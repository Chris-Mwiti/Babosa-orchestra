package circuitbreaker

import (
	"errors"
	"sync"
	"testing"
	"time"
)

func failer() func() (interface{}, error) {
	return func() (interface{}, error) {
		return nil, errors.New("boom")
	}
}

func succeeder(v interface{}) func() (interface{}, error) {
	return func() (interface{}, error) {
		return v, nil
	}
}

func TestClosedPassThrough(t *testing.T) {
	cb := New(ExtraOptions{Policy: MaxConsecutiveFails, MaxConsecutiveFails: 3})

	res, err := cb.Execute(succeeder("ok"))
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res != "ok" {
		t.Fatalf("expected passthrough result, got %v", res)
	}
	if cb.State() != Closed {
		t.Fatalf("expected closed, got %s", cb.State())
	}
}

func TestOpensAfterConsecutiveThreshold(t *testing.T) {
	cb := New(ExtraOptions{Policy: MaxConsecutiveFails, MaxConsecutiveFails: 3, OpenInterval: time.Minute})

	for i := 0; i < 3; i++ {
		if _, err := cb.Execute(failer()); err == nil {
			t.Fatalf("expected failure %d to propagate", i)
		}
	}

	if cb.State() != Open {
		t.Fatalf("expected open after 3 consecutive failures, got %s", cb.State())
	}

	// Requests must be rejected fast without invoking the func.
	called := false
	_, err := cb.Execute(func() (interface{}, error) {
		called = true
		return nil, nil
	})
	if !errors.Is(err, ErrOpenState) {
		t.Fatalf("expected ErrOpenState, got %v", err)
	}
	if called {
		t.Fatal("rejected request must not execute the func")
	}
}

func TestConsecutiveCounterResetsOnSuccess(t *testing.T) {
	cb := New(ExtraOptions{Policy: MaxConsecutiveFails, MaxConsecutiveFails: 2, OpenInterval: time.Minute})

	cb.Execute(failer())
	cb.Execute(succeeder(nil)) // resets the tally
	cb.Execute(failer())

	if cb.State() != Closed {
		t.Fatalf("expected closed after non-consecutive failures, got %s", cb.State())
	}
}

func TestHalfOpenClosesOnProbeSuccess(t *testing.T) {
	cb := New(ExtraOptions{Policy: MaxConsecutiveFails, MaxConsecutiveFails: 1, OpenInterval: 50 * time.Millisecond})

	cb.Execute(failer())
	if cb.State() != Open {
		t.Fatalf("expected open, got %s", cb.State())
	}

	time.Sleep(80 * time.Millisecond)

	res, err := cb.Execute(succeeder("recovered"))
	if err != nil {
		t.Fatalf("probe should be admitted, got %v", err)
	}
	if res != "recovered" {
		t.Fatalf("expected probe result, got %v", res)
	}
	if cb.State() != Closed {
		t.Fatalf("expected closed after successful probe, got %s", cb.State())
	}
}

func TestHalfOpenReopensOnProbeFailure(t *testing.T) {
	cb := New(ExtraOptions{Policy: MaxConsecutiveFails, MaxConsecutiveFails: 1, OpenInterval: 50 * time.Millisecond})

	cb.Execute(failer())
	time.Sleep(80 * time.Millisecond)

	if _, err := cb.Execute(failer()); err == nil {
		t.Fatal("expected probe failure to propagate")
	}
	if cb.State() != Open {
		t.Fatalf("expected re-open after failed probe, got %s", cb.State())
	}
}

func TestHalfOpenProbeLimit(t *testing.T) {
	cb := New(ExtraOptions{
		Policy:              MaxConsecutiveFails,
		MaxConsecutiveFails: 1,
		OpenInterval:        30 * time.Millisecond,
		HalfOpenMaxRequests: 1,
	})

	cb.Execute(failer())
	time.Sleep(60 * time.Millisecond) // breaker is half-open now

	release := make(chan struct{})
	admitted := make(chan struct{})
	go func() {
		defer close(admitted)
		cb.Execute(func() (interface{}, error) {
			<-release // hold the single probe slot
			return nil, nil
		})
	}()
	time.Sleep(20 * time.Millisecond) // let the probe take the slot

	_, err := cb.Execute(succeeder(nil))
	close(release)
	<-admitted

	if !errors.Is(err, ErrTooManyProbes) {
		t.Fatalf("expected ErrTooManyProbes, got %v", err)
	}
}

func TestMaxFailsPolicy(t *testing.T) {
	cb := New(ExtraOptions{Policy: MaxFails, MaxFails: 3, OpenInterval: time.Minute})

	// Non-consecutive failures still accumulate under MaxFails.
	cb.Execute(failer())
	cb.Execute(succeeder(nil))
	cb.Execute(failer())
	cb.Execute(succeeder(nil))
	cb.Execute(failer())

	if cb.State() != Open {
		t.Fatalf("expected open after 3 total failures, got %s", cb.State())
	}
}

func TestConcurrentSafe(t *testing.T) {
	cb := New(ExtraOptions{Policy: MaxConsecutiveFails, MaxConsecutiveFails: 1000, OpenInterval: time.Minute})

	var wg sync.WaitGroup
	for i := 0; i < 50; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := 0; j < 100; j++ {
				cb.Execute(succeeder(nil))
				_ = cb.State()
			}
		}()
	}
	wg.Wait()

	if cb.State() != Closed {
		t.Fatalf("expected closed, got %s", cb.State())
	}
}

func TestReset(t *testing.T) {
	cb := New(ExtraOptions{Policy: MaxConsecutiveFails, MaxConsecutiveFails: 1, OpenInterval: time.Minute})

	cb.Execute(failer())
	if cb.State() != Open {
		t.Fatalf("expected open, got %s", cb.State())
	}

	cb.Reset()
	if cb.State() != Closed {
		t.Fatalf("expected closed after reset, got %s", cb.State())
	}
}
