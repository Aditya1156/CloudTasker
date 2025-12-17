const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('✅ Uploads directory created');
}

// Serve static files
app.use('/files', express.static(uploadsDir));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    service: 'File Service', 
    status: 'UP',
    s3_enabled: process.env.USE_S3 === 'true',
    timestamp: new Date().toISOString() 
  });
});

// File routes
const fileRoutes = require('./routes/fileRoutes');
app.use('/files', fileRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => {
  console.log(`🚀 File Service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`S3 Upload: ${process.env.USE_S3 === 'true' ? 'Enabled' : 'Disabled (Local Storage)'}`);
});
