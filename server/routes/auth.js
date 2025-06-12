const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

router.get('/me', protect, getMe);

module.exports = router;
