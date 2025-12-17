const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const UserProfile = require('./models/UserProfile');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize database table
(async () => {
  try {
    await UserProfile.createTable();
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
  }
})();

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    service: 'User Service', 
    status: 'UP',
    timestamp: new Date().toISOString() 
  });
});

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`🚀 User Service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database: ${process.env.DB_DATABASE}`);
});
