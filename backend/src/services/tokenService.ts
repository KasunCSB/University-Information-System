import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/config.js';
import { JWTPayload, RefreshTokenPayload } from '../types/auth.js';

export class TokenService {
  static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRE,
      issuer: 'uis-backend',
      audience: 'uis-frontend'
    } as SignOptions);
  }

  static generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRE,
      issuer: 'uis-backend',
      audience: 'uis-frontend'
    } as SignOptions);
  }

  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.JWT_SECRET, {
        issuer: 'uis-backend',
        audience: 'uis-frontend'
      }) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  static verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      return jwt.verify(token, config.JWT_REFRESH_SECRET, {
        issuer: 'uis-backend',
        audience: 'uis-frontend'
      }) as RefreshTokenPayload;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static generateRandomToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static generateTokenId(): string {
    return crypto.randomUUID();
  }
}

export default TokenService;
