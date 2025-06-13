const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, location, website } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update fields
  if (name) user.name = name;
  if (bio) user.bio = bio;
  if (location) user.location = location;
  if (website) user.website = website;

  const updatedUser = await user.save();

  res.json({
    success: true,
    data: updatedUser
  });
});

// @desc    Update profile picture
// @route   PUT /api/users/profile/picture
// @access  Private
const updateProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  // Update profile picture
  user.profilePicture = `/uploads/${req.file.filename}`;
  const updatedUser = await user.save();

  res.json({
    success: true,
    data: updatedUser
  });
});

// @desc    Get user suggestions
// @route   GET /api/users/suggestions
// @access  Private
const getSuggestions = asyncHandler(async (req, res) => {
  // Get users that are not friends and not the current user
  const user = await User.findById(req.user.id);
  const friends = user.friends || [];
  
  const suggestions = await User.find({
    _id: { 
      $nin: [...friends, req.user.id]
    }
  })
  .select('name profilePicture')
  .limit(5);

  // Add mutual friends count
  const suggestionsWithMutualFriends = await Promise.all(
    suggestions.map(async (suggestion) => {
      const mutualFriends = await User.countDocuments({
        _id: { $in: friends },
        friends: suggestion._id
      });
      return {
        ...suggestion.toObject(),
        mutualFriends
      };
    })
  );

  res.json({
    success: true,
    data: suggestionsWithMutualFriends
  });
});

module.exports = {
  getMe,
  updateProfile,
  updateProfilePicture,
  getSuggestions
}; 