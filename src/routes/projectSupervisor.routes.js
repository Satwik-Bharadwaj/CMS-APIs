const express = require('express');
const router = express.Router();
const projectSupervisorController = require('../controllers/projectSupervisor.controller');

// Create a new project supervisor
router.post('/create', projectSupervisorController.createProjectSupervisor);

// Get all project supervisors
router.get('/all', projectSupervisorController.getAllProjectSupervisors);

// Update a project supervisor by ID
router.put('/update/:id', projectSupervisorController.updateProjectSupervisor);

module.exports = router; 