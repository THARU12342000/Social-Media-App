const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // make sure this points to a JS file

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// MongoDB connection with retry logic
const connectDB = async (retries = 5, timeout = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/social-media-app';
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected successfully');
      return true;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${timeout/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, timeout));
      }
    }
  }
  return false;
};

// Start server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  const isConnected = await connectDB();
  if (isConnected) {
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } else {
    console.error('Could not connect to MongoDB. Server will not start.');
    process.exit(1);
  }
};

startServer();
