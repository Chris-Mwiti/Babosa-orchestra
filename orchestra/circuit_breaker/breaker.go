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
	MaxFails = iota

	//this checks the no of consecutive fails in a closed state
	MaxConsecutiveFails 
)

type circuitbreaker struct {
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

func (cb *circuitbreaker) Execute( req func ()(interface {}, error)) (interface{}, error) {
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
func (cb *circuitbreaker) doPreRequest() (error) {

	if cb.state == open {
		return errors.New("ERR_REQ_CANCELED")
	}

	return nil
}

//Purpose: 
func (cb *circuitbreaker) doPostRequest(err error) error {
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

func (cb *circuitbreaker) failsExceedThreshold() (bool) {
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
func (cb *circuitbreaker) OpenWatcher() {	
	for range cb.openChannel {
		time.Sleep(cb.openInterval)
		cb.mutex.Lock()
		cb.state = halfOpen
		cb.fails = 0
		cb.mutex.Unlock()
	}	
}

