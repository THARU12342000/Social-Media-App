const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMe,
  updateProfile,
  updateProfilePicture,
  getSuggestions
} = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');

// Get current user profile
router.get('/me', protect, getMe);

// Update user profile
router.put('/profile', protect, updateProfile);

// Update profile picture
router.put('/profile/picture', protect, upload.single('profilePicture'), updateProfilePicture);

// Get user suggestions
router.get('/suggestions', protect, getSuggestions);

module.exports = router; 