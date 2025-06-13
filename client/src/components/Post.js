import React, { useState } from 'react';
import axios from '../utils/axios';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
  Collapse,
  Divider
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import defaultAvatar from '../assets/default-avatar.svg';
import { useAuth } from '../context/AuthContext';

const Post = ({ post }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post?.likes?.includes(user?.id) || false);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post?.comments || []);
  const [loading, setLoading] = useState(false);

  if (!post || !post.user) {
    return null;
  }

  const handleLike = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/posts/${post._id}/like`);
      if (response?.data?.success) {
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || loading) return;

    try {
      setLoading(true);
      const response = await axios.post(`/api/posts/${post._id}/comment`, {
        content: comment
      });

      if (response?.data?.success) {
        setComments([...comments, response.data.data]);
        setComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar 
            src={post.user?.profilePicture || defaultAvatar}
            alt={post.user?.name || 'User'}
            imgProps={{
              onError: (e) => {
                e.target.src = defaultAvatar;
              }
            }}
          >
            {post.user?.name ? post.user.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={post.user?.name || 'Unknown User'}
        subheader={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
      />
      {post.content && (
        <CardContent>
          <Typography variant="body1">{post.content}</Typography>
        </CardContent>
      )}
      {post.image && (
        <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
          <img
            src={post.image}
            alt="Post content"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>
      )}
      <CardActions disableSpacing>
        <IconButton 
          aria-label="like"
          onClick={handleLike}
          disabled={loading}
          color={liked ? 'primary' : 'default'}
        >
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </Typography>
        <IconButton
          aria-label="comment"
          onClick={() => setShowComments(!showComments)}
          disabled={loading}
          sx={{ ml: 1 }}
        >
          <CommentIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </Typography>
        <IconButton aria-label="share" disabled={loading} sx={{ ml: 1 }}>
          <ShareIcon />
        </IconButton>
      </CardActions>
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Divider />
        <Box sx={{ p: 2 }}>
          <form onSubmit={handleComment}>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={!comment.trim() || loading}
              sx={{ mb: 2 }}
            >
              Comment
            </Button>
          </form>
          {comments.map((comment, index) => (
            <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'start' }}>
              <Avatar
                src={comment.user?.profilePicture || defaultAvatar}
                alt={comment.user?.name || 'User'}
                sx={{ width: 32, height: 32, mr: 1 }}
                imgProps={{
                  onError: (e) => {
                    e.target.src = defaultAvatar;
                  }
                }}
              >
                {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">
                  {comment.user?.name || 'Unknown User'}
                </Typography>
                <Typography variant="body2">{comment.content}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Card>
  );
};

export default Post; 