const pool = require("../config/db");

/**
 * Create a new project
 */
const createProject = async (req, res) => {
  try {
    const {
      name,
      client_id,
      labour_contractor,
      address,
      total_budget,
      created_by,
      admin_id,
    } = req.body;

    // Validate required fields
    if (!name || !client_id || !created_by || !admin_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, client_id, created_by, and admin_id are required",
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
      admin_id,
    ]);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: {
        id: result.insertId,
        name,
        client_id,
        labour_contractor,
        address,
        total_budget,
        created_by,
        admin_id,
      },
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Error creating project",
      error: error.message,
    });
  }
};

/**
 * Get all projects with related user information
 */
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
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: error.message,
    });
  }
};

/**
 * Update an existing project
 */
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
      admin_id,
    } = req.body;

    // Validate required fields
    if (!updated_by) {
      return res.status(400).json({
        success: false,
        message: "updated_by is required for project updates",
      });
    }

    // Check if project exists
    const [existingProject] = await pool.execute(
      "SELECT * FROM Project WHERE id = ?",
      [id]
    );

    if (existingProject.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Build update query dynamically
    const updateFields = [];
    const values = [];

    if (name !== undefined) {
      updateFields.push("name = ?");
      values.push(name);
    }
    if (client_id !== undefined) {
      updateFields.push("client_id = ?");
      values.push(client_id);
    }
    if (labour_contractor !== undefined) {
      updateFields.push("labour_contractor = ?");
      values.push(labour_contractor);
    }
    if (address !== undefined) {
      updateFields.push("address = ?");
      values.push(address);
    }
    if (total_budget !== undefined) {
      updateFields.push("total_budget = ?");
      values.push(total_budget);
    }
    if (admin_id !== undefined) {
      updateFields.push("admin_id = ?");
      values.push(admin_id);
    }

    // Always update these fields
    updateFields.push("updated_by = ?", "updated_on = NOW()");
    values.push(updated_by, id);

    const query = `UPDATE Project SET ${updateFields.join(", ")} WHERE id = ?`;

    await pool.execute(query, values);

    // Fetch and return updated project
    const [updatedProject] = await pool.execute(
      `SELECT 
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
      WHERE p.id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject[0],
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Error updating project",
      error: error.message,
    });
  }
};

/**
 * Get a single project by ID
 */
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

    const [project] = await pool.execute(query, [id]);

    if (project.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project[0],
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching project",
      error: error.message,
    });
  }
};

/**
 * Delete a project and all related records
 */
const deleteProject = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { id } = req.params;

    // Start transaction
    await connection.beginTransaction();

    // Check if project exists
    const [project] = await connection.execute(
      "SELECT * FROM Project WHERE id = ?",
      [id]
    );

    if (project.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Delete related records in order (respecting foreign key constraints)
    const tablesToClean = [
      'Payment_plan',
      'Payment',
      'RateList',
      'Drawing',
      'Material',
      'LabourBill',
      'LabourPayment',
      'ProjectSupervisor'
    ];

    for (const table of tablesToClean) {
      try {
        await connection.execute(`DELETE FROM ${table} WHERE project_id = ?`, [id]);
      } catch (error) {
        // Table might not exist, continue with other tables
        console.warn(`Could not delete from ${table}:`, error.message);
      }
    }

    // Finally delete the project
    await connection.execute("DELETE FROM Project WHERE id = ?", [id]);

    // Commit transaction
    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Project and all related records deleted successfully",
    });
  } catch (error) {
    // Rollback transaction on error
    await connection.rollback();
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting project",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

/**
 * Get projects by client ID
 */
const getProjectsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;

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
      WHERE p.client_id = ?
      ORDER BY p.created_on DESC
    `;

    const [projects] = await pool.execute(query, [clientId]);

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching projects by client:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching projects by client",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  updateProject,
  getProjectById,
  deleteProject,
  getProjectsByClient,
};
