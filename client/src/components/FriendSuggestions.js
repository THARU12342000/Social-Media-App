import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Button,
  Skeleton,
  Alert
} from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import axios from '../utils/axios';
import defaultAvatar from '../assets/default-avatar.svg';

const FriendSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/suggestions');
      if (response?.data?.data) {
        setSuggestions(response.data.data);
      } else if (response?.data) {
        setSuggestions(Array.isArray(response.data) ? response.data : []);
      } else {
        setSuggestions([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError('Unable to load friend suggestions');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      await axios.post(`/api/friends/request/${userId}`);
      // Remove user from suggestions
      setSuggestions(prev => prev.filter(user => user._id !== userId));
    } catch (err) {
      console.error('Error sending friend request:', err);
      setError('Failed to send friend request');
    }
  };

  if (loading) {
    return (
      <List>
        {[1, 2, 3].map((_, index) => (
          <ListItem key={index}>
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton width="60%" />}
              secondary={<Skeleton width="40%" />}
            />
            <ListItemSecondaryAction>
              <Skeleton width={80} height={36} />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center">
        No suggestions available
      </Typography>
    );
  }

  return (
    <List>
      {suggestions.map((user) => (
        <ListItem key={user._id}>
          <ListItemAvatar>
            <Avatar 
              src={user.profilePicture || defaultAvatar}
              alt={user.name || 'User'}
              imgProps={{
                onError: (e) => {
                  e.target.src = defaultAvatar;
                }
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={user.name || 'Unknown User'}
            secondary={`${user.mutualFriends || 0} mutual friends`}
          />
          <ListItemSecondaryAction>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PersonAddIcon />}
              onClick={() => handleAddFriend(user._id)}
            >
              Add
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default FriendSuggestions; 