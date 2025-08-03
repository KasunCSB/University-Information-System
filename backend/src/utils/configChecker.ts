#!/usr/bin/env node

/**
 * University Information System - Startup Configuration Checker
 * This script validates all necessary environment variables and configurations
 * before starting the application.
 */

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

interface ConfigCheck {
  name: string;
  required: boolean;
  check: () => boolean | Promise<boolean>;
  message: string;
  value?: string;
}

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'EMAIL_USER',
  'EMAIL_PASS'
];

const optionalEnvVars = [
  'NODE_ENV',
  'PORT',
  'FRONTEND_URL',
  'SESSION_SECRET'
];

async function checkConfiguration(): Promise<void> {
  console.log('🚀 Starting University Information System Configuration Check...\n');

  const checks: ConfigCheck[] = [
    {
      name: 'Environment Variables',
      required: true,
      check: () => {
        const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
        if (missing.length > 0) {
          console.log(`❌ Missing required environment variables: ${missing.join(', ')}`);
          return false;
        }
        console.log('✅ All required environment variables are set');
        return true;
      },
      message: 'Check that all required environment variables are set in .env file'
    },
    {
      name: 'JWT Secret Security',
      required: true,
      check: () => {
        const jwtSecret = process.env.JWT_SECRET || '';
        const refreshSecret = process.env.JWT_REFRESH_SECRET || '';
        
        if (jwtSecret.length < 32) {
          console.log('❌ JWT_SECRET should be at least 32 characters long');
          return false;
        }
        
        if (refreshSecret.length < 32) {
          console.log('❌ JWT_REFRESH_SECRET should be at least 32 characters long');
          return false;
        }
        
        if (jwtSecret === refreshSecret) {
          console.log('❌ JWT_SECRET and JWT_REFRESH_SECRET should be different');
          return false;
        }
        
        console.log('✅ JWT secrets are secure');
        return true;
      },
      message: 'JWT secrets should be long, random, and different from each other'
    },
    {
      name: 'Database Connection',
      required: true,
      check: async () => {
        try {
          await mongoose.connect(process.env.MONGODB_URI!, {
            serverSelectionTimeoutMS: 5000
          });
          console.log('✅ Database connection successful');
          await mongoose.disconnect();
          return true;
        } catch (error) {
          console.log('❌ Database connection failed:', error instanceof Error ? error.message : error);
          return false;
        }
      },
      message: 'Ensure MongoDB is running and MONGODB_URI is correct'
    },
    {
      name: 'Email Configuration',
      required: true,
      check: async () => {
        try {
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });
          
          await transporter.verify();
          console.log('✅ Email configuration is valid');
          return true;
        } catch (error) {
          console.log('❌ Email configuration failed:', error instanceof Error ? error.message : error);
          return false;
        }
      },
      message: 'Check EMAIL_USER and EMAIL_PASS (use app-specific password for Gmail)'
    },
    {
      name: 'Directory Structure',
      required: true,
      check: () => {
        const requiredDirs = ['logs', 'uploads'];
        let allExist = true;
        
        for (const dir of requiredDirs) {
          const dirPath = path.join(process.cwd(), dir);
          if (!fs.existsSync(dirPath)) {
            try {
              fs.mkdirSync(dirPath, { recursive: true });
              console.log(`📁 Created directory: ${dir}`);
            } catch (error) {
              console.log(`❌ Failed to create directory ${dir}:`, error);
              allExist = false;
            }
          }
        }
        
        if (allExist) {
          console.log('✅ Directory structure is valid');
        }
        
        return allExist;
      },
      message: 'Required directories should exist or be creatable'
    },
    {
      name: 'Production Security',
      required: false,
      check: () => {
        if (process.env.NODE_ENV === 'production') {
          const issues = [];
          
          if (process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-in-production') {
            issues.push('JWT_SECRET is using default value');
          }
          
          if (process.env.SESSION_SECRET === 'your-session-secret-change-in-production') {
            issues.push('SESSION_SECRET is using default value');
          }
          
          if (!process.env.FRONTEND_URL || process.env.FRONTEND_URL.includes('localhost')) {
            issues.push('FRONTEND_URL should be set to production domain');
          }
          
          if (issues.length > 0) {
            console.log('⚠️  Production security issues:', issues.join(', '));
            return false;
          }
        }
        
        console.log('✅ Production security check passed');
        return true;
      },
      message: 'In production, ensure all secrets are changed from defaults'
    }
  ];

  let allRequired = true;
  let warningCount = 0;

  for (const check of checks) {
    try {
      const result = await check.check();
      if (!result) {
        if (check.required) {
          allRequired = false;
          console.log(`💡 ${check.message}\n`);
        } else {
          warningCount++;
          console.log(`💡 ${check.message}\n`);
        }
      }
    } catch (error) {
      console.log(`❌ ${check.name} check failed:`, error);
      if (check.required) {
        allRequired = false;
      } else {
        warningCount++;
      }
      console.log(`💡 ${check.message}\n`);
    }
  }

  console.log('='.repeat(50));
  
  if (allRequired) {
    console.log('🎉 Configuration check passed!');
    if (warningCount > 0) {
      console.log(`⚠️  ${warningCount} warnings - see above for details`);
    }
    console.log('✅ Ready to start the University Information System\n');
    process.exit(0);
  } else {
    console.log('❌ Configuration check failed!');
    console.log('🔧 Please fix the issues above before starting the application\n');
    process.exit(1);
  }
}

// Run the configuration check
checkConfiguration().catch(error => {
  console.error('Fatal error during configuration check:', error);
  process.exit(1);
});
