import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { mode, setThemeMode } = useTheme();

  const handleThemeChange = (event) => {
    setThemeMode(event.target.value);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SettingsIcon sx={{ mr: 1 }} />
          <Typography variant="h5">Settings</Typography>
        </Box>

        <List>
          <ListItem>
            <ListItemIcon>
              {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
            </ListItemIcon>
            <ListItemText
              primary="Theme"
              secondary="Choose your preferred theme"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <FormControl component="fieldset">
              <FormLabel component="legend">Theme Mode</FormLabel>
              <RadioGroup
                value={mode}
                onChange={handleThemeChange}
              >
                <FormControlLabel
                  value="light"
                  control={<Radio />}
                  label="Light"
                />
                <FormControlLabel
                  value="dark"
                  control={<Radio />}
                  label="Dark"
                />
              </RadioGroup>
            </FormControl>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default Settings; 