const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const initializeDatabase = async () => {
    let connection;
    try {
        console.log('Starting database initialization...');

        // First connect without database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'construction_management'}`);
        console.log('Database created successfully');

        // Use the database
        await connection.query(`USE ${process.env.DB_NAME || 'construction_management'}`);
        console.log('Database selected successfully');

        // Create User table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS User (
                id VARCHAR(255) PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);
        console.log('User table created successfully');

        // Create Project table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Project (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                client_id VARCHAR(255),
                labour_contractor VARCHAR(255),
                address TEXT,
                total_budget DECIMAL(15,2),
                created_by VARCHAR(255),
                created_on DATETIME,
                updated_by VARCHAR(255),
                updated_on DATETIME,
                admin_id VARCHAR(255),
                FOREIGN KEY (client_id) REFERENCES User(id),
                FOREIGN KEY (created_by) REFERENCES User(id),
                FOREIGN KEY (updated_by) REFERENCES User(id),
                FOREIGN KEY (admin_id) REFERENCES User(id)
            )
        `);
        console.log('Project table created successfully');

        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Run the initialization
console.log('Starting database initialization process...');
initializeDatabase(); 