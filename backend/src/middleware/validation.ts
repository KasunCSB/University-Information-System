import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/auth.js';

// Validation middleware
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: errors.array().map(err => err.msg).join(', ')
    } as ApiResponse);
    return;
  }
  next();
};

// Registration validation with stronger password requirements
export const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .escape(),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email is too long')
    .custom(async (email) => {
      // Check for disposable email providers (basic list)
      const disposableProviders = ['10minutemail.com', 'guerrillamail.com', 'tempmail.org'];
      const domain = email.split('@')[1];
      if (disposableProviders.includes(domain)) {
        throw new Error('Disposable email addresses are not allowed');
      }
      return true;
    }),
  
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')
    .custom((password) => {
      // Check for common weak passwords
      const commonPasswords = ['password123', 'Password123!', '12345678', 'qwerty123'];
      if (commonPasswords.includes(password)) {
        throw new Error('Please choose a more secure password');
      }
      return true;
    }),
  
  body('role')
    .optional()
    .isIn(['student', 'teacher', 'admin'])
    .withMessage('Role must be student, teacher, or admin'),
  
  handleValidationErrors
];

// Complete registration validation (no email needed since it comes from token)
export const validateCompleteRegistration = [
  body('token')
    .notEmpty()
    .withMessage('Token is required')
    .isLength({ min: 20 })
    .withMessage('Invalid token format - must be a JWT token')
    .custom((token) => {
      // Basic JWT format validation (three parts separated by dots)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT token format');
      }
      
      // Check if each part is base64url encoded
      try {
        parts.forEach((part: string) => {
          // Base64url decode check
          Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
        });
      } catch {
        throw new Error('Invalid JWT token encoding');
      }
      
      return true;
    }),

  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .escape(),
  
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')
    .custom((password) => {
      // Check for common weak passwords
      const commonPasswords = ['password123', 'Password123!', '12345678', 'qwerty123'];
      if (commonPasswords.includes(password)) {
        throw new Error('Please choose a more secure password');
      }
      return true;
    }),
  
  body('role')
    .optional()
    .isIn(['student', 'teacher', 'admin'])
    .withMessage('Role must be student, teacher, or admin'),
  
  handleValidationErrors
];

// Email verification validation
export const validateEmailVerification = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email is too long'),
  
  handleValidationErrors
];

// Login validation
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email or username is required')
    .escape(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Password reset request validation
export const validatePasswordResetRequest = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  handleValidationErrors
];

// Password reset validation
export const validatePasswordReset = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required')
    .isLength({ min: 64, max: 64 })
    .withMessage('Invalid reset token format - must be 64 characters')
    .matches(/^[a-f0-9]+$/i)
    .withMessage('Reset token must be a valid hexadecimal string'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  handleValidationErrors
];

// Email validation
export const validateEmail = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  handleValidationErrors
];

// Token validation for email verification (JWT)
export const validateToken = [
  body('token')
    .notEmpty()
    .withMessage('Token is required')
    .isLength({ min: 20 })
    .withMessage('Invalid token format - must be a JWT token')
    .custom((token) => {
      // Basic JWT format validation (three parts separated by dots)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT token format');
      }
      
      // Check if each part is base64url encoded
      try {
        parts.forEach((part: string) => {
          // Base64url decode check
          Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
        });
      } catch {
        throw new Error('Invalid JWT token encoding');
      }
      
      return true;
    }),
  
  handleValidationErrors
];
