const pool = require('../config/db');

// Create a new payment plan
const createPaymentPlan = async (req, res) => {
    try {
        const { project_id, particulars, date, amount } = req.body;
        if (!project_id || !particulars || !date || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: project_id, particulars, date, amount'
            });
        }
        const query = `INSERT INTO Payment_plan (project_id, particulars, date, amount) VALUES (?, ?, ?, ?)`;
        const [result] = await pool.execute(query, [project_id, particulars, date, amount]);
        res.status(201).json({
            success: true,
            message: 'Payment plan created successfully',
            data: {
                id: result.insertId,
                project_id,
                particulars,
                date,
                amount
            }
        });
    } catch (error) {
        console.error('Error creating payment plan:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating payment plan',
            error: error.message
        });
    }
};

// Get all payment plans
const getAllPaymentPlans = async (req, res) => {
    try {
        const query = `SELECT * FROM Payment_plan ORDER BY date DESC`;
        const [plans] = await pool.execute(query);
        res.status(200).json({
            success: true,
            data: plans
        });
    } catch (error) {
        console.error('Error fetching payment plans:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment plans',
            error: error.message
        });
    }
};

// Update a payment plan
const updatePaymentPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { project_id, particulars, date, amount } = req.body;
        // Check if payment plan exists
        const [existing] = await pool.execute('SELECT * FROM Payment_plan WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Payment plan not found'
            });
        }
        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];
        if (project_id !== undefined) {
            updateFields.push('project_id = ?');
            updateValues.push(project_id);
        }
        if (particulars !== undefined) {
            updateFields.push('particulars = ?');
            updateValues.push(particulars);
        }
        if (date !== undefined) {
            updateFields.push('date = ?');
            updateValues.push(date);
        }
        if (amount !== undefined) {
            updateFields.push('amount = ?');
            updateValues.push(amount);
        }
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        updateValues.push(id);
        const query = `UPDATE Payment_plan SET ${updateFields.join(', ')} WHERE id = ?`;
        await pool.execute(query, updateValues);
        res.status(200).json({
            success: true,
            message: 'Payment plan updated successfully',
            data: { id: parseInt(id) }
        });
    } catch (error) {
        console.error('Error updating payment plan:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating payment plan',
            error: error.message
        });
    }
};

module.exports = {
    createPaymentPlan,
    getAllPaymentPlans,
    updatePaymentPlan
}; 