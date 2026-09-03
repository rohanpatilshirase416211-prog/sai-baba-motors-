const SellRequest = require('../models/SellRequest');

// @desc    Submit vehicle for sale
// @route   POST /api/sell-requests
// @access  Public
const createSellRequest = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      vehicleType,
      brand,
      model,
      year,
      running,
      registration,
      expectedPrice,
      additionalInformation,
      images,
    } = req.body;

    if (!name || !phone || !vehicleType || !brand || !model || !expectedPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required vehicle and contact details',
      });
    }

    const sellRequest = await SellRequest.create({
      name,
      phone,
      vehicleType,
      brand,
      model,
      year: Number(year) || new Date().getFullYear(),
      running: Number(running) || 0,
      registration: registration || '',
      expectedPrice: Number(expectedPrice),
      additionalInformation: additionalInformation || '',
      images: Array.isArray(images) ? images : [],
    });

    res.status(201).json({
      success: true,
      message: 'Your vehicle sell request has been submitted successfully! Rohit, Amit, or Yuvaraj from Sai Baba Motors will review and call you shortly.',
      data: sellRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sell requests
// @route   GET /api/sell-requests
// @access  Private (Admin)
const getSellRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await SellRequest.countDocuments(query);
    const requests = await SellRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update sell request status
// @route   PATCH /api/sell-requests/:id/status
// @access  Private (Admin)
const updateSellRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['New', 'Contacted', 'Purchased', 'Rejected', 'Closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const request = await SellRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Sell request not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Sell request status updated to ${status}`,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete sell request
// @route   DELETE /api/sell-requests/:id
// @access  Private (Admin)
const deleteSellRequest = async (req, res, next) => {
  try {
    const request = await SellRequest.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Sell request not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sell request deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSellRequest,
  getSellRequests,
  updateSellRequestStatus,
  deleteSellRequest,
};
