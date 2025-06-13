import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      console.log('Loading user data...');
      const res = await axios.get('/api/auth/me');
      console.log('User data response:', res.data);
      
      if (res.data.success) {
        setUser(res.data.data);
      } else {
        console.log('Failed to load user data:', res.data);
        setUser(null);
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const res = await axios.post('/api/auth/register', userData);
      console.log('Register response:', res.data);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const login = async (userData) => {
    try {
      setError(null);
      console.log('Attempting login...');
      const res = await axios.post('/api/auth/login', userData);
      console.log('Login response:', res.data);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return true;
      }
      setError('Login failed. Please check your credentials.');
      return false;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    error,
    loading,
    register,
    login,
    logout,
    updateUser,
    loadUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 