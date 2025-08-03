#!/usr/bin/env node

import crypto from 'crypto';

console.log('🔐 Production Secrets Generator');
console.log('================================\n');

// Generate secrets
const jwtSecret = crypto.randomBytes(64).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');
const sessionSecret = crypto.randomBytes(32).toString('hex');

console.log('Add these to your Azure Web App Configuration:\n');

console.log('Environment Variables for Azure Web App:');
console.log('========================================');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`);
console.log(`SESSION_SECRET=${sessionSecret}`);

console.log('\n📋 Other required environment variables:');
console.log('========================================');
console.log('NODE_ENV=production');
console.log('WEBSITES_PORT=8080');
console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/university_system?retryWrites=true&w=majority');
console.log('EMAIL_USER=your_email@gmail.com');
console.log('EMAIL_PASS=your_16_character_gmail_app_password');
console.log('EMAIL_FROM=University System <noreply@yourdomain.com>');
console.log('FRONTEND_URL=https://your-app.vercel.app');
console.log('CORS_ORIGIN=https://your-app.vercel.app');

console.log('\n⚠️  Important Security Notes:');
console.log('============================');
console.log('1. Never commit these secrets to version control');
console.log('2. Store them securely in Azure Key Vault or App Configuration');
console.log('3. Use different secrets for different environments');
console.log('4. Rotate secrets regularly');
console.log('5. Use Azure Managed Identity when possible');

console.log('\n🔒 For Vercel Frontend:');
console.log('=======================');
console.log('NEXT_PUBLIC_API_URL=https://your-backend-app.azurewebsites.net/api');

console.log('\n✅ Setup Complete!');
console.log('Copy these values to your deployment platforms.');
