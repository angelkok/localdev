package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func userHandlerV2(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	result, err := cb.Execute(func() (interface{}, error) {
		return getUserByID(id)
	})

	if err != nil {
		switch err {
		case ErrCircuitOpen:
			http.Error(w, "Circuit breaker is open", http.StatusServiceUnavailable)
		case ErrUserNotFound:
			http.Error(w, "User not found", http.StatusNotFound)
		default:
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	user := result.(User)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func userHandlerV1(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	user, err := getUserByID(id)
	if err != nil {
		switch err {
		case ErrUserNotFound:
			http.Error(w, "User not found", http.StatusNotFound)
		default:
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	// Set the response header to indicate the content type.
	w.Header().Set("Content-Type", "text/plain")
	// Write the response body.
	fmt.Fprint(w, "Hello from your Go service!")
}
