const Task = require('../models/Task');

/**
 * Create new task
 * POST /tasks
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, project_id, assigned_to, created_by, status, priority, due_date } = req.body;

    if (!title || !project_id || !created_by) {
      return res.status(400).json({
        success: false,
        message: 'title, project_id, and created_by are required'
      });
    }

    const task = await Task.create({
      title,
      description,
      project_id,
      assigned_to,
      created_by,
      status,
      priority,
      due_date
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });

  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all tasks
 * GET /tasks
 */
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });

  } catch (error) {
    console.error('Get All Tasks Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get task by ID
 * GET /tasks/:id
 */
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      task
    });

  } catch (error) {
    console.error('Get Task Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update task
 * PUT /tasks/:id
 */
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.update(id, updates);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });

  } catch (error) {
    console.error('Update Task Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete task
 * DELETE /tasks/:id
 */
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Task.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get tasks by project
 * GET /tasks/project/:projectId
 */
exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.findByProject(projectId);

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });

  } catch (error) {
    console.error('Get Tasks By Project Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get tasks assigned to user
 * GET /tasks/assignee/:userId
 */
exports.getTasksByAssignee = async (req, res) => {
  try {
    const { userId } = req.params;

    const tasks = await Task.findByAssignee(userId);

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });

  } catch (error) {
    console.error('Get Tasks By Assignee Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get tasks by status
 * GET /tasks/status/:status
 */
exports.getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const tasks = await Task.findByStatus(status);

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });

  } catch (error) {
    console.error('Get Tasks By Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Add comment to task
 * POST /tasks/:id/comments
 */
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, comment } = req.body;

    if (!user_id || !comment) {
      return res.status(400).json({
        success: false,
        message: 'user_id and comment are required'
      });
    }

    const newComment = await Task.addComment(id, user_id, comment);

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment
    });

  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get task comments
 * GET /tasks/:id/comments
 */
exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await Task.getComments(id);

    res.json({
      success: true,
      count: comments.length,
      comments
    });

  } catch (error) {
    console.error('Get Comments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete comment
 * DELETE /tasks/comments/:commentId
 */
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const deleted = await Task.deleteComment(commentId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Delete Comment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
