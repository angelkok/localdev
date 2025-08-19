package main

import "errors"

// User represents a user in the system.
type User struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

var users = map[string]User{
	"1": {ID: "1", Name: "John Doe", Email: "john.doe@example.com"},
	"2": {ID: "2", Name: "Jane Doe", Email: "jane.doe@example.com"},
}

var ErrUserNotFound = errors.New("user not found")

func getUserByID(id string) (User, error) {
	// Simulate a failure to test the circuit breaker
	if id == "2" {
		return User{}, errors.New("simulated failure")
	}
	if user, ok := users[id]; ok {
		return user, nil
	}
	return User{}, ErrUserNotFound
}
