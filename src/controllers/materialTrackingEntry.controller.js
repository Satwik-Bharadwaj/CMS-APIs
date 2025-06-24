const pool = require('../config/db');

// Create a new material tracking entry
const createMaterialTrackingEntry = async (req, res) => {
    try {
        const { material_id, date, received_quantity, consumed_quantity } = req.body;
        if (!material_id || !date) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: material_id, date'
            });
        }
        const query = `INSERT INTO MaterialTrackingEntry (material_id, date, received_quantity, consumed_quantity) VALUES (?, ?, ?, ?)`;
        const [result] = await pool.execute(query, [
            material_id,
            date,
            received_quantity || null,
            consumed_quantity || null
        ]);
        res.status(201).json({
            success: true,
            message: 'Material tracking entry created successfully',
            data: {
                id: result.insertId,
                material_id,
                date,
                received_quantity,
                consumed_quantity
            }
        });
    } catch (error) {
        console.error('Error creating material tracking entry:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating material tracking entry',
            error: error.message
        });
    }
};

// Get all material tracking entries
const getAllMaterialTrackingEntries = async (req, res) => {
    try {
        const query = `SELECT * FROM MaterialTrackingEntry ORDER BY id DESC`;
        const [entries] = await pool.execute(query);
        res.status(200).json({
            success: true,
            data: entries
        });
    } catch (error) {
        console.error('Error fetching material tracking entries:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching material tracking entries',
            error: error.message
        });
    }
};

// Update a material tracking entry
const updateMaterialTrackingEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { material_id, date, received_quantity, consumed_quantity } = req.body;
        // Check if entry exists
        const [existing] = await pool.execute('SELECT * FROM MaterialTrackingEntry WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Material tracking entry not found'
            });
        }
        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];
        if (material_id !== undefined) {
            updateFields.push('material_id = ?');
            updateValues.push(material_id);
        }
        if (date !== undefined) {
            updateFields.push('date = ?');
            updateValues.push(date);
        }
        if (received_quantity !== undefined) {
            updateFields.push('received_quantity = ?');
            updateValues.push(received_quantity);
        }
        if (consumed_quantity !== undefined) {
            updateFields.push('consumed_quantity = ?');
            updateValues.push(consumed_quantity);
        }
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        updateValues.push(id);
        const query = `UPDATE MaterialTrackingEntry SET ${updateFields.join(', ')} WHERE id = ?`;
        await pool.execute(query, updateValues);
        res.status(200).json({
            success: true,
            message: 'Material tracking entry updated successfully',
            data: { id: parseInt(id) }
        });
    } catch (error) {
        console.error('Error updating material tracking entry:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating material tracking entry',
            error: error.message
        });
    }
};

module.exports = {
    createMaterialTrackingEntry,
    getAllMaterialTrackingEntries,
    updateMaterialTrackingEntry
}; 