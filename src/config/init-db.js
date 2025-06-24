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

        // Create Payment table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Payment (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                particulars TEXT,
                date DATE,
                amount DECIMAL(15,2),
                paid_through VARCHAR(255),
                remarks TEXT,
                FOREIGN KEY (project_id) REFERENCES Project(id)
            )
        `);
        console.log('Payment table created successfully');

        // Create Payment_plan table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Payment_plan (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                particulars TEXT,
                date DATE,
                amount DECIMAL(15,2),
                FOREIGN KEY (project_id) REFERENCES Project(id)
            )
        `);
        console.log('Payment_plan table created successfully');

        // Create RateList table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS RateList (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                head_mason_rate DECIMAL(15,2),
                mason_rate DECIMAL(15,2),
                m_helper_rate DECIMAL(15,2),
                w_helper_rate DECIMAL(15,2),
                column_barbending_rate DECIMAL(15,2),
                FOREIGN KEY (project_id) REFERENCES Project(id)
            )
        `);
        console.log('RateList table created successfully');

        // Create Drawing table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Drawing (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                particulars TEXT,
                file_url VARCHAR(255),
                drawing_file LONGBLOB,
                uploaded_by VARCHAR(255),
                approved_by VARCHAR(255),
                remarks TEXT,
                FOREIGN KEY (project_id) REFERENCES Project(id)
            )
        `);
        console.log('Drawing table created successfully');

        // Create Material table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Material (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                particulars TEXT,
                FOREIGN KEY (project_id) REFERENCES Project(id)
            )
        `);
        console.log('Material table created successfully');

        // Create LabourBill table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS LabourBill (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                date DATE,
                bar_bender VARCHAR(255),
                head_mason INT,
                mason INT,
                m_helper INT,
                w_helper INT,
                total INT,
                extra_payment DECIMAL(15,2),
                remarks TEXT,
                FOREIGN KEY (project_id) REFERENCES Project(id)
            )
        `);
        console.log('LabourBill table created successfully');

        // Create LabourPayment table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS LabourPayment (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                particulars TEXT,
                date DATE,
                net_amount DECIMAL(15,2),
                extra DECIMAL(15,2),
                labour_amount DECIMAL(15,2),
                cumulative_amount DECIMAL(15,2),
                remarks TEXT,
                FOREIGN KEY (project_id) REFERENCES Project(id)
            )
        `);
        console.log('LabourPayment table created successfully');

        // Create MaterialTrackingEntry table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS MaterialTrackingEntry (
                id INT AUTO_INCREMENT PRIMARY KEY,
                material_id INT,
                date DATE,
                received_quantity DECIMAL(15,2),
                consumed_quantity DECIMAL(15,2),
                FOREIGN KEY (material_id) REFERENCES Material(id)
            )
        `);
        console.log('MaterialTrackingEntry table created successfully');

        // Create ProjectSupervisor table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS ProjectSupervisor (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                supervisor_id VARCHAR(255),
                FOREIGN KEY (project_id) REFERENCES Project(id),
                FOREIGN KEY (supervisor_id) REFERENCES User(id)
            )
        `);
        console.log('ProjectSupervisor table created successfully');

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