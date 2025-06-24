const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const paymentRoutes = require('./routes/payment.routes');
const projectRoutes = require('./routes/project.routes');
const userRoutes = require('./routes/user.routes');
const paymentPlanRoutes = require('./routes/payment_plan.routes');
const rateListRoutes = require('./routes/rate_list.routes');
const drawingRoutes = require('./routes/drawing.routes');
const materialRoutes = require('./routes/material.routes');
const labourBillRoutes = require('./routes/labourBill.routes');
const labourPaymentRoutes = require('./routes/labourPayment.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Test route is working' });
});

// Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment-plans', paymentPlanRoutes);
app.use('/api/rate-lists', rateListRoutes);
app.use('/api/drawings', drawingRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/labour-bills', labourBillRoutes);
app.use('/api/labour-payments', labourPaymentRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Construction Management API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false,
        message: 'Something went wrong!',
        error: err.message 
    });
});

const PORT = process.env.PORT || 3001;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test the server at: http://localhost:${PORT}/test`);
}); 