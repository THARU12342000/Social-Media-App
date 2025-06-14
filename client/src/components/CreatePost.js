import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  IconButton,
  Avatar,
  FormControl,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Image as ImageIcon,
  Public as PublicIcon,
  People as PeopleIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        setShowError(true);
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) {
      setError('Please add some content or an image');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('privacy', privacy);
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response?.data?.success) {
        // Clear form
        setContent('');
        setImage(null);
        setImagePreview('');
        setPrivacy('public');
        setError(null);

        // Notify parent component with the new post
        if (onPostCreated) {
          onPostCreated(response.data.data);
        }
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const privacyOptions = [
    { value: 'public', label: 'Public', icon: <PublicIcon /> },
    { value: 'friends', label: 'Friends', icon: <PeopleIcon /> },
    { value: 'private', label: 'Private', icon: <LockIcon /> },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Avatar
              src={user?.profilePicture}
              alt={user?.name}
              sx={{ mr: 2 }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
                sx={{ mb: 2 }}
              />

              {imagePreview && (
                <Box
                  sx={{
                    position: 'relative',
                    mb: 2,
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                      },
                    }}
                    onClick={() => {
                      setImage(null);
                      setImagePreview('');
                    }}
                  >
                    ✕
                  </IconButton>
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <input
                    accept="image/*"
                    type="file"
                    id="image-upload"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                  <label htmlFor="image-upload">
                    <IconButton
                      component="span"
                      disabled={loading}
                      color="primary"
                    >
                      <ImageIcon />
                    </IconButton>
                  </label>

                  <FormControl sx={{ minWidth: 120, ml: 1 }}>
                    <Select
                      size="small"
                      value={privacy}
                      onChange={(e) => setPrivacy(e.target.value)}
                      disabled={loading}
                      startAdornment={
                        privacyOptions.find((option) => option.value === privacy)?.icon
                      }
                    >
                      {privacyOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {option.icon}
                            <Box sx={{ ml: 1 }}>{option.label}</Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || (!content.trim() && !image)}
                >
                  {loading ? 'Posting...' : 'Post'}
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {loading && (
        <Box 
          sx={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default CreatePost; 