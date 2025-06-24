const express = require('express');
const router = express.Router();
const projectSupervisorController = require('../controllers/projectSupervisor.controller');

// Create a new project supervisor
router.post('/', projectSupervisorController.createProjectSupervisor);

// Get all project supervisors
router.get('/', projectSupervisorController.getAllProjectSupervisors);

// Update a project supervisor
router.put('/:id', projectSupervisorController.updateProjectSupervisor);

module.exports = router; 