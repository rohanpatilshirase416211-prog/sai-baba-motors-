const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadImages } = require('../controllers/uploadController');

// Support multiple images upload (up to 10 photos at once)
router.post('/', upload.array('images', 10), uploadImages);

module.exports = router;
