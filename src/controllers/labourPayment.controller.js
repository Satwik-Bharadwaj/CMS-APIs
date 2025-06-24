const pool = require('../config/db');

// Create a new labour payment
const createLabourPayment = async (req, res) => {
    try {
        const { project_id, particulars, date, net_amount, extra, labour_amount, cumulative_amount, remarks } = req.body;
        if (!project_id || !date) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: project_id, date'
            });
        }
        const query = `INSERT INTO LabourPayment (project_id, particulars, date, net_amount, extra, labour_amount, cumulative_amount, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(query, [
            project_id,
            particulars || null,
            date,
            net_amount || null,
            extra || null,
            labour_amount || null,
            cumulative_amount || null,
            remarks || null
        ]);
        res.status(201).json({
            success: true,
            message: 'Labour payment created successfully',
            data: {
                id: result.insertId,
                project_id,
                particulars,
                date,
                net_amount,
                extra,
                labour_amount,
                cumulative_amount,
                remarks
            }
        });
    } catch (error) {
        console.error('Error creating labour payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating labour payment',
            error: error.message
        });
    }
};

// Get all labour payments
const getAllLabourPayments = async (req, res) => {
    try {
        const query = `SELECT * FROM LabourPayment ORDER BY id DESC`;
        const [payments] = await pool.execute(query);
        res.status(200).json({
            success: true,
            data: payments
        });
    } catch (error) {
        console.error('Error fetching labour payments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching labour payments',
            error: error.message
        });
    }
};

// Update a labour payment
const updateLabourPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { project_id, particulars, date, net_amount, extra, labour_amount, cumulative_amount, remarks } = req.body;
        // Check if labour payment exists
        const [existing] = await pool.execute('SELECT * FROM LabourPayment WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Labour payment not found'
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
        if (net_amount !== undefined) {
            updateFields.push('net_amount = ?');
            updateValues.push(net_amount);
        }
        if (extra !== undefined) {
            updateFields.push('extra = ?');
            updateValues.push(extra);
        }
        if (labour_amount !== undefined) {
            updateFields.push('labour_amount = ?');
            updateValues.push(labour_amount);
        }
        if (cumulative_amount !== undefined) {
            updateFields.push('cumulative_amount = ?');
            updateValues.push(cumulative_amount);
        }
        if (remarks !== undefined) {
            updateFields.push('remarks = ?');
            updateValues.push(remarks);
        }
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        updateValues.push(id);
        const query = `UPDATE LabourPayment SET ${updateFields.join(', ')} WHERE id = ?`;
        await pool.execute(query, updateValues);
        res.status(200).json({
            success: true,
            message: 'Labour payment updated successfully',
            data: { id: parseInt(id) }
        });
    } catch (error) {
        console.error('Error updating labour payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating labour payment',
            error: error.message
        });
    }
};

module.exports = {
    createLabourPayment,
    getAllLabourPayments,
    updateLabourPayment
}; 