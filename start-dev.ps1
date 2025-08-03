# University Information System - Development Setup Script
# PowerShell version for Windows

Write-Host "===========================================" -ForegroundColor Blue
Write-Host "    University Information System" -ForegroundColor Blue
Write-Host "         Development Setup" -ForegroundColor Blue
Write-Host "===========================================" -ForegroundColor Blue
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[INFO] Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# Function to run commands with error checking
function Invoke-SafeCommand {
    param(
        [string]$Command,
        [string]$WorkingDirectory = ".",
        [string]$Description
    )
    
    Write-Host "Running: $Command" -ForegroundColor Cyan
    
    Push-Location $WorkingDirectory
    try {
        Invoke-Expression $Command
        if ($LASTEXITCODE -ne 0) {
            throw "Command failed with exit code $LASTEXITCODE"
        }
        Write-Host "✅ $Description completed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ $Description failed: $_" -ForegroundColor Red
        Pop-Location
        Read-Host "Press Enter to exit"
        exit 1
    } finally {
        Pop-Location
    }
}

# Step 1: Install backend dependencies
Write-Host "[STEP 1/6] Installing backend dependencies..." -ForegroundColor Yellow
if (!(Test-Path "backend\node_modules")) {
    Invoke-SafeCommand "npm install" "backend" "Backend dependency installation"
} else {
    Write-Host "Backend dependencies already installed" -ForegroundColor Green
}

# Step 2: Build backend
Write-Host ""
Write-Host "[STEP 2/6] Building backend..." -ForegroundColor Yellow
Invoke-SafeCommand "npm run build" "backend" "Backend build"

# Step 3: Install frontend dependencies
Write-Host ""
Write-Host "[STEP 3/6] Installing frontend dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Invoke-SafeCommand "npm install" "." "Frontend dependency installation"
} else {
    Write-Host "Frontend dependencies already installed" -ForegroundColor Green
}

# Step 4: Build frontend
Write-Host ""
Write-Host "[STEP 4/6] Building frontend..." -ForegroundColor Yellow
Invoke-SafeCommand "npm run build" "." "Frontend build"

# Step 5: Start backend
Write-Host ""
Write-Host "[STEP 5/6] Starting backend server..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location $args[0]
    Set-Location backend
    npm run dev
} -ArgumentList $ScriptDir

# Wait for backend to start
Start-Sleep -Seconds 3

# Step 6: Start frontend
Write-Host ""
Write-Host "[STEP 6/6] Starting frontend development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "===========================================" -ForegroundColor Blue
Write-Host "    Servers Starting..." -ForegroundColor Blue
Write-Host "===========================================" -ForegroundColor Blue
Write-Host "Backend:  http://localhost:3001" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "API Docs: http://localhost:3001/health" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Blue
Write-Host ""
Write-Host "Press Ctrl+C to stop the frontend server" -ForegroundColor Yellow
Write-Host "The backend server is running in the background" -ForegroundColor Yellow
Write-Host ""

# Start frontend (this will block until stopped)
try {
    npm run dev
} finally {
    # Cleanup: Stop the backend job
    Write-Host ""
    Write-Host "Stopping backend server..." -ForegroundColor Yellow
    Stop-Job $backendJob -PassThru | Remove-Job
    Write-Host "Servers stopped" -ForegroundColor Green
}
