const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../uploads');

console.log('Multer setup - Uploads directory path:', uploadsDir);
console.log('Multer setup - Directory exists:', fs.existsSync(uploadsDir));

if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory...');
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Directory created successfully');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Multer destination function called - uploadsDir:', uploadsDir);
    console.log('Multer destination - Directory exists at time of upload:', fs.existsSync(uploadsDir));
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log('Multer filename function called - generated filename:', filename);
    cb(null, filename);
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