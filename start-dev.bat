@echo off
echo ===========================================
echo    University Information System
echo         Development Setup
echo ===========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js version:
node --version
echo.

:: Navigate to project root
cd /d %~dp0

:: Install dependencies for backend
echo [STEP 1/6] Installing backend dependencies...
cd backend
if not exist node_modules (
    echo Installing npm packages for backend...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed
)

:: Build backend
echo.
echo [STEP 2/6] Building backend...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Backend build failed
    pause
    exit /b 1
)
echo Backend build completed successfully!

:: Navigate back to root and install frontend dependencies
cd ..
echo.
echo [STEP 3/6] Installing frontend dependencies...
if not exist node_modules (
    echo Installing npm packages for frontend...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed
)

:: Build frontend
echo.
echo [STEP 4/6] Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed
    pause
    exit /b 1
)
echo Frontend build completed successfully!

:: Start backend in background
echo.
echo [STEP 5/6] Starting backend server...
cd backend
start "UIS Backend" cmd /k "echo Starting UIS Backend Server... && npm run dev"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend
echo.
echo [STEP 6/6] Starting frontend development server...
cd ..
echo.
echo ===========================================
echo    Servers Starting...
echo ===========================================
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:3001/health
echo ===========================================
echo.
echo Press Ctrl+C to stop the frontend server
echo The backend server is running in a separate window
echo.

call npm run dev

echo.
echo [INFO] Frontend server stopped
echo [INFO] Backend server is still running in the background
echo [INFO] Close the backend window manually if needed
pause
