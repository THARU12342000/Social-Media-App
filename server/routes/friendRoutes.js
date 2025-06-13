const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests
} = require('../controllers/friendController');

// Get friends list
router.get('/', protect, getFriends);

// Send friend request
router.post('/request/:userId', protect, sendFriendRequest);

// Accept friend request
router.put('/accept/:requestId', protect, acceptFriendRequest);

// Reject friend request
router.put('/reject/:requestId', protect, rejectFriendRequest);

// Get friend requests
router.get('/requests', protect, getFriendRequests);

module.exports = router; 