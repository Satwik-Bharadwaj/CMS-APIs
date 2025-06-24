const pool = require('../config/db');

// Create a new material
const createMaterial = async (req, res) => {
    try {
        const { project_id, particulars } = req.body;
        if (!project_id || !particulars) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: project_id, particulars'
            });
        }
        const query = `INSERT INTO Material (project_id, particulars) VALUES (?, ?)`;
        const [result] = await pool.execute(query, [project_id, particulars]);
        res.status(201).json({
            success: true,
            message: 'Material created successfully',
            data: {
                id: result.insertId,
                project_id,
                particulars
            }
        });
    } catch (error) {
        console.error('Error creating material:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating material',
            error: error.message
        });
    }
};

// Get all materials
const getAllMaterials = async (req, res) => {
    try {
        const query = `SELECT * FROM Material ORDER BY id DESC`;
        const [materials] = await pool.execute(query);
        res.status(200).json({
            success: true,
            data: materials
        });
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching materials',
            error: error.message
        });
    }
};

// Update a material
const updateMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { project_id, particulars } = req.body;
        // Check if material exists
        const [existing] = await pool.execute('SELECT * FROM Material WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
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
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        updateValues.push(id);
        const query = `UPDATE Material SET ${updateFields.join(', ')} WHERE id = ?`;
        await pool.execute(query, updateValues);
        res.status(200).json({
            success: true,
            message: 'Material updated successfully',
            data: { id: parseInt(id) }
        });
    } catch (error) {
        console.error('Error updating material:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating material',
            error: error.message
        });
    }
};

// Delete material by ID
const deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if material exists
        const [existingMaterial] = await pool.execute(
            'SELECT * FROM Material WHERE id = ?',
            [id]
        );

        if (existingMaterial.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        // Start a transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        try {
            // Delete associated MaterialTrackingEntry records
            await connection.execute('DELETE FROM MaterialTrackingEntry WHERE material_id = ?', [id]);
            // Delete the material
            await connection.execute('DELETE FROM Material WHERE id = ?', [id]);
            await connection.commit();
            res.status(200).json({
                success: true,
                message: 'Material and associated tracking entries deleted successfully',
                data: {
                    id: parseInt(id),
                    particulars: existingMaterial[0].particulars
                }
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error deleting material:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting material and associated tracking entries',
            error: error.message
        });
    }
};

module.exports = {
    createMaterial,
    getAllMaterials,
    updateMaterial,
    deleteMaterial
}; 