#!/bin/bash

# CyberQuest Jr - Linux Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}
print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}
print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}
print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "backend/app.py" ] || [ ! -f "frontend/package.json" ]; then
    print_error "Please run this script from the CyberQuestJR root directory"
    exit 1
fi

print_status "🧹 Cleaning previous installs and build artifacts..."
rm -rf frontend/node_modules frontend/dist frontend/.vite
rm -rf backend/__pycache__ backend/*.pyc backend/cyberquest.db
print_success "Old dependencies and build artifacts removed."

print_status "🚀 Starting CyberQuest Jr deployment..."

# Check Python
if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
    PIP_CMD="pip3"
elif command -v python >/dev/null 2>&1; then
    PYTHON_CMD="python"
    PIP_CMD="pip"
else
    print_error "Python not found! Please install Python 3.8+ from https://python.org"
    exit 1
fi

print_status "📦 Installing Python dependencies..."
cd backend
$PIP_CMD install --upgrade pip
$PIP_CMD install -r requirements.txt --user
print_success "Python dependencies installed successfully"
cd ..

print_status "📦 Installing Node.js dependencies..."
cd frontend
npm install
print_success "Node.js dependencies installed successfully"
npm run build
print_success "Frontend built successfully"
cd ..

print_status "📁 Copying frontend files to backend..."
rm -rf backend/static
mkdir -p backend/static
cp -r frontend/dist/* backend/static/
print_success "Frontend files copied to backend/static"

print_status "🗄️  Initializing database..."
cd backend
$PYTHON_CMD -c "from app import Base, engine; Base.metadata.create_all(bind=engine); print('Database initialized successfully')"
print_success "Database initialized"
cd ..

print_status "🚀 Starting CyberQuest Jr server..."
cd backend
$PYTHON_CMD app.py
