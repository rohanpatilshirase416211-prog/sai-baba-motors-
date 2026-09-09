const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Detect serverless environment (Netlify / AWS Lambda)
const isServerless = !!(
  process.env.NETLIFY ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT
);

const uploadDir = isServerless
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, '..', 'uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  // Ignore filesystem error in read-only environment
}

// Storage configuration: use memoryStorage in serverless so no disk writes needed
const storage = isServerless
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination(req, file, cb) {
        cb(null, uploadDir);
      },
      filename(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `vehicle-${uniqueSuffix}${ext}`);
      },
    });

// File validation
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|webp/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp) are permitted!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

module.exports = upload;
