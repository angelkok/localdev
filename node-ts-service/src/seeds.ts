// src/seed.ts
import db from './db';

const seedData = async () => {
    try {
        console.log('Starting database seed...');

        // Drop table if it exists to start fresh
        await db.query('DROP TABLE IF EXISTS users;');
        console.log('Dropped existing users table.');

        // Create the users table
        await db.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL
      );
    `);
        console.log('Created users table.');

        // Insert some sample data
        await db.query(
            "INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com'), ('Bob', 'bob@example.com');"
        );
        console.log('Inserted sample users.');

        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // In a real script, you might want to close the connection pool
        // For a simple script, we can let it exit.
        process.exit();
    }
};

seedData();
