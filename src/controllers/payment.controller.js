const pool = require('../config/db');

// Create a new payment
const createPayment = async (req, res) => {
    try {
        const { project_id, particulars, date, amount, paid_through, remarks } = req.body;

        // Validate required fields
        if (!project_id || !particulars || !date || !amount || !paid_through) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
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
            amount,
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
                amount,
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
                ROW_NUMBER() OVER (ORDER BY date DESC) as serial_number,
                id,
                project_id,
                particulars,
                date,
                amount,
                paid_through,
                remarks
            FROM Payment
            ORDER BY date DESC
        `;

        const [payments] = await pool.execute(query);

        res.status(200).json({
            success: true,
            data: payments
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

module.exports = {
    createPayment,
    getAllPayments
}; 