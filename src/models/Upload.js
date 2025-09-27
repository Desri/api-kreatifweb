const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true
  },
  cloudinaryUrl: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number
  },
  mimeType: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Upload', uploadSchema);