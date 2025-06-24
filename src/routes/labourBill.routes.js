const express = require('express');
const router = express.Router();
const labourBillController = require('../controllers/labourBill.controller');

// Create a new labour bill
router.post('/', labourBillController.createLabourBill);

// Get all labour bills
router.get('/', labourBillController.getAllLabourBills);

// Update a labour bill
router.put('/:id', labourBillController.updateLabourBill);

module.exports = router; 