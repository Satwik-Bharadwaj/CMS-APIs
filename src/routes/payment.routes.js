const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Create a new payment
router.post('/create', paymentController.createPayment);

// Get all payments
router.get('/all', paymentController.getAllPayments);

// Get a payment by ID
router.get('/id/:id', paymentController.getPaymentById);

// Get payments by project ID
router.get('/project/:projectId', paymentController.getPaymentsByProjectId);

// Update a payment by ID
router.put('/update/:id', paymentController.updatePayment);

// Delete a payment by ID
router.delete('/delete/:id', paymentController.deletePayment);

module.exports = router; 