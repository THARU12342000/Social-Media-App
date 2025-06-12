import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../utils/axios';
import { Box, Container, Grid, CircularProgress, Typography, Paper } from '@mui/material';
import Post from './Post';
import CreatePost from './CreatePost';
import FriendSuggestions from './FriendSuggestions';
import { Home as HomeIcon, People as PeopleIcon, Bookmark as BookmarkIcon } from '@mui/icons-material';

const QuickLink = ({ icon: Icon, text, active }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      p: 1.5,
      borderRadius: 1,
      cursor: 'pointer',
      bgcolor: active ? 'action.selected' : 'transparent',
      '&:hover': {
        bgcolor: 'action.hover',
      },
      mb: 1,
    }}
  >
    <Icon color={active ? 'primary' : 'action'} sx={{ mr: 2 }} />
    <Typography
      variant="body1"
      color={active ? 'primary' : 'text.primary'}
      sx={{ fontWeight: active ? 500 : 400 }}
    >
      {text}
    </Typography>
  </Box>
);

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef();

  const lastPostElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  const fetchPosts = async (pageNum = 1, isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      const response = await axios.get(`/api/posts?page=${pageNum}&limit=10`);
      const newPosts = response.data.posts;
      
      setPosts(prev => pageNum === 1 ? newPosts : [...prev, ...newPosts]);
      setHasMore(newPosts.length === 10);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
      setPosts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, true);
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ position: { md: 'sticky' }, top: 20, p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ px: 1.5, mb: 2 }}>
              Quick Links
            </Typography>
            <QuickLink icon={HomeIcon} text="Home" active />
            <QuickLink icon={PeopleIcon} text="Friends" />
            <QuickLink icon={BookmarkIcon} text="Saved Posts" />
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={6}>
          <CreatePost onPostCreated={handlePostCreated} />
          
          {posts.length === 0 ? (
            <Typography variant="body1" textAlign="center" sx={{ mt: 4 }}>
              No posts to show. Start following people or create your first post!
            </Typography>
          ) : (
            <>
              {posts.map((post, index) => (
                <div
                  key={post._id}
                  ref={index === posts.length - 1 ? lastPostElementRef : null}
                >
                  <Post post={post} />
                </div>
              ))}
              {loadingMore && (
                <Box display="flex" justifyContent="center" my={2}>
                  <CircularProgress size={30} />
                </Box>
              )}
            </>
          )}
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ position: { md: 'sticky' }, top: 20, p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ px: 1 }}>
              Suggested Friends
            </Typography>
            <FriendSuggestions />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewsFeed; 