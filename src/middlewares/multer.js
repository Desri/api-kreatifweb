const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Use /tmp directory for serverless environments, local uploads for development
const getUploadsDir = () => {
  if (process.env.NODE_ENV === 'production') {
    // Use /tmp directory in serverless environments (Vercel)
    return os.tmpdir();
  } else {
    // Use local uploads directory for development
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    return uploadsDir;
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const uploadsDir = getUploadsDir();
      cb(null, uploadsDir);
    } catch (error) {
      console.error('Error setting upload destination:', error);
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;