// In middlewares/uploadMiddleware.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'project_thumbnails',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    // A transformation to ensure thumbnails are a reasonable size
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const upload = multer({ storage });

// Create middleware that makes file upload optional
const optionalUpload = (req, res, next) => {
  // Use multer's .single() method to process one file identified by 'thumbnail'
  upload.single('thumbnail')(req, res, (err) => {
    // Check for Multer-specific errors
    if (err instanceof multer.MulterError) {
      console.error('Multer error during upload:', err);
      // You could pass this error to your standard error handler
      return res.status(400).json({ message: 'File upload error', error: err.message });
    } else if (err) {
      // Handle other potential errors
      console.error('Unknown upload error:', err);
      return res.status(500).json({ message: 'An unknown error occurred during file upload.' });
    }
    // If there's no error, or even if no file was uploaded, proceed to the next middleware
    next();
  });
};

module.exports = optionalUpload;
