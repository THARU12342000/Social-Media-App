import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  Tab,
  Tabs,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Link,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import Post from './Post';
import EditProfile from './EditProfile';
import ChangeProfilePicture from './ChangeProfilePicture';
import defaultAvatar from '../assets/default-avatar.svg';

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePictureOpen, setChangePictureOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userResponse, postsResponse, friendsResponse] = await Promise.all([
        axios.get('/api/users/me'),
        axios.get(`/api/posts/user/${authUser.id}`),
        axios.get('/api/friends')
      ]);

      if (userResponse?.data?.data) {
        setUser(userResponse.data.data);
        updateUser(userResponse.data.data);
      }
      if (postsResponse?.data?.data) {
        setPosts(postsResponse.data.data);
      }
      if (friendsResponse?.data?.data) {
        setFriends(friendsResponse.data.data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
    updateUser(updatedUser);
  };

  const handlePictureUpdated = (updatedUser) => {
    setUser(updatedUser);
    updateUser(updatedUser);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Profile Header */}
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={user?.profilePicture || defaultAvatar}
                alt={user?.name}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                {user?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              <Box mt={2}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditProfileOpen(true)}
                  sx={{ mr: 1 }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PhotoCameraIcon />}
                  onClick={() => setChangePictureOpen(true)}
                >
                  Change Photo
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Profile Info */}
          <Grid item xs={12} md={8}>
            <Box>
              <Typography variant="h6" gutterBottom>
                About
              </Typography>
              <Typography variant="body1" paragraph>
                {user?.bio || 'No bio available'}
              </Typography>
              {user?.location && (
                <Box display="flex" alignItems="center" mb={1}>
                  <LocationIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {user.location}
                  </Typography>
                </Box>
              )}
              {user?.website && (
                <Box display="flex" alignItems="center" mb={1}>
                  <LanguageIcon color="action" sx={{ mr: 1 }} />
                  <Link href={user.website} target="_blank" rel="noopener noreferrer">
                    {user.website}
                  </Link>
                </Box>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Joined {new Date(user?.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Posts" />
          <Tab label="About" />
          <Tab label="Friends" />
        </Tabs>

        {/* Tab Content */}
        <Box p={3}>
          {activeTab === 0 && (
            <>
              {error ? (
                <Typography color="error">{error}</Typography>
              ) : posts.length === 0 ? (
                <Typography variant="body1" textAlign="center">
                  No posts yet
                </Typography>
              ) : (
                posts.map((post) => (
                  <Post key={post._id} post={post} />
                ))
              )}
            </>
          )}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Detailed Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Personal Information
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Name"
                          secondary={user?.name}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Email"
                          secondary={user?.email}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Location"
                          secondary={user?.location || 'Not specified'}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Social Links
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Website"
                          secondary={
                            user?.website ? (
                              <Link href={user.website} target="_blank" rel="noopener noreferrer">
                                {user.website}
                              </Link>
                            ) : (
                              'Not specified'
                            )
                          }
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Friends ({friends.length})
              </Typography>
              {friends.length === 0 ? (
                <Typography variant="body1" textAlign="center">
                  No friends yet
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {friends.map((friend) => (
                    <Grid item xs={12} sm={6} md={4} key={friend._id}>
                      <Paper sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={friend.profilePicture || defaultAvatar}
                            alt={friend.name}
                            sx={{ width: 50, height: 50, mr: 2 }}
                          />
                          <Box flex={1}>
                            <Typography variant="subtitle1">
                              {friend.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {friend.mutualFriends} mutual friends
                            </Typography>
                          </Box>
                          <IconButton size="small">
                            <MessageIcon />
                          </IconButton>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Edit Profile Dialog */}
      <EditProfile
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        user={user}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* Change Profile Picture Dialog */}
      <ChangeProfilePicture
        open={changePictureOpen}
        onClose={() => setChangePictureOpen(false)}
        onPictureUpdated={handlePictureUpdated}
      />
    </Container>
  );
};

export default Profile; 