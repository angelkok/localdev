// Import source-map-support for better stack traces in production
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

// Import necessary modules
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import routes from './routes'; // Import the main router

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
app.use(express.json());

// 2. Request Logger
// A simple middleware to log every incoming request to the console.
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pass control to the next handler
});

// --- OpenAPI / Swagger Setup ---
const swaggerOptions: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Node TS Service API',
      version: '1.0.0',
      description: 'API documentation for the Node TS service, providing interactive UI for endpoints.',
      contact: {
        name: 'Developer',
        url: 'https://example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server',
      },
    ],
  },
  // Path to the API docs. This now points to our new routes directory.
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
// Serve the Swagger UI at /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// --- Routes ---
// The app now uses the router from the routes directory
app.use(routes);


// --- Error Handling Middleware ---
// This middleware must be defined LAST, after all other app.use() and routes.
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
  console.log(`API documentation available at http://localhost:${port}/docs`);
});
