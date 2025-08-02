import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import {
  validateRegistration,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateToken
} from '../middleware/validation.js';
import {
  createAccountLimiter,
  loginLimiter,
  passwordResetLimiter,
  authenticateToken,
  authorizeRoles,
  requireEmailVerification
} from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/register', createAccountLimiter, validateRegistration, AuthController.register);
router.post('/login', loginLimiter, validateLogin, AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/verify-email', validateToken, AuthController.verifyEmail);
router.post('/request-password-reset', passwordResetLimiter, validatePasswordResetRequest, AuthController.requestPasswordReset);
router.post('/reset-password', validatePasswordReset, AuthController.resetPassword);

// Protected routes
router.post('/logout', authenticateToken, AuthController.logout);
router.get('/profile', authenticateToken, AuthController.getProfile);

// Admin only routes
router.get('/admin/users', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Admin endpoint - List all users',
    data: []
  });
});

// Teacher and Admin routes
router.get('/teacher/dashboard', authenticateToken, authorizeRoles('teacher', 'admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Teacher dashboard endpoint',
    data: {}
  });
});

// Email verified users only
router.get('/verified-only', authenticateToken, requireEmailVerification, (req, res) => {
  res.json({
    success: true,
    message: 'This endpoint requires email verification',
    data: {}
  });
});

export default router;
