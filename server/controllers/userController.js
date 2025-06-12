const User = require('../models/User');

// @desc    Get friend suggestions
// @route   GET /api/users/suggestions
// @access  Private
exports.getSuggestions = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get users who are not friends and not the current user
    const suggestions = await User.find({
      _id: { 
        $nin: [...user.friends, req.user.id] 
      }
    })
    .select('name profilePicture')
    .limit(5);

    // Add mutual friends count
    const suggestionsWithMutual = await Promise.all(
      suggestions.map(async (suggestion) => {
        const mutualFriends = suggestion.friends.filter(friend => 
          user.friends.includes(friend)
        ).length;

        return {
          _id: suggestion._id,
          name: suggestion.name,
          profilePicture: suggestion.profilePicture,
          mutualFriends
        };
      })
    );

    res.status(200).json({
      success: true,
      data: suggestionsWithMutual
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send friend request
// @route   POST /api/users/friends/request/:userId
// @access  Private
exports.sendFriendRequest = async (req, res, next) => {
  try {
    const recipient = await User.findById(req.params.userId);
    
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if request already exists
    const existingRequest = recipient.friendRequests.find(
      request => request.from.toString() === req.user.id
    );

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Friend request already sent'
      });
    }

    // Add friend request
    recipient.friendRequests.push({
      from: req.user.id,
      status: 'pending'
    });

    await recipient.save();

    res.status(200).json({
      success: true,
      message: 'Friend request sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept friend request
// @route   PUT /api/users/friends/accept/:requestId
// @access  Private
exports.acceptFriendRequest = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const request = user.friendRequests.id(req.params.requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found'
      });
    }

    // Add each user to the other's friends list
    user.friends.push(request.from);
    const otherUser = await User.findById(request.from);
    otherUser.friends.push(user._id);

    // Remove the request
    request.remove();

    await Promise.all([user.save(), otherUser.save()]);

    res.status(200).json({
      success: true,
      message: 'Friend request accepted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject friend request
// @route   PUT /api/users/friends/reject/:requestId
// @access  Private
exports.rejectFriendRequest = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const request = user.friendRequests.id(req.params.requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found'
      });
    }

    // Remove the request
    request.remove();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Friend request rejected'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get friend requests
// @route   GET /api/users/friends/requests
// @access  Private
exports.getFriendRequests = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('friendRequests.from', 'name profilePicture');

    res.status(200).json({
      success: true,
      data: user.friendRequests
    });
  } catch (error) {
    next(error);
  }
}; 