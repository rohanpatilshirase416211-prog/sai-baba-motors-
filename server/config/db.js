const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

let memoryServer = null;

const cleanupMemoryServer = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (memoryServer) {
      console.log('[MongoDB] Safely stopping persistent database engine...');
      await memoryServer.stop({ doCleanup: false, force: false });
      memoryServer = null;
    }
  } catch (err) {
    // Ignore cleanup errors during shutdown
  }
};

// Register process exit listeners for safe data flushing
process.once('SIGINT', async () => {
  await cleanupMemoryServer();
  process.exit(0);
});
process.once('SIGTERM', async () => {
  await cleanupMemoryServer();
  process.exit(0);
});

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (memoryServer) {
    const memoryUri = memoryServer.getUri() + 'saibabamotors';
    const conn = await mongoose.connect(memoryUri);
    return conn;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/saibabamotors';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Connected to external MongoDB host: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] External MongoDB not reachable at ${uri}: ${err.message}`);
    console.log('[MongoDB] Initializing persistent local database in server/data/db...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const dataDir = path.join(__dirname, '..', 'data', 'db');

      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Check if stale lock file exists and if another process is holding it
      const lockFile = path.join(dataDir, 'mongod.lock');
      if (fs.existsSync(lockFile)) {
        try {
          // If 0 bytes or unlocked, it's safe; if locked, an old process might be running
          const stats = fs.statSync(lockFile);
          if (stats.size === 0) {
            fs.unlinkSync(lockFile);
          }
        } catch (e) {
          // File may be locked by another process
        }
      }

      memoryServer = await MongoMemoryServer.create({
        instance: {
          dbPath: dataDir,
          storageEngine: 'wiredTiger',
          dbName: 'saibabamotors',
        },
      });

      const memoryUri = memoryServer.getUri() + 'saibabamotors';
      const conn = await mongoose.connect(memoryUri);
      console.log(`[MongoDB] Persistent Database running successfully at: ${memoryUri}`);
      console.log(`[MongoDB] Data is safely saved to disk: ${dataDir}`);
      return conn;
    } catch (memErr) {
      console.error('[MongoDB] Fatal error initializing persistent database:', memErr);
      throw memErr;
    }
  }
};

module.exports = connectDB;

