package circuitbreaker

import (
	"errors"
	"sync"
	"time"
)

type Policy int
type State string

const (
	Closed   State = "closed"
	Open     State = "open"
	HalfOpen State = "half-open"
)

const (
	// MaxFails trips after MaxFails total failures while closed.
	// Successes do not reset the tally; a full open -> half-open -> closed
	// recovery cycle does.
	MaxFails Policy = iota

	// MaxConsecutiveFails trips after MaxConsecutiveFails failures in a row
	// while closed. Any success resets the tally. This is the standard
	// circuit-breaker semantic and the recommended policy.
	MaxConsecutiveFails
)

var (
	// ErrOpenState is returned when a request is rejected because the
	// breaker is open. Match it with errors.Is to distinguish a tripped
	// breaker from a failed request.
	ErrOpenState = errors.New("circuit breaker is open")

	// ErrTooManyProbes is returned when the half-open probe budget is
	// exhausted, i.e. another probe is already testing the downstream.
	ErrTooManyProbes = errors.New("circuit breaker half-open probe limit reached")
)

// Exposed for other clients to use.
type ExtraOptions struct {
	Name string

	Policy Policy

	MaxFails            uint64
	MaxConsecutiveFails uint64

	// OpenInterval is how long the breaker stays open before allowing a
	// half-open probe through.
	OpenInterval time.Duration

	// HalfOpenMaxRequests caps how many probes may test a recovering
	// downstream concurrently. Defaults to 1.
	HalfOpenMaxRequests uint64
}

type Circuitbreaker struct {
	name   string
	policy Policy

	maxFails            uint64
	maxConsecutiveFails uint64

	openInterval time.Duration
	halfOpenMax  uint64

	mutex sync.Mutex
	state State

	// Failure tally while closed. Consecutive for MaxConsecutiveFails,
	// cumulative for MaxFails.
	fails uint64

	// OpenedAt records when the breaker last tripped. Half-open
	// admission is derived from it, so no watcher goroutine or channel
	// is needed (and none can leak or deadlock).
	openedAt time.Time

	// Probes currently testing the downstream while half-open.
	halfOpenInFlight uint64
}

// Execute runs req unless the breaker is open, and records the outcome.
// The returned error is ErrOpenState/ErrTooManyProbes when the request was
// rejected, otherwise whatever req returned.
func (cb *Circuitbreaker) Execute(req func() (interface{}, error)) (interface{}, error) {
	if err := cb.beforeRequest(); err != nil {
		return nil, err
	}

	res, err := req()
	cb.afterRequest(err)

	return res, err
}

// Name reports the breaker name for logging.
func (cb *Circuitbreaker) Name() string {
	return cb.name
}

// State reports the current breaker state. Safe for concurrent use.
func (cb *Circuitbreaker) State() State {
	cb.mutex.Lock()
	defer cb.mutex.Unlock()
	cb.maybeHalfOpen(time.Now())
	return cb.state
}

// Reset forces the breaker closed and clears all tallies.
func (cb *Circuitbreaker) Reset() {
	cb.mutex.Lock()
	defer cb.mutex.Unlock()
	cb.state = Closed
	cb.fails = 0
	cb.halfOpenInFlight = 0
}

// beforeRequest decides whether a call may proceed. Callers must pair every
// nil return with exactly one afterRequest call.
func (cb *Circuitbreaker) beforeRequest() error {
	cb.mutex.Lock()
	defer cb.mutex.Unlock()

	cb.maybeHalfOpen(time.Now())

	switch cb.state {
	case Closed:
		return nil
	case Open:
		return ErrOpenState
	case HalfOpen:
		if cb.halfOpenInFlight >= cb.halfOpenMax {
			return ErrTooManyProbes
		}
		cb.halfOpenInFlight++
		return nil
	default:
		return ErrOpenState
	}
}

// afterRequest records the outcome of an admitted call.
func (cb *Circuitbreaker) afterRequest(err error) {
	cb.mutex.Lock()
	defer cb.mutex.Unlock()

	switch cb.state {
	case HalfOpen:
		// A probe has answered. One probe decides the recovery attempt.
		if cb.halfOpenInFlight > 0 {
			cb.halfOpenInFlight--
		}
		if err != nil {
			cb.tripLocked(time.Now())
			return
		}
		cb.state = Closed
		cb.fails = 0
		cb.halfOpenInFlight = 0
	case Closed:
		if err == nil {
			if cb.policy == MaxConsecutiveFails {
				cb.fails = 0
			}
			return
		}
		cb.fails++
		if cb.failsExceedThreshold() {
			cb.tripLocked(time.Now())
		}
	case Open:
		// Admitted under an older state before a concurrent trip.
		// The trip decision stands; recovery goes through half-open.
		return
	}
}

// maybeHalfOpen moves an expired open breaker to half-open. The caller must
// hold cb.mutex.
func (cb *Circuitbreaker) maybeHalfOpen(now time.Time) {
	if cb.state == Open && now.Sub(cb.openedAt) >= cb.openInterval {
		cb.state = HalfOpen
		cb.halfOpenInFlight = 0
	}
}

// tripLocked opens the breaker. The caller must hold cb.mutex.
func (cb *Circuitbreaker) tripLocked(now time.Time) {
	cb.state = Open
	cb.openedAt = now
	cb.halfOpenInFlight = 0
}

func (cb *Circuitbreaker) failsExceedThreshold() bool {
	switch cb.policy {
	case MaxConsecutiveFails:
		return cb.fails >= cb.maxConsecutiveFails
	case MaxFails:
		return cb.fails >= cb.maxFails
	default:
		return false
	}
}

func New(opts ...ExtraOptions) *Circuitbreaker {
	var opt ExtraOptions

	if len(opts) > 0 {
		opt = opts[0]
	}

	// Unknown policies fail safe: a breaker that can never trip is worse
	// than useless, so fall back to the standard semantic.
	if opt.Policy != MaxFails && opt.Policy != MaxConsecutiveFails {
		opt.Policy = MaxConsecutiveFails
	}

	if opt.MaxFails == 0 {
		opt.MaxFails = 5
	}

	if opt.MaxConsecutiveFails == 0 {
		opt.MaxConsecutiveFails = 5
	}

	if opt.OpenInterval <= 0 {
		opt.OpenInterval = 5 * time.Second
	}

	if opt.HalfOpenMaxRequests == 0 {
		opt.HalfOpenMaxRequests = 1
	}

	if opt.Name == "" {
		opt.Name = "circuit"
	}

	return &Circuitbreaker{
		name:                opt.Name,
		policy:              opt.Policy,
		maxFails:            opt.MaxFails,
		maxConsecutiveFails: opt.MaxConsecutiveFails,
		openInterval:        opt.OpenInterval,
		halfOpenMax:         opt.HalfOpenMaxRequests,
		state:               Closed,
	}
}
