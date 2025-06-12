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

const Post = ({ post = {} }) => {
  const [liked, setLiked] = useState(post?.likes?.includes(localStorage.getItem('userId')) || false);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post?.comments || []);

  if (!post || !post.author) {
    return null;
  }

  const handleLike = async () => {
    try {
      await axios.post(`/api/posts/${post._id}/like`);
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await axios.post(`/api/posts/${post._id}/comment`, {
        content: comment
      });
      setComments([...comments, response.data]);
      setComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardHeader
        avatar={
          <Avatar src={post.author?.profilePicture}>
            {post.author?.name?.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title={post.author?.name || 'Unknown User'}
        subheader={post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'Recently'}
      />
      
      {post.image && (
        <Box
          component="img"
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: 500,
            objectFit: 'cover'
          }}
          src={post.image}
          alt="Post"
        />
      )}

      <CardContent>
        <Typography variant="body1">{post.content}</Typography>
      </CardContent>

      <CardActions disableSpacing>
        <IconButton onClick={handleLike} color={liked ? "primary" : "default"}>
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </Typography>
        
        <IconButton 
          onClick={() => setShowComments(!showComments)}
          sx={{ ml: 2 }}
        >
          <CommentIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </Typography>

        <IconButton sx={{ ml: 'auto' }}>
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
              sx={{ mb: 2 }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              size="small"
              disabled={!comment.trim()}
            >
              Post Comment
            </Button>
          </form>

          <Box sx={{ mt: 2 }}>
            {comments.map((comment, index) => (
              <Box key={comment._id || index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Avatar
                    src={comment.author?.profilePicture}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  >
                    {comment.author?.name?.charAt(0)}
                  </Avatar>
                  <Typography variant="subtitle2">
                    {comment.author?.name || 'Unknown User'}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ pl: 4 }}>
                  {comment.content}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};

export default Post; 