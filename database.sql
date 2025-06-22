-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS construction_management;

-- Use the database
USE construction_management;

-- Create User table (no foreign keys)
CREATE TABLE IF NOT EXISTS User (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create Project table (depends on User)
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
); 