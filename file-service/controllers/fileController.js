const path = require('path');
const fs = require('fs');
const { uploadToS3, deleteFromS3 } = require('../config/s3Config');

/**
 * Upload file (local or S3)
 * POST /files/upload
 */
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const useS3 = process.env.USE_S3 === 'true';

    let fileUrl;
    let fileKey;

    if (useS3 && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_S3_BUCKET_NAME) {
      // Upload to S3
      try {
        const s3Result = await uploadToS3(req.file);
        fileUrl = s3Result.url;
        fileKey = s3Result.key;

        // Delete local file after S3 upload
        fs.unlinkSync(req.file.path);
      } catch (s3Error) {
        console.error('S3 upload failed, using local storage:', s3Error.message);
        fileUrl = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;
        fileKey = req.file.filename;
      }
    } else {
      // Local storage
      fileUrl = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;
      fileKey = req.file.filename;
    }

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        url: fileUrl,
        key: fileKey,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    });

  } catch (error) {
    console.error('Upload File Error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Upload multiple files
 * POST /files/upload-multiple
 */
exports.uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const useS3 = process.env.USE_S3 === 'true';
    const uploadedFiles = [];

    for (const file of req.files) {
      let fileUrl;
      let fileKey;

      if (useS3 && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_S3_BUCKET_NAME) {
        try {
          const s3Result = await uploadToS3(file);
          fileUrl = s3Result.url;
          fileKey = s3Result.key;
          fs.unlinkSync(file.path);
        } catch (s3Error) {
          console.error('S3 upload failed for file, using local:', s3Error.message);
          fileUrl = `${req.protocol}://${req.get('host')}/files/${file.filename}`;
          fileKey = file.filename;
        }
      } else {
        fileUrl = `${req.protocol}://${req.get('host')}/files/${file.filename}`;
        fileKey = file.filename;
      }

      uploadedFiles.push({
        url: fileUrl,
        key: fileKey,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });
    }

    res.status(201).json({
      success: true,
      message: `${uploadedFiles.length} files uploaded successfully`,
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Upload Multiple Files Error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete file
 * DELETE /files/:fileKey
 */
exports.deleteFile = async (req, res) => {
  try {
    const { fileKey } = req.params;

    const useS3 = process.env.USE_S3 === 'true';

    if (useS3 && process.env.AWS_ACCESS_KEY_ID) {
      // Delete from S3
      await deleteFromS3(fileKey);
    } else {
      // Delete from local storage
      const filePath = path.join(__dirname, '../uploads', fileKey);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete File Error:', error);
    res.status(500).json({
      success: false,
      message: 'File deletion failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
