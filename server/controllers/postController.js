const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    const { content, privacy } = req.body;
    let image = null;

    // Handle file upload if present
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    // Validate that either content or image is present
    if (!content && !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either content or an image'
      });
    }

    const post = await Post.create({
      user: req.user.id,
      content,
      image,
      privacy: privacy || 'public'
    });

    const populatedPost = await post.populate([
      { path: 'user', select: 'name profilePicture' },
      { path: 'comments.user', select: 'name profilePicture' },
      { path: 'likes', select: 'name profilePicture' }
    ]);

    res.status(201).json({
      success: true,
      data: populatedPost
    });
  } catch (error) {
    console.error('Create post error:', error);
    next(error);
  }
};

// @desc    Get all posts (feed)
// @route   GET /api/posts
// @access  Private
exports.getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Get user's friends
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const friends = user.friends || [];

    // Get posts from user and friends
    const posts = await Post.find({
      $or: [
        { user: req.user.id },
        { user: { $in: friends }, privacy: 'public' },
        { user: { $in: friends }, privacy: 'friends' }
      ]
    })
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit)
      .populate('user', 'name profilePicture')
      .populate('comments.user', 'name profilePicture')
      .populate('likes', 'name profilePicture');

    // Get total posts count for pagination
    const total = await Post.countDocuments({
      $or: [
        { user: req.user.id },
        { user: { $in: friends }, privacy: 'public' },
        { user: { $in: friends }, privacy: 'friends' }
      ]
    });

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get feed error:', error);
    next(error);
  }
};

// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
// @access  Private
exports.getUserPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const posts = await Post.find({ user: req.params.userId })
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit)
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .populate('likes', 'username profilePicture');

    const total = await Post.countDocuments({ user: req.params.userId });

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if post has already been liked
    const liked = post.likes.includes(req.user.id);

    if (liked) {
      // Unlike
      post.likes = post.likes.filter(
        like => like.toString() !== req.user.id.toString()
      );
    } else {
      // Like
      post.likes.push(req.user.id);

      // Create notification if post is not user's own
      if (post.user.toString() !== req.user.id.toString()) {
        const user = await User.findById(post.user);
        user.notifications.push({
          type: 'like',
          from: req.user.id,
          post: post._id
        });
        await user.save();
      }
    }

    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = {
      user: req.user.id,
      content: req.body.content
    };

    post.comments.push(comment);
    await post.save();

    // Create notification if post is not user's own
    if (post.user.toString() !== req.user.id.toString()) {
      const user = await User.findById(post.user);
      user.notifications.push({
        type: 'comment',
        from: req.user.id,
        post: post._id
      });
      await user.save();
    }

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .populate('likes', 'username profilePicture');

    res.status(200).json({
      success: true,
      data: populatedPost
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Make sure user owns post
    if (post.user.toString() !== req.user.id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Make sure user owns post
    if (post.user.toString() !== req.user.id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { 
        content: req.body.content,
        privacy: req.body.privacy,
        images: req.body.images
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'username profilePicture');

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
}; 