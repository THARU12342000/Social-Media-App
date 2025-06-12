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

// Protect all routes
router.use(protect);

// Post routes
router.route('/')
  .get(getFeed)
  .post(createPost);

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