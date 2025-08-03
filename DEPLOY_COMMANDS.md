# Step-by-Step Deployment Commands

## 🚀 Complete Deployment Guide - Copy & Paste Commands

### STEP 1: Prerequisites Check
```cmd
REM Check if everything is installed
node --version
docker --version
docker info
az --version
az account show
```

### STEP 2: Clean Up and Prepare
```cmd
REM Stop any running containers
docker-compose down

REM Clean up Docker
docker system prune -f

REM Navigate to project root (adjust path as needed)
cd c:\Users\kasun\repos\my\University-Information-System
```

### STEP 3: Install Dependencies
```cmd
REM Install frontend dependencies
npm install

REM Install backend dependencies
cd backend
npm install
cd ..
```

### STEP 4: Build Applications
```cmd
REM Build backend
cd backend
npm run build
cd ..

REM Build frontend
npm run build
```

### STEP 5: Test Local Build
```cmd
REM Start with Docker Compose to test
docker-compose up --build -d

REM Wait 30 seconds
timeout /t 30 /nobreak

REM Test backend
curl http://localhost:3001/health

REM Test frontend
curl http://localhost:3000

REM If tests pass, stop containers for Azure deployment
docker-compose down
```

### STEP 6: Azure Login and Setup
```cmd
REM Login to Azure
az login

REM Set variables (modify if your names are different)
set RESOURCE_GROUP=uis-rg
set ACR_NAME=uisacr
set BACKEND_APP=uis-backend-app
set FRONTEND_APP=lk-uis
set LOCATION=eastus
```

### STEP 7: Container Registry Login
```cmd
REM Login to Azure Container Registry
az acr login --name %ACR_NAME%
```

### STEP 8: Build and Push Backend Image
```cmd
REM Build backend Docker image
cd backend
docker build -t %ACR_NAME%.azurecr.io/uis-backend:latest .

REM Push backend image
docker push %ACR_NAME%.azurecr.io/uis-backend:latest

REM Go back to root
cd ..
```

### STEP 9: Build and Push Frontend Image
```cmd
REM Build frontend Docker image with production API URL
docker build --build-arg NEXT_PUBLIC_API_URL=https://%BACKEND_APP%.azurewebsites.net/api --build-arg NODE_ENV=production -t %ACR_NAME%.azurecr.io/uis-frontend:latest .

REM Push frontend image
docker push %ACR_NAME%.azurecr.io/uis-frontend:latest
```

### STEP 10: Create App Service Plan (if needed)
```cmd
REM Create app service plan
az appservice plan create --name uis-service-plan --resource-group %RESOURCE_GROUP% --location %LOCATION% --sku B1 --is-linux
```

### STEP 11: Deploy Backend Web App
```cmd
REM Create backend web app
az webapp create --name %BACKEND_APP% --resource-group %RESOURCE_GROUP% --plan uis-service-plan --deployment-container-image-name %ACR_NAME%.azurecr.io/uis-backend:latest

REM Configure backend app settings
az webapp config appsettings set --name %BACKEND_APP% --resource-group %RESOURCE_GROUP% --settings NODE_ENV=production PORT=80 WEBSITES_PORT=3001 MONGODB_URI="mongodb+srv://kasuncamushan123:Kasun%%401234@cluster0.iuj7a.mongodb.net/university_system?retryWrites=true&w=majority" JWT_SECRET="super-secret-jwt-key-production-2024" JWT_REFRESH_SECRET="super-secret-refresh-key-production-2024" SESSION_SECRET="super-secret-session-key-production-2024" EMAIL_USER="noreply.lk.uis@gmail.com" EMAIL_PASS="your-gmail-app-password" EMAIL_FROM="University System <noreply.lk.uis@gmail.com>" FRONTEND_URL="https://%FRONTEND_APP%.azurewebsites.net" CORS_ORIGIN="https://%FRONTEND_APP%.azurewebsites.net"

REM Enable backend logging
az webapp log config --name %BACKEND_APP% --resource-group %RESOURCE_GROUP% --docker-container-logging filesystem
```

### STEP 12: Deploy Frontend Web App
```cmd
REM Create frontend web app
az webapp create --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP% --plan uis-service-plan --deployment-container-image-name %ACR_NAME%.azurecr.io/uis-frontend:latest

REM Configure frontend app settings
az webapp config appsettings set --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP% --settings NODE_ENV=production PORT=80 WEBSITES_PORT=3000 NEXT_PUBLIC_API_URL="https://%BACKEND_APP%.azurewebsites.net/api"

REM Enable frontend logging
az webapp log config --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP% --docker-container-logging filesystem
```

### STEP 13: Restart Applications
```cmd
REM Restart backend
az webapp restart --name %BACKEND_APP% --resource-group %RESOURCE_GROUP%

REM Restart frontend
az webapp restart --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP%
```

### STEP 14: Wait and Test
```cmd
REM Wait 3 minutes for services to start
echo Waiting for services to start...
timeout /t 180 /nobreak

REM Test backend health
curl https://uis-backend-app.azurewebsites.net/health

REM Test frontend
curl -I https://lk-uis.azurewebsites.net

REM Test API
curl -X POST https://uis-backend-app.azurewebsites.net/api/auth/send-verification -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\"}"
```

### STEP 15: Verification
```cmd
REM Check app status
az webapp show --name %BACKEND_APP% --resource-group %RESOURCE_GROUP% --query state
az webapp show --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP% --query state

REM Check app settings
az webapp config appsettings list --name %BACKEND_APP% --resource-group %RESOURCE_GROUP% --output table
az webapp config appsettings list --name %FRONTEND_APP% --resource-group %RESOURCE_GROUP% --output table
```

## 🎉 Final URLs:
- Frontend: https://lk-uis.azurewebsites.net
- Backend API: https://uis-backend-app.azurewebsites.net/api
- Backend Health: https://uis-backend-app.azurewebsites.net/health

## 🔧 If Something Goes Wrong:

### View Logs:
```cmd
az webapp log tail --name uis-backend-app --resource-group uis-rg
az webapp log tail --name lk-uis --resource-group uis-rg
```

### Force Restart:
```cmd
az webapp restart --name uis-backend-app --resource-group uis-rg
az webapp restart --name lk-uis --resource-group uis-rg
```

### Fix CORS Issues:
```cmd
az webapp config appsettings set --name uis-backend-app --resource-group uis-rg --settings CORS_ORIGIN="https://lk-uis.azurewebsites.net"
```

### Fix API URL Issues:
```cmd
az webapp config appsettings set --name lk-uis --resource-group uis-rg --settings NEXT_PUBLIC_API_URL="https://uis-backend-app.azurewebsites.net/api"
```

## 📝 Important Notes:
1. Replace "your-gmail-app-password" with your actual Gmail app password
2. Run commands from the project root directory
3. Wait for each step to complete before proceeding
4. If a command fails, check the error message and try again
5. Azure services take 2-3 minutes to fully start after deployment
