const UserProfile = require('../models/UserProfile');
const axios = require('axios');

/**
 * Create user profile
 * POST /users/profile
 */
exports.createProfile = async (req, res) => {
  try {
    const { user_id, bio, avatar_url, phone, location, role, department, skills } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id is required'
      });
    }

    // Check if profile already exists
    const existing = await UserProfile.findByUserId(user_id);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Profile already exists for this user'
      });
    }

    const profile = await UserProfile.create(user_id, {
      bio,
      avatar_url,
      phone,
      location,
      role,
      department,
      skills
    });

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      profile
    });

  } catch (error) {
    console.error('Create Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get user profile by user ID
 * GET /users/profile/:userId
 */
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await UserProfile.findByUserId(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update user profile
 * PUT /users/profile/:userId
 */
exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const profile = await UserProfile.update(userId, updates);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete user profile
 * DELETE /users/profile/:userId
 */
exports.deleteProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const deleted = await UserProfile.delete(userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });

  } catch (error) {
    console.error('Delete Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all profiles
 * GET /users/profiles
 */
exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await UserProfile.findAll();

    res.json({
      success: true,
      count: profiles.length,
      profiles
    });

  } catch (error) {
    console.error('Get All Profiles Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get profiles by role
 * GET /users/profiles/role/:role
 */
exports.getProfilesByRole = async (req, res) => {
  try {
    const { role } = req.params;

    const profiles = await UserProfile.findByRole(role);

    res.json({
      success: true,
      count: profiles.length,
      profiles
    });

  } catch (error) {
    console.error('Get Profiles By Role Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
