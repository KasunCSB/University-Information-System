# Windows Command Reference - UIS Deployment

## Quick Commands for Windows Users

### 1. Prerequisites Check
```cmd
:: Check Node.js
node --version

:: Check Docker
docker --version
docker info

:: Check Azure CLI
az --version
az account show
```

### 2. Local Development Setup
```cmd
:: Install dependencies
npm install
cd backend
npm install
cd ..

:: Build applications
cd backend
npm run build
cd ..
npm run build
```

### 3. Docker Local Deployment
```cmd
:: Clean up existing containers
docker-compose down
docker system prune -f

:: Start services
docker-compose up --build -d

:: Check status
docker-compose ps

:: Test services
curl http://localhost:3001/health
curl http://localhost:3000
```

### 4. Azure Deployment Commands
```cmd
:: Set variables
set RESOURCE_GROUP=uis-rg
set ACR_NAME=uniinfsysacr
set BACKEND_APP=uis-backend-app
set FRONTEND_APP=lk-uis

:: Login to Azure
az login
az acr login --name %ACR_NAME%

:: Build and push backend
docker build -t %ACR_NAME%.azurecr.io/uis-backend:latest ./backend
docker push %ACR_NAME%.azurecr.io/uis-backend:latest

:: Build and push frontend
docker build --build-arg NEXT_PUBLIC_API_URL=https://%BACKEND_APP%.azurewebsites.net/api -t %ACR_NAME%.azurecr.io/uis-frontend:latest .
docker push %ACR_NAME%.azurecr.io/uis-frontend:latest

:: Create App Service Plan (if needed)
az appservice plan create --name uis-service-plan --resource-group %RESOURCE_GROUP% --location eastus --sku B1 --is-linux

:: Create Backend Web App
az webapp create --name %BACKEND_APP% --resource-group %RESOURCE_GROUP% --plan uis-service-plan --deployment-container-image-name %ACR_NAME%.azurecr.io/uis-backend:latest

:: Configure Backend
az webapp config appsettings set --name %BACKEND_APP% --resource-group %RESOURCE_GROUP% --settings NODE_ENV=production PORT=80 WEBSITES_PORT=3001 MONGODB_URI="mongodb+srv://kasuncamushan123:Kasun%%401234@cluster0.iuj7a.mongodb.net/university_system?retryWrites=true&w=majority" JWT_SECRET="super-secret-jwt-key-production-2024" JWT_REFRESH_SECRET="super-secret-refresh-key-production-2024" SESSION_SECRET="super-secret-session-key-production-2024" EMAIL_USER="noreply.lk.uis@gmail.com" EMAIL_PASS="your-gmail-app-password" EMAIL_FROM="University System <noreply.lk.uis@gmail.com>" FRONTEND_URL="https://%FRONTEND_APP%.azurewebsites.net" CORS_ORIGIN="https://%FRONTEND_APP%.azurewebsites.net"

:: Create Frontend Web App
az webapp create --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP% --plan uis-service-plan --deployment-container-image-name %ACR_NAME%.azurecr.io/uis-frontend:latest

:: Configure Frontend
az webapp config appsettings set --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP% --settings NODE_ENV=production PORT=80 WEBSITES_PORT=3000 NEXT_PUBLIC_API_URL="https://%BACKEND_APP%.azurewebsites.net/api"

:: Enable logging
az webapp log config --name %BACKEND_APP% --resource-group %RESOURCE_GROUP% --docker-container-logging filesystem
az webapp log config --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP% --docker-container-logging filesystem

:: Restart apps
az webapp restart --name %BACKEND_APP% --resource-group %RESOURCE_GROUP%
az webapp restart --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP%
```

### 5. Testing Commands
```cmd
:: Test backend health
curl https://uis-backend-app.azurewebsites.net/health

:: Test API endpoint
curl -X POST https://uis-backend-app.azurewebsites.net/api/auth/send-verification -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\"}"

:: Test frontend
curl -I https://lk-uis.azurewebsites.net
```

### 6. Troubleshooting Commands
```cmd
:: View logs
az webapp log tail --name uis-backend-app --resource-group uis-rg
az webapp log tail --name lk-uis --resource-group uis-rg

:: Check app settings
az webapp config appsettings list --name uis-backend-app --resource-group uis-rg --output table
az webapp config appsettings list --name lk-uis --resource-group uis-rg --output table

:: Check app status
az webapp show --name uis-backend-app --resource-group uis-rg --query state
az webapp show --name lk-uis --resource-group uis-rg --query state

:: Force restart
az webapp stop --name uis-backend-app --resource-group uis-rg
az webapp stop --name lk-uis --resource-group uis-rg
az webapp start --name uis-backend-app --resource-group uis-rg
az webapp start --name lk-uis --resource-group uis-rg
```

### 7. Quick Fix Commands
```cmd
:: Fix CORS issue
az webapp config appsettings set --name uis-backend-app --resource-group uis-rg --settings CORS_ORIGIN="https://lk-uis.azurewebsites.net"

:: Fix API URL issue
az webapp config appsettings set --name lk-uis --resource-group uis-rg --settings NEXT_PUBLIC_API_URL="https://uis-backend-app.azurewebsites.net/api"

:: Restart after fixes
az webapp restart --name uis-backend-app --resource-group uis-rg
az webapp restart --name lk-uis --resource-group uis-rg
```

## Important Notes:
1. Replace "your-gmail-app-password" with your actual Gmail app password
2. Wait 2-3 minutes after deployment for services to fully start
3. Check Azure portal if commands fail
4. Ensure Docker Desktop is running before Docker commands
5. Run commands from the project root directory
