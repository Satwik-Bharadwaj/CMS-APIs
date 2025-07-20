const express = require("express");
const router = express.Router();
const labourPaymentController = require("../controllers/labourPayment.controller");

// Create a new labour payment
router.post("/", labourPaymentController.createLabourPayment);

// Get all labour payments
router.get("/", labourPaymentController.getAllLabourPayments);

module.exports = router;
