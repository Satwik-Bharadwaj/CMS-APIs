const express = require('express');
const router = express.Router();
const rateListController = require('../controllers/rate_list.controller');

// Create a new rate list
router.post('/', rateListController.createRateList);

// Get all rate lists
router.get('/', rateListController.getAllRateLists);

// Update a rate list
router.put('/:id', rateListController.updateRateList);

module.exports = router; 