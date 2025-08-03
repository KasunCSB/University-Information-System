import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database.js';
import config from './config/config.js';
import logger from './config/logger.js';
import authRoutes from './routes/auth.js';
import { errorHandler } from './middleware/auth.js';
import { checkDatabaseConnection, gracefulDatabaseHandler, dbHealthCheck } from './middleware/database.js';

const app = express();

// Trust proxy if behind reverse proxy (for rate limiting)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database middleware
app.use(gracefulDatabaseHandler);

// Logging middleware
if (config.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim())
    }
  }));
}

// Health check endpoint with database health check
app.get('/health', dbHealthCheck, (req, res) => {
  res.json({
    success: true,
    message: 'UIS Backend API is running',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    database: 'Connected'
  });
});

// Database health endpoint
app.get('/health/db', dbHealthCheck, (req, res) => {
  res.json({
    success: true,
    message: 'Database connection healthy',
    database: {
      status: 'Connected',
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    }
  });
});

// API routes
app.use('/api/auth', checkDatabaseConnection, authRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    const server = app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
      logger.info(`Frontend URL: ${config.FRONTEND_URL}`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start server when this file is run directly
startServer();

export default app;
