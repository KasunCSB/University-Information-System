import mongoose from 'mongoose';
import config from './config.js';
import logger from './logger.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    if (!config.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Set connection options for better reliability and performance
    await mongoose.connect(config.MONGODB_URI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      retryWrites: true, // Retry failed writes
      retryReads: true, // Retry failed reads
    });
    
    logger.info('MongoDB Connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('connecting', () => {
      logger.info('Mongoose connecting to MongoDB...');
    });
    
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    
    // In development, exit immediately
    if (config.NODE_ENV === 'development') {
      process.exit(1);
    }
    
    // In production, retry connection after delay
    logger.info('Retrying database connection in 5 seconds...');
    setTimeout(connectDatabase, 5000);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});
