const Project = require('../models/Project');

/**
 * Create new project
 * POST /projects
 */
exports.createProject = async (req, res) => {
  try {
    const { name, description, owner_id, status, start_date, end_date } = req.body;

    if (!name || !owner_id) {
      return res.status(400).json({
        success: false,
        message: 'name and owner_id are required'
      });
    }

    const project = await Project.create({
      name,
      description,
      owner_id,
      status,
      start_date,
      end_date
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });

  } catch (error) {
    console.error('Create Project Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all projects
 * GET /projects
 */
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();

    res.json({
      success: true,
      count: projects.length,
      projects
    });

  } catch (error) {
    console.error('Get All Projects Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get project by ID
 * GET /projects/:id
 */
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      project
    });

  } catch (error) {
    console.error('Get Project Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update project
 * PUT /projects/:id
 */
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const project = await Project.update(id, updates);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });

  } catch (error) {
    console.error('Update Project Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete project
 * DELETE /projects/:id
 */
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Project.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete Project Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Add member to project
 * POST /projects/:id/members
 */
exports.addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, role } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id is required'
      });
    }

    const member = await Project.addMember(id, user_id, role);

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      member
    });

  } catch (error) {
    console.error('Add Member Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get project members
 * GET /projects/:id/members
 */
exports.getMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const members = await Project.getMembers(id);

    res.json({
      success: true,
      count: members.length,
      members
    });

  } catch (error) {
    console.error('Get Members Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Remove member from project
 * DELETE /projects/:id/members/:userId
 */
exports.removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const removed = await Project.removeMember(id, userId);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in project'
      });
    }

    res.json({
      success: true,
      message: 'Member removed successfully'
    });

  } catch (error) {
    console.error('Remove Member Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get projects by owner
 * GET /projects/owner/:ownerId
 */
exports.getProjectsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const projects = await Project.findByOwner(ownerId);

    res.json({
      success: true,
      count: projects.length,
      projects
    });

  } catch (error) {
    console.error('Get Projects By Owner Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get projects where user is a member
 * GET /projects/member/:userId
 */
exports.getProjectsByMember = async (req, res) => {
  try {
    const { userId } = req.params;

    const projects = await Project.findByMember(userId);

    res.json({
      success: true,
      count: projects.length,
      projects
    });

  } catch (error) {
    console.error('Get Projects By Member Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
