import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/config.js';
import logger from '../config/logger.js';
import { JWTPayload, RefreshTokenPayload } from '../types/auth.js';
import tokenBlacklistService from './tokenBlacklistService.js';

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

  static async verifyAccessTokenWithBlacklist(token: string): Promise<JWTPayload> {
    try {
      // Check if token is blacklisted first
      const isBlacklisted = await tokenBlacklistService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new Error('Token has been invalidated');
      }

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

  static async blacklistToken(token: string, reason?: string): Promise<void> {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      if (decoded && decoded.exp) {
        await tokenBlacklistService.blacklistToken(token, decoded.exp * 1000, reason);
      } else {
        // If we can't decode the token, we can't blacklist it properly
        // But we should still try to blacklist it with a reasonable expiration
        await tokenBlacklistService.blacklistToken(token, Date.now() + 24 * 60 * 60 * 1000, reason);
      }
    } catch (error) {
      logger.error('Error blacklisting token:', error);
      // Fallback: try to blacklist with default expiration
      await tokenBlacklistService.blacklistToken(token, Date.now() + 24 * 60 * 60 * 1000, reason || 'Token invalidation failed');
    }
  }
}

export default TokenService;
