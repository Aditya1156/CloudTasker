const express = require('express');
const {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  getAllProfiles,
  getProfilesByRole
} = require('../controllers/userController');

const router = express.Router();

// Profile routes
router.post('/profile', createProfile);
router.get('/profile/:userId', getProfile);
router.put('/profile/:userId', updateProfile);
router.delete('/profile/:userId', deleteProfile);
router.get('/profiles', getAllProfiles);
router.get('/profiles/role/:role', getProfilesByRole);

module.exports = router;
