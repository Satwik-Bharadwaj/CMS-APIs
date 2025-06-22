const pool = require('../config/db');

// Create a new project
const createProject = async (req, res) => {
    try {
        const {
            name,
            client_id,
            labour_contractor,
            address,
            total_budget,
            created_by,
            admin_id
        } = req.body;

        // Validate required fields
        if (!name || !client_id || !created_by || !admin_id) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, client_id, created_by, and admin_id are required'
            });
        }

        const query = `
            INSERT INTO Project (
                name,
                client_id,
                labour_contractor,
                address,
                total_budget,
                created_by,
                created_on,
                updated_by,
                updated_on,
                admin_id
            ) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, NOW(), ?)
        `;

        const [result] = await pool.execute(query, [
            name,
            client_id,
            labour_contractor || null,
            address || null,
            total_budget || null,
            created_by,
            created_by, // updated_by is same as created_by initially
            admin_id
        ]);

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: {
                id: result.insertId,
                name,
                client_id,
                labour_contractor,
                address,
                total_budget,
                created_by,
                admin_id
            }
        });

    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating project',
            error: error.message
        });
    }
};

// Get all projects
const getAllProjects = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.*,
                u1.username as client_name,
                u2.username as created_by_name,
                u3.username as admin_name
            FROM Project p
            LEFT JOIN User u1 ON p.client_id = u1.id
            LEFT JOIN User u2 ON p.created_by = u2.id
            LEFT JOIN User u3 ON p.admin_id = u3.id
            ORDER BY p.created_on DESC
        `;

        const [projects] = await pool.execute(query);

        res.status(200).json({
            success: true,
            data: projects
        });

    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching projects',
            error: error.message
        });
    }
};

module.exports = {
    createProject,
    getAllProjects
}; 