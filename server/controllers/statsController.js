const Vehicle = require('../models/Vehicle');
const Enquiry = require('../models/Enquiry');
const SellRequest = require('../models/SellRequest');

// @desc    Get showroom dashboard statistics & metrics
// @route   GET /api/stats
// @access  Private (Admin)
const getStats = async (req, res, next) => {
  try {
    const [
      totalVehicles,
      totalCars,
      totalBikes,
      featuredVehicles,
      soldVehicles,
      availableVehicles,
      totalEnquiries,
      newEnquiries,
      totalSellRequests,
      newSellRequests,
      recentEnquiries,
      recentSellRequests,
      recentVehicles,
    ] = await Promise.all([
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ vehicleType: 'car' }),
      Vehicle.countDocuments({ vehicleType: 'bike' }),
      Vehicle.countDocuments({ featured: true }),
      Vehicle.countDocuments({ status: 'sold' }),
      Vehicle.countDocuments({ status: 'available' }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'New' }),
      SellRequest.countDocuments(),
      SellRequest.countDocuments({ status: 'New' }),
      Enquiry.find().sort({ createdAt: -1 }).limit(5),
      SellRequest.find().sort({ createdAt: -1 }).limit(5),
      Vehicle.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalVehicles,
        totalCars,
        totalBikes,
        featuredVehicles,
        soldVehicles,
        availableVehicles,
        totalEnquiries,
        newEnquiries,
        totalSellRequests,
        newSellRequests,
        recentEnquiries,
        recentSellRequests,
        recentVehicles,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
