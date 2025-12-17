const express = require('express');
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByProject,
  getTasksByAssignee,
  getTasksByStatus,
  addComment,
  getComments,
  deleteComment
} = require('../controllers/taskController');

const router = express.Router();

// Task routes
router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Query routes
router.get('/project/:projectId', getTasksByProject);
router.get('/assignee/:userId', getTasksByAssignee);
router.get('/status/:status', getTasksByStatus);

// Comment routes
router.post('/:id/comments', addComment);
router.get('/:id/comments', getComments);
router.delete('/comments/:commentId', deleteComment);

module.exports = router;
