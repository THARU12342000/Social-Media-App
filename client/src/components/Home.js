import React from 'react';
import { Box, Container, Grid, Paper } from '@mui/material';
import NewsFeed from './NewsFeed';
import CreatePost from './CreatePost';
import FriendSuggestions from './FriendSuggestions';
import './Home.css';

const Home = () => {
  const handlePostCreated = (newPost) => {
    // This will be handled by NewsFeed component's useEffect
  };

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
                <li>News Feed</li>
                <li>My Profile</li>
                <li>Messages</li>
                <li>Events</li>
                <li>Groups</li>
              </ul>
            </Box>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={6}>
          <CreatePost onPostCreated={handlePostCreated} />
          <NewsFeed />
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
