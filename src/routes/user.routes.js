const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Create a new user
router.post('/create', userController.createUser);

// Get all users
router.get('/all', userController.getAllUsers);

// Get a user by ID
router.get('/id/:id', userController.getUserById);

module.exports = router; 