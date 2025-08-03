@echo off
REM Azure Web App Deployment Script for Backend (Windows)
echo 🚀 Starting Azure Web App deployment preparation...

REM Check if we're in the backend directory
if not exist "package.json" (
    echo ❌ Error: This script must be run from the backend directory
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm ci --only=production
if errorlevel 1 (
    echo ❌ Error: Failed to install dependencies
    exit /b 1
)

REM Build the application
echo 🔨 Building application...
call npm run build
if errorlevel 1 (
    echo ❌ Error: Build failed
    exit /b 1
)

REM Check if build was successful
if not exist "dist" (
    echo ❌ Error: Build failed - dist directory not found
    exit /b 1
)

echo ✅ Build completed successfully!
echo 📋 Deployment checklist:
echo 1. Upload the entire backend folder to Azure Web App
echo 2. Set environment variables in Azure Portal:
echo    - NODE_ENV=production
echo    - WEBSITES_PORT=8080
echo    - MONGODB_URI=your_mongodb_atlas_connection_string
echo    - JWT_SECRET=your_generated_secret
echo    - JWT_REFRESH_SECRET=your_generated_refresh_secret
echo    - SESSION_SECRET=your_generated_session_secret
echo    - EMAIL_USER=your_email@gmail.com
echo    - EMAIL_PASS=your_gmail_app_password
echo    - FRONTEND_URL=https://your-app.vercel.app
echo    - CORS_ORIGIN=https://your-app.vercel.app
echo 3. Enable 'Always On' in Azure Web App settings
echo 4. Set Node.js version to 18.x in Azure Portal

echo 🎉 Ready for Azure deployment!
