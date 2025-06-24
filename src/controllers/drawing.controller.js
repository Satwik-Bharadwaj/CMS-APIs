const pool = require('../config/db');

// Create a new drawing
const createDrawing = async (req, res) => {
    try {
        const { project_id, particulars, file_url, drawing_file, uploaded_by, approved_by, remarks } = req.body;
        if (!project_id) {
            return res.status(400).json({
                success: false,
                message: 'Missing required field: project_id'
            });
        }
        const query = `INSERT INTO Drawing (project_id, particulars, file_url, drawing_file, uploaded_by, approved_by, remarks) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(query, [
            project_id,
            particulars || null,
            file_url || null,
            drawing_file || null,
            uploaded_by || null,
            approved_by || null,
            remarks || null
        ]);
        res.status(201).json({
            success: true,
            message: 'Drawing created successfully',
            data: {
                id: result.insertId,
                project_id,
                particulars,
                file_url,
                drawing_file,
                uploaded_by,
                approved_by,
                remarks
            }
        });
    } catch (error) {
        console.error('Error creating drawing:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating drawing',
            error: error.message
        });
    }
};

// Get all drawings
const getAllDrawings = async (req, res) => {
    try {
        const query = `SELECT * FROM Drawing ORDER BY id DESC`;
        const [drawings] = await pool.execute(query);
        res.status(200).json({
            success: true,
            data: drawings
        });
    } catch (error) {
        console.error('Error fetching drawings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching drawings',
            error: error.message
        });
    }
};

// Update a drawing
const updateDrawing = async (req, res) => {
    try {
        const { id } = req.params;
        const { project_id, particulars, file_url, drawing_file, uploaded_by, approved_by, remarks } = req.body;
        // Check if drawing exists
        const [existing] = await pool.execute('SELECT * FROM Drawing WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Drawing not found'
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
        if (file_url !== undefined) {
            updateFields.push('file_url = ?');
            updateValues.push(file_url);
        }
        if (drawing_file !== undefined) {
            updateFields.push('drawing_file = ?');
            updateValues.push(drawing_file);
        }
        if (uploaded_by !== undefined) {
            updateFields.push('uploaded_by = ?');
            updateValues.push(uploaded_by);
        }
        if (approved_by !== undefined) {
            updateFields.push('approved_by = ?');
            updateValues.push(approved_by);
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
        const query = `UPDATE Drawing SET ${updateFields.join(', ')} WHERE id = ?`;
        await pool.execute(query, updateValues);
        res.status(200).json({
            success: true,
            message: 'Drawing updated successfully',
            data: { id: parseInt(id) }
        });
    } catch (error) {
        console.error('Error updating drawing:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating drawing',
            error: error.message
        });
    }
};

module.exports = {
    createDrawing,
    getAllDrawings,
    updateDrawing
}; 