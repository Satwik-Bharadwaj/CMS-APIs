const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');

// Create a new project
router.post('/create', projectController.createProject);

// Get all projects
router.get('/all', projectController.getAllProjects);

// Get a project by ID
router.get('/id/:id', projectController.getProjectById);

// Update a project by ID
router.put('/update/:id', projectController.updateProject);

// Delete a project by ID
router.delete('/delete/:id', projectController.deleteProject);

module.exports = router; 