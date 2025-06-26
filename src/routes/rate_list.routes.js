const express = require('express');
const router = express.Router();
const rateListController = require('../controllers/rate_list.controller');

// Create a new rate list
router.post('/create', rateListController.createRateList);

// Get all rate lists
router.get('/all', rateListController.getAllRateLists);

// Update a rate list by ID
router.put('/update/:id', rateListController.updateRateList);

module.exports = router; 