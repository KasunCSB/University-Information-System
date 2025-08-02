import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { TokenService } from '../services/tokenService.js';
import UserModel from '../models/User.js';
import logger from '../config/logger.js';
import { ApiResponse } from '../types/auth.js';

// Rate limiting middleware
export const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 account creation requests per windowMs
  message: {
    success: false,
    message: 'Too many account creation attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per windowMs
  message: {
    success: false,
    message: 'Too many password reset attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication middleware
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required'
      } as ApiResponse);
      return;
    }

    const decoded = TokenService.verifyAccessToken(token);
    
    // Get fresh user data
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      } as ApiResponse);
      return;
    }

    // Add user to request object
    req.user = {
      _id: user._id?.toString() || '',
      username: user.username,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    };
    next();
  } catch (error) {
    logger.error('Token authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid access token'
    } as ApiResponse);
  }
};

// Authorization middleware
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;
    
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      } as ApiResponse);
      return;
    }
    
    next();
  };
};

// Email verification required middleware
export const requireEmailVerification = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const user = req.user;
  
  if (!user?.isEmailVerified) {
    res.status(403).json({
      success: false,
      message: 'Email verification required'
    } as ApiResponse);
    return;
  }
  
  _next();
};

// Error handling middleware
export const errorHandler = (
  err: Error & { 
    name?: string; 
    code?: number; 
    errors?: Record<string, { message: string }>;
    keyValue?: Record<string, unknown>;
    statusCode?: number;
  },
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    const errors = Object.values(err.errors).map((e) => e.message);
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      error: errors.join(', ')
    } as ApiResponse);
    return;
  }

  // Mongoose duplicate key error
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    res.status(400).json({
      success: false,
      message: `${field} already exists`
    } as ApiResponse);
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    } as ApiResponse);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expired'
    } as ApiResponse);
    return;
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  } as ApiResponse);
};
