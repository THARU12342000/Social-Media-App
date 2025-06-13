import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Paper, Typography, Avatar,
  Grid, Button, Tab, Tabs, Divider, CircularProgress,
  List, ListItem, ListItemText, Link, Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import Post from './Post';
import EditProfile from './EditProfile';
import ChangeProfilePicture from './ChangeProfilePicture';
import defaultAvatar from '../assets/default-avatar.svg';

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    user: authUser || {
      name: '',
      email: '',
      bio: '',
      location: '',
      website: '',
      profilePicture: defaultAvatar,
      createdAt: new Date().toISOString()
    },
    posts: [],
    friends: []
  });
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePictureOpen, setChangePictureOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchUserData = useCallback(async () => {
    if (!authUser) return;
    
    if (isInitialLoad) {
      setLoading(true);
    }
    setError(null);

    try {
      const { data: meRes } = await axios.get('/api/auth/me');
      if (!meRes.success || !meRes.user) throw new Error('Failed to load user data');
      const u = meRes.user;

      const [postsRes, friendsRes] = await Promise.all([
        axios.get(`/api/posts/user/${u.id}`),
        axios.get('/api/friends')
      ]);

      setProfileData({
        user: u,
        posts: postsRes.data.success ? postsRes.data.data : [],
        friends: friendsRes.data.success ? friendsRes.data.data : []
      });
      updateUser(u);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [authUser, updateUser, isInitialLoad]);

  useEffect(() => {
    if (authUser) {
      fetchUserData();
    }
  }, [authUser, fetchUserData]);

  const handleTabChange = (_, newVal) => {
    setActiveTab(newVal);
  };

  const handleProfileUpdated = updatedUser => {
    setProfileData(p => ({ ...p, user: updatedUser }));
    updateUser(updatedUser);
    setEditProfileOpen(false);
  };

  const handlePictureUpdated = updatedUser => {
    setProfileData(p => ({ ...p, user: updatedUser }));
    updateUser(updatedUser);
    setChangePictureOpen(false);
  };

  if (!authUser) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">Please log in to view your profile</Alert>
      </Container>
    );
  }

  const { user, posts, friends } = profileData;

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button size="small" onClick={fetchUserData} sx={{ ml: 2 }}>Retry</Button>
        </Alert>
      )}
      
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          position: 'relative',
          minHeight: '300px',
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        {loading && isInitialLoad && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1
            }}
          >
            <CircularProgress />
          </Box>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Avatar
                src={user?.profilePicture || defaultAvatar}
                alt={user?.name || ''}
                sx={{ 
                  width: 150, 
                  height: 150, 
                  mx: 'auto', 
                  mb: 2,
                  transition: 'all 0.3s ease-in-out'
                }}
                imgProps={{
                  onError: e => { e.target.src = defaultAvatar; }
                }}
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  minHeight: '1.5em',
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                {user?.name || 'Loading...'}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  minHeight: '1.5em',
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                {user?.email || 'Loading...'}
              </Typography>
              <Box mt={2}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditProfileOpen(true)}
                  sx={{ mr: 1 }}
                >Edit Profile</Button>
                <Button
                  variant="outlined"
                  startIcon={<PhotoCameraIcon />}
                  onClick={() => setChangePictureOpen(true)}
                >Change Photo</Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>About</Typography>
            <Typography 
              paragraph 
              sx={{ 
                minHeight: '1.5em',
                transition: 'all 0.3s ease-in-out'
              }}
            >
              {user?.bio || 'No bio available'}
            </Typography>
            {user?.location && (
              <Box 
                display="flex" 
                alignItems="center" 
                mb={1}
                sx={{ transition: 'all 0.3s ease-in-out' }}
              >
                <LocationIcon sx={{ mr: 1 }} color="action" />
                <Typography color="text.secondary">{user.location}</Typography>
              </Box>
            )}
            {user?.website && (
              <Box 
                display="flex" 
                alignItems="center" 
                mb={1}
                sx={{ transition: 'all 0.3s ease-in-out' }}
              >
                <LanguageIcon sx={{ mr: 1 }} color="action" />
                <Link href={user.website} target="_blank" rel="noopener">{user.website}</Link>
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                minHeight: '1.5em',
                transition: 'all 0.3s ease-in-out'
              }}
            >
              {user?.createdAt ? `Joined ${new Date(user.createdAt).toLocaleDateString()}` : 'Loading...'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Posts" />
          <Tab label="Friends" />
        </Tabs>
        <Box p={3}>
          {activeTab === 0 && (
            posts.length ? posts.map(p => <Post key={p._id} post={p} />)
                         : <Typography textAlign="center">No posts yet</Typography>
          )}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Friends</Typography>
              {friends.length ? (
                <Grid container spacing={2}>
                  {friends.map(f => (
                    <Grid item xs={12} sm={6} md={4} key={f._id}>
                      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={f.profilePicture || defaultAvatar}
                          alt={f.name}
                          sx={{ mr: 2 }}
                          imgProps={{ onError: e => { e.target.src = defaultAvatar; } }}
                        />
                        <Box>
                          <Typography>{f.name}</Typography>
                          <Typography color="text.secondary">{f.email}</Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography textAlign="center">No friends yet</Typography>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      <EditProfile
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        user={user}
        onProfileUpdated={handleProfileUpdated}
      />
      <ChangeProfilePicture
        open={changePictureOpen}
        onClose={() => setChangePictureOpen(false)}
        onPictureUpdated={handlePictureUpdated}
      />
    </Container>
  );
};

export default Profile;
