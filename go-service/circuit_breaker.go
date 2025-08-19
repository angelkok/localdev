package main

import (
	"errors"
	"sync"
	"time"
)

type State int

const (
	StateClosed State = iota
	StateOpen
	StateHalfOpen
)

type CircuitBreaker struct {
	state             State
	failures          int
	lastError         time.Time
	mutex             sync.Mutex
	failureThreshold  int
	resetTimeout      time.Duration
}

func NewCircuitBreaker(failureThreshold int, resetTimeout time.Duration) *CircuitBreaker {
	return &CircuitBreaker{
		state:            StateClosed,
		failureThreshold: failureThreshold,
		resetTimeout:     resetTimeout,
	}
}

var ErrCircuitOpen = errors.New("circuit breaker is open")

func (cb *CircuitBreaker) Execute(fn func() (interface{}, error)) (interface{}, error) {
	cb.mutex.Lock()
	defer cb.mutex.Unlock()

	if cb.state == StateOpen {
		if time.Since(cb.lastError) > cb.resetTimeout {
			cb.state = StateHalfOpen
		} else {
			return nil, ErrCircuitOpen
		}
	}

	result, err := fn()
	if err != nil {
		cb.failures++
		if cb.failures >= cb.failureThreshold {
			cb.state = StateOpen
			cb.lastError = time.Now()
		}
		return nil, err
	}

	cb.failures = 0
	if cb.state == StateHalfOpen {
		cb.state = StateClosed
	}

	return result, nil
}
