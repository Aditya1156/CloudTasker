const express = require('express');
const upload = require('../config/multerConfig');
const { uploadFile, uploadMultipleFiles, deleteFile } = require('../controllers/fileController');

const router = express.Router();

// File upload routes
router.post('/upload', upload.single('file'), uploadFile);
router.post('/upload-multiple', upload.array('files', 10), uploadMultipleFiles);
router.delete('/:fileKey', deleteFile);

module.exports = router;
