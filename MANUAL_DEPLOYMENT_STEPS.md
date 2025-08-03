# Manual Deployment Steps - University Information System

## 🎯 Overview
This guide provides step-by-step manual instructions to deploy your University Information System with the fixes we've implemented.

## 📋 Prerequisites Checklist

### Required Software:
- [ ] Docker Desktop installed and running
- [ ] Node.js 18+ installed
- [ ] Azure CLI installed (for Azure deployment)
- [ ] Git installed

### Azure Requirements:
- [ ] Azure account with active subscription
- [ ] Resource group created (uis-rg)
- [ ] Azure Container Registry created
- [ ] MongoDB connection string ready

---

## 🔧 STEP 1: Local Environment Setup

### 1.1 Verify Prerequisites
```bash
# Check Node.js version
node --version
# Should show v18.x.x or higher

# Check Docker
docker --version
docker info

# Check Azure CLI (if doing Azure deployment)
az --version
az account show
```

### 1.2 Install Dependencies
```bash
# In the root directory
npm install

# In the backend directory
cd backend
npm install
cd ..
```

### 1.3 Environment Configuration
Create `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Create `.env` file in the `backend` directory:
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb+srv://kasuncamushan123:Kasun%401234@cluster0.iuj7a.mongodb.net/university_system?retryWrites=true&w=majority
JWT_SECRET=super-secret-jwt-key-development
JWT_REFRESH_SECRET=super-secret-refresh-key-development
SESSION_SECRET=super-secret-session-key-development
EMAIL_USER=noreply.lk.uis@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=University System <noreply.lk.uis@gmail.com>
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

---

## 🏗️ STEP 2: Build Applications

### 2.1 Build Backend
```bash
cd backend
npm run build
# Verify build succeeded - should create 'dist' folder
ls dist/
cd ..
```

### 2.2 Build Frontend
```bash
npm run build
# Verify build succeeded - should create '.next' folder
ls .next/
```

---

## 🐳 STEP 3: Local Docker Deployment

### 3.1 Stop Existing Containers
```bash
docker-compose down
docker system prune -f
```

### 3.2 Build Docker Images
```bash
# Build backend image
cd backend
docker build -t uis-backend:latest .
cd ..

# Build frontend image
docker build -t uis-frontend:latest .
```

### 3.3 Start Services with Docker Compose
```bash
# Start all services
docker-compose up --build -d

# Check status
docker-compose ps
```

### 3.4 Verify Local Deployment
```bash
# Wait for services to start
sleep 30

# Test backend health
curl http://localhost:3001/health

# Test frontend
curl http://localhost:3000

# Test API endpoint
curl -X POST http://localhost:3001/api/auth/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 3.5 View Logs (if needed)
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
```

---

## ☁️ STEP 4: Azure Deployment

### 4.1 Azure Login and Setup
```bash
# Login to Azure
az login

# Set subscription (if you have multiple)
az account set --subscription "your-subscription-id"

# Verify resource group exists
az group show --name uis-rg
```

### 4.2 Container Registry Setup
```bash
# Set variables
$RESOURCE_GROUP = "uis-rg"
$ACR_NAME = "uniinfsysacr"
$LOCATION = "eastus"

# Create container registry (if not exists)
az acr create --name $ACR_NAME --resource-group $RESOURCE_GROUP --location $LOCATION --sku Basic

# Login to container registry
az acr login --name $ACR_NAME
```

### 4.3 Build and Push Images to Azure

#### Backend Image:
```bash
# Tag and push backend image
docker tag uis-backend:latest $ACR_NAME.azurecr.io/uis-backend:latest
docker push $ACR_NAME.azurecr.io/uis-backend:latest
```

#### Frontend Image:
```bash
# Build frontend with production API URL
docker build --build-arg NEXT_PUBLIC_API_URL=https://uis-backend-app.azurewebsites.net/api \
  --build-arg NODE_ENV=production \
  -t $ACR_NAME.azurecr.io/uis-frontend:latest .

# Push frontend image
docker push $ACR_NAME.azurecr.io/uis-frontend:latest
```

### 4.4 Create App Service Plan
```bash
az appservice plan create \
  --name uis-service-plan \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku B1 \
  --is-linux
```

### 4.5 Create Backend Web App
```bash
# Create backend web app
az webapp create \
  --name uis-backend-app \
  --resource-group $RESOURCE_GROUP \
  --plan uis-service-plan \
  --deployment-container-image-name $ACR_NAME.azurecr.io/uis-backend:latest

# Configure backend app settings
az webapp config appsettings set \
  --name uis-backend-app \
  --resource-group $RESOURCE_GROUP \
  --settings \
  NODE_ENV=production \
  PORT=80 \
  WEBSITES_PORT=3001 \
  MONGODB_URI="mongodb+srv://kasuncamushan123:Kasun%401234@cluster0.iuj7a.mongodb.net/university_system?retryWrites=true&w=majority" \
  JWT_SECRET="super-secret-jwt-key-production-2024" \
  JWT_REFRESH_SECRET="super-secret-refresh-key-production-2024" \
  SESSION_SECRET="super-secret-session-key-production-2024" \
  EMAIL_USER="noreply.lk.uis@gmail.com" \
  EMAIL_PASS="your-gmail-app-password" \
  EMAIL_FROM="University System <noreply.lk.uis@gmail.com>" \
  FRONTEND_URL="https://lk-uis.azurewebsites.net" \
  CORS_ORIGIN="https://lk-uis.azurewebsites.net"
