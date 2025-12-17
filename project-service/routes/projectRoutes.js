const express = require('express');
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  getMembers,
  removeMember,
  getProjectsByOwner,
  getProjectsByMember
} = require('../controllers/projectController');

const router = express.Router();

// Project routes
router.post('/', createProject);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// Member routes
router.post('/:id/members', addMember);
router.get('/:id/members', getMembers);
router.delete('/:id/members/:userId', removeMember);

// Query routes
router.get('/owner/:ownerId', getProjectsByOwner);
router.get('/member/:userId', getProjectsByMember);

module.exports = router;
