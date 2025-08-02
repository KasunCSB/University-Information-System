# Azure Web App deployment script
# This script automates the deployment to Azure Web Apps

# Variables - Replace with your actual values
$resourceGroup = "uis-resource-group"
$appServicePlan = "uis-app-service-plan"
$backendAppName = "uis-backend-api"
$frontendAppName = "uis-frontend-app"
$location = "East US"
$sku = "B1"

Write-Host "🚀 Starting Azure deployment process..." -ForegroundColor Green

# Login to Azure (uncomment if needed)
# az login

# Create resource group
Write-Host "📦 Creating resource group..." -ForegroundColor Yellow
az group create --name $resourceGroup --location $location

# Create App Service Plan
Write-Host "🏗️ Creating App Service Plan..." -ForegroundColor Yellow
az appservice plan create --name $appServicePlan --resource-group $resourceGroup --sku $sku --is-linux

# Create Backend Web App
Write-Host "🔧 Creating Backend Web App..." -ForegroundColor Yellow
az webapp create --resource-group $resourceGroup --plan $appServicePlan --name $backendAppName --runtime "NODE:18-lts"

# Create Frontend Web App
Write-Host "🎨 Creating Frontend Web App..." -ForegroundColor Yellow
az webapp create --resource-group $resourceGroup --plan $appServicePlan --name $frontendAppName --runtime "NODE:18-lts"

# Configure Backend App Settings
Write-Host "⚙️ Configuring Backend settings..." -ForegroundColor Yellow
az webapp config appsettings set --resource-group $resourceGroup --name $backendAppName --settings @backend-appsettings.json

# Configure Frontend App Settings
Write-Host "⚙️ Configuring Frontend settings..." -ForegroundColor Yellow
az webapp config appsettings set --resource-group $resourceGroup --name $frontendAppName --settings @frontend-appsettings.json

Write-Host "✅ Azure resources created successfully!" -ForegroundColor Green
Write-Host "Backend URL: https://$backendAppName.azurewebsites.net" -ForegroundColor Cyan
Write-Host "Frontend URL: https://$frontendAppName.azurewebsites.net" -ForegroundColor Cyan

Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Update your environment variables in the Azure portal"
Write-Host "2. Set up MongoDB Atlas and update MONGODB_URI"
Write-Host "3. Configure email settings for Gmail"
Write-Host "4. Deploy your code using GitHub Actions or manual deployment"
