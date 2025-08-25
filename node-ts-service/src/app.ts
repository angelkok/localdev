// Import source-map-support for better stack traces in production
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

// Import necessary modules
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

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
// NOTE: You will need to install these packages:
// npm install swagger-ui-express swagger-jsdoc
// npm install --save-dev @types/swagger-ui-express @types/swagger-jsdoc

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
  // Path to the API docs. This should point to the files where your routes are defined.
  apis: [__filename],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
// Serve the Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// --- Routes ---

/**
 * @swagger
 * /:
 * get:
 * summary: Health check
 * description: Returns a simple hello world message to indicate the service is running.
 * tags: [Default]
 * responses:
 * 200:
 * description: Service is up and running.
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: Node-ts-service: Hello World!!!
 */
app.get('/', (req: Request, res: Response) => {
  res.send('Node-ts-service: Hello World!!!')
});

/**
 * @swagger
 * /status:
 * get:
 * summary: Get service status
 * description: Returns the current status and version of the service.
 * tags: [Default]
 * responses:
 * 200:
 * description: A JSON object with service status.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * status:
 * type: string
 * example: This is version 1
 * timestamp:
 * type: string
 * format: date-time
 * example: 2023-10-27T10:00:00.000Z
 */
app.get('/status', (req: Request, res: Response) => {
    res.json({
        status: "This is version 1",
        timestamp: new Date().toISOString()
    });
});

/**
 * @swagger
 * /error:
 * get:
 * summary: Trigger a simulated error
 * description: This route intentionally triggers an error to demonstrate the error handling middleware.
 * tags: [Default]
 * responses:
 * 500:
 * description: Internal Server Error.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: Something went wrong!
 * message:
 * type: string
 * example: This is a simulated error!
 */
app.get('/error', (req: Request, res: Response, next: NextFunction) => {
    // This will trigger our custom error handler below
    next(new Error("This is a simulated error!"));
});


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
  console.log(`API documentation available at http://localhost:${port}/api-docs`);
});

