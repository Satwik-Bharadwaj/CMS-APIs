const pool = require('../config/db');

// Create a new payment
const createPayment = async (req, res) => {
    try {
        const { project_id, particulars, date, amount, paid_through, remarks } = req.body;

        // Validate required fields
        if (!project_id || !particulars || !date || !amount || !paid_through) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: project_id, particulars, date, amount, paid_through' 
            });
        }

        // Validate amount is a positive number
        if (isNaN(amount) || parseFloat(amount) <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Amount must be a positive number' 
            });
        }

        // Check if project exists
        const [projectExists] = await pool.execute(
            'SELECT id FROM Project WHERE id = ?', 
            [project_id]
        );

        if (projectExists.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Project not found' 
            });
        }

        const query = `
            INSERT INTO Payment 
            (project_id, particulars, date, amount, paid_through, remarks) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(query, [
            project_id,
            particulars,
            date,
            parseFloat(amount),
            paid_through,
            remarks || null
        ]);

        res.status(201).json({
            success: true,
            message: 'Payment added successfully',
            data: {
                id: result.insertId,
                project_id,
                particulars,
                date,
                amount: parseFloat(amount),
                paid_through,
                remarks
            }
        });

    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating payment',
            error: error.message
        });
    }
};

// Get all payments with serial numbers
const getAllPayments = async (req, res) => {
    try {
        const query = `
            SELECT 
                ROW_NUMBER() OVER (ORDER BY p.date DESC) as serial_number,
                p.id,
                p.project_id,
                pr.name as project_name,
                p.particulars,
                p.date,
                p.amount,
                p.paid_through,
                p.remarks
            FROM Payment p
            LEFT JOIN Project pr ON p.project_id = pr.id
            ORDER BY p.date DESC
        `;

        const [payments] = await pool.execute(query);

        res.status(200).json({
            success: true,
            data: payments,
            count: payments.length
        });

    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payments',
            error: error.message
        });
    }
};

// Get a payment by ID
const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                p.id,
                p.project_id,
                pr.name as project_name,
                p.particulars,
                p.date,
                p.amount,
                p.paid_through,
                p.remarks
            FROM Payment p
            LEFT JOIN Project pr ON p.project_id = pr.id
            WHERE p.id = ?
        `;

        const [payments] = await pool.execute(query, [id]);

        if (payments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.status(200).json({
            success: true,
            data: payments[0]
        });

    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment',
            error: error.message
        });
    }
};

// Get payments by project ID
const getPaymentsByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;

        const query = `
            SELECT 
                ROW_NUMBER() OVER (ORDER BY date DESC) as serial_number,
                id,
                project_id,
                particulars,
                date,
                amount,
                paid_through,
                remarks
            FROM Payment
            WHERE project_id = ?
            ORDER BY date DESC
        `;

        const [payments] = await pool.execute(query, [projectId]);

        res.status(200).json({
            success: true,
            data: payments,
            count: payments.length
        });

    } catch (error) {
        console.error('Error fetching payments for project:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payments for project',
            error: error.message
        });
    }
};

// Update a payment by ID
const updatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { project_id, particulars, date, amount, paid_through, remarks } = req.body;

        // Check if payment exists
        const [existingPayment] = await pool.execute(
            'SELECT id FROM Payment WHERE id = ?', 
            [id]
        );

        if (existingPayment.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Validate required fields
        if (!project_id || !particulars || !date || !amount || !paid_through) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: project_id, particulars, date, amount, paid_through' 
            });
        }

        // Validate amount is a positive number
        if (isNaN(amount) || parseFloat(amount) <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Amount must be a positive number' 
            });
        }

        // Check if project exists
        const [projectExists] = await pool.execute(
            'SELECT id FROM Project WHERE id = ?', 
            [project_id]
        );

        if (projectExists.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Project not found' 
            });
        }

        const query = `
            UPDATE Payment 
            SET project_id = ?, particulars = ?, date = ?, amount = ?, paid_through = ?, remarks = ?
            WHERE id = ?
        `;

        await pool.execute(query, [
            project_id,
            particulars,
            date,
            parseFloat(amount),
            paid_through,
            remarks || null,
            id
        ]);

        res.status(200).json({
            success: true,
            message: 'Payment updated successfully',
            data: {
                id: parseInt(id),
                project_id,
                particulars,
                date,
                amount: parseFloat(amount),
                paid_through,
                remarks
            }
        });

    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating payment',
            error: error.message
        });
    }
};

// Delete a payment by ID
const deletePayment = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if payment exists
        const [existingPayment] = await pool.execute(
            'SELECT id FROM Payment WHERE id = ?', 
            [id]
        );

        if (existingPayment.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        const query = 'DELETE FROM Payment WHERE id = ?';
        await pool.execute(query, [id]);

        res.status(200).json({
            success: true,
            message: 'Payment deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting payment',
            error: error.message
        });
    }
};

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    getPaymentsByProjectId,
    updatePayment,
    deletePayment
}; 