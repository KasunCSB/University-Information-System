#!/bin/bash

# Azure Web App Deployment Script for Backend
echo "🚀 Starting Azure Web App deployment preparation..."

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: This script must be run from the backend directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📋 Deployment checklist:"
echo "1. Upload the entire backend folder to Azure Web App"
echo "2. Set environment variables in Azure Portal:"
echo "   - NODE_ENV=production"
echo "   - WEBSITES_PORT=8080"
echo "   - MONGODB_URI=your_mongodb_atlas_connection_string"
echo "   - JWT_SECRET=your_generated_secret"
echo "   - JWT_REFRESH_SECRET=your_generated_refresh_secret"
echo "   - SESSION_SECRET=your_generated_session_secret"
echo "   - EMAIL_USER=your_email@gmail.com"
echo "   - EMAIL_PASS=your_gmail_app_password"
echo "   - FRONTEND_URL=https://your-app.vercel.app"
echo "   - CORS_ORIGIN=https://your-app.vercel.app"
echo "3. Enable 'Always On' in Azure Web App settings"
echo "4. Set Node.js version to 18.x in Azure Portal"

echo "🎉 Ready for Azure deployment!"
