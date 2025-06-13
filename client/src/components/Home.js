import React, { useState } from 'react';
import { Box, Container, Grid, Paper, Typography, List, ListItem, ListItemText, useTheme, useMediaQuery, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NewsFeed from './NewsFeed';
import CreatePost from './CreatePost';
import FriendSuggestions from './FriendSuggestions';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const quickLinks = [
    { id: 'news-feed', label: 'News Feed', path: '/home' },
    { id: 'profile', label: 'My Profile', path: '/profile' },
    { id: 'messages', label: 'Messages', path: '/messages' },
    { id: 'events', label: 'Events', path: '/events' },
    { id: 'groups', label: 'Groups', path: '/groups' }
  ];

  return (
    <Container 
      maxWidth={false}
      disableGutters
      sx={{ 
        mt: { xs: 4, sm: 6, md: 8 }, 
        mb: { xs: 2, sm: 3, md: 4 },
        px: { xs: 0, sm: 2, md: 4 },
        width: '100vw',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}
    >
      <Grid container spacing={{ xs: 3, sm: 4, md: 6 }} alignItems="flex-start" justifyContent="center">
        {/* Left Sidebar */}
        {!isMobile && (
          <Grid item xs={12} md={2}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'sticky',
                top: 100,
                maxHeight: 'calc(100vh - 120px)',
                overflow: 'auto',
                borderRadius: 3,
                bgcolor: 'background.paper',
                boxShadow: 3
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Quick Links
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List sx={{ '& .MuiListItem-root': { px: 2 } }}>
                {quickLinks.map((link, index) => (
                  <React.Fragment key={link.id}>
                    <ListItem 
                      component={RouterLink}
                      to={link.path}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemText primary={link.label} />
                    </ListItem>
                    {index < quickLinks.length - 1 && <Divider sx={{ my: 1 }} />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        )}

        {/* Main Content */}
        <Grid item xs={12} md={isTablet ? 12 : 8}>
          <Box sx={{ 
            maxWidth: '1200px', 
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 4 
          }}>
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3, bgcolor: 'background.paper', boxShadow: 3 }}>
              <CreatePost onPostCreated={handlePostCreated} />
            </Paper>
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: 'background.paper', boxShadow: 3 }}>
              <NewsFeed initialPosts={posts} />
            </Paper>
          </Box>
        </Grid>

        {/* Right Sidebar */}
        {!isTablet && (
          <Grid item xs={12} md={2}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'sticky',
                top: 100,
                maxHeight: 'calc(100vh - 120px)',
                overflow: 'auto',
                borderRadius: 3,
                bgcolor: 'background.paper',
                boxShadow: 3
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Friend Suggestions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ '& > *': { mb: 2 } }}>
                <FriendSuggestions />
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Home;
