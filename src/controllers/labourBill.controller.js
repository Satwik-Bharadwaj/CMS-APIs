const pool = require('../config/db');

// Create a new labour bill
const createLabourBill = async (req, res) => {
    try {
        const { project_id, date, bar_bender, head_mason, mason, m_helper, w_helper, total, extra_payment, remarks } = req.body;
        if (!project_id || !date) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: project_id, date'
            });
        }
        const query = `INSERT INTO LabourBill (project_id, date, bar_bender, head_mason, mason, m_helper, w_helper, total, extra_payment, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(query, [
            project_id,
            date,
            bar_bender || null,
            head_mason || null,
            mason || null,
            m_helper || null,
            w_helper || null,
            total || null,
            extra_payment || null,
            remarks || null
        ]);
        res.status(201).json({
            success: true,
            message: 'Labour bill created successfully',
            data: {
                id: result.insertId,
                project_id,
                date,
                bar_bender,
                head_mason,
                mason,
                m_helper,
                w_helper,
                total,
                extra_payment,
                remarks
            }
        });
    } catch (error) {
        console.error('Error creating labour bill:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating labour bill',
            error: error.message
        });
    }
};

// Get all labour bills
const getAllLabourBills = async (req, res) => {
    try {
        const query = `SELECT * FROM LabourBill ORDER BY id DESC`;
        const [bills] = await pool.execute(query);
        res.status(200).json({
            success: true,
            data: bills
        });
    } catch (error) {
        console.error('Error fetching labour bills:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching labour bills',
            error: error.message
        });
    }
};

// Update a labour bill
const updateLabourBill = async (req, res) => {
    try {
        const { id } = req.params;
        const { project_id, date, bar_bender, head_mason, mason, m_helper, w_helper, total, extra_payment, remarks } = req.body;
        // Check if labour bill exists
        const [existing] = await pool.execute('SELECT * FROM LabourBill WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Labour bill not found'
            });
        }
        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];
        if (project_id !== undefined) {
            updateFields.push('project_id = ?');
            updateValues.push(project_id);
        }
        if (date !== undefined) {
            updateFields.push('date = ?');
            updateValues.push(date);
        }
        if (bar_bender !== undefined) {
            updateFields.push('bar_bender = ?');
            updateValues.push(bar_bender);
        }
        if (head_mason !== undefined) {
            updateFields.push('head_mason = ?');
            updateValues.push(head_mason);
        }
        if (mason !== undefined) {
            updateFields.push('mason = ?');
            updateValues.push(mason);
        }
        if (m_helper !== undefined) {
            updateFields.push('m_helper = ?');
            updateValues.push(m_helper);
        }
        if (w_helper !== undefined) {
            updateFields.push('w_helper = ?');
            updateValues.push(w_helper);
        }
        if (total !== undefined) {
            updateFields.push('total = ?');
            updateValues.push(total);
        }
        if (extra_payment !== undefined) {
            updateFields.push('extra_payment = ?');
            updateValues.push(extra_payment);
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
        const query = `UPDATE LabourBill SET ${updateFields.join(', ')} WHERE id = ?`;
        await pool.execute(query, updateValues);
        res.status(200).json({
            success: true,
            message: 'Labour bill updated successfully',
            data: { id: parseInt(id) }
        });
    } catch (error) {
        console.error('Error updating labour bill:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating labour bill',
            error: error.message
        });
    }
};

module.exports = {
    createLabourBill,
    getAllLabourBills,
    updateLabourBill
}; 