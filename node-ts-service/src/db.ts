// src/db.ts
import { Pool } from 'pg';

// The Pool will use the environment variables for connection details
// (DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT)
const pool = new Pool({
    // You can add additional configuration here if needed,
    // but by default, it reads the standard PG environment variables.
    // For example, to add SSL configuration for a production environment:
    // ssl: {
    //   rejectUnauthorized: false
    // }
});

export default {
    query: (text: string, params?: any[]) => pool.query(text, params),
};
