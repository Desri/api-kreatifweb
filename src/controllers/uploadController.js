const cloudinary = require('../config/cloudinary');
const Upload = require('../models/Upload');
const fs = require('fs');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    console.log('Upload controller - File received:', {
      originalname: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    console.log('Upload controller - File exists at path:', fs.existsSync(req.file.path));


    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'kreatifweb-uploads',
      resource_type: 'auto'
    });

    // Temporarily skip database save due to MongoDB connection issues
    const savedUpload = {
      _id: 'temp-id',
      cloudinaryUrl: result.secure_url,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      createdAt: new Date()
    };

    // const uploadData = new Upload({
    //   originalName: req.file.originalname,
    //   cloudinaryUrl: result.secure_url,
    //   cloudinaryPublicId: result.public_id,
    //   fileSize: req.file.size,
    //   mimeType: req.file.mimetype
    // });

    // const savedUpload = await uploadData.save();

    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
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