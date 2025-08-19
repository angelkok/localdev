package main

import (
	"fmt"
	"log"
	"net/http"
)

// helloHandler handles the incoming HTTP requests.
func helloHandler(w http.ResponseWriter, r *http.Request) {
	// Set the response header to indicate the content type.
	w.Header().Set("Content-Type", "text/plain")
	// Write the response body.
	fmt.Fprint(w, "Hello from your Go service!")
}

func main() {
	// Register the handler function for the root URL path ("/").
	http.HandleFunc("/", helloHandler)

	// Define the port the server will listen on.
	port := ":8083"
	fmt.Printf("Server starting on port %s\n", port)

	// Start the HTTP server. log.Fatal will print any error and exit the program.
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal(err)
	}
}
