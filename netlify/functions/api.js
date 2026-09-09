const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('../../server/config/db');
const authRoutes = require('../../server/routes/authRoutes');
const vehicleRoutes = require('../../server/routes/vehicleRoutes');
const enquiryRoutes = require('../../server/routes/enquiryRoutes');
const sellRequestRoutes = require('../../server/routes/sellRequestRoutes');
const statsRoutes = require('../../server/routes/statsRoutes');
const uploadRoutes = require('../../server/routes/uploadRoutes');
const errorHandler = require('../../server/middleware/errorHandler');

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Database connection check on each request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[Netlify Function] Database connection error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to database',
    });
  }
});

// Router mounting
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    dealership: 'साईबाबा मोटर्स (Sai Baba Motors)',
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/sell-requests', sellRequestRoutes);
router.use('/stats', statsRoutes);
router.use('/upload', uploadRoutes);

app.use('/.netlify/functions/api', router);
app.use('/api', router);
app.use('/', router);

app.use(errorHandler);

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return handler(event, context);
};
