import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../types/auth.js';
import logger from '../config/logger.js';

interface UserDocument extends Omit<User, '_id'>, Document {
  comparePassword(password: string): Promise<boolean>;
  generateEmailVerificationToken(): string;
  generatePasswordResetToken(): string;
  incLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  isLocked: boolean;
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [50, 'Username cannot be longer than 50 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
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
      select: false // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student'
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: {
      type: String,
      select: false
    },
    emailVerificationExpires: {
      type: Date,
      select: false
    },
    passwordResetToken: {
      type: String,
      select: false
    },
    passwordResetExpires: {
      type: Date,
      select: false
    },
    refreshTokens: {
      type: [String],
      default: [],
      select: false
    },
    lastLogin: {
      type: Date
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date
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
        delete ret.refreshTokens;
        delete ret.emailVerificationToken;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        return ret;
      }
    }
  }
);

// Index for faster queries (email and username already have unique indexes)
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function(): string {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    
    if (!token || token.length !== 64) {
      throw new Error('Failed to generate valid email verification token');
    }
    
    this.emailVerificationToken = token;
    const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    this.emailVerificationExpires = expirationDate;
    
    // Add logging to debug token generation
    logger.info(`Generated email verification token for ${this.email}`);
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

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function(): string {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = token;
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Validate token generation
    if (!token || token.length !== 64) {
      throw new Error('Failed to generate valid password reset token');
    }
    
    return token;
  } catch (error) {
    throw new Error(`Password reset token generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Account lockout methods
userSchema.methods.incLoginAttempts = async function(): Promise<void> {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < new Date()) {
    await this.updateOne({
      $set: {
        loginAttempts: 1
      },
      $unset: {
        lockUntil: 1
      }
    });
    return;
  }
  
  const updates: Record<string, unknown> = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 30 minutes
  if (this.loginAttempts + 1 >= 5 && !this.lockUntil) {
    updates.$set = { lockUntil: new Date(Date.now() + 30 * 60 * 1000) }; // 30 minutes
  }
  
  await this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  await this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1
    }
  });
};

userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
