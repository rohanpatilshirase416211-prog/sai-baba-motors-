const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles with comprehensive filtering, search, sorting & pagination
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res, next) => {
  try {
    const {
      type,
      brand,
      model,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      maxRunning,
      passing,
      fuelType,
      transmission,
      ownership,
      featured,
      status,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Filter by type (car or bike)
    if (type && type !== 'all') {
      query.vehicleType = type;
    }

    // Filter by status (public defaults to 'available' or 'sold', unless specified by admin)
    if (status) {
      if (status !== 'all') {
        query.status = status;
      }
    } else {
      // By default for public users, show available and sold vehicles (exclude inactive)
      query.status = { $in: ['available', 'sold'] };
    }

    // Filter by featured
    if (featured !== undefined && featured !== '') {
      query.featured = featured === 'true';
    }

    // Filter by brand
    if (brand && brand !== 'all') {
      query.brand = new RegExp(`^${brand.trim()}$`, 'i');
    }

    // Filter by model
    if (model) {
      query.model = new RegExp(model.trim(), 'i');
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by manufacturing year range
    if (minYear || maxYear) {
      query.year = {};
      if (minYear) query.year.$gte = Number(minYear);
      if (maxYear) query.year.$lte = Number(maxYear);
    }

    // Filter by running km
    if (maxRunning) {
      query.running = { $lte: Number(maxRunning) };
    }

    // Filter by passing / RTO (e.g. MH 09)
    if (passing) {
      query.passing = new RegExp(passing.trim(), 'i');
    }

    // Filter by fuel type
    if (fuelType && fuelType !== 'all') {
      query.fuelType = fuelType;
    }

    // Filter by transmission
    if (transmission && transmission !== 'all') {
      query.transmission = transmission;
    }

    // Filter by ownership
    if (ownership && ownership !== 'all') {
      query.ownership = ownership;
    }

    // General text search
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { brand: searchRegex },
        { model: searchRegex },
        { variant: searchRegex },
        { passing: searchRegex },
        { description: searchRegex },
        { additionalInformation: searchRegex },
      ];
    }

    // Sorting options
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'km_asc') sortOptions = { running: 1 };
    else if (sort === 'year_desc') sortOptions = { year: -1 };
    else if (sort === 'year_asc') sortOptions = { year: 1 };

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    const total = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: vehicles.length,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured vehicles for home page showcase
// @route   GET /api/vehicles/featured
// @access  Public
const getFeaturedVehicles = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    const vehicles = await Vehicle.find({
      featured: true,
      status: { $in: ['available', 'sold'] },
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dynamic distinct filter options (brands, fuel types, min/max price, etc.)
// @route   GET /api/vehicles/filters
// @access  Public
const getFilterOptions = async (req, res, next) => {
  try {
    const { type } = req.query;
    const baseQuery = { status: { $in: ['available', 'sold'] } };
    if (type && type !== 'all') {
      baseQuery.vehicleType = type;
    }

    const brands = await Vehicle.distinct('brand', baseQuery);
    const passingList = await Vehicle.distinct('passing', baseQuery);
    
    // Aggregation to find min and max prices & years
    const stats = await Vehicle.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          minYear: { $min: '$year' },
          maxYear: { $max: '$year' },
          maxKm: { $max: '$running' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        brands: brands.sort(),
        passingList: passingList.sort(),
        stats: stats[0] || {
          minPrice: 50000,
          maxPrice: 2000000,
          minYear: 2010,
          maxYear: 2024,
          maxKm: 150000,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    // Also fetch 3-4 related vehicles (same type or brand)
    const related = await Vehicle.find({
      _id: { $ne: vehicle._id },
      vehicleType: vehicle.vehicleType,
      status: 'available',
    })
      .limit(3)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: vehicle,
      related,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new vehicle
// @route   POST /api/vehicles
// @access  Private (Admin)
const createVehicle = async (req, res, next) => {
  try {
    const {
      vehicleType,
      brand,
      model,
      variant,
      year,
      price,
      running,
      passing,
      registration,
      fuelType,
      transmission,
      engineCC,
      ownership,
      color,
      description,
      additionalInformation,
      images,
      primaryImage,
      featured,
      status,
    } = req.body;

    const vehicle = await Vehicle.create({
      vehicleType,
      brand,
      model,
      variant,
      year: Number(year),
      price: Number(price),
      running: Number(running),
      passing,
      registration,
      fuelType,
      transmission,
      engineCC: engineCC ? Number(engineCC) : null,
      ownership,
      color,
      description,
      additionalInformation,
      images: Array.isArray(images) ? images : [],
      primaryImage: primaryImage || (images && images.length > 0 ? images[0] : ''),
      featured: featured === true || featured === 'true',
      status: status || 'available',
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Admin)
const updateVehicle = async (req, res, next) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    const updates = { ...req.body };
    if (updates.year) updates.year = Number(updates.year);
    if (updates.price) updates.price = Number(updates.price);
    if (updates.running) updates.running = Number(updates.running);
    if (updates.engineCC) updates.engineCC = Number(updates.engineCC);
    if (updates.featured !== undefined) updates.featured = updates.featured === true || updates.featured === 'true';

    // If primaryImage not set or deleted, ensure fallback
    if (updates.images && updates.images.length > 0 && !updates.primaryImage) {
      updates.primaryImage = updates.images[0];
    }

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Admin)
const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle vehicle status (available / sold / inactive)
// @route   PATCH /api/vehicles/:id/status
// @access  Private (Admin)
const updateVehicleStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['available', 'sold', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be available, sold, or inactive',
      });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Vehicle status updated to ${status}`,
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle vehicle featured flag
// @route   PATCH /api/vehicles/:id/featured
// @access  Private (Admin)
const toggleVehicleFeatured = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    vehicle.featured = !vehicle.featured;
    await vehicle.save();

    res.status(200).json({
      success: true,
      message: `Vehicle ${vehicle.featured ? 'marked as featured' : 'removed from featured'}`,
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVehicles,
  getFeaturedVehicles,
  getFilterOptions,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  updateVehicleStatus,
  toggleVehicleFeatured,
};
