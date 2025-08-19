package main

import (
	"log"
	"net"
	"net/http"
	"sync"
	"time"
)

type rateLimiter struct {
	tokens     int
	lastRefill time.Time
	mutex      sync.Mutex
	rate       time.Duration
	burst      int
}

func NewRateLimiter(rate time.Duration, burst int) *rateLimiter {
	return &rateLimiter{
		tokens:     burst,
		lastRefill: time.Now(),
		rate:       rate,
		burst:      burst,
	}
}

func (l *rateLimiter) Allow() bool {
	l.mutex.Lock()
	defer l.mutex.Unlock()

	now := time.Now()
	elapsed := now.Sub(l.lastRefill)
	tokensToAdd := int(elapsed / l.rate)

	if tokensToAdd > 0 {
		l.tokens += tokensToAdd
		l.lastRefill = now
	}

	if l.tokens > l.burst {
		l.tokens = l.burst
	}

	if l.tokens > 0 {
		l.tokens--
		return true
	}

	return false
}

type visitor struct {
	limiter  *rateLimiter
	lastSeen time.Time
}

var visitors = make(map[string]*visitor)
var mu sync.Mutex

func getVisitor(ip string) *rateLimiter {
	mu.Lock()
	defer mu.Unlock()

	v, exists := visitors[ip]
	if !exists {
		limiter := NewRateLimiter(time.Second, 3)
		visitors[ip] = &visitor{limiter, time.Now()}
		return limiter
	}

	v.lastSeen = time.Now()
	return v.limiter
}

func cleanupVisitors() {
	for {
		time.Sleep(time.Minute)
		mu.Lock()
		for ip, v := range visitors {
			if time.Since(v.lastSeen) > 3*time.Minute {
				delete(visitors, ip)
			}
		}
		mu.Unlock()
	}
}

func rateLimitMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip, _, err := net.SplitHostPort(r.RemoteAddr)
		if err != nil {
			log.Println(err.Error())
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		limiter := getVisitor(ip)
		if !limiter.Allow() {
			http.Error(w, http.StatusText(http.StatusTooManyRequests), http.StatusTooManyRequests)
			return
		}

		next.ServeHTTP(w, r)
	})
}
