const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Create a new payment
router.post('/create', paymentController.createPayment);

// Get all payments
router.get('/all', paymentController.getAllPayments);

module.exports = router; 