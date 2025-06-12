const express = require('express');
const router = express.Router();
const {
  createPost,
  getFeed,
  getUserPosts,
  toggleLike,
  addComment,
  deletePost,
  updatePost
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Protect all routes
router.use(protect);

// Post routes
router.route('/')
  .get(getFeed)
  .post(upload.single('image'), createPost);

router.route('/user/:userId')
  .get(getUserPosts);

router.route('/:id')
  .put(updatePost)
  .delete(deletePost);

router.route('/:id/like')
  .put(toggleLike);

router.route('/:id/comment')
  .post(addComment);

module.exports = router; 