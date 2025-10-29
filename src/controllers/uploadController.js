const cloudinary = require('../config/cloudinary');
const Upload = require('../models/Upload');
const fs = require('fs');

// Check if Cloudinary is properly configured
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME &&
         process.env.CLOUDINARY_API_KEY &&
         process.env.CLOUDINARY_API_SECRET;
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      // Clean up the uploaded file
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting temporary file:', err);
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Upload service is not configured properly. Please contact the administrator.'
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'kreatifweb-uploads',
      resource_type: 'auto'
    });

    const uploadData = new Upload({
      originalName: req.file.originalname,
      cloudinaryUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

    const savedUpload = await uploadData.save();

    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      url: savedUpload.cloudinaryUrl, // Add url at top level for frontend compatibility
      data: {
        id: savedUpload._id,
        url: savedUpload.cloudinaryUrl,
        originalName: savedUpload.originalName,
        fileSize: savedUpload.fileSize,
        mimeType: savedUpload.mimeType,
        createdAt: savedUpload.createdAt
      }
    });

  } catch (error) {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temporary file on error:', err);
      });
    }

    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
};

module.exports = {
  uploadImage
};