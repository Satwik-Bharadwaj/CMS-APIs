const express = require('express');
const router = express.Router();
const materialController = require('../controllers/material.controller');

// Create a new material
// Create a new material
router.post('/create', materialController.createMaterial);

// Get all materials
// Get all materials
router.get('/all', materialController.getAllMaterials);

// Update a material
// Update a material by ID
router.put('/update/:id', materialController.updateMaterial);

// Delete a material
// Delete a material by ID
router.delete('/delete/:id', materialController.deleteMaterial);

module.exports = router; 