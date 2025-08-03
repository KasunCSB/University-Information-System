import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import {
  validateCompleteRegistration,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateToken,
  validateEmailVerification
} from '../middleware/validation.js';
import {
  createAccountLimiter,
  loginLimiter,
  passwordResetLimiter,
  emailVerificationLimiter,
  tokenVerificationLimiter,
  authenticateToken
} from '../middleware/auth.js';

const router = Router();

// Public routes - Step-by-step registration
router.post('/send-verification', emailVerificationLimiter, validateEmailVerification, AuthController.sendVerificationEmail);
router.post('/resend-verification', emailVerificationLimiter, validateEmailVerification, AuthController.sendVerificationEmail); // Add resend endpoint
router.post('/verify-token', tokenVerificationLimiter, validateToken, AuthController.verifyEmailToken);
router.post('/complete-registration', createAccountLimiter, validateCompleteRegistration, AuthController.completeRegistration);

// Email link verification (compatibility for email links)
router.get('/verify-email', AuthController.verifyEmailFromLink);
router.post('/verify-email', AuthController.verifyEmailFromLink);

router.post('/login', loginLimiter, validateLogin, AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/request-password-reset', passwordResetLimiter, validatePasswordResetRequest, AuthController.requestPasswordReset);
router.post('/reset-password', validatePasswordReset, AuthController.resetPassword);

// Protected routes
router.post('/logout', authenticateToken, AuthController.logout);
router.get('/profile', authenticateToken, AuthController.getProfile);

export default router;
