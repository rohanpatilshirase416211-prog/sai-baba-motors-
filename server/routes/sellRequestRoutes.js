const express = require('express');
const router = express.Router();
const {
  createSellRequest,
  getSellRequests,
  updateSellRequestStatus,
  deleteSellRequest,
} = require('../controllers/sellRequestController');
const { protect, adminOnly } = require('../middleware/auth');

// Public route to submit sell request
router.post('/', createSellRequest);

// Admin protected routes
router.get('/', protect, adminOnly, getSellRequests);
router.patch('/:id/status', protect, adminOnly, updateSellRequestStatus);
router.delete('/:id', protect, adminOnly, deleteSellRequest);

module.exports = router;
