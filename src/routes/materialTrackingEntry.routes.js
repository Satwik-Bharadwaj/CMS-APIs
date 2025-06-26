const express = require('express');
const router = express.Router();
const materialTrackingEntryController = require('../controllers/materialTrackingEntry.controller');

// Create a new material tracking entry
router.post('/create', materialTrackingEntryController.createMaterialTrackingEntry);

// Get all material tracking entries
router.get('/all', materialTrackingEntryController.getAllMaterialTrackingEntries);

// Update a material tracking entry by ID
router.put('/update/:id', materialTrackingEntryController.updateMaterialTrackingEntry);

module.exports = router; 