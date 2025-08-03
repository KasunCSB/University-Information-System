import logger from '../config/logger.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

interface BlacklistedToken {
  token: string;
  expirationTime: number;
  reason?: string;
  timestamp: number;
}

class TokenBlacklistService {
  private memoryBlacklist: Map<string, BlacklistedToken> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired tokens every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredTokens();
    }, 5 * 60 * 1000);

    // Graceful shutdown cleanup
    process.on('SIGINT', () => {
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
      }
    });
  }

  private cleanupExpiredTokens(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [tokenHash, tokenData] of this.memoryBlacklist.entries()) {
      if (tokenData.expirationTime <= now) {
        this.memoryBlacklist.delete(tokenHash);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      logger.info(`Cleaned up ${cleanedCount} expired blacklisted tokens`);
    }
  }

  private hashToken(token: string): string {
    // Use crypto to hash token for storage (don't store full token)
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async blacklistToken(token: string, expirationTime?: number, reason?: string): Promise<void> {
    try {
      // If no expiration provided, decode JWT to get expiration
      let expTime = expirationTime;
      if (!expTime) {
        try {
          const decoded = jwt.decode(token) as { exp?: number };
          expTime = decoded?.exp ? decoded.exp * 1000 : Date.now() + (24 * 60 * 60 * 1000);
        } catch {
          expTime = Date.now() + (24 * 60 * 60 * 1000); // Default 24 hours
        }
      }

      if (expTime > Date.now()) {
        const tokenHash = this.hashToken(token);
        const tokenData: BlacklistedToken = {
          token: tokenHash, // Store hash, not actual token
          expirationTime: expTime,
          reason: reason || 'Token invalidated',
          timestamp: Date.now()
        };
        
        this.memoryBlacklist.set(tokenHash, tokenData);
        logger.info(`Token blacklisted successfully: ${reason || 'Token invalidated'}`);
      }
    } catch (error) {
      logger.error('Failed to blacklist token:', error);
      throw new Error('Failed to blacklist token');
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const tokenHash = this.hashToken(token);
      const tokenData = this.memoryBlacklist.get(tokenHash);
      
      if (!tokenData) {
        return false;
      }
      
      // Check if token has expired
      if (tokenData.expirationTime <= Date.now()) {
        this.memoryBlacklist.delete(tokenHash);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Error checking token blacklist:', error);
      return false; // Fail open for availability
    }
  }

  async getBlacklistStats(): Promise<{ totalTokens: number; memory: string }> {
    return {
      totalTokens: this.memoryBlacklist.size,
      memory: `${Math.round(JSON.stringify([...this.memoryBlacklist.entries()]).length / 1024)} KB`
    };
  }

  async clearExpiredTokens(): Promise<number> {
    const sizeBefore = this.memoryBlacklist.size;
    this.cleanupExpiredTokens();
    return sizeBefore - this.memoryBlacklist.size;
  }

  getBlacklistSize(): number {
    return this.memoryBlacklist.size;
  }

  async cleanup(): Promise<void> {
    this.memoryBlacklist.clear();
    logger.info('Token blacklist cleared');
  }
}

export default new TokenBlacklistService();
