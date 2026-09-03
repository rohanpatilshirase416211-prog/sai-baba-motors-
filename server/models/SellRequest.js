const mongoose = require('mongoose');

const sellRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Seller name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true,
    },
    vehicleType: {
      type: String,
      enum: ['car', 'bike'],
      required: [true, 'Vehicle type (car/bike) is required'],
    },
    brand: {
      type: String,
      required: [true, 'Vehicle brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Manufacturing year is required'],
    },
    running: {
      type: Number,
      default: 0,
    },
    registration: {
      type: String,
      trim: true,
      default: '',
    },
    expectedPrice: {
      type: Number,
      required: [true, 'Expected selling price is required'],
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
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Purchased', 'Rejected', 'Closed'],
      default: 'New',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SellRequest', sellRequestSchema);
