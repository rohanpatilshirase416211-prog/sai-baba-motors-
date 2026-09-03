require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route handlers
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const sellRequestRoutes = require('./routes/sellRequestRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows images to be served to frontend
  })
);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for local network/dev preview
      }
    },
    credentials: true,
  })
);

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests created from this IP, please try again after 15 minutes',
  },
});
app.use('/api', apiLimiter);

// Body parser
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    dealership: 'साईबाबा मोटर्स (Sai Baba Motors)',
    location: 'Kasba Walve',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/sell-requests', sellRequestRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server and connect to Database
const startServer = async () => {
  try {
    await connectDB();
    
    // Auto-seed if database has no vehicles yet
    const Vehicle = require('./models/Vehicle');
    const vehicleCount = await Vehicle.countDocuments();
    if (vehicleCount === 0) {
      console.log('[Server] No vehicles found. Automatically running seed script...');
      const seedDatabase = require('./seed/seedData');
      await seedDatabase();
    }

    const server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 साईबाबा मोटर्स (Sai Baba Motors) API Server Running`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`📍 Location: Kasba Walve`);
      console.log(`👤 Contacts: Rohit Patil (9130959393), Amit Pawar (9096545144), Yuvaraj Chavan (9689653300)`);
      console.log(`======================================================\n`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`[Server Error] Port ${PORT} is already in use by another process.`);
        console.error(`Run: Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force`);
      } else {
        console.error('[Server Error]', err.message);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
