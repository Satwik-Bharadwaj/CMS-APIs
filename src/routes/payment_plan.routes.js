const express = require('express');
const router = express.Router();
const paymentPlanController = require('../controllers/payment_plan.controller');

// Create a new payment plan
// Create a new payment plan
router.post('/create', paymentPlanController.createPaymentPlan);

// Get all payment plans
// Get all payment plans
router.get('/all', paymentPlanController.getAllPaymentPlans);

// Update a payment plan
// Update a payment plan by ID
router.put('/update/:id', paymentPlanController.updatePaymentPlan);

module.exports = router; 