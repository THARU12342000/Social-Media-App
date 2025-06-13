import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Alert, Snackbar } from '@mui/material';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      console.log('User authenticated, navigating to home...', user);
      navigate('/home', { replace: true });
    }
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
    return () => clearError();
  }, [user, navigate, clearError, location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMessage('');
    setShowError(false);
  };

  const validateForm = () => {
    if (!formData.email) {
      setErrorMessage('Please enter your email address');
      setShowError(true);
      return false;
    }
    if (!formData.password) {
      setErrorMessage('Please enter your password');
      setShowError(true);
      return false;
    }
    if (!formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      setShowError(true);
      return false;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      setShowError(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');
    setShowError(false);
    
    try {
      console.log('Attempting login with:', { email: formData.email });
      const success = await login(formData);
      console.log('Login response:', success);
      
      if (success) {
        console.log('Login successful, user state:', user);
        navigate('/home', { replace: true });
      } else {
        setErrorMessage('Invalid email or password. Please try again.');
        setShowError(true);
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setErrorMessage('Invalid email or password. Please try again.');
      } else if (err.response?.status === 404) {
        setErrorMessage('Account not found. Please check your email or register.');
      } else {
        setErrorMessage('An error occurred during login. Please try again.');
      }
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <span 
              onClick={() => navigate('/forgot-password')} 
              className="auth-link forgot-password"
            >
              Forgot Password?
            </span>
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} className="auth-link">
            Register here
          </span>
        </p>
      </div>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login; 