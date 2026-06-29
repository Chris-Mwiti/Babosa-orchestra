package circuitbreaker

import (
	"errors"
	"sync"
	"time"
)

type Policy int
type State string

const (
	open State = "open"
	closed State = "closed"
	halfOpen State = "halfOpen"
)

const (
	//this checks the no of non-consecutive fails in a closed state
	MaxFails Policy = iota

	//this checks the no of consecutive fails in a closed state
	MaxConsecutiveFails 
)

//exposed for other clients to use
type ExtraOptions struct {

	Policy Policy

	MaxFails uint64
	MaxConsecutiveFails uint64

	OpenInterval time.Duration
}

type Circuitbreaker struct {
	policy Policy
	state State
	mutex sync.Mutex

	maxFails uint64
	maxConsecutiveFails uint64

	//number of fails while in the closed state
	//resets when on a successful req while in the half-open state to the closed state
	fails uint64
	
	openInterval time.Duration

	//handles the event transfer mechanism for the open state
	openChannel chan struct{} 
}

func (cb *Circuitbreaker) Execute( req func ()(interface {}, error)) (interface{}, error) {
	//checks the current state of the circuit breaker before execution
	err := cb.doPreRequest()

	if err != nil {
		return nil, err
	}

	res, err := req() 

	if err != nil {
		return nil, err
	}

	return res, nil
}

//Purpose: Checks if the state of the breaker is open, if open then cancels the req execution
func (cb *Circuitbreaker) doPreRequest() (error) {

	if cb.state == open {
		return errors.New("ERR_REQ_CANCELED")
	}

	return nil
}

//Purpose: 
func (cb *Circuitbreaker) doPostRequest(err error) error {
	cb.mutex.Lock()
	defer cb.mutex.Unlock()

	if err == nil {
		if cb.policy == MaxConsecutiveFails {
			cb.fails = 0
		}

		cb.state = closed
		return nil
	}

	if cb.state == halfOpen {
		cb.state = open
		cb.openChannel <- struct{}{}

		return err
	}

	cb.fails++
	if cb.failsExceedThreshold() {
		cb.state = open
		cb.openChannel <- struct{}{}
	}

	return err
} 

func (cb *Circuitbreaker) failsExceedThreshold() (bool) {
	switch cb.policy {
	case MaxConsecutiveFails:
		if cb.fails >= cb.maxConsecutiveFails {
			return true
		}
	case MaxFails:
		if cb.fails >= cb.maxFails {
			return true
		}
	default:
		return false
	}
	return false
}

//listens to any incoming breakoff signals 
func (cb *Circuitbreaker) OpenWatcher() {	
	for range cb.openChannel {
		time.Sleep(cb.openInterval)
		cb.mutex.Lock()
		cb.state = halfOpen
		cb.fails = 0
		cb.mutex.Unlock()
	}	
}


func New (opts ...ExtraOptions) Circuitbreaker {

	var opt ExtraOptions

	if len(opts) > 0 {
		opt = opts[0]
	}

	if opt.MaxFails == 0 {
		opt.MaxFails = 5
	}

	if opt.MaxConsecutiveFails == 0 {
		opt.MaxConsecutiveFails = 5
	}

	if opt.OpenInterval <= 0 {
		var interval time.Duration
		interval = (5 * time.Second)
		opt.OpenInterval = interval
	}

	cb := Circuitbreaker{
		maxFails: opt.MaxFails,
		maxConsecutiveFails: opt.MaxConsecutiveFails,
		openInterval: opt.OpenInterval,

		openChannel: make(chan struct{}),
		policy: opt.Policy,
	}

	go cb.OpenWatcher()

	return cb
}
