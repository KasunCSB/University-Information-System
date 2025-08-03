@echo off
REM Quick fix script to update existing Azure deployment

echo 🔧 Fixing Azure deployment configuration...

set RESOURCE_GROUP=uis-rg
set WEBAPP_BACKEND=uis-backend-app
set WEBAPP_FRONTEND=uis-frontend-app

echo 📱 Updating frontend app settings with correct API URL...
az webapp config appsettings set ^
    --name %WEBAPP_FRONTEND% ^
    --resource-group %RESOURCE_GROUP% ^
    --settings ^
    NEXT_PUBLIC_API_URL="https://%WEBAPP_BACKEND%.azurewebsites.net/api"

if errorlevel 1 (
    echo ❌ Failed to update frontend settings
    exit /b 1
)

echo 🔄 Restarting frontend app to apply changes...
az webapp restart --name %WEBAPP_FRONTEND% --resource-group %RESOURCE_GROUP%

if errorlevel 1 (
    echo ❌ Failed to restart frontend app
    exit /b 1
)

echo ✅ Quick fix applied successfully!
echo.
echo 🧪 Test your app at: https://%WEBAPP_FRONTEND%.azurewebsites.net
echo 📊 Backend health: https://%WEBAPP_BACKEND%.azurewebsites.net/health
echo.
echo 📝 If issues persist, run the full deployment script again.
