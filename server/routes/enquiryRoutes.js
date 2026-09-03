const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} = require('../controllers/enquiryController');
const { protect, adminOnly } = require('../middleware/auth');

// Public route to submit enquiry
router.post('/', createEnquiry);

// Admin protected routes
router.get('/', protect, adminOnly, getEnquiries);
router.patch('/:id/status', protect, adminOnly, updateEnquiryStatus);
router.delete('/:id', protect, adminOnly, deleteEnquiry);

module.exports = router;
