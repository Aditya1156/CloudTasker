const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ 
    service: 'File Service', 
    status: 'UP',
    timestamp: new Date().toISOString() 
  });
});

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => {
  console.log(`🚀 File Service running on port ${PORT}`);
});
