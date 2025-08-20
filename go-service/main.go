package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

var cb = NewCircuitBreaker(3, 5*time.Second)

func main() {
	go cleanupVisitors()

	r := mux.NewRouter()
	r.HandleFunc("/", helloHandler)

	api := r.PathPrefix("/api/v1").Subrouter()
	api.Handle("/users/{id}", rateLimitMiddleware(http.HandlerFunc(userHandler))).Methods("GET")

	port := ":8000"
	fmt.Printf("Server starting on port %s\n", port)

	if err := http.ListenAndServe(port, r); err != nil {
		log.Fatal(err)
	}
}
