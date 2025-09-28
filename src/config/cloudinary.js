const cloudinary = require('cloudinary').v2;

// Check if Cloudinary environment variables are present
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME &&
         process.env.CLOUDINARY_API_KEY &&
         process.env.CLOUDINARY_API_SECRET;
};

// Only configure Cloudinary if all required env vars are present
if (isCloudinaryConfigured()) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('Cloudinary configured successfully');
  } catch (error) {
    console.error('Error configuring Cloudinary:', error);
  }
} else {
  console.warn('Cloudinary configuration missing - upload functionality will be limited');
}

module.exports = cloudinary;