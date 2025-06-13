const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get friends list
// @route   GET /api/friends
// @access  Private
const getFriends = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('friends', 'name profilePicture');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Add mutual friends count
  const friendsWithMutualCount = await Promise.all(
    user.friends.map(async (friend) => {
      const mutualFriends = await User.countDocuments({
        _id: { $in: user.friends },
        friends: friend._id
      });
      return {
        ...friend.toObject(),
        mutualFriends
      };
    })
  );

  res.json({
    success: true,
    data: friendsWithMutualCount
  });
});

// @desc    Send friend request
// @route   POST /api/friends/request/:userId
// @access  Private
const sendFriendRequest = asyncHandler(async (req, res) => {
  const recipient = await User.findById(req.params.userId);
  
  if (!recipient) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if request already exists
  const existingRequest = recipient.friendRequests.find(
    request => request.from.toString() === req.user.id
  );

  if (existingRequest) {
    res.status(400);
    throw new Error('Friend request already sent');
  }

  // Add friend request
  recipient.friendRequests.push({
    from: req.user.id,
    status: 'pending'
  });

  await recipient.save();

  res.json({
    success: true,
    message: 'Friend request sent successfully'
  });
});

// @desc    Accept friend request
// @route   PUT /api/friends/accept/:requestId
// @access  Private
const acceptFriendRequest = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const request = user.friendRequests.id(req.params.requestId);

  if (!request) {
    res.status(404);
    throw new Error('Friend request not found');
  }

  // Add each user to the other's friends list
  user.friends.push(request.from);
  const otherUser = await User.findById(request.from);
  otherUser.friends.push(user._id);

  // Remove the request
  request.remove();

  await Promise.all([user.save(), otherUser.save()]);

  res.json({
    success: true,
    message: 'Friend request accepted'
  });
});

// @desc    Reject friend request
// @route   PUT /api/friends/reject/:requestId
// @access  Private
const rejectFriendRequest = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const request = user.friendRequests.id(req.params.requestId);

  if (!request) {
    res.status(404);
    throw new Error('Friend request not found');
  }

  // Remove the request
  request.remove();
  await user.save();

  res.json({
    success: true,
    message: 'Friend request rejected'
  });
});

// @desc    Get friend requests
// @route   GET /api/friends/requests
// @access  Private
const getFriendRequests = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('friendRequests.from', 'name profilePicture');

  res.json({
    success: true,
    data: user.friendRequests
  });
});

module.exports = {
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests
}; 