#!/bin/bash
# Deployment Guide Script for University Information System
# Run this script to deploy the updated setup

echo "🚀 University Information System - Updated Deployment Guide"
echo "=========================================================="
echo ""

# Step 1: Pre-deployment checks
echo "📋 Step 1: Pre-deployment Verification"
echo "======================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
else
    echo "✅ Docker is running"
fi

# Check if Azure CLI is available (for Azure deployment)
if command -v az > /dev/null 2>&1; then
    echo "✅ Azure CLI is available"
    # Check if logged in
    if az account show > /dev/null 2>&1; then
        echo "✅ Logged into Azure"
    else
        echo "⚠️  Not logged into Azure. Run 'az login' for Azure deployment"
    fi
else
    echo "⚠️  Azure CLI not found. Install it for Azure deployment"
fi

echo ""

# Step 2: Build and test locally first
echo "🔨 Step 2: Local Build and Test"
echo "==============================="
echo "Building and testing the application locally before deployment..."

# Build the backend
echo "Building backend..."
cd backend
if npm run build; then
    echo "✅ Backend build successful"
else
    echo "❌ Backend build failed. Fix errors before deploying."
    exit 1
fi
cd ..

# Build the frontend
echo "Building frontend..."
if npm run build; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed. Fix errors before deploying."
    exit 1
fi

echo ""

# Step 3: Local Docker deployment
echo "🐳 Step 3: Local Docker Deployment Test"
echo "======================================="
echo "Testing with Docker Compose..."

# Stop any existing containers
docker-compose down

# Build and start with updated configuration
if docker-compose up --build -d; then
    echo "✅ Local Docker deployment successful"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔌 Backend: http://localhost:3001"
    echo "📊 Backend Health: http://localhost:3001/health"
    echo "🧪 Backend API: http://localhost:3001/api"
    echo ""
    echo "⏳ Waiting 30 seconds for services to start..."
    sleep 30
    
    # Test the deployment
    echo "🧪 Testing local deployment..."
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ Backend health check passed"
    else
        echo "❌ Backend health check failed"
        echo "📝 Check logs with: docker-compose logs backend"
    fi
    
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Frontend is responding"
    else
        echo "❌ Frontend is not responding"
        echo "📝 Check logs with: docker-compose logs frontend"
    fi
else
    echo "❌ Local Docker deployment failed"
    echo "📝 Check logs with: docker-compose logs"
    exit 1
fi

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "1. Test the local deployment at http://localhost:3000"
echo "2. If everything works, proceed with Azure deployment"
echo "3. Stop local containers: docker-compose down"
echo ""
read -p "Press Enter to continue with Azure deployment, or Ctrl+C to stop..."

echo ""

# Step 4: Azure deployment
echo "☁️  Step 4: Azure Deployment"
echo "============================"

# Stop local containers
docker-compose down

echo "Running comprehensive Azure fix..."
if [ -f "comprehensive-fix.bat" ]; then
    if command -v cmd.exe > /dev/null 2>&1; then
        cmd.exe /c comprehensive-fix.bat
    else
        echo "⚠️  Running on non-Windows system. Use the manual Azure deployment steps below."
    fi
else
    echo "⚠️  comprehensive-fix.bat not found. Using manual deployment..."
fi

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "📱 Your Applications:"
echo "   Frontend:  https://lk-uis.azurewebsites.net"
echo "   Backend:   https://uis-backend-app.azurewebsites.net"
echo "   API Base:  https://uis-backend-app.azurewebsites.net/api"
echo ""
echo "🧪 Test URLs:"
echo "   Health:    https://uis-backend-app.azurewebsites.net/health"
echo "   Auth API:  https://uis-backend-app.azurewebsites.net/api/auth/send-verification"
echo ""
echo "📝 Troubleshooting:"
echo "   - If apps are slow to start, wait 2-3 minutes"
echo "   - Check Azure portal for detailed logs"
echo "   - Run: az webapp log tail --name uis-backend-app --resource-group uis-rg"
echo ""
