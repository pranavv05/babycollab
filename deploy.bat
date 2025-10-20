@echo off
title Baby Collab Deployment Script

echo 🚀 Starting deployment process...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo 🟢 Node.js is installed
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo Version: %NODE_VERSION%
) else (
    echo ❌ Node.js is not installed. Please install Node.js.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% == 0 (
    echo 📦 npm is installed
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo Version: %NPM_VERSION%
) else (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

REM Install dependencies
echo.
echo 📥 Installing dependencies...
call npm ci
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Build the application
echo.
echo 🏗️  Building the application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

echo.
echo Choose your deployment option:
echo 1. Railway.app (recommended)
echo 2. Render.com
echo 3. Docker (local - requires Docker Desktop)
echo 4. Manual deployment
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo 🚢 Deploying to Railway.app
    echo Please visit https://railway.app and follow the deployment instructions in ALTERNATIVE_DEPLOYMENT_PLATFORMS.md
) else if "%choice%"=="2" (
    echo 🚢 Deploying to Render.com
    echo Please visit https://render.com and follow the deployment instructions in ALTERNATIVE_DEPLOYMENT_PLATFORMS.md
) else if "%choice%"=="3" (
    echo 🚢 Deploying with Docker locally
    docker-compose up --build
) else if "%choice%"=="4" (
    echo 🚢 Manual deployment
    echo Please follow the deployment instructions in ALTERNATIVE_DEPLOYMENT_PLATFORMS.md
) else (
    echo Invalid choice. Please run the script again and select a valid option.
)

echo.
echo For detailed deployment instructions, please check ALTERNATIVE_DEPLOYMENT_PLATFORMS.md
pause