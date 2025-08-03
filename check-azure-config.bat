@echo off
REM Script to check Azure app configurations

echo 🔍 Checking Azure deployment configuration...

set RESOURCE_GROUP=uis-rg
set WEBAPP_BACKEND=uis-backend-app
set WEBAPP_FRONTEND=uis-frontend-app

echo.
echo 🔧 Backend App Settings:
az webapp config appsettings list --name %WEBAPP_BACKEND% --resource-group %RESOURCE_GROUP% --output table

echo.
echo 🎨 Frontend App Settings:
az webapp config appsettings list --name %WEBAPP_FRONTEND% --resource-group %RESOURCE_GROUP% --output table

echo.
echo 📊 Testing endpoints:
echo Backend health: 
curl -s "https://%WEBAPP_BACKEND%.azurewebsites.net/health" | echo.

echo.
echo Frontend status:
curl -s -I "https://%WEBAPP_FRONTEND%.azurewebsites.net" | findstr "HTTP"

echo.
echo 🧪 Testing API route:
curl -s -I "https://%WEBAPP_BACKEND%.azurewebsites.net/api/auth/send-verification" | findstr "HTTP"
