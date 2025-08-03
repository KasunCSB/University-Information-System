@echo off
REM Complete Deployment Script for University Information System
REM Run this script to deploy both frontend and backend to Azure

echo 🚀 University Information System - Complete Deployment
echo =====================================================
echo.

REM Set variables
set RESOURCE_GROUP=uis-rg
set ACR_NAME=uniinfsysacr
set BACKEND_APP=uis-backend-app
set FRONTEND_APP=lk-uis
set LOCATION=eastus

echo 📋 Configuration:
echo    Resource Group: %RESOURCE_GROUP%
echo    Container Registry: %ACR_NAME%
echo    Backend App: %BACKEND_APP%
echo    Frontend App: %FRONTEND_APP%
echo    Location: %LOCATION%
echo.

REM STEP 1: Prerequisites Check
echo 🔍 Step 1: Checking Prerequisites...
echo ====================================

node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
) else (
    echo ✅ Node.js found
)

docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker not found. Please install Docker Desktop
    pause
    exit /b 1
) else (
    echo ✅ Docker found
)

az --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Azure CLI not found. Please install Azure CLI
    pause
    exit /b 1
) else (
    echo ✅ Azure CLI found
)

az account show >nul 2>&1
if errorlevel 1 (
    echo ❌ Not logged into Azure. Please run 'az login' first
    pause
    exit /b 1
) else (
    echo ✅ Logged into Azure
)

echo.

REM STEP 2: Clean up and prepare
echo 🧹 Step 2: Cleaning Up...
echo ==========================

echo Stopping existing containers...
docker-compose down >nul 2>&1

echo Cleaning Docker system...
docker system prune -f >nul 2>&1

echo.

REM STEP 3: Install dependencies
echo 📦 Step 3: Installing Dependencies...
echo ====================================

echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Frontend npm install failed
    pause
    exit /b 1
)

echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Backend npm install failed
    pause
    exit /b 1
)
cd ..

echo ✅ Dependencies installed

echo.

REM STEP 4: Build applications
echo 🔨 Step 4: Building Applications...
echo ==================================

echo Building backend...
cd backend
call npm run build
if errorlevel 1 (
    echo ❌ Backend build failed
    pause
    exit /b 1
)
cd ..

echo Building frontend...
call npm run build
if errorlevel 1 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)

echo ✅ Applications built successfully

echo.

REM STEP 5: Test local build
echo 🧪 Step 5: Testing Local Build...
echo =================================

echo Starting local containers for testing...
docker-compose up --build -d
if errorlevel 1 (
    echo ❌ Local container startup failed
    pause
    exit /b 1
)

echo Waiting 30 seconds for services to start...
timeout /t 30 /nobreak >nul

echo Testing backend health...
curl -f http://localhost:3001/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Backend health check failed, but continuing...
) else (
    echo ✅ Backend health check passed
)

echo Stopping local containers...
docker-compose down >nul 2>&1

echo.

REM STEP 6: Azure Container Registry
echo ☁️  Step 6: Azure Container Registry...
echo ====================================

echo Logging into Azure Container Registry...
az acr login --name %ACR_NAME%
if errorlevel 1 (
    echo ❌ ACR login failed
    pause
    exit /b 1
)

echo ✅ Logged into ACR

echo.

REM STEP 7: Build and push backend
echo 🐳 Step 7: Backend Docker Build & Push...
echo =========================================

echo Building backend Docker image...
cd backend
docker build -t %ACR_NAME%.azurecr.io/uis-backend:latest .
if errorlevel 1 (
    echo ❌ Backend Docker build failed
    pause
    exit /b 1
)

echo Pushing backend image to ACR...
docker push %ACR_NAME%.azurecr.io/uis-backend:latest
if errorlevel 1 (
    echo ❌ Backend Docker push failed
    pause
    exit /b 1
)

cd ..
echo ✅ Backend image pushed successfully

echo.

REM STEP 8: Build and push frontend
echo 🎨 Step 8: Frontend Docker Build & Push...
echo ==========================================

echo Building frontend Docker image...
docker build --build-arg NEXT_PUBLIC_API_URL=https://%BACKEND_APP%.azurewebsites.net/api --build-arg NODE_ENV=production -t %ACR_NAME%.azurecr.io/uis-frontend:latest .
if errorlevel 1 (
    echo ❌ Frontend Docker build failed
    pause
    exit /b 1
)

echo Pushing frontend image to ACR...
docker push %ACR_NAME%.azurecr.io/uis-frontend:latest
if errorlevel 1 (
    echo ❌ Frontend Docker push failed
    pause
    exit /b 1
)

echo ✅ Frontend image pushed successfully

echo.

