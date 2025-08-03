@echo off
REM Flexible fix script that detects actual app names

echo 🔧 Smart Azure deployment fix...

REM Try common app name patterns
set POSSIBLE_FRONTEND_NAMES=lk-uis uis-frontend-app uis-client
set POSSIBLE_BACKEND_NAMES=uis-backend-app uis-backend uis-api
set RESOURCE_GROUP=uis-rg

echo 🔍 Detecting actual app names...

REM Find frontend app
set FRONTEND_APP=
for %%i in (%POSSIBLE_FRONTEND_NAMES%) do (
    az webapp show --name %%i --resource-group %RESOURCE_GROUP% >nul 2>&1
    if not errorlevel 1 (
        set FRONTEND_APP=%%i
        echo ✅ Found frontend app: %%i
        goto :found_frontend
    )
)
:found_frontend

REM Find backend app
set BACKEND_APP=
for %%i in (%POSSIBLE_BACKEND_NAMES%) do (
    az webapp show --name %%i --resource-group %RESOURCE_GROUP% >nul 2>&1
    if not errorlevel 1 (
        set BACKEND_APP=%%i
        echo ✅ Found backend app: %%i
        goto :found_backend
    )
)
:found_backend

if "%FRONTEND_APP%"=="" (
    echo ❌ Could not find frontend app. Please check your deployment.
    echo 💡 Try running: az webapp list --output table
    exit /b 1
)

if "%BACKEND_APP%"=="" (
    echo ❌ Could not find backend app. Please check your deployment.
    echo 💡 Try running: az webapp list --output table
    exit /b 1
)

echo.
echo 📱 Updating %FRONTEND_APP% with correct API URL...
az webapp config appsettings set ^
    --name %FRONTEND_APP% ^
    --resource-group %RESOURCE_GROUP% ^
    --settings ^
    NEXT_PUBLIC_API_URL="https://%BACKEND_APP%.azurewebsites.net/api"

if errorlevel 1 (
    echo ❌ Failed to update frontend settings
    exit /b 1
)

echo 🔄 Restarting %FRONTEND_APP%...
az webapp restart --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP%

echo.
echo ✅ Configuration updated successfully!
echo 🌐 Frontend: https://%FRONTEND_APP%.azurewebsites.net
echo 🔌 Backend: https://%BACKEND_APP%.azurewebsites.net
echo 📊 Backend Health: https://%BACKEND_APP%.azurewebsites.net/health
