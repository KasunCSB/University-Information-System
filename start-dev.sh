#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}==========================================="
echo "    University Information System"
echo "         Development Setup"
echo -e "===========================================${NC}"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}[INFO] Node.js version:${NC}"
node --version
echo

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Install dependencies for backend
echo -e "${YELLOW}[STEP 1/6] Installing backend dependencies...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing npm packages for backend..."
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}[ERROR] Failed to install backend dependencies${NC}"
        exit 1
    fi
else
    echo "Backend dependencies already installed"
fi

# Build backend
echo
echo -e "${YELLOW}[STEP 2/6] Building backend...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Backend build failed${NC}"
    exit 1
fi
echo -e "${GREEN}Backend build completed successfully!${NC}"

# Navigate back to root and install frontend dependencies
cd ..
echo
echo -e "${YELLOW}[STEP 3/6] Installing frontend dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Installing npm packages for frontend..."
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}[ERROR] Failed to install frontend dependencies${NC}"
        exit 1
    fi
else
    echo "Frontend dependencies already installed"
fi

# Build frontend
echo
echo -e "${YELLOW}[STEP 4/6] Building frontend...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Frontend build failed${NC}"
    exit 1
fi
echo -e "${GREEN}Frontend build completed successfully!${NC}"

# Start backend in background
echo
echo -e "${YELLOW}[STEP 5/6] Starting backend server...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo
echo -e "${YELLOW}[STEP 6/6] Starting frontend development server...${NC}"
cd ..
echo
echo -e "${BLUE}==========================================="
echo "    Servers Starting..."
echo "==========================================="
echo "Backend:  http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo "API Docs: http://localhost:3001/health"
echo -e "===========================================${NC}"
echo
echo "Press Ctrl+C to stop both servers"
echo

# Function to handle cleanup
cleanup() {
    echo
    echo -e "${YELLOW}[INFO] Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    echo -e "${GREEN}[INFO] Servers stopped${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start frontend
npm run dev

# If we reach here, frontend stopped
cleanup
