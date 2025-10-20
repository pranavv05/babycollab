#!/bin/bash

# Deployment script for alternative platforms

echo "🚀 Starting deployment process..."

# Check if Docker is installed
if command -v docker &> /dev/null
then
    echo "🐳 Docker is installed"
else
    echo "⚠️  Docker is not installed. Please install Docker for container deployment."
fi

# Check if Node.js is installed
if command -v node &> /dev/null
then
    echo "🟢 Node.js is installed"
else
    echo "❌ Node.js is not installed. Please install Node.js."
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null
then
    echo "📦 npm is installed"
else
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Install dependencies
echo "📥 Installing dependencies..."
npm ci

# Build the application
echo "🏗️  Building the application..."
npm run build

echo "✅ Build completed successfully!"

echo ""
echo "Choose your deployment option:"
echo "1. Railway.app (recommended)"
echo "2. Render.com"
echo "3. Docker (local)"
echo "4. Docker (cloud - requires Docker registry)"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🚢 Deploying to Railway.app"
        echo "Please visit https://railway.app and follow the deployment instructions in ALTERNATIVE_DEPLOYMENT_PLATFORMS.md"
        ;;
    2)
        echo "🚢 Deploying to Render.com"
        echo "Please visit https://render.com and follow the deployment instructions in ALTERNATIVE_DEPLOYMENT_PLATFORMS.md"
        ;;
    3)
        echo "🚢 Deploying with Docker locally"
        if command -v docker &> /dev/null
        then
            echo "🐳 Building Docker image..."
            docker-compose up --build
        else
            echo "❌ Docker is not installed. Please install Docker first."
        fi
        ;;
    4)
        echo "🚢 Deploying with Docker to cloud"
        echo "Please follow the cloud provider's instructions for deploying Docker containers."
        ;;
    *)
        echo "Invalid choice. Please run the script again and select a valid option."
        ;;
esac

echo ""
echo "For detailed deployment instructions, please check ALTERNATIVE_DEPLOYMENT_PLATFORMS.md"