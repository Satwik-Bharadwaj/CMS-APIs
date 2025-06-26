const express = require('express');
const router = express.Router();
const labourBillController = require('../controllers/labourBill.controller');

// Create a new labour bill
router.post('/create', labourBillController.createLabourBill);

// Get all labour bills
router.get('/all', labourBillController.getAllLabourBills);

// Update a labour bill by ID
router.put('/update/:id', labourBillController.updateLabourBill);

module.exports = router; 