import React, { createContext, useState, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
    },
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const blueTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#e3f2fd',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const greenTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    secondary: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    background: {
      default: '#e8f5e9',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const purpleTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff80ab',
      dark: '#f50057',
    },
    background: {
      default: '#f3e5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const sunsetTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff7043',
      light: '#ffab91',
      dark: '#e64a19',
    },
    secondary: {
      main: '#ffd54f',
      light: '#ffe082',
      dark: '#ffb300',
    },
    background: {
      default: '#fff3e0',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 24,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme || 'light';
  });

  const [fontSize, setFontSize] = useState(() => {
    const savedSize = localStorage.getItem('fontSize');
    return savedSize || 'medium';
  });

  const themes = {
    light: lightTheme,
    dark: darkTheme,
    blue: blueTheme,
    green: greenTheme,
    purple: purpleTheme,
    sunset: sunsetTheme,
  };

  const fontSizes = {
    small: {
      h1: '2rem',
      h2: '1.5rem',
      h3: '1.25rem',
      body1: '0.875rem',
    },
    medium: {
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.5rem',
      body1: '1rem',
    },
    large: {
      h1: '3rem',
      h2: '2.5rem',
      h3: '2rem',
      body1: '1.25rem',
    },
  };

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const currentTheme = createTheme({
    ...themes[themeMode],
    typography: {
      ...themes[themeMode].typography,
      ...fontSizes[fontSize],
    },
  });

  const toggleTheme = (newTheme) => {
    setThemeMode(newTheme);
  };

  const changeFontSize = (newSize) => {
    setFontSize(newSize);
  };

  const value = {
    themeMode,
    fontSize,
    toggleTheme,
    changeFontSize,
    availableThemes: Object.keys(themes),
    availableFontSizes: Object.keys(fontSizes),
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={currentTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 