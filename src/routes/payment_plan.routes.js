const express = require('express');
const router = express.Router();
const paymentPlanController = require('../controllers/payment_plan.controller');

// Create a new payment plan
router.post('/', paymentPlanController.createPaymentPlan);

// Get all payment plans
router.get('/', paymentPlanController.getAllPaymentPlans);

// Update a payment plan
router.put('/:id', paymentPlanController.updatePaymentPlan);

module.exports = router; 