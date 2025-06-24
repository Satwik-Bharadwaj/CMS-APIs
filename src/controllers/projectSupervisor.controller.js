const pool = require('../config/db');

// Create a new project supervisor
const createProjectSupervisor = async (req, res) => {
    try {
        const { project_id, supervisor_id } = req.body;
        if (!project_id || !supervisor_id) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: project_id, supervisor_id'
            });
        }
        const query = `INSERT INTO ProjectSupervisor (project_id, supervisor_id) VALUES (?, ?)`;
        const [result] = await pool.execute(query, [project_id, supervisor_id]);
        res.status(201).json({
            success: true,
            message: 'Project supervisor created successfully',
            data: {
                id: result.insertId,
                project_id,
                supervisor_id
            }
        });
    } catch (error) {
        console.error('Error creating project supervisor:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating project supervisor',
            error: error.message
        });
    }
};

// Get all project supervisors
const getAllProjectSupervisors = async (req, res) => {
    try {
        const query = `SELECT * FROM ProjectSupervisor ORDER BY id DESC`;
        const [supervisors] = await pool.execute(query);
        res.status(200).json({
            success: true,
            data: supervisors
        });
    } catch (error) {
        console.error('Error fetching project supervisors:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching project supervisors',
            error: error.message
        });
    }
};

// Update a project supervisor
const updateProjectSupervisor = async (req, res) => {
    try {
        const { id } = req.params;
        const { project_id, supervisor_id } = req.body;
        // Check if supervisor exists
        const [existing] = await pool.execute('SELECT * FROM ProjectSupervisor WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project supervisor not found'
            });
        }
        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];
        if (project_id !== undefined) {
            updateFields.push('project_id = ?');
            updateValues.push(project_id);
        }
        if (supervisor_id !== undefined) {
            updateFields.push('supervisor_id = ?');
            updateValues.push(supervisor_id);
        }
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        updateValues.push(id);
        const query = `UPDATE ProjectSupervisor SET ${updateFields.join(', ')} WHERE id = ?`;
        await pool.execute(query, updateValues);
        res.status(200).json({
            success: true,
            message: 'Project supervisor updated successfully',
            data: { id: parseInt(id) }
        });
    } catch (error) {
        console.error('Error updating project supervisor:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating project supervisor',
            error: error.message
        });
    }
};

module.exports = {
    createProjectSupervisor,
    getAllProjectSupervisors,
    updateProjectSupervisor
}; 