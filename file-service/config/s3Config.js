const AWS = require('aws-sdk');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

/**
 * Upload file to S3
 */
exports.uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  try {
    const result = await s3.upload(params).promise();
    return {
      success: true,
      url: result.Location,
      key: result.Key
    };
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw error;
  }
};

/**
 * Delete file from S3
 */
exports.deleteFromS3 = async (fileKey) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey
  };

  try {
    await s3.deleteObject(params).promise();
    return { success: true };
  } catch (error) {
    console.error('S3 Delete Error:', error);
    throw error;
  }
};

/**
 * Get signed URL for private files
 */
exports.getSignedUrl = (fileKey, expiresIn = 3600) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
    Expires: expiresIn
  };

  return s3.getSignedUrl('getObject', params);
};

module.exports = {
  uploadToS3: exports.uploadToS3,
  deleteFromS3: exports.deleteFromS3,
  getSignedUrl: exports.getSignedUrl,
  s3
};
