// src/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  // Add a connection timeout to fail faster if the host is truly unreachable
  connectionTimeoutMillis: 5000,
});

// --- Database Connection Check with Retry ---
// This function attempts to connect to the database when the app starts.
// If it fails, it will retry a few times before crashing the app.
// This is crucial in a containerized environment where the database
// might not be ready when the application starts.
const connectWithRetry = async () => {
  let retries = 5;
  while (retries) {
    try {
      const client = await pool.connect();
      console.log('Successfully connected to the database.');
      client.release(); // Release the client back to the pool
      return; // Exit the function successfully
    } catch (err) {
      // Check if the error is an instance of Error to safely access .message
      if (err instanceof Error) {
        console.error(`Failed to connect to the database: ${err.message}. Retrying... (${retries} retries left)`);
      } else {
        console.error(`An unknown error occurred while connecting to the database. Retrying... (${retries} retries left)`);
      }
      retries -= 1;
      if (retries === 0) {
        console.error('Could not connect to the database after multiple attempts. Exiting.');
        process.exit(1); // Exit the process with an error code
      }
      // Wait for 5 seconds before the next retry
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

// Immediately attempt to connect when this module is loaded.
connectWithRetry();


export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
