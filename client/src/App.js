import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box, useTheme, useMediaQuery } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ShortcutProvider } from './context/ShortcutContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/Profile';
import Settings from './components/Settings';
import { AnimatePresence } from 'framer-motion';
import './App.css';

const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

const App = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <CssBaseline />
          <Router future={router.future}>
            <ShortcutProvider>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: 'background.default'
              }}>
                <Navbar />
                <Box 
                  component="main" 
                  sx={{ 
                    flexGrow: 1,
                    p: isMobile ? 1 : 2,
                    maxWidth: '100%',
                    mx: 'auto',
                    width: '100%'
                  }}
                >
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route
                        path="/"
                        element={
                          <PrivateRoute>
                            <Home />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/home"
                        element={
                          <PrivateRoute>
                            <Home />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <PrivateRoute>
                            <Profile />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <PrivateRoute>
                            <Settings />
                          </PrivateRoute>
                        }
                      />
                    </Routes>
                  </AnimatePresence>
                </Box>
              </Box>
            </ShortcutProvider>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
