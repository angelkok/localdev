# --- Build Stage ---
# Use an official Go image as the builder.
FROM golang:1.25-alpine AS builder

# Set the working directory inside the container.
WORKDIR /app

# Copy the Go module file.
# This is done in a separate step to leverage Docker's layer caching.
COPY go.mod ./

# Copy the rest of the application source code.
COPY . .

# Tidy the modules to ensure all dependencies are correct before building.
# This makes the build more robust.
RUN go mod tidy


# Build the Go application.
# -o /app/main specifies the output file name.
# CGO_ENABLED=0 disables Cgo to create a static binary.
# -ldflags="-w -s" strips debugging information to reduce binary size.
RUN CGO_ENABLED=0 GOOS=linux go build -a -ldflags="-w -s" -o /app/main .

ENTRYPOINT ["/app/main"]
#ENTRYPOINT ["tail", "-f", "/dev/null"]

# # --- Final Stage ---
# # Use a minimal base image for the final container.
# # scratch is an empty image, making our final image very small.
# FROM scratch

# # Set the working directory.
# WORKDIR /app

# # Copy the compiled binary from the builder stage.
# COPY --from=builder /app/main .

# # Expose port 8083 to allow external traffic.
# EXPOSE 8083

# # Command to run the application when the container starts.
# #ENTRYPOINT ["/app/main"]

# ENTRYPOINT ["tail", "-f", "/dev/null"]