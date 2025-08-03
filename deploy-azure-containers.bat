@echo off
REM Azure Container Deployment Script for University Information System
echo 🚀 Starting Azure Container deployment...

REM Set variables
set RESOURCE_GROUP=uis-rg
set ACR_NAME=uniinfsysacr
set BACKEND_IMAGE=%ACR_NAME%.azurecr.io/uis-backend:latest
set FRONTEND_IMAGE=%ACR_NAME%.azurecr.io/uis-frontend:latest
set WEBAPP_BACKEND=uis-backend-app
set WEBAPP_FRONTEND=uis-frontend-app
set APP_SERVICE_PLAN=uis-service-plan
set LOCATION=eastus

echo 📋 Deployment Configuration:
echo    Resource Group: %RESOURCE_GROUP%
echo    ACR Registry: %ACR_NAME%
echo    Backend Image: %BACKEND_IMAGE%
echo    Frontend Image: %FRONTEND_IMAGE%
echo    Location: %LOCATION%
echo.

REM Check if logged in to Azure
echo 🔐 Checking Azure login status...
az account show >nul 2>&1
if errorlevel 1 (
    echo ❌ Please login to Azure first: az login
    exit /b 1
)

REM Login to ACR
echo 🐳 Logging into Azure Container Registry...
az acr login --name %ACR_NAME%
if errorlevel 1 (
    echo ❌ Failed to login to ACR
    exit /b 1
)

REM Build and push backend image
echo 🔨 Building backend Docker image...
docker build -t %BACKEND_IMAGE% ./backend
if errorlevel 1 (
    echo ❌ Failed to build backend image
    exit /b 1
)

echo 📤 Pushing backend image to ACR...
docker push %BACKEND_IMAGE%
if errorlevel 1 (
    echo ❌ Failed to push backend image
    exit /b 1
)

REM Build and push frontend image
echo 🔨 Building frontend Docker image...
docker build ^
    --build-arg NEXT_PUBLIC_API_URL=https://%WEBAPP_BACKEND%.azurewebsites.net/api ^
    --build-arg NODE_ENV=production ^
    -t %FRONTEND_IMAGE% .
if errorlevel 1 (
    echo ❌ Failed to build frontend image
    exit /b 1
)

echo 📤 Pushing frontend image to ACR...
docker push %FRONTEND_IMAGE%
if errorlevel 1 (
    echo ❌ Failed to push frontend image
    exit /b 1
)

REM Create App Service Plan
echo 🏗️ Creating App Service Plan...
az appservice plan create ^
    --name %APP_SERVICE_PLAN% ^
    --resource-group %RESOURCE_GROUP% ^
    --location %LOCATION% ^
    --sku B1 ^
    --is-linux
if errorlevel 1 (
    echo ⚠️ App Service Plan might already exist, continuing...
)

REM Create backend web app
echo 🌐 Creating backend web app...
az webapp create ^
    --name %WEBAPP_BACKEND% ^
    --resource-group %RESOURCE_GROUP% ^
    --plan %APP_SERVICE_PLAN% ^
    --deployment-container-image-name %BACKEND_IMAGE%
if errorlevel 1 (
    echo ❌ Failed to create backend web app
    exit /b 1
)

REM Configure backend app settings
echo ⚙️ Configuring backend app settings...
az webapp config appsettings set ^
    --name %WEBAPP_BACKEND% ^
    --resource-group %RESOURCE_GROUP% ^
    --settings ^
    NODE_ENV=production ^
    PORT=80 ^
    WEBSITES_PORT=3001 ^
    MONGODB_URI="mongodb+srv://your-connection-string-here" ^
    JWT_SECRET="your-super-secret-jwt-key-change-in-production" ^
    JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production" ^
    EMAIL_USER="your-email@gmail.com" ^
    EMAIL_PASS="your-app-password" ^
    FRONTEND_URL="https://%WEBAPP_FRONTEND%.azurewebsites.net" ^
    CORS_ORIGIN="https://%WEBAPP_FRONTEND%.azurewebsites.net"

REM Create frontend web app
echo 🌐 Creating frontend web app...
az webapp create ^
    --name %WEBAPP_FRONTEND% ^
    --resource-group %RESOURCE_GROUP% ^
    --plan %APP_SERVICE_PLAN% ^
    --deployment-container-image-name %FRONTEND_IMAGE%
if errorlevel 1 (
    echo ❌ Failed to create frontend web app
    exit /b 1
)

REM Configure frontend app settings
echo ⚙️ Configuring frontend app settings...
az webapp config appsettings set ^
    --name %WEBAPP_FRONTEND% ^
    --resource-group %RESOURCE_GROUP% ^
    --settings ^
    NODE_ENV=production ^
    PORT=80 ^
    WEBSITES_PORT=3000 ^
    NEXT_PUBLIC_API_URL="https://%WEBAPP_BACKEND%.azurewebsites.net/api"

REM Enable container logging
echo 📝 Enabling container logging...
az webapp log config ^
    --name %WEBAPP_BACKEND% ^
    --resource-group %RESOURCE_GROUP% ^
    --docker-container-logging filesystem

az webapp log config ^
    --name %WEBAPP_FRONTEND% ^
    --resource-group %RESOURCE_GROUP% ^
    --docker-container-logging filesystem

REM Restart web apps
echo 🔄 Restarting web apps...
az webapp restart --name %WEBAPP_BACKEND% --resource-group %RESOURCE_GROUP%
az webapp restart --name %WEBAPP_FRONTEND% --resource-group %RESOURCE_GROUP%

echo.
echo ✅ Deployment completed successfully!
echo.
echo 🌐 Your applications are available at:
echo    Backend:  https://%WEBAPP_BACKEND%.azurewebsites.net
echo    Frontend: https://%WEBAPP_FRONTEND%.azurewebsites.net
echo.
echo 📝 To view logs, use:
echo    az webapp log tail --name %WEBAPP_BACKEND% --resource-group %RESOURCE_GROUP%
echo    az webapp log tail --name %WEBAPP_FRONTEND% --resource-group %RESOURCE_GROUP%
echo.
echo 🎉 Happy coding!
