const express = require('express');
const router = express.Router();
const materialTrackingEntryController = require('../controllers/materialTrackingEntry.controller');

// Create a new material tracking entry
router.post('/', materialTrackingEntryController.createMaterialTrackingEntry);

// Get all material tracking entries
router.get('/', materialTrackingEntryController.getAllMaterialTrackingEntries);

// Update a material tracking entry
router.put('/:id', materialTrackingEntryController.updateMaterialTrackingEntry);

module.exports = router; 