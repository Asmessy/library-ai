const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/books');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    // Generate unique identifier
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    let sanitizedTitle = req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'book';
    cb(null, `${sanitizedTitle}_${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

function checkFileType(file, cb) {
  const filetypes = /pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images and PDFs only! Allowed type: .pdf'), false);
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload;
