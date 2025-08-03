@echo off
REM Script to find actual Azure app names

echo 🔍 Detecting your actual Azure deployment...

echo.
echo 📱 Searching for web apps containing 'uis' or 'lk-uis'...
for /f "tokens=1" %%i in ('az webapp list --query "[?contains(name,'uis')].name" --output tsv 2^>nul') do (
    echo Found web app: %%i
    set FOUND_APP=%%i
)

echo.
echo 🐳 Searching for container registries...
for /f "tokens=1" %%i in ('az acr list --query "[].name" --output tsv 2^>nul') do (
    echo Found ACR: %%i
)

echo.
echo 🏗️ Searching for resource groups containing 'uis'...
for /f "tokens=1" %%i in ('az group list --query "[?contains(name,'uis')].name" --output tsv 2^>nul') do (
    echo Found resource group: %%i
)

echo.
echo 📋 If you see any resources above, we can use them to fix the configuration.
echo If no resources are found, you may need to run the full deployment script first.
