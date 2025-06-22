const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Create a new payment
router.post('/', paymentController.createPayment);

// Get all payments
router.get('/', paymentController.getAllPayments);

module.exports = router; 