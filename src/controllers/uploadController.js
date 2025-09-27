const cloudinary = require('../config/cloudinary');
const Upload = require('../models/Upload');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
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