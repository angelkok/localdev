package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gorilla/mux"
)

func TestUserHandler(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/v1/users/1", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	router := mux.NewRouter()
	router.HandleFunc("/api/v1/users/{id}", userHandler)
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	expected := `{"id":"1","name":"John Doe","email":"john.doe@example.com"}` + "\n"
	if rr.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), expected)
	}
}

func TestRateLimiter(t *testing.T) {
	router := mux.NewRouter()
	api := router.PathPrefix("/api/v1").Subrouter()
	api.Handle("/users/{id}", rateLimitMiddleware(http.HandlerFunc(userHandler))).Methods("GET")

	req, err := http.NewRequest("GET", "/api/v1/users/1", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.RemoteAddr = "127.0.0.1:12345"

	// First 3 requests should be fine
	for i := 0; i < 3; i++ {
		rr := httptest.NewRecorder()
		router.ServeHTTP(rr, req)
		if status := rr.Code; status != http.StatusOK {
			t.Errorf("handler returned wrong status code: got %v want %v",
				status, http.StatusOK)
		}
	}

	// 4th request should be rate limited
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusTooManyRequests {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusTooManyRequests)
	}
}

func TestCircuitBreaker(t *testing.T) {
	router := mux.NewRouter()
	api := router.PathPrefix("/api/v1").Subrouter()
	api.Handle("/users/{id}", http.HandlerFunc(userHandler)).Methods("GET")

	req, err := http.NewRequest("GET", "/api/v1/users/2", nil)
	if err != nil {
		t.Fatal(err)
	}

	// 3 requests should fail and open the circuit
	for i := 0; i < 3; i++ {
		rr := httptest.NewRecorder()
		router.ServeHTTP(rr, req)
		if status := rr.Code; status != http.StatusInternalServerError {
			t.Errorf("handler returned wrong status code: got %v want %v",
				status, http.StatusInternalServerError)
		}
	}

	// 4th request should fail because the circuit is open
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusServiceUnavailable {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusServiceUnavailable)
	}

	// Wait for the circuit breaker to reset
	time.Sleep(6 * time.Second)

	// This request should be half-open and succeed, so we need a valid user
	req, err = http.NewRequest("GET", "/api/v1/users/1", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
}
