const express = require('express');
const router = express.Router();
const drawingController = require('../controllers/drawing.controller');

// Create a new drawing
// Create a new drawing
router.post('/create', drawingController.createDrawing);

// Get all drawings
// Get all drawings
router.get('/all', drawingController.getAllDrawings);

// Update a drawing
// Update a drawing by ID
router.put('/update/:id', drawingController.updateDrawing);

module.exports = router; 