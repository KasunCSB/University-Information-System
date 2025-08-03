import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import logger from '../config/logger.js';
import { ApiResponse } from '../types/auth.js';

export const checkDatabaseConnection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check if MongoDB is connected
  if (mongoose.connection.readyState !== 1) {
    logger.error('Database connection not available - current state:', mongoose.connection.readyState);
    res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable. Database connection issue. Please try again later.'
    } as ApiResponse);
    return;
  }
  
  next();
};

export const gracefulDatabaseHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Set up error handling for database operations
  const originalSend = res.send;
  
  res.send = function(data) {
    try {
      return originalSend.call(this, data);
    } catch (error) {
      logger.error('Database operation failed during response:', error);
      
      if (!res.headersSent) {
        return originalSend.call(this, JSON.stringify({
          success: false,
          message: 'Database operation failed. Please try again.',
          error: process.env.NODE_ENV === 'development' ? String(error) : undefined
        }));
      }
      
      return originalSend.call(this, data);
    }
  };
  
  next();
};

export const dbHealthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Perform a simple ping to database
    await mongoose.connection.db?.admin().ping();
    next();
  } catch (error) {
    logger.error('Database health check failed:', error);
    res.status(503).json({
      success: false,
      message: 'Database health check failed. Service temporarily unavailable.'
    } as ApiResponse);
  }
};
