@echo off
REM Comprehensive fix for UIS deployment

echo 🚀 University Information System - Deployment Fix
echo ================================================

set RESOURCE_GROUP=uis-rg
set BACKEND_APP=uis-backend-app
set FRONTEND_APP=lk-uis

echo.
echo 🔍 Step 1: Detecting current Azure resources...

REM Check if apps exist
az webapp show --name %BACKEND_APP% --resource-group %RESOURCE_GROUP% >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend app %BACKEND_APP% not found
    echo 💡 Available apps:
    az webapp list --resource-group %RESOURCE_GROUP% --query "[].name" --output tsv
    pause
    exit /b 1
) else (
    echo ✅ Found backend app: %BACKEND_APP%
)

az webapp show --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP% >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend app %FRONTEND_APP% not found
    echo 💡 Available apps:
    az webapp list --resource-group %RESOURCE_GROUP% --query "[].name" --output tsv
    pause
    exit /b 1
) else (
    echo ✅ Found frontend app: %FRONTEND_APP%
)

echo.
echo 🔧 Step 2: Fixing backend configuration...

REM Update backend app settings
az webapp config appsettings set ^
    --name %BACKEND_APP% ^
    --resource-group %RESOURCE_GROUP% ^
    --settings ^
    NODE_ENV=production ^
    PORT=80 ^
    WEBSITES_PORT=3001 ^
    MONGODB_URI="mongodb+srv://kasuncamushan123:Kasun%401234@cluster0.iuj7a.mongodb.net/university_system?retryWrites=true&w=majority" ^
    JWT_SECRET="super-secret-jwt-key-production-2024" ^
    JWT_REFRESH_SECRET="super-secret-refresh-key-production-2024" ^
    SESSION_SECRET="super-secret-session-key-production-2024" ^
    EMAIL_USER="noreply.lk.uis@gmail.com" ^
    EMAIL_PASS="your-app-password-here" ^
    EMAIL_FROM="University System <noreply.lk.uis@gmail.com>" ^
    FRONTEND_URL="https://%FRONTEND_APP%.azurewebsites.net" ^
    CORS_ORIGIN="https://%FRONTEND_APP%.azurewebsites.net"

if errorlevel 1 (
    echo ❌ Failed to update backend settings
    pause
    exit /b 1
)

echo ✅ Backend configuration updated

echo.
echo 🎨 Step 3: Fixing frontend configuration...

REM Update frontend app settings
az webapp config appsettings set ^
    --name %FRONTEND_APP% ^
    --resource-group %RESOURCE_GROUP% ^
    --settings ^
    NODE_ENV=production ^
    PORT=80 ^
    WEBSITES_PORT=3000 ^
    NEXT_PUBLIC_API_URL="https://%BACKEND_APP%.azurewebsites.net/api"

if errorlevel 1 (
    echo ❌ Failed to update frontend settings
    pause
    exit /b 1
)

echo ✅ Frontend configuration updated

echo.
echo 🔄 Step 4: Restarting applications...

echo Restarting backend...
az webapp restart --name %BACKEND_APP% --resource-group %RESOURCE_GROUP%

echo Restarting frontend...
az webapp restart --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP%

echo ✅ Applications restarted

echo.
echo 🧪 Step 5: Testing deployment...

echo Testing backend health...
timeout 10 >nul
curl -s "https://%BACKEND_APP%.azurewebsites.net/health"

echo.
echo Testing frontend...
curl -s -I "https://%FRONTEND_APP%.azurewebsites.net" | findstr "HTTP"

echo.
echo ✅ Deployment fix completed!
echo.
echo 🌐 Your applications:
echo    Frontend: https://%FRONTEND_APP%.azurewebsites.net
echo    Backend:  https://%BACKEND_APP%.azurewebsites.net
echo    Backend Health: https://%BACKEND_APP%.azurewebsites.net/health
echo    Backend API: https://%BACKEND_APP%.azurewebsites.net/api
echo.
echo 📝 If you still see issues:
echo 1. Wait 2-3 minutes for apps to fully restart
echo 2. Check logs: az webapp log tail --name %BACKEND_APP% --resource-group %RESOURCE_GROUP%
echo 3. Verify MongoDB connection string is correct
echo 4. Check Azure portal for any error messages
echo.
pause
