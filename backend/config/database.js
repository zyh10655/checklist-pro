// ========================================
// BACKEND - config/database.js
// ========================================

const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Database connection configuration
const connectDB = async () => {
  try {
    // MongoDB connection options
    const options = {
      // Connection options
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      // Buffering options
      bufferMaxEntries: 0,
      bufferCommands: false,
      
      // Connection pool options
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5,  // Maintain a minimum of 5 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      
      // Timeout options
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      
      // Heartbeat options
      heartbeatFrequencyMS: 10000, // Send a ping to check connection every 10 seconds
      
      // Replica set options (if using replica sets)
      retryWrites: true,
      retryReads: true,
      
      // Compression
      compressors: ['zlib'],
      
      // Read preference
      readPreference: 'primary',
      
      // Write concern
      writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000
      }
    };

    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/checklistpro';
    
    // Validate MongoDB URI
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, options);

    // Log successful connection
    logger.info(`MongoDB Connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    logger.info(`MongoDB Connection State: ${mongoose.connection.readyState}`);

    // Set up connection event listeners
    setupConnectionEventListeners();

    return conn;

  } catch (error) {
    logger.error('Database connection error:', error);
    
    // Exit process with failure
    process.exit(1);
  }
};

// Set up event listeners for database connection
const setupConnectionEventListeners = () => {
  const db = mongoose.connection;

  // Connection events
  db.on('connected', () => {
    logger.info('Mongoose connected to database');
  });

  db.on('error', (error) => {
    logger.error('Mongoose connection error:', error);
  });

  db.on('disconnected', () => {
    logger.warn('Mongoose disconnected from database');
  });

  db.on('reconnected', () => {
    logger.info('Mongoose reconnected to database');
  });

  db.on('close', () => {
    logger.info('Mongoose connection closed');
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', async () => {
    try {
      await db.close();
      logger.info('Mongoose connection closed through app termination (SIGINT)');
      process.exit(0);
    } catch (error) {
      logger.error('Error closing Mongoose connection:', error);
      process.exit(1);
    }
  });

  process.on('SIGTERM', async () => {
    try {
      await db.close();
      logger.info('Mongoose connection closed through app termination (SIGTERM)');
      process.exit(0);
    } catch (error) {
      logger.error('Error closing Mongoose connection:', error);
      process.exit(1);
    }
  });
};

// Disconnect from database
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting from database:', error);
    throw error;
  }
};

// Get database connection status
const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return {
    state: states[mongoose.connection.readyState],
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name
  };
};

// Check if database is connected
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Database health check
const healthCheck = async () => {
  try {
    if (!isConnected()) {
      throw new Error('Database not connected');
    }

    // Perform a simple operation to test connection
    await mongoose.connection.db.admin().ping();
    
    return {
      status: 'healthy',
      connection: getConnectionStatus(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      connection: getConnectionStatus(),
      timestamp: new Date().toISOString()
    };
  }
};

// Database statistics
const getStats = async () => {
  try {
    if (!isConnected()) {
      throw new Error('Database not connected');
    }

    const stats = await mongoose.connection.db.stats();
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    return {
      database: stats.db,
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexSize: stats.indexSize,
      totalSize: stats.dataSize + stats.indexSize,
      documents: stats.objects,
      avgObjSize: stats.avgObjSize,
      indexes: stats.indexes,
      collectionsInfo: collections.map(col => ({
        name: col.name,
        type: col.type
      }))
    };
  } catch (error) {
    logger.error('Error getting database stats:', error);
    throw error;
  }
};

// Create database indexes
const createIndexes = async () => {
  try {
    logger.info('Creating database indexes...');

    // User indexes
    const User = require('../models/User');
    await User.createIndexes();
    
    // Product indexes
    const Product = require('../models/Product');
    await Product.createIndexes();
    
    // Category indexes (if exists)
    try {
      const Category = require('../models/Category');
      await Category.createIndexes();
    } catch (error) {
      // Category model might not exist yet
    }
    
    // Order indexes (if exists)
    try {
      const Order = require('../models/Order');
      await Order.createIndexes();
    } catch (error) {
      // Order model might not exist yet
    }

    logger.info('Database indexes created successfully');
  } catch (error) {
    logger.error('Error creating database indexes:', error);
    throw error;
  }
};

// Seed initial data
const seedDatabase = async () => {
  try {
    logger.info('Checking if database seeding is needed...');

    // Check if we already have data
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      logger.info('Database already contains data, skipping seeding');
      return;
    }

    logger.info('Seeding database with initial data...');

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: process.env.ADMIN_EMAIL || 'admin@checklistpro.com',
      password: process.env.ADMIN_PASSWORD || 'Admin123!',
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });

    await adminUser.save();
    logger.info('Admin user created successfully');

    // Create categories (if Category model exists)
    try {
      const Category = require('../models/Category');
      const categories = [
        {
          name: 'Food Service',
          description: 'Restaurant and food business checklists',
          slug: 'food-service',
          icon: '🍽️'
        },
        {
          name: 'Healthcare',
          description: 'Medical and therapy practice checklists',
          slug: 'healthcare',
          icon: '🏥'
        },
        {
          name: 'Media & Content',
          description: 'Content creation and media production',
          slug: 'media-content',
          icon: '📺'
        },
        {
          name: 'Retail',
          description: 'Retail and e-commerce business setup',
          slug: 'retail',
          icon: '🛍️'
        },
        {
          name: 'Consulting',
          description: 'Professional services and consulting',
          slug: 'consulting',
          icon: '💼'
        }
      ];

      await Category.insertMany(categories);
      logger.info('Categories created successfully');
    } catch (error) {
      logger.warn('Category seeding skipped (model not found)');
    }

    logger.info('Database seeding completed successfully');

  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
};

// Backup database
const backupDatabase = async (backupPath) => {
  try {
    const { spawn } = require('child_process');
    const path = require('path');
    
    if (!isConnected()) {
      throw new Error('Database not connected');
    }

    const uri = new URL(process.env.MONGODB_URI);
    const dbName = uri.pathname.slice(1);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${dbName}-${timestamp}.gz`;
    const fullPath = path.join(backupPath || './backups', filename);

    return new Promise((resolve, reject) => {
      const mongodump = spawn('mongodump', [
        '--uri', process.env.MONGODB_URI,
        '--gzip',
        '--archive=' + fullPath
      ]);

      mongodump.on('close', (code) => {
        if (code === 0) {
          logger.info(`Database backup created: ${fullPath}`);
          resolve(fullPath);
        } else {
          reject(new Error(`Backup failed with code ${code}`));
        }
      });

      mongodump.on('error', reject);
    });

  } catch (error) {
    logger.error('Error creating database backup:', error);
    throw error;
  }
};

// Restore database from backup
const restoreDatabase = async (backupPath) => {
  try {
    const { spawn } = require('child_process');
    
    if (!isConnected()) {
      throw new Error('Database not connected');
    }

    return new Promise((resolve, reject) => {
      const mongorestore = spawn('mongorestore', [
        '--uri', process.env.MONGODB_URI,
        '--gzip',
        '--archive=' + backupPath,
        '--drop'
      ]);

      mongorestore.on('close', (code) => {
        if (code === 0) {
          logger.info(`Database restored from: ${backupPath}`);
          resolve();
        } else {
          reject(new Error(`Restore failed with code ${code}`));
        }
      });

      mongorestore.on('error', reject);
    });

  } catch (error) {
    logger.error('Error restoring database:', error);
    throw error;
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  getConnectionStatus,
  isConnected,
  healthCheck,
  getStats,
  createIndexes,
  seedDatabase,
  backupDatabase,
  restoreDatabase
};