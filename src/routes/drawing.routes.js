const express = require('express');
const router = express.Router();
const drawingController = require('../controllers/drawing.controller');

// Create a new drawing
router.post('/', drawingController.createDrawing);

// Get all drawings
router.get('/', drawingController.getAllDrawings);

// Update a drawing
router.put('/:id', drawingController.updateDrawing);

module.exports = router; 