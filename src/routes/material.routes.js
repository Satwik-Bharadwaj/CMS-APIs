const express = require('express');
const router = express.Router();
const materialController = require('../controllers/material.controller');

// Create a new material
router.post('/', materialController.createMaterial);

// Get all materials
router.get('/', materialController.getAllMaterials);

// Update a material
router.put('/:id', materialController.updateMaterial);

// Delete a material
router.delete('/:id', materialController.deleteMaterial);

module.exports = router; 