import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { register, error, clearError, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
    return () => clearError();
  }, [user, navigate, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setValidationError('');
  };

  const validateForm = () => {
    // Validate name
    if (!formData.name.trim()) {
      setValidationError('Please enter your full name');
      return false;
    }
    if (formData.name.length < 2) {
      setValidationError('Name must be at least 2 characters long');
      return false;
    }

    // Validate email
    if (!formData.email.trim()) {
      setValidationError('Please enter your email address');
      return false;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    // Validate password
    if (!formData.password) {
      setValidationError('Please enter a password');
      return false;
    }
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return false;
    }

    // Validate password confirmation
    if (!formData.confirmPassword) {
      setValidationError('Please confirm your password');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const success = await register(registerData);
      
      if (success) {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please login with your credentials.' 
          }
        });
      } else {
        setValidationError(error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setValidationError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>
        {(error || validationError) && (
          <div className="error-message">{error || validationError}</div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              minLength="2"
              disabled={isLoading}
            />
          </div>
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
              placeholder="Create a password (min. 6 characters)"
              minLength="6"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className="auth-link">
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register; 