import dotenv from 'dotenv';

dotenv.config();

interface Config {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRE: string;
  JWT_REFRESH_EXPIRE: string;
  SESSION_SECRET: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  EMAIL_FROM: string;
  FRONTEND_URL: string;
  CORS_ORIGIN: string;
  REDIS_URL?: string;
}

const config: Config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || process.env.WEBSITES_PORT || '3001', 10),
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '15m',
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '7d',
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@localhost',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  CORS_ORIGIN: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000',
  REDIS_URL: process.env.REDIS_URL
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

// Enhanced production validation
if (config.NODE_ENV === 'production') {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  });

  // Additional production-specific validations
  const productionRequiredVars = ['EMAIL_USER', 'EMAIL_PASS', 'FRONTEND_URL'];
  const missingOptionalVars: string[] = [];
  
  productionRequiredVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingOptionalVars.push(envVar);
    }
  });

  if (missingOptionalVars.length > 0) {
    // Use logger instead of console in production
    const message = `Warning: Missing optional environment variables: ${missingOptionalVars.join(', ')}. Some features may not work properly.`;
    if (typeof process !== 'undefined' && process.stderr) {
      process.stderr.write(`⚠️ ${message}\n`);
    }
  }

  // Validate URLs
  if (config.FRONTEND_URL && config.FRONTEND_URL.includes('localhost')) {
    const message = 'Warning: FRONTEND_URL still contains localhost in production';
    if (typeof process !== 'undefined' && process.stderr) {
      process.stderr.write(`⚠️ ${message}\n`);
    }
  }

  // Validate secrets are changed from defaults
  if (config.JWT_SECRET === 'your-super-secret-jwt-key-change-in-production') {
    throw new Error('JWT_SECRET must be changed from default value in production');
  }

  if (config.SESSION_SECRET === 'your-session-secret-change-in-production') {
    throw new Error('SESSION_SECRET must be changed from default value in production');
  }
} else {
  // Development validation
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar] && config.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  });
}

export default config;
