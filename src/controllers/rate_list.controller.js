const pool = require('../config/db');

// Create a new rate list
const createRateList = async (req, res) => {
    try {
        const { project_id, head_mason_rate, mason_rate, m_helper_rate, w_helper_rate, column_barbending_rate } = req.body;
        if (!project_id) {
            return res.status(400).json({
                success: false,
                message: 'Missing required field: project_id'
            });
        }
        const query = `INSERT INTO RateList (project_id, head_mason_rate, mason_rate, m_helper_rate, w_helper_rate, column_barbending_rate) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(query, [
            project_id,
            head_mason_rate || null,
            mason_rate || null,
            m_helper_rate || null,
            w_helper_rate || null,
            column_barbending_rate || null
        ]);
        res.status(201).json({
            success: true,
            message: 'Rate list created successfully',
            data: {
                id: result.insertId,
                project_id,
                head_mason_rate,
                mason_rate,
                m_helper_rate,
                w_helper_rate,
                column_barbending_rate
            }
        });
    } catch (error) {
        console.error('Error creating rate list:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating rate list',
            error: error.message
        });
    }
};

// Get all rate lists
const getAllRateLists = async (req, res) => {
    try {
        const query = `SELECT * FROM RateList ORDER BY id DESC`;
        const [lists] = await pool.execute(query);
        res.status(200).json({
            success: true,
            data: lists
        });
    } catch (error) {
        console.error('Error fetching rate lists:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching rate lists',
            error: error.message
        });
    }
};

// Update a rate list
const updateRateList = async (req, res) => {
    try {
        const { id } = req.params;
        const { project_id, head_mason_rate, mason_rate, m_helper_rate, w_helper_rate, column_barbending_rate } = req.body;
        // Check if rate list exists
        const [existing] = await pool.execute('SELECT * FROM RateList WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Rate list not found'
            });
        }
        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];
        if (project_id !== undefined) {
            updateFields.push('project_id = ?');
            updateValues.push(project_id);
        }
        if (head_mason_rate !== undefined) {
            updateFields.push('head_mason_rate = ?');
            updateValues.push(head_mason_rate);
        }
        if (mason_rate !== undefined) {
            updateFields.push('mason_rate = ?');
            updateValues.push(mason_rate);
        }
        if (m_helper_rate !== undefined) {
            updateFields.push('m_helper_rate = ?');
            updateValues.push(m_helper_rate);
        }
        if (w_helper_rate !== undefined) {
            updateFields.push('w_helper_rate = ?');
            updateValues.push(w_helper_rate);
        }
        if (column_barbending_rate !== undefined) {
            updateFields.push('column_barbending_rate = ?');
            updateValues.push(column_barbending_rate);
        }
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        updateValues.push(id);
        const query = `UPDATE RateList SET ${updateFields.join(', ')} WHERE id = ?`;
        await pool.execute(query, updateValues);
        res.status(200).json({
            success: true,
            message: 'Rate list updated successfully',
            data: { id: parseInt(id) }
        });
    } catch (error) {
        console.error('Error updating rate list:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating rate list',
            error: error.message
        });
    }
};

module.exports = {
    createRateList,
    getAllRateLists,
    updateRateList
}; 