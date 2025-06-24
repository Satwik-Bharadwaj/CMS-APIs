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
                u3.username as updated_by_name,
                u4.username as admin_name
            FROM Project p
            LEFT JOIN User u1 ON p.client_id = u1.id
            LEFT JOIN User u2 ON p.created_by = u2.id
            LEFT JOIN User u3 ON p.updated_by = u3.id
            LEFT JOIN User u4 ON p.admin_id = u4.id
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

// Update a project
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            client_id,
            labour_contractor,
            address,
            total_budget,
            updated_by,
            admin_id
        } = req.body;

        // Validate required fields
        if (!updated_by) {
            return res.status(400).json({
                success: false,
                message: 'updated_by is required for project updates'
            });
        }

        // Check if project exists
        const [existingProject] = await pool.execute(
            'SELECT * FROM Project WHERE id = ?',
            [id]
        );

        if (existingProject.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];

        if (name !== undefined) {
            updateFields.push('name = ?');
            updateValues.push(name);
        }
        if (client_id !== undefined) {
            updateFields.push('client_id = ?');
            updateValues.push(client_id);
        }
        if (labour_contractor !== undefined) {
            updateFields.push('labour_contractor = ?');
            updateValues.push(labour_contractor);
        }
        if (address !== undefined) {
            updateFields.push('address = ?');
            updateValues.push(address);
        }
        if (total_budget !== undefined) {
            updateFields.push('total_budget = ?');
            updateValues.push(total_budget);
        }
        if (admin_id !== undefined) {
            updateFields.push('admin_id = ?');
            updateValues.push(admin_id);
        }

        // Always update updated_by and updated_on
        updateFields.push('updated_by = ?');
        updateFields.push('updated_on = NOW()');
        updateValues.push(updated_by);

        // Add project id for WHERE clause
        updateValues.push(id);

        const query = `
            UPDATE Project 
            SET ${updateFields.join(', ')}
            WHERE id = ?
        `;

        await pool.execute(query, updateValues);

        res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            data: {
                id: parseInt(id),
                updated_by,
                updated_on: new Date()
            }
        });

    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating project',
            error: error.message
        });
    }
};

// Get project by ID
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                p.*,
                u1.username as client_name,
                u2.username as created_by_name,
                u3.username as updated_by_name,
                u4.username as admin_name
            FROM Project p
            LEFT JOIN User u1 ON p.client_id = u1.id
            LEFT JOIN User u2 ON p.created_by = u2.id
            LEFT JOIN User u3 ON p.updated_by = u3.id
            LEFT JOIN User u4 ON p.admin_id = u4.id
            WHERE p.id = ?
        `;

        const [projects] = await pool.execute(query, [id]);

        if (projects.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            data: projects[0]
        });

    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching project',
            error: error.message
        });
    }
};

// Delete project by ID
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if project exists
        const [existingProject] = await pool.execute(
            'SELECT * FROM Project WHERE id = ?',
            [id]
        );

        if (existingProject.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Start a transaction to ensure data consistency
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Delete all associated records from other tables
            // Note: We'll delete in reverse order of foreign key dependencies

            // 1. Delete from Payment_plan table
            try {
                await connection.execute('DELETE FROM Payment_plan WHERE project_id = ?', [id]);
                console.log('Deleted payment plans for project:', id);
            } catch (error) {
                console.log('Payment_plan table may not exist, skipping...');
            }

            // 2. Delete from Payment table
            await connection.execute('DELETE FROM Payment WHERE project_id = ?', [id]);
            console.log('Deleted payments for project:', id);

            // 3. Delete from RateList table (if it exists)
            try {
                await connection.execute('DELETE FROM RateList WHERE project_id = ?', [id]);
                console.log('Deleted rate lists for project:', id);
            } catch (error) {
                console.log('RateList table may not exist, skipping...');
            }

            // 4. Delete from Drawing table (if it exists)
            try {
                await connection.execute('DELETE FROM Drawing WHERE project_id = ?', [id]);
                console.log('Deleted drawings for project:', id);
            } catch (error) {
                console.log('Drawing table may not exist, skipping...');
            }

            // 5. Delete from Material table (if it exists)
            try {
                await connection.execute('DELETE FROM Material WHERE project_id = ?', [id]);
                console.log('Deleted materials for project:', id);
            } catch (error) {
                console.log('Material table may not exist, skipping...');
            }

            // 6. Delete from LabourBill table (if it exists)
            try {
                await connection.execute('DELETE FROM LabourBill WHERE project_id = ?', [id]);
                console.log('Deleted labour bills for project:', id);
            } catch (error) {
                console.log('LabourBill table may not exist, skipping...');
            }

            // 7. Delete from LabourPayment table (if it exists)
            try {
                await connection.execute('DELETE FROM LabourPayment WHERE project_id = ?', [id]);
                console.log('Deleted labour payments for project:', id);
            } catch (error) {
                console.log('LabourPayment table may not exist, skipping...');
            }

            // 8. Delete from ProjectSupervisor table (if it exists)
            try {
                await connection.execute('DELETE FROM ProjectSupervisor WHERE project_id = ?', [id]);
                console.log('Deleted project supervisors for project:', id);
            } catch (error) {
                console.log('ProjectSupervisor table may not exist, skipping...');
            }

            // 9. Finally, delete the project itself
            await connection.execute('DELETE FROM Project WHERE id = ?', [id]);
            console.log('Deleted project:', id);

            // Commit the transaction
            await connection.commit();

            res.status(200).json({
                success: true,
                message: 'Project and all associated data deleted successfully',
                data: {
                    id: parseInt(id),
                    name: existingProject[0].name,
                    deletedTables: [
                        'Payment_plan',
                        'Payment',
                        'RateList',
                        'Drawing', 
                        'Material',
                        'LabourBill',
                        'LabourPayment',
                        'ProjectSupervisor',
                        'Project'
                    ]
                }
            });

        } catch (error) {
            // Rollback the transaction if any error occurs
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting project and associated data',
            error: error.message
        });
    }
};

module.exports = {
    createProject,
    getAllProjects,
    updateProject,
    getProjectById,
    deleteProject
}; 