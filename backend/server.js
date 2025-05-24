const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
require('express-async-errors');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const analyticsRoutes = require('./routes/analytics');
const uploadRoutes = require('./routes/uploads');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { connectDB } = require('./config/database');
const logger = require('./utils/logger');

// Initialize Express app
const app = express();

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  }
});

app.use(globalLimiter);

// Compression middleware
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001'
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body for Stripe webhook verification
    if (req.path === '/api/payments/webhook') {
      req.rawBody = buf;
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/uploads', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memory: process.memoryUsage()
  };

  res.status(200).json(healthCheck);
});

// API documentation route
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'ChecklistPro API Documentation',
    version: '1.0.0',
    description: 'Professional Checklist Business Platform API',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/logout': 'Logout user',
        'POST /api/auth/refresh': 'Refresh access token',
        'POST /api/auth/forgot-password': 'Request password reset',
        'POST /api/auth/reset-password': 'Reset password'
      },
      products: {
        'GET /api/products': 'Get all products with filtering',
        'GET /api/products/:slug': 'Get product by slug',
        'POST /api/products': 'Create product (Admin only)',
        'PUT /api/products/:id': 'Update product (Admin only)',
        'DELETE /api/products/:id': 'Delete product (Admin only)'
      },
      categories: {
        'GET /api/categories': 'Get all categories',
        'POST /api/categories': 'Create category (Admin only)'
      },
      orders: {
        'GET /api/orders': 'Get user orders',
        'POST /api/orders': 'Create order',
        'GET /api/orders/:id': 'Get order by ID',
        'PUT /api/orders/:id/status': 'Update order status (Admin only)'
      },
      payments: {
        'POST /api/payments/create-intent': 'Create payment intent',
        'POST /api/payments/webhook': 'Stripe webhook handler'
      },
      analytics: {
        'GET /api/analytics': 'Get analytics data (Admin only)',
        'GET /api/analytics/revenue': 'Get revenue analytics (Admin only)',
        'GET /api/analytics/products': 'Get product analytics (Admin only)'
      }
    }
  });
});

// Metrics endpoint for monitoring
app.get('/api/metrics', (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    activeConnections: mongoose.connection.readyState,
    environment: process.env.NODE_ENV
  };

  res.status(200).json(metrics);
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `The endpoint ${req.method} ${req.path} does not exist`,
    availableEndpoints: '/api/docs'
  });
});

// Global error handling middleware
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    mongoose.connection.close();
    process.exit(0);
  });
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      logger.info(`API Documentation: http://localhost:${PORT}/api/docs`);
      logger.info(`Health Check: http://localhost:${PORT}/api/health`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

      switch (error.code) {
        case 'EACCES':
          logger.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Store server reference for graceful shutdown
    global.server = server;

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;