// Import source-map-support for better stack traces in production
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

// Import necessary modules
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

// --- Configuration ---
// Load environment variables from a .env file into process.env
dotenv.config();

// --- App Initialization ---
const app = express();
// Use the PORT from environment variables, or default to 8001
const port = process.env.PORT || 8001;

// --- Middleware ---

// 1. JSON Body Parser
// This middleware parses incoming requests with JSON payloads.
// It's crucial for handling POST, PUT, PATCH requests with a JSON body.
app.use(express.json());

// 2. Request Logger
// A simple middleware to log every incoming request to the console.
// For production, you'd likely use a more robust logger like Winston or Pino.
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Pass control to the next handler
});


// --- Routes ---

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.send('Node-ts-service: Hello World!!!')
});

// Status route
app.get('/status', (req: Request, res: Response) => {
    res.json({
        status: "This is version 1",
        timestamp: new Date().toISOString()
    });
});

// A new route to demonstrate error handling
app.get('/error', (req: Request, res: Response, next: NextFunction) => {
    // This will trigger our custom error handler below
    next(new Error("This is a simulated error!"));
});


// --- Error Handling Middleware ---
// This middleware must be defined LAST, after all other app.use() and routes.
// It catches any errors that occur in the route handlers.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).json({
        error: "Something went wrong!",
        message: err.message // In production, you might not want to expose the error message
    });
});


// --- Server Startup ---
app.listen(port, () => {
  console.log(`Node app listening on port ${port}`);
  console.log(`Try visiting http://localhost:${port}`);
});
