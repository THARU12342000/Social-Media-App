import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  TextFields as TextFieldsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const MotionPaper = motion.create(Paper);
const MotionBox = motion.create(Box);

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { themeMode, fontSize, toggleTheme, changeFontSize, availableThemes, availableFontSizes } = useCustomTheme();
  const { showSuccess, showError } = useNotification();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    mentions: true,
    comments: true,
  });
  const [language, setLanguage] = useState('en');
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showActivity: true,
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNotificationChange = (setting) => (event) => {
    setNotifications({
      ...notifications,
      [setting]: event.target.checked,
    });
  };

  const handlePrivacyChange = (setting) => (event) => {
    setPrivacy({
      ...privacy,
      [setting]: event.target.value,
    });
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSaveSettings = async () => {
    try {
      await updateUser({
        settings: {
          theme: themeMode,
          fontSize,
          notifications,
          language,
          privacy,
        },
      });
      showSuccess('Settings saved successfully!');
    } catch (error) {
      showError('Failed to save settings. Please try again.');
    }
  };

  const renderThemePreview = (themeName) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        sx={{
          width: '100%',
          cursor: 'pointer',
          border: themeMode === themeName ? `2px solid ${theme.palette.primary.main}` : 'none',
        }}
        onClick={() => {
          toggleTheme(themeName);
          showSuccess(`Theme changed to ${themeName}`);
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {themeName.charAt(0).toUpperCase() + themeName.slice(1)} Theme
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mt: 1,
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: theme.palette.primary.main,
                borderRadius: 1,
              }}
            />
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: theme.palette.secondary.main,
                borderRadius: 1,
              }}
            />
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: theme.palette.background.paper,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ p: 3 }}
      >
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab icon={<PaletteIcon />} label="Appearance" />
            <Tab icon={<TextFieldsIcon />} label="Text" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
            <Tab icon={<SecurityIcon />} label="Privacy" />
            <Tab icon={<LanguageIcon />} label="Language" />
          </Tabs>
        </Box>

        <AnimatePresence mode="wait">
          <MotionBox
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Theme
                </Typography>
                <Grid container spacing={2}>
                  {availableThemes.map((theme) => (
                    <Grid item xs={12} sm={6} md={4} key={theme}>
                      {renderThemePreview(theme)}
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Font Size
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Font Size</InputLabel>
                  <Select
                    value={fontSize}
                    label="Font Size"
                    onChange={(e) => {
                      changeFontSize(e.target.value);
                      showSuccess(`Font size changed to ${e.target.value}`);
                    }}
                  >
                    {availableFontSizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Notification Settings
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.email}
                      onChange={handleNotificationChange('email')}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.push}
                      onChange={handleNotificationChange('push')}
                    />
                  }
                  label="Push Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.mentions}
                      onChange={handleNotificationChange('mentions')}
                    />
                  }
                  label="Mentions"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.comments}
                      onChange={handleNotificationChange('comments')}
                    />
                  }
                  label="Comments"
                />
              </Box>
            )}

            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Privacy Settings
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Profile Visibility</InputLabel>
                  <Select
                    value={privacy.profileVisibility}
                    label="Profile Visibility"
                    onChange={handlePrivacyChange('profileVisibility')}
                  >
                    <MenuItem value="public">Public</MenuItem>
                    <MenuItem value="friends">Friends Only</MenuItem>
                    <MenuItem value="private">Private</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacy.showEmail}
                      onChange={handlePrivacyChange('showEmail')}
                    />
                  }
                  label="Show Email Address"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacy.showActivity}
                      onChange={handlePrivacyChange('showActivity')}
                    />
                  }
                  label="Show Activity Status"
                />
              </Box>
            )}

            {activeTab === 4 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Language
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={language}
                    label="Language"
                    onChange={(e) => {
                      handleLanguageChange(e);
                      showSuccess(`Language changed to ${e.target.value}`);
                    }}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </MotionBox>
        </AnimatePresence>

        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveSettings}
            >
              Save Changes
            </Button>
          </motion.div>
        </Box>
      </MotionPaper>
    </Container>
  );
};

export default Settings; 