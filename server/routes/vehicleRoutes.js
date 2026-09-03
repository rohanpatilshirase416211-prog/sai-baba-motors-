const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getFeaturedVehicles,
  getFilterOptions,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  updateVehicleStatus,
  toggleVehicleFeatured,
} = require('../controllers/vehicleController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getVehicles);
router.get('/featured', getFeaturedVehicles);
router.get('/filters', getFilterOptions);
router.get('/:id', getVehicleById);

// Admin protected routes
router.post('/', protect, adminOnly, createVehicle);
router.put('/:id', protect, adminOnly, updateVehicle);
router.delete('/:id', protect, adminOnly, deleteVehicle);
router.patch('/:id/status', protect, adminOnly, updateVehicleStatus);
router.patch('/:id/featured', protect, adminOnly, toggleVehicleFeatured);

module.exports = router;
