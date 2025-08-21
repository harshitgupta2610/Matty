// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('../config/cloudinary');

// // Configure multer to use Cloudinary for storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'project_thumbnails', // Specify a folder name in your Cloudinary account
//     allowed_formats: ['jpeg', 'png', 'jpg'], // Restrict file types
//     // You can add transformations here if you want
//     // transformation: [{ width: 500, height: 500, crop: 'limit' }]
//   },
// });

// // Initialize multer with the configured storage
// const upload = multer({ storage: storage });

// module.exports = upload;
// In middlewares/uploadMiddleware.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'project_thumbnails',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

// Create optional upload middleware
const optionalUpload = (req, res, next) => {
  upload.single('thumbnail')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return next(err);
    }
    // Continue even if no file was uploaded
    next();
  });
};

module.exports = optionalUpload;
