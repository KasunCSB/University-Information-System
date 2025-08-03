@echo off
REM Windows Deployment Guide for University Information System

echo 🚀 University Information System - Updated Deployment Guide
echo ==========================================================
echo.

REM Step 1: Pre-deployment checks
echo 📋 Step 1: Pre-deployment Verification
echo ======================================

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
) else (
    echo ✅ Docker is running
)

REM Check if Azure CLI is available
az --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Azure CLI not found. Install it for Azure deployment
) else (
    echo ✅ Azure CLI is available
    REM Check if logged in
    az account show >nul 2>&1
    if errorlevel 1 (
        echo ⚠️  Not logged into Azure. Run 'az login' for Azure deployment
    ) else (
        echo ✅ Logged into Azure
    )
)

echo.

REM Step 2: Build and test locally first
echo 🔨 Step 2: Local Build and Test
echo ===============================
echo Building and testing the application locally before deployment...

REM Build the backend
echo Building backend...
cd backend
call npm run build
if errorlevel 1 (
    echo ❌ Backend build failed. Fix errors before deploying.
    pause
    exit /b 1
) else (
    echo ✅ Backend build successful
)
cd ..

REM Build the frontend
echo Building frontend...
call npm run build
if errorlevel 1 (
    echo ❌ Frontend build failed. Fix errors before deploying.
    pause
    exit /b 1
) else (
    echo ✅ Frontend build successful
)

echo.

REM Step 3: Local Docker deployment
echo 🐳 Step 3: Local Docker Deployment Test
echo =======================================
echo Testing with Docker Compose...

REM Stop any existing containers
docker-compose down

REM Build and start with updated configuration
docker-compose up --build -d
if errorlevel 1 (
    echo ❌ Local Docker deployment failed
    echo 📝 Check logs with: docker-compose logs
    pause
    exit /b 1
) else (
    echo ✅ Local Docker deployment successful
    echo 🌐 Frontend: http://localhost:3000
    echo 🔌 Backend: http://localhost:3001
    echo 📊 Backend Health: http://localhost:3001/health
    echo 🧪 Backend API: http://localhost:3001/api
    echo.
    echo ⏳ Waiting 30 seconds for services to start...
    timeout /t 30 /nobreak >nul
    
    REM Test the deployment
    echo 🧪 Testing local deployment...
    curl -f http://localhost:3001/health >nul 2>&1
    if errorlevel 1 (
        echo ❌ Backend health check failed
        echo 📝 Check logs with: docker-compose logs backend
    ) else (
        echo ✅ Backend health check passed
    )
    
    curl -f http://localhost:3000 >nul 2>&1
    if errorlevel 1 (
        echo ❌ Frontend is not responding
        echo 📝 Check logs with: docker-compose logs frontend
    ) else (
        echo ✅ Frontend is responding
    )
)

echo.
echo 🎯 Next Steps:
echo ==============
echo 1. Test the local deployment at http://localhost:3000
echo 2. If everything works, proceed with Azure deployment
echo 3. Stop local containers: docker-compose down
echo.
pause

echo.

REM Step 4: Azure deployment
echo ☁️  Step 4: Azure Deployment
echo ============================

REM Stop local containers
docker-compose down

echo Running comprehensive Azure fix...
if exist "comprehensive-fix.bat" (
    call comprehensive-fix.bat
) else (
    echo ⚠️  comprehensive-fix.bat not found. Using manual deployment...
    
    REM Manual Azure deployment steps
    echo Manual Azure Configuration:
    echo ==========================
    
    set RESOURCE_GROUP=uis-rg
    set BACKEND_APP=uis-backend-app
    set FRONTEND_APP=lk-uis
    
    echo Updating backend configuration...
    az webapp config appsettings set ^
        --name %BACKEND_APP% ^
        --resource-group %RESOURCE_GROUP% ^
        --settings ^
        NODE_ENV=production ^
        PORT=80 ^
        WEBSITES_PORT=3001 ^
        MONGODB_URI="mongodb+srv://kasuncamushan123:Kasun%%401234@cluster0.iuj7a.mongodb.net/university_system?retryWrites=true&w=majority" ^
        JWT_SECRET="super-secret-jwt-key-production-2024" ^
        JWT_REFRESH_SECRET="super-secret-refresh-key-production-2024" ^
        SESSION_SECRET="super-secret-session-key-production-2024" ^
        EMAIL_USER="noreply.lk.uis@gmail.com" ^
        EMAIL_PASS="your-app-password-here" ^
        EMAIL_FROM="University System <noreply.lk.uis@gmail.com>" ^
        FRONTEND_URL="https://%FRONTEND_APP%.azurewebsites.net" ^
        CORS_ORIGIN="https://%FRONTEND_APP%.azurewebsites.net"
    
    echo Updating frontend configuration...
    az webapp config appsettings set ^
        --name %FRONTEND_APP% ^
        --resource-group %RESOURCE_GROUP% ^
        --settings ^
        NODE_ENV=production ^
        PORT=80 ^
        WEBSITES_PORT=3000 ^
        NEXT_PUBLIC_API_URL="https://%BACKEND_APP%.azurewebsites.net/api"
    
    echo Restarting applications...
    az webapp restart --name %BACKEND_APP% --resource-group %RESOURCE_GROUP%
    az webapp restart --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP%
)

echo.
echo 🎉 Deployment Complete!
echo ======================
echo.
echo 📱 Your Applications:
echo    Frontend:  https://lk-uis.azurewebsites.net
echo    Backend:   https://uis-backend-app.azurewebsites.net
echo    API Base:  https://uis-backend-app.azurewebsites.net/api
echo.
echo 🧪 Test URLs:
echo    Health:    https://uis-backend-app.azurewebsites.net/health
echo    Auth API:  https://uis-backend-app.azurewebsites.net/api/auth/send-verification
echo.
echo 📝 Troubleshooting:
echo    - If apps are slow to start, wait 2-3 minutes
echo    - Check Azure portal for detailed logs
echo    - Run: az webapp log tail --name uis-backend-app --resource-group uis-rg
echo.
pause
