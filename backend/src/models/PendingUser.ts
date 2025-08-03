import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';
import logger from '../config/logger.js';

interface PendingUserDocument extends Document {
  username: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  emailVerificationToken: string;
  emailVerificationExpires: Date;
  createdAt: Date;
  updatedAt: Date;
  generateEmailVerificationToken(): string;
}

const pendingUserSchema = new Schema<PendingUserDocument>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [50, 'Username cannot be longer than 50 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student'
    },
    emailVerificationToken: {
      type: String,
      required: true
    },
    emailVerificationExpires: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 } // Auto-delete expired documents
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(_doc: unknown, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.emailVerificationToken;
        return ret;
      }
    }
  }
);

// Indexes for faster queries and auto-cleanup
pendingUserSchema.index({ emailVerificationToken: 1 });
pendingUserSchema.index({ email: 1 });
pendingUserSchema.index({ username: 1 });

// Hash password before saving
pendingUserSchema.pre('save', async function(next) {
  // Don't hash password for pending users - we'll hash it when creating the actual user
  next();
});

// Generate email verification token
pendingUserSchema.methods.generateEmailVerificationToken = function(): string {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    
    if (!token || token.length !== 64) {
      throw new Error('Failed to generate valid email verification token');
    }
    
    this.emailVerificationToken = token;
    const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    this.emailVerificationExpires = expirationDate;
    
    // Add logging to debug token generation
    logger.info(`Generated email verification token for pending user ${this.email}`);
    logger.info(`Token: ${token.substring(0, 8)}...${token.substring(token.length - 8)}`);
    logger.info(`Current time: ${new Date()}`);
    logger.info(`Expiration time: ${expirationDate}`);
    logger.info(`Time difference (hours): ${(expirationDate.getTime() - Date.now()) / (1000 * 60 * 60)}`);
    
    return token;
  } catch (error) {
    logger.error('Email verification token generation failed:', error);
    throw new Error(`Email verification token generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const PendingUserModel = mongoose.model<PendingUserDocument>('PendingUser', pendingUserSchema);

export default PendingUserModel;
