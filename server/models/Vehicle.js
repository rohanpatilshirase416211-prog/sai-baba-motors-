const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    vehicleType: {
      type: String,
      enum: ['car', 'bike'],
      required: [true, 'Vehicle type (car or bike) is required'],
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      index: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
      index: true,
    },
    variant: {
      type: String,
      trim: true,
      default: '',
    },
    year: {
      type: Number,
      required: [true, 'Manufacturing/Registration year is required'],
      min: [1990, 'Year must be 1990 or newer'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
      index: true,
    },
    running: {
      type: Number,
      required: [true, 'Running kilometers is required'],
      min: [0, 'Running kilometers cannot be negative'],
      index: true,
    },
    passing: {
      type: String,
      required: [true, 'Passing/RTO code is required (e.g. MH 09)'],
      trim: true,
      index: true,
    },
    registration: {
      type: String,
      trim: true,
      default: '',
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid', 'Other'],
      default: 'Petrol',
      index: true,
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic', 'N/A'],
      default: 'Manual',
    },
    engineCC: {
      type: Number,
      default: null,
    },
    ownership: {
      type: String,
      enum: ['1st Owner', '2nd Owner', '3rd Owner', '4th+ Owner', 'N/A'],
      default: '1st Owner',
    },
    color: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    additionalInformation: {
      type: String,
      trim: true,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    primaryImage: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'inactive'],
      default: 'available',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for high performance search and filtering
vehicleSchema.index({ vehicleType: 1, status: 1, price: 1 });
vehicleSchema.index({ vehicleType: 1, brand: 1, status: 1 });
vehicleSchema.index({ vehicleType: 1, year: 1, status: 1 });
vehicleSchema.index({ featured: 1, status: 1 });

// Helper to ensure primaryImage is set if images exist
vehicleSchema.pre('save', function (next) {
  if (this.images && this.images.length > 0 && !this.primaryImage) {
    this.primaryImage = this.images[0];
  }
  next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
