@echo off
REM Script to check what Azure resources exist

echo 🔍 Checking existing Azure resources...

set RESOURCE_GROUP=uis-rg

echo.
echo 📋 Listing all resources in resource group: %RESOURCE_GROUP%
az resource list --resource-group %RESOURCE_GROUP% --output table

echo.
echo 🌐 Listing all web apps in resource group:
az webapp list --resource-group %RESOURCE_GROUP% --output table

echo.
echo 🏗️ Listing all app service plans:
az appservice plan list --resource-group %RESOURCE_GROUP% --output table

echo.
echo 🐳 Listing all container registries:
az acr list --resource-group %RESOURCE_GROUP% --output table
