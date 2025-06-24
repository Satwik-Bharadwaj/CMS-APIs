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

-- Create Payment table (depends on Project)
CREATE TABLE IF NOT EXISTS Payment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    particulars TEXT,
    date DATE,
    amount DECIMAL(15,2),
    paid_through VARCHAR(255),
    remarks TEXT,
    FOREIGN KEY (project_id) REFERENCES Project(id)
);

-- Create Payment_plan table (depends on Project)
CREATE TABLE IF NOT EXISTS Payment_plan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    particulars TEXT,
    date DATE,
    amount DECIMAL(15,2),
    FOREIGN KEY (project_id) REFERENCES Project(id)
);

-- Create RateList table (depends on Project)
CREATE TABLE IF NOT EXISTS RateList (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    head_mason_rate DECIMAL(15,2),
    mason_rate DECIMAL(15,2),
    m_helper_rate DECIMAL(15,2),
    w_helper_rate DECIMAL(15,2),
    column_barbending_rate DECIMAL(15,2),
    FOREIGN KEY (project_id) REFERENCES Project(id)
);

-- Create Drawing table (depends on Project)
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
);

-- Create Material table (depends on Project)
CREATE TABLE IF NOT EXISTS Material (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    particulars TEXT,
    FOREIGN KEY (project_id) REFERENCES Project(id)
);

-- Create MaterialTrackingEntry table (depends on Material)
CREATE TABLE IF NOT EXISTS MaterialTrackingEntry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_id INT,
    date DATE,
    received_quantity DECIMAL(15,2),
    consumed_quantity DECIMAL(15,2),
    FOREIGN KEY (material_id) REFERENCES Material(id)
);

-- Create LabourBill table (depends on Project)
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
);

-- Create LabourPayment table (depends on Project)
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
);

-- Create ProjectSupervisor table (depends on Project and User)
CREATE TABLE IF NOT EXISTS ProjectSupervisor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    supervisor_id VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES Project(id),
    FOREIGN KEY (supervisor_id) REFERENCES User(id)
); 