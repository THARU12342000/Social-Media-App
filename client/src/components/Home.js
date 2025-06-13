import React, { useState } from 'react';
import { Box, Container, Grid, Paper } from '@mui/material';
import NewsFeed from './NewsFeed';
import CreatePost from './CreatePost';
import FriendSuggestions from './FriendSuggestions';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const quickLinks = [
    { id: 'news-feed', label: 'News Feed' },
    { id: 'profile', label: 'My Profile' },
    { id: 'messages', label: 'Messages' },
    { id: 'events', label: 'Events' },
    { id: 'groups', label: 'Groups' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            {/* Quick Links */}
            <Box sx={{ mb: 2 }}>
              <h3>Quick Links</h3>
              <ul className="quick-links">
                {quickLinks.map(link => (
                  <li key={link.id}>{link.label}</li>
                ))}
              </ul>
            </Box>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={6}>
          <CreatePost onPostCreated={handlePostCreated} />
          <NewsFeed initialPosts={posts} />
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Box sx={{ mb: 2 }}>
              <h3>Friend Suggestions</h3>
              <FriendSuggestions />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
