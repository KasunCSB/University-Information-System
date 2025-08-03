export interface User {
  _id?: string;
  username: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens: string[];
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  loginAttempts?: number;
  lockUntil?: Date;
}

// Type for user attached to request (can be either interface or document)
export interface AuthenticatedUser {
  _id: string;
  username: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  isEmailVerified: boolean;
  lastLogin?: Date;
  createdAt?: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  requiresEmailVerification?: boolean;
  userEmail?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
