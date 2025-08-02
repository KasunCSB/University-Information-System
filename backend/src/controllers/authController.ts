import { Request, Response } from 'express';
import UserModel from '../models/User.js';
import { TokenService } from '../services/tokenService.js';
import emailService from '../services/emailService.js';
import logger from '../config/logger.js';
import { AuthResponse, ApiResponse } from '../types/auth.js';

export class AuthController {
  // Register new user
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, role = 'student' } = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User with this email or username already exists'
        } as AuthResponse);
        return;
      }

      // Create new user
      const user = new UserModel({
        username,
        email,
        password,
        role
      });

      // Generate email verification token
      const emailToken = user.generateEmailVerificationToken();
      await user.save();

      // Send verification email
      try {
        await emailService.sendEmailVerification(email, emailToken, username);
      } catch (emailError) {
        logger.error('Email sending failed:', emailError);
        // Continue with registration even if email fails
      }

      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email for verification.',
        user: {
          id: user._id!.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      } as AuthResponse);
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed'
      } as AuthResponse);
    }
  }

  // Login user
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user by email or username
      const user = await UserModel.findOne({
        $or: [{ email }, { username: email }]
      }).select('+password +refreshTokens');

      if (!user || !(await user.comparePassword(password))) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        } as AuthResponse);
        return;
      }

      // Generate tokens
      const tokenId = TokenService.generateTokenId();
      const accessToken = TokenService.generateAccessToken({
        userId: user._id!.toString(),
        email: user.email,
        role: user.role
      });
      const refreshToken = TokenService.generateRefreshToken({
        userId: user._id!.toString(),
        tokenId
      });

      // Store refresh token
      user.refreshTokens.push(refreshToken);
      user.lastLogin = new Date();
      await user.save();

      logger.info(`User logged in: ${user.email}`);

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id!.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        tokens: {
          accessToken,
          refreshToken
        }
      } as AuthResponse);
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed'
      } as AuthResponse);
    }
  }

  // Refresh token
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: 'Refresh token required'
        } as ApiResponse);
        return;
      }

      const decoded = TokenService.verifyRefreshToken(refreshToken);
      const user = await UserModel.findById(decoded.userId).select('+refreshTokens');

      if (!user || !user.refreshTokens.includes(refreshToken)) {
        res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        } as ApiResponse);
        return;
      }

      // Generate new tokens
      const newTokenId = TokenService.generateTokenId();
      const newAccessToken = TokenService.generateAccessToken({
        userId: user._id!.toString(),
        email: user.email,
        role: user.role
      });
      const newRefreshToken = TokenService.generateRefreshToken({
        userId: user._id!.toString(),
        tokenId: newTokenId
      });

      // Replace old refresh token with new one
      user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
      user.refreshTokens.push(newRefreshToken);
      await user.save();

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      } as ApiResponse);
    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        message: 'Token refresh failed'
      } as ApiResponse);
    }
  }

  // Logout
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const user = req.user;

      if (refreshToken && user) {
        const userDoc = await UserModel.findById(user._id).select('+refreshTokens');
        if (userDoc) {
          userDoc.refreshTokens = userDoc.refreshTokens.filter(token => token !== refreshToken);
          await userDoc.save();
        }
      }

      res.json({
        success: true,
        message: 'Logout successful'
      } as ApiResponse);
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      } as ApiResponse);
    }
  }

  // Verify email
  static async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      const user = await UserModel.findOne({
        emailVerificationToken: token
      }).select('+emailVerificationToken');

      if (!user) {
        res.status(400).json({
          success: false,
          message: 'Invalid verification token'
        } as ApiResponse);
        return;
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      await user.save();

      logger.info(`Email verified for user: ${user.email}`);

      res.json({
        success: true,
        message: 'Email verified successfully'
      } as ApiResponse);
    } catch (error) {
      logger.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Email verification failed'
      } as ApiResponse);
    }
  }

  // Request password reset
  static async requestPasswordReset(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        // Don't reveal if email exists or not
        res.json({
          success: true,
          message: 'If the email exists, a password reset link has been sent'
        } as ApiResponse);
        return;
      }

      const resetToken = user.generatePasswordResetToken();
      await user.save();

      try {
        await emailService.sendPasswordReset(email, resetToken, user.username);
      } catch (emailError) {
        logger.error('Password reset email failed:', emailError);
        res.status(500).json({
          success: false,
          message: 'Failed to send password reset email'
        } as ApiResponse);
        return;
      }

      logger.info(`Password reset requested for: ${email}`);

      res.json({
        success: true,
        message: 'Password reset link sent to your email'
      } as ApiResponse);
    } catch (error) {
      logger.error('Password reset request error:', error);
      res.status(500).json({
        success: false,
        message: 'Password reset request failed'
      } as ApiResponse);
    }
  }

  // Reset password
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      const user = await UserModel.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
      }).select('+passwordResetToken +passwordResetExpires +refreshTokens');

      if (!user) {
        res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        } as ApiResponse);
        return;
      }

      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.refreshTokens = []; // Invalidate all refresh tokens
      await user.save();

      logger.info(`Password reset completed for: ${user.email}`);

      res.json({
        success: true,
        message: 'Password reset successfully'
      } as ApiResponse);
    } catch (error) {
      logger.error('Password reset error:', error);
      res.status(500).json({
        success: false,
        message: 'Password reset failed'
      } as ApiResponse);
    }
  }

  // Get current user profile
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user;

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        } as ApiResponse);
        return;
      }

      // Get full user data from database
      const fullUser = await UserModel.findById(user._id);
      
      if (!fullUser) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          lastLogin: fullUser.lastLogin,
          createdAt: fullUser.createdAt
        }
      } as ApiResponse);
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile'
      } as ApiResponse);
    }
  }
}
