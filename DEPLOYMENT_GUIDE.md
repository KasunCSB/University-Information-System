# Deployment Guide - University Information System

## Issues Identified and Fixed

### 1. API URL Configuration Mismatch
- **Problem**: Frontend was trying to connect to incorrect backend URLs
- **Fix**: Updated all environment configurations to use consistent API paths

### 2. Docker Configuration Issues
- **Problem**: Inconsistent port configurations and missing CORS settings
- **Fix**: Updated Dockerfiles and docker-compose.yml with proper configurations

### 3. Azure Deployment Configuration
- **Problem**: Missing environment variables and incorrect app settings
- **Fix**: Updated deployment scripts with proper Azure configurations

## Deployment Steps

### For Local Development:
1. **Start the development servers:**
   ```bash
   # Option 1: Using Docker Compose (Recommended)
   docker-compose up --build
   
   # Option 2: Manual start
   cd backend && npm run dev
   # In another terminal:
   npm run dev
   ```

2. **Verify local setup:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - Backend Health: http://localhost:3001/health

### For Azure Deployment:

#### Prerequisites:
1. Azure CLI installed and logged in: `az login`
2. Docker installed and running
3. Azure Container Registry created

#### Quick Fix for Existing Deployment:
```bash
# Run the smart fix script
smart-fix-azure.bat
```

#### Full Redeployment:
```bash
# Deploy both frontend and backend
deploy-azure-containers.bat
```

#### Manual Azure Configuration:
If the scripts don't work, configure manually:

1. **Backend App Settings:**
   ```bash
   az webapp config appsettings set \
     --name uis-backend-app \
     --resource-group uis-rg \
     --settings \
     NODE_ENV=production \
     PORT=80 \
     WEBSITES_PORT=3001 \
     MONGODB_URI="your-mongodb-connection-string" \
     JWT_SECRET="your-jwt-secret" \
     JWT_REFRESH_SECRET="your-refresh-secret" \
     EMAIL_USER="your-email@gmail.com" \
     EMAIL_PASS="your-app-password" \
     FRONTEND_URL="https://uis-frontend-app.azurewebsites.net" \
     CORS_ORIGIN="https://uis-frontend-app.azurewebsites.net"
   ```

2. **Frontend App Settings:**
   ```bash
   az webapp config appsettings set \
     --name uis-frontend-app \
     --resource-group uis-rg \
     --settings \
     NODE_ENV=production \
     PORT=80 \
     WEBSITES_PORT=3000 \
     NEXT_PUBLIC_API_URL="https://uis-backend-app.azurewebsites.net/api"
   ```

3. **Restart Apps:**
   ```bash
   az webapp restart --name uis-backend-app --resource-group uis-rg
   az webapp restart --name uis-frontend-app --resource-group uis-rg
   ```

### Testing Deployment:

1. **Backend Health Check:**
   ```
   https://uis-backend-app.azurewebsites.net/health
   ```

2. **Backend API Test:**
   ```
   https://uis-backend-app.azurewebsites.net/api/auth/send-verification
   ```

3. **Frontend Application:**
   ```
   https://uis-frontend-app.azurewebsites.net
   ```

### Troubleshooting:

#### Common Issues:

1. **CORS Errors:**
   - Ensure CORS_ORIGIN in backend matches frontend URL
   - Check that frontend NEXT_PUBLIC_API_URL includes /api path

2. **Database Connection Issues:**
   - Verify MONGODB_URI is correctly set
   - Ensure MongoDB allows connections from Azure

3. **Environment Variable Issues:**
   - Check app settings in Azure portal
   - Ensure all required variables are set
   - Restart apps after changing settings

#### Debugging Commands:

```bash
# Check Azure resources
detect-azure-resources.bat

# Check app configurations
check-azure-config.bat

# View application logs
az webapp log tail --name uis-backend-app --resource-group uis-rg
az webapp log tail --name uis-frontend-app --resource-group uis-rg
```

### Security Notes:

1. **Update Default Secrets:**
   - Change all default JWT secrets
   - Use strong, unique passwords
   - Store secrets in Azure Key Vault for production

2. **Database Security:**
   - Use MongoDB Atlas or Azure Cosmos DB
   - Enable authentication and authorization
   - Whitelist only necessary IP addresses

3. **Environment Variables:**
   - Never commit .env files to version control
   - Use different secrets for different environments
   - Rotate secrets regularly

## Next Steps:

1. **Monitor Application:**
   - Set up Application Insights
   - Configure log aggregation
   - Set up health checks and alerts

2. **Performance Optimization:**
   - Enable CDN for static assets
   - Configure auto-scaling
   - Optimize database queries

3. **Security Hardening:**
   - Implement rate limiting
   - Add input validation
   - Enable HTTPS everywhere
   - Set up Web Application Firewall

## Support:

If you encounter issues:
1. Check the Azure portal for app logs
2. Run the diagnostic scripts
3. Verify all environment variables are set correctly
4. Ensure both apps are running and healthy
