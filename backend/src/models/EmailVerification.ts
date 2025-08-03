import mongoose, { Schema, Document } from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/config.js';
import logger from '../config/logger.js';

interface EmailVerificationDocument extends Document {
  email: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  generateToken(): string;
}

const emailVerificationSchema = new Schema<EmailVerificationDocument>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
    },
    token: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 } // Auto-delete expired documents
    },
    isUsed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Generate verification token (JWT)
emailVerificationSchema.methods.generateToken = function(): string {
  try {
    // Generate a secure JWT token with proper imports
    const now = Math.floor(Date.now() / 1000);
    const expiration = now + (24 * 60 * 60); // 24 hours for better UX
    
    const payload = {
      email: this.email,
      type: 'email_verification',
      purpose: 'account_creation',
      iat: now,
      exp: expiration,
      jti: crypto.randomBytes(16).toString('hex') // Unique token ID
    };
    
    const token = jwt.sign(payload, config.JWT_SECRET, {
      issuer: 'uis-backend',
      audience: 'uis-frontend'
    });
    
    if (!token) {
      throw new Error('Failed to generate valid verification token');
    }
    
    this.token = token;
    this.expiresAt = new Date(expiration * 1000); // Convert to milliseconds
    
    logger.info(`Generated email verification JWT token for ${this.email} (expires: ${this.expiresAt.toISOString()})`);
    
    return token;
  } catch (error) {
    logger.error('JWT token generation failed:', error);
    throw new Error(`Token generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Indexes
emailVerificationSchema.index({ email: 1 });
emailVerificationSchema.index({ token: 1 });

const EmailVerificationModel = mongoose.model<EmailVerificationDocument>('EmailVerification', emailVerificationSchema);

export default EmailVerificationModel;