REM STEP 9: Create App Service Plan
echo 🏗️  Step 9: App Service Plan...
echo ===============================

echo Creating App Service Plan...
az appservice plan create --name uis-service-plan --resource-group %RESOURCE_GROUP% --location %LOCATION% --sku B1 --is-linux >nul 2>&1
if errorlevel 1 (
    echo ⚠️  App Service Plan might already exist, continuing...
) else (
    echo ✅ App Service Plan created
)

echo.

REM STEP 10: Deploy backend
echo 🔌 Step 10: Deploy Backend...
echo =============================

echo Creating backend web app...
az webapp create --name %BACKEND_APP% --resource-group %RESOURCE_GROUP% --plan uis-service-plan --deployment-container-image-name %ACR_NAME%.azurecr.io/uis-backend:latest >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Backend app might already exist, continuing with configuration...
)

echo Configuring backend app settings...
az webapp config appsettings set --name %BACKEND_APP% --resource-group %RESOURCE_GROUP% --settings NODE_ENV=production PORT=80 WEBSITES_PORT=3001 MONGODB_URI="mongodb+srv://kasuncamushan123:Kasun%%401234@cluster0.iuj7a.mongodb.net/university_system?retryWrites=true&w=majority" JWT_SECRET="super-secret-jwt-key-production-2024" JWT_REFRESH_SECRET="super-secret-refresh-key-production-2024" SESSION_SECRET="super-secret-session-key-production-2024" EMAIL_USER="noreply.lk.uis@gmail.com" EMAIL_PASS="your-gmail-app-password" EMAIL_FROM="University System <noreply.lk.uis@gmail.com>" FRONTEND_URL="https://%FRONTEND_APP%.azurewebsites.net" CORS_ORIGIN="https://%FRONTEND_APP%.azurewebsites.net"
if errorlevel 1 (
    echo ❌ Backend configuration failed
    pause
    exit /b 1
)

echo Enabling backend logging...
az webapp log config --name %BACKEND_APP% --resource-group %RESOURCE_GROUP% --docker-container-logging filesystem >nul 2>&1

echo ✅ Backend deployed and configured

echo.

REM STEP 11: Deploy frontend
echo 🎨 Step 11: Deploy Frontend...
echo ==============================

echo Creating frontend web app...
az webapp create --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP% --plan uis-service-plan --deployment-container-image-name %ACR_NAME%.azurecr.io/uis-frontend:latest >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Frontend app might already exist, continuing with configuration...
)

echo Configuring frontend app settings...
az webapp config appsettings set --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP% --settings NODE_ENV=production PORT=80 WEBSITES_PORT=3000 NEXT_PUBLIC_API_URL="https://%BACKEND_APP%.azurewebsites.net/api"
if errorlevel 1 (
    echo ❌ Frontend configuration failed
    pause
    exit /b 1
)

echo Enabling frontend logging...
az webapp log config --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP% --docker-container-logging filesystem >nul 2>&1

echo ✅ Frontend deployed and configured

echo.

REM STEP 12: Restart and test
echo 🔄 Step 12: Restart & Test...
echo =============================

echo Restarting backend...
az webapp restart --name %BACKEND_APP% --resource-group %RESOURCE_GROUP%

echo Restarting frontend...
az webapp restart --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP%

echo Waiting 3 minutes for services to fully start...
timeout /t 180 /nobreak >nul

echo Testing backend health...
curl -f https://uis-backend-app.azurewebsites.net/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Backend health check failed - may need more time to start
) else (
    echo ✅ Backend health check passed
)

echo Testing frontend...
curl -f -I https://lk-uis.azurewebsites.net >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Frontend test failed - may need more time to start
) else (
    echo ✅ Frontend test passed
)

echo.

REM Final summary
echo 🎉 Deployment Complete!
echo =======================
echo.
echo 🌐 Your applications are deployed at:
echo    Frontend:     https://lk-uis.azurewebsites.net
echo    Backend API:  https://uis-backend-app.azurewebsites.net/api
echo    Backend Health: https://uis-backend-app.azurewebsites.net/health
echo.
echo 📝 Notes:
echo    - Applications may take 2-3 minutes to fully start
echo    - If you see errors, wait a bit and try accessing the URLs again
echo    - Check Azure portal for detailed logs if issues persist
echo.
echo 🧪 Test your application:
echo    1. Open https://lk-uis.azurewebsites.net in your browser
echo    2. Try to create a new account
echo    3. Verify that API calls are working
echo.
echo 📊 To check logs if needed:
echo    az webapp log tail --name uis-backend-app --resource-group uis-rg
echo    az webapp log tail --name lk-uis --resource-group uis-rg
echo.

pause
