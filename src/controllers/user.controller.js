const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Create a new user
const createUser = async (req, res) => {
    try {
        const { id, username, password } = req.body;

        // Validate required fields
        if (!id || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: id, username, and password are required'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO User (id, username, password)
            VALUES (?, ?, ?)
        `;

        const [result] = await pool.execute(query, [
            id,
            username,
            hashedPassword
        ]);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id,
                username
            }
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const query = `
            SELECT id, username
            FROM User
            ORDER BY username
        `;

        const [users] = await pool.execute(query);

        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT id, username
            FROM User
            WHERE id = ?
        `;

        const [users] = await pool.execute(query, [id]);

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: users[0]
        });

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById
}; 