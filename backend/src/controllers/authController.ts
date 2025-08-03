import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';
import EmailVerificationModel from '../models/EmailVerification.js';
import { TokenService } from '../services/tokenService.js';
import emailService from '../services/emailService.js';
import config from '../config/config.js';
import logger from '../config/logger.js';
import { AuthResponse, ApiResponse } from '../types/auth.js';

export class AuthController {
  // Step 1: Send verification email to the provided email
  static async sendVerificationEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email || typeof email !== 'string' || email.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Email address is required'
        } as ApiResponse);
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email: normalizedEmail });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please try logging in.'
        } as ApiResponse);
        return;
      }

      // Check for recent verification attempts (prevent spam)
      const recentVerification = await EmailVerificationModel.findOne({
        email: normalizedEmail,
        createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) } // 5 minutes ago
      });

      if (recentVerification && !recentVerification.isUsed) {
        res.status(429).json({
          success: false,
          message: 'Please wait 5 minutes before requesting another verification email.'
        } as ApiResponse);
        return;
      }

      // Create email verification record
      const emailVerification = new EmailVerificationModel({ email: normalizedEmail });
      const token = emailVerification.generateToken();
      await emailVerification.save();

      // Send verification email
      try {
        await emailService.sendEmailVerification(normalizedEmail, token, 'User');
        logger.info(`Verification email sent to: ${normalizedEmail}`);

        res.json({
          success: true,
          message: 'Verification email sent! Please check your inbox and click the verification link to continue.'
        } as ApiResponse);
      } catch (emailError) {
        logger.error('Failed to send verification email:', emailError);
        // Clean up the verification record if email fails
        await EmailVerificationModel.findByIdAndDelete(emailVerification._id);
        
        res.status(500).json({
          success: false,
          message: 'Failed to send verification email. Please try again.'
        } as ApiResponse);
      }
    } catch (error) {
      logger.error('Send verification email error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      } as ApiResponse);
    }
  }

  // Step 2: Verify email token and return email for registration form
  static async verifyEmailToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      if (!token || typeof token !== 'string' || token.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Verification token is required'
        } as ApiResponse);
        return;
      }

      // Verify JWT token format and validity
      let decodedToken;
      try {
        decodedToken = jwt.verify(token.trim(), config.JWT_SECRET) as { 
          email: string; 
          type: string; 
          exp: number; 
          iat: number 
        };
      } catch (jwtError) {
        logger.error('JWT verification failed:', jwtError);
        res.status(400).json({
          success: false,
          message: 'Invalid or malformed verification token. Please request a new verification email.'
        } as ApiResponse);
        return;
      }

      // Verify token type and expiration
      if (decodedToken.type !== 'email_verification') {
        res.status(400).json({
          success: false,
          message: 'Invalid token type. Please use an email verification token.'
        } as ApiResponse);
        return;
      }

      if (decodedToken.exp * 1000 < Date.now()) {
        res.status(400).json({
          success: false,
          message: 'Verification token has expired. Please request a new verification email.'
        } as ApiResponse);
        return;
      }

      // Find and validate the token in database
      const emailVerification = await EmailVerificationModel.findOne({ 
        token: token.trim(),
        email: decodedToken.email,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });

      if (!emailVerification) {
        res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token. Please request a new verification email.'
        } as ApiResponse);
        return;
      }

      // Check if user was created while token was valid
      const existingUser = await UserModel.findOne({ email: emailVerification.email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please try logging in.'
        } as ApiResponse);
        return;
      }

      logger.info(`Email token verified for: ${emailVerification.email} (expires: ${emailVerification.expiresAt.toISOString()})`);

      res.json({
        success: true,
        message: 'Email verified successfully! Please complete your registration.',
        data: {
          email: emailVerification.email,
          token: token.trim(), // Return token for Step 3
          expiresAt: emailVerification.expiresAt.toISOString()
        }
      } as ApiResponse);
    } catch (error) {
      logger.error('Verify email token error:', error);
      res.status(500).json({
        success: false,
        message: 'Email verification failed'
      } as ApiResponse);
    }
  }

  // Email link verification (compatibility for email links)
  static async verifyEmailFromLink(req: Request, res: Response): Promise<void> {
    try {
      // Token can come from query parameter (GET) or request body (POST)
      const token = req.query.token as string || req.body.token;

      if (!token || typeof token !== 'string' || token.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Verification token is required'
        } as ApiResponse);
        return;
      }

      // Find and validate the token
      const emailVerification = await EmailVerificationModel.findOne({ 
        token: token.trim(),
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });

      if (!emailVerification) {
        res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token. Please request a new verification email.'
        } as ApiResponse);
        return;
      }

      // Check if user was created while token was valid
      const existingUser = await UserModel.findOne({ email: emailVerification.email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please try logging in.'
        } as ApiResponse);
        return;
      }

      logger.info(`Email link verification successful for: ${emailVerification.email}`);

      res.json({
        success: true,
        message: 'Email verified successfully! You can now complete your registration.',
        data: {
          email: emailVerification.email,
          token: token.trim(),
          verified: true
        }
      } as ApiResponse);
    } catch (error) {
      logger.error('Email link verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Email verification failed'
      } as ApiResponse);
    }
  }

  // Step 3: Complete registration with username and password
  static async completeRegistration(req: Request, res: Response): Promise<void> {
    try {
      const { token, username, password, role = 'student' } = req.body;

      if (!token || !username || !password) {
        res.status(400).json({
          success: false,
          message: 'Token, username, and password are required'
        } as ApiResponse);
        return;
      }

      // Verify JWT token format and validity
      let decodedToken;
      try {
        decodedToken = jwt.verify(token.trim(), config.JWT_SECRET) as { 
          email: string; 
          type: string; 
          exp: number; 
          iat: number 
        };
      } catch (jwtError) {
        logger.error('JWT verification failed during registration:', jwtError);
        res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token. Please start the registration process again.'
        } as ApiResponse);
        return;
      }

      // Verify token type and expiration
      if (decodedToken.type !== 'email_verification') {
        res.status(400).json({
          success: false,
          message: 'Invalid token type. Please use an email verification token.'
        } as ApiResponse);
        return;
      }

      if (decodedToken.exp * 1000 < Date.now()) {
        res.status(400).json({
          success: false,
          message: 'Verification token has expired. Please request a new verification email.'
        } as ApiResponse);
        return;
      }

      // Find and validate the token in database
      const emailVerification = await EmailVerificationModel.findOne({ 
        token: token.trim(),
        email: decodedToken.email,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });

      if (!emailVerification) {
        res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token. Please start the registration process again.'
        } as ApiResponse);
        return;
      }

      // Check if username is already taken
      const existingUsername = await UserModel.findOne({ username: username.trim() });
      if (existingUsername) {
        res.status(400).json({
          success: false,
          message: 'This username is already taken. Please choose a different username.'
        } as ApiResponse);
        return;
      }

      // Check if email is already registered (double-check)
      const existingEmail = await UserModel.findOne({ email: emailVerification.email });
      if (existingEmail) {
        res.status(400).json({
          success: false,
          message: 'An account with this email already exists.'
        } as ApiResponse);
        return;
      }

      // Create the user account
      const user = new UserModel({
        username: username.trim(),
        email: emailVerification.email,
        password: password,
        role: role,
        isEmailVerified: true // Email is already verified
      });

      await user.save();

      // Mark the token as used
      emailVerification.isUsed = true;
      await emailVerification.save();

      logger.info(`User account created successfully: ${user.email} (username: ${user.username})`);

      res.status(201).json({
        success: true,
        message: 'Account created successfully! You can now log in.',
        user: {
          id: user._id!.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      } as AuthResponse);
    } catch (error) {
      logger.error('Complete registration error:', error);
      
      // Handle specific errors
      if (error instanceof Error) {
        if (error.message.includes('duplicate key') || error.message.includes('E11000')) {
          res.status(400).json({
            success: false,
            message: 'An account with this email or username already exists.'
          } as ApiResponse);
          return;
        }
      }
      
      res.status(500).json({
        success: false,
        message: 'Registration failed. Please try again.'
      } as ApiResponse);
    }
  }

  // Login user
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user by email or username
      const user = await UserModel.findOne({
        $or: [{ email }, { username: email }]
      }).select('+password +refreshTokens +loginAttempts +lockUntil');

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        } as AuthResponse);
        return;
      }

      // Check if account is locked
      if (user.lockUntil && user.lockUntil > new Date()) {
        res.status(423).json({
          success: false,
          message: 'Account temporarily locked due to too many failed login attempts. Please try again later.'
        } as AuthResponse);
        return;
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        // Increment login attempts
        await user.incLoginAttempts();
        
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        } as AuthResponse);
        return;
      }

      // Check if email is verified
      if (!user.isEmailVerified) {
        res.status(403).json({
          success: false,
          message: 'Email verification required. Please check your email and verify your account before logging in.',
          requiresEmailVerification: true,
          userEmail: user.email
        } as AuthResponse);
        return;
      }

      // Reset login attempts on successful login
      if (user.loginAttempts && user.loginAttempts > 0) {
        await user.resetLoginAttempts();
      }

      // Generate tokens
      const tokenId = TokenService.generateTokenId();
      const accessToken = TokenService.generateAccessToken({
        userId: user._id!.toString(),
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
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

      if (!refreshToken || typeof refreshToken !== 'string') {
        res.status(401).json({
          success: false,
          message: 'Refresh token is required'
        } as ApiResponse);
        return;
      }

      let decoded;
      try {
        decoded = TokenService.verifyRefreshToken(refreshToken);
      } catch (tokenError) {
        res.status(401).json({
          success: false,
          message: 'Invalid or expired refresh token'
        } as ApiResponse);
        return;
      }

      const user = await UserModel.findById(decoded.userId).select('+refreshTokens');

      if (!user || !user.refreshTokens.includes(refreshToken)) {
        res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        } as ApiResponse);
        return;
      }

      // Generate new tokens with current user data (including updated email verification status)
      const newTokenId = TokenService.generateTokenId();
      const newAccessToken = TokenService.generateAccessToken({
        userId: user._id!.toString(),
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified // Use current verification status from DB
      });
      const newRefreshToken = TokenService.generateRefreshToken({
        userId: user._id!.toString(),
        tokenId: newTokenId
      });

      // Replace old refresh token with new one
      user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
      user.refreshTokens.push(newRefreshToken);
      await user.save();

      // Blacklist the old refresh token
      await TokenService.blacklistToken(refreshToken);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        user: {
          id: user._id!.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      } as AuthResponse);
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
      const authHeader = req.headers.authorization;
      const accessToken = authHeader && authHeader.split(' ')[1];

      // Handle token blacklisting and database updates concurrently
      const blacklistPromises: Promise<void>[] = [];
      
      // Blacklist the access token
      if (accessToken) {
        blacklistPromises.push(TokenService.blacklistToken(accessToken));
      }

      // Blacklist the refresh token if provided
      if (refreshToken) {
        blacklistPromises.push(TokenService.blacklistToken(refreshToken));
      }

      // Remove refresh token from user's token list
      let dbUpdatePromise: Promise<void> = Promise.resolve();
      if (refreshToken && user) {
        dbUpdatePromise = (async () => {
          const userDoc = await UserModel.findById(user._id).select('+refreshTokens');
          if (userDoc) {
            userDoc.refreshTokens = userDoc.refreshTokens.filter(token => token !== refreshToken);
            await userDoc.save();
          }
        })();
      }

      // Wait for all operations to complete
      await Promise.all([...blacklistPromises, dbUpdatePromise]);

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

  // Request password reset
  static async requestPasswordReset(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      logger.info(`Password reset requested for email: ${email}`);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        } as ApiResponse);
        return;
      }

      const user = await UserModel.findOne({ email });
      
      if (!user) {
        // Don't reveal if email exists or not for security
        res.json({
          success: true,
          message: 'If the email exists, a password reset link has been sent'
        } as ApiResponse);
        return;
      }

      // Generate password reset token
      const resetToken = user.generatePasswordResetToken();
      await user.save();

      // Send password reset email
      try {
        await emailService.sendPasswordReset(email, resetToken, user.username);
        logger.info(`Password reset email sent successfully to: ${email}`);
        
        res.json({
          success: true,
          message: 'Password reset link sent to your email'
        } as ApiResponse);
      } catch (emailError) {
        logger.error(`Password reset email failed for: ${email}`, emailError);
        
        // Clear the reset token since email failed
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        
        res.status(500).json({
          success: false,
          message: 'Failed to send password reset email. Please try again later.'
        } as ApiResponse);
      }
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

      // Send notification email about password change
      try {
        await emailService.sendPasswordChangeNotification(user.email, user.username);
      } catch (emailError) {
        logger.error('Failed to send password change notification:', emailError);
        // Don't fail the password reset if notification fails
      }

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
