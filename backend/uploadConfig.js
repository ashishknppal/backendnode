const multer = require('multer');
const path = require('path');

// Configure multer storage (Temporary upload directory)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'temp_uploads/'); // Temporary upload folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // File size limit: 5MB
});

module.exports = { upload };
