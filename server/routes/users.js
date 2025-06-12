const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controllers
const {
  getSuggestions,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests
} = require('../controllers/userController');

// Protect all routes
router.use(protect);

// Friend suggestions
router.get('/suggestions', getSuggestions);

// Friend requests
router.post('/friends/request/:userId', sendFriendRequest);
router.put('/friends/accept/:requestId', acceptFriendRequest);
router.put('/friends/reject/:requestId', rejectFriendRequest);
router.get('/friends/requests', getFriendRequests);

module.exports = router; 