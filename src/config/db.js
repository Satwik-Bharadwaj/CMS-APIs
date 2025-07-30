const mysql2 = require('mysql2/promise');
require("dotenv").config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "construction_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
const pool = mysql2.createPool(dbConfig);

// Test the connection (optional - won't crash if DB is not available)
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully");
    connection.release();
  } catch (error) {
    console.warn("Database connection failed (continuing without DB):", error.message);
    console.warn("Note: Set up MySQL database for full functionality");
  }
};

// Test connection on startup
testConnection();

module.exports = pool;