```

### 4.6 Create Frontend Web App
```bash
# Create frontend web app
az webapp create \
  --name lk-uis \
  --resource-group $RESOURCE_GROUP \
  --plan uis-service-plan \
  --deployment-container-image-name $ACR_NAME.azurecr.io/uis-frontend:latest

# Configure frontend app settings
az webapp config appsettings set \
  --name lk-uis \
  --resource-group $RESOURCE_GROUP \
  --settings \
  NODE_ENV=production \
  PORT=80 \
  WEBSITES_PORT=3000 \
  NEXT_PUBLIC_API_URL="https://uis-backend-app.azurewebsites.net/api"
```

### 4.7 Enable Container Logging
```bash
# Enable logging for backend
az webapp log config \
  --name uis-backend-app \
  --resource-group $RESOURCE_GROUP \
  --docker-container-logging filesystem

# Enable logging for frontend
az webapp log config \
  --name lk-uis \
  --resource-group $RESOURCE_GROUP \
  --docker-container-logging filesystem
```

### 4.8 Restart Applications
```bash
# Restart backend
az webapp restart --name uis-backend-app --resource-group $RESOURCE_GROUP

# Restart frontend
az webapp restart --name lk-uis --resource-group $RESOURCE_GROUP
```

---

## 🧪 STEP 5: Testing Deployment

### 5.1 Wait for Services to Start
```bash
# Wait 2-3 minutes for Azure services to fully start
```

### 5.2 Test Backend
```bash
# Test health endpoint
curl https://uis-backend-app.azurewebsites.net/health

# Test API endpoint
curl -X POST https://uis-backend-app.azurewebsites.net/api/auth/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 5.3 Test Frontend
```bash
# Test frontend
curl -I https://lk-uis.azurewebsites.net
```

### 5.4 Manual Browser Testing
1. Open browser and go to: `https://lk-uis.azurewebsites.net`
2. Try to register a new account
3. Check if API calls are working
4. Verify email verification flow

---

## 🔍 STEP 6: Troubleshooting

### 6.1 Check Application Logs
```bash
# Backend logs
az webapp log tail --name uis-backend-app --resource-group uis-rg

# Frontend logs
az webapp log tail --name lk-uis --resource-group uis-rg
```

### 6.2 Check App Settings
```bash
# Backend settings
az webapp config appsettings list --name uis-backend-app --resource-group uis-rg --output table

# Frontend settings
az webapp config appsettings list --name lk-uis --resource-group uis-rg --output table
```

### 6.3 Common Issues and Solutions

#### Issue: CORS Errors
**Solution:**
```bash
az webapp config appsettings set \
  --name uis-backend-app \
  --resource-group uis-rg \
  --settings CORS_ORIGIN="https://lk-uis.azurewebsites.net"
```

#### Issue: API Not Found (404)
**Solution:**
```bash
az webapp config appsettings set \
  --name lk-uis \
  --resource-group uis-rg \
  --settings NEXT_PUBLIC_API_URL="https://uis-backend-app.azurewebsites.net/api"
```

#### Issue: Database Connection Failed
**Solution:**
1. Verify MongoDB URI is correct
2. Check MongoDB Atlas whitelist includes Azure IPs
3. Ensure database credentials are correct

### 6.4 Force Restart if Needed
```bash
# Stop apps
az webapp stop --name uis-backend-app --resource-group uis-rg
az webapp stop --name lk-uis --resource-group uis-rg

# Start apps
az webapp start --name uis-backend-app --resource-group uis-rg
az webapp start --name lk-uis --resource-group uis-rg
```

---

## ✅ STEP 7: Verification Checklist

### Local Deployment:
- [ ] Backend builds successfully
- [ ] Frontend builds successfully
- [ ] Docker containers start without errors
- [ ] Backend health check returns 200
- [ ] Frontend loads at localhost:3000
- [ ] API endpoints respond correctly

### Azure Deployment:
- [ ] Images pushed to Container Registry
- [ ] Web apps created successfully
- [ ] App settings configured correctly
- [ ] Backend health check returns 200
- [ ] Frontend loads at production URL
- [ ] API calls work from frontend to backend
- [ ] CORS is configured properly
- [ ] Database connection working

---

## 🚀 Final URLs

After successful deployment:

- **Frontend Application:** https://lk-uis.azurewebsites.net
- **Backend API:** https://uis-backend-app.azurewebsites.net/api
- **Backend Health:** https://uis-backend-app.azurewebsites.net/health

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. View application logs in Azure portal
3. Ensure all environment variables are set correctly
4. Verify MongoDB connection string and credentials
