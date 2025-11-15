#!/bin/bash

# CyberQuest Jr - Linux Setup and Deployment Script
# This script sets up the complete environment and starts the application
set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Print banner
echo -e "${PURPLE}"
echo "██████╗██╗   ██╗██████╗ ███████╗██████╗  ██████╗ ██╗   ██╗███████╗███████╗████████╗    ██╗██████╗ "
echo "██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝    ██║██╔══██╗"
echo "██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝██║   ██║██║   ██║█████╗  ███████╗   ██║       ██║██████╔╝"
echo "██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║  ██   ██║██╔══██╗"
echo "╚██████╗   ██║   ██████╔╝███████╗██║  ██║╚██████╔╝╚██████╔╝███████╗███████║   ██║  ╚█████╔╝██║  ██║"
echo " ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝   ╚════╝ ╚═╝  ╚═╝"
echo -e "${NC}"
echo -e "${GREEN}🛡️  AI-Powered Cybersecurity Gaming Platform for Kids (Google GenAI)${NC}"
echo "========================================================================"
echo ""

# Function to print status messages
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down server...${NC}"
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}

# Trap CTRL+C
trap cleanup SIGINT SIGTERM

# Change to project root directory
cd "$(dirname "$0")/.."

print_status "Starting CyberQuest Jr setup..."

# Check system requirements
print_status "Checking system requirements..."

# Check Python
if command_exists python3; then
    PYTHON_CMD="python3"
    PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
    print_success "Python $PYTHON_VERSION found"
elif command_exists python; then
    PYTHON_CMD="python"
    PYTHON_VERSION=$(python --version 2>&1 | cut -d' ' -f2)
    print_success "Python $PYTHON_VERSION found"
else
    print_error "Python not found! Please install Python 3.8 or higher"
    exit 1
fi

# Check pip
if command_exists pip3; then
    PIP_CMD="pip3"
elif command_exists pip; then
    PIP_CMD="pip"
else
    print_error "pip not found! Please install pip"
    exit 1
fi

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js $NODE_VERSION found"
else
    print_warning "Node.js not found! Installing Node.js..."

    # Install Node.js based on distribution
    if command_exists apt; then
        # Ubuntu/Debian
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif command_exists yum; then
        # RHEL/CentOS
        curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
        sudo yum install -y nodejs npm
    elif command_exists pacman; then
        # Arch Linux
        sudo pacman -S nodejs npm
    else
        print_error "Cannot automatically install Node.js. Please install it manually from https://nodejs.org/"
        exit 1
    fi
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm $NPM_VERSION found"
else
    print_error "npm not found! Please install npm"
    exit 1
fi

# Check Python version compatibility
PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)

if [ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -ge 13 ]; then
    print_warning "Python 3.13+ detected. Some packages may have compatibility issues."
    print_status "Attempting installation with compatibility flags..."

    # Try to use older compatible versions for Python 3.13
    export PIP_NO_BUILD_ISOLATION=false
    export PIP_USE_PEP517=true
fi

# Install Python dependencies
print_status "Installing Python dependencies..."
cd backend
if [ -f "requirements.txt" ]; then
    # For Python 3.13, try installing with specific flags
    if [ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -ge 13 ]; then
        print_status "Using Python 3.13+ compatible installation method..."
        $PIP_CMD install --upgrade pip setuptools wheel
        $PIP_CMD install --no-cache-dir --force-reinstall "sqlalchemy>=2.0.35"
        $PIP_CMD install --no-cache-dir --force-reinstall "google-generativeai>=0.8.0"
        $PIP_CMD install --no-cache-dir --force-reinstall pydantic==2.10.3 pydantic-core==2.27.1
        $PIP_CMD install --no-cache-dir -r requirements.txt --user
    else
        # Install Google GenAI and updated SQLAlchemy first for compatibility
        $PIP_CMD install --upgrade "sqlalchemy>=2.0.35" "google-generativeai>=0.8.0"
        $PIP_CMD install -r requirements.txt --user
    fi

    if [ $? -eq 0 ]; then
        print_success "Python dependencies installed"
        print_success "Google GenAI integration ready!"
    else
        print_error "Failed to install Python dependencies"
        print_warning "If you're using Python 3.13, consider using Python 3.11 or 3.12 instead"
        print_warning "You can install Python 3.12 with: sudo apt install python3.12 python3.12-pip"
        exit 1
    fi
else
    print_error "requirements.txt not found!"
    exit 1
fi

# Install Node.js dependencies and build frontend
print_status "Installing Node.js dependencies..."
cd ../frontend
if [ -f "package.json" ]; then
    npm install
    print_success "Node.js dependencies installed"

    print_status "Building frontend..."
    npm run build
    print_success "Frontend built successfully"

    # Copy build files to backend/static
    print_status "Copying frontend build to backend/static..."
    cd ..
    mkdir -p backend/static
    cp -r frontend/dist/* backend/static/
    print_success "Frontend files copied to backend/static"
else
    print_error "package.json not found!"
    exit 1
fi

# Go back to project root
cd backend

# Check environment configuration
print_status "Checking environment configuration..."
if [ -f ".env" ]; then
    # Check if Google GenAI API key is configured
    if grep -q "GEMINI_API_KEY=$" .env || ! grep -q "GEMINI_API_KEY=" .env; then
        print_warning "Google GenAI API key not configured!"
        echo "Please add your Google GenAI API key to backend/.env:"
        echo "1. Get your API key from https://ai.google.dev/"
        echo "2. Edit backend/.env and set GEMINI_API_KEY=your_actual_key"
        echo "3. Make sure you have access to the Gemini API"
        echo ""
        print_status "Current .env file content:"
        cat .env
        echo ""
        read -p "Press Enter to continue once you've added your API key..."
    else
        print_success "Environment configuration found"
        print_success "Google GenAI API key configured"
    fi
else
    print_warning "Environment file not found! Creating backend/.env..."
    echo "# Google GenAI Configuration" > .env
    echo "GEMINI_API_KEY=" >> .env
    echo "DATABASE_URL=sqlite:///./cyberquest_game.db" >> .env
    echo ""
    print_warning "Please add your Google GenAI API key to backend/.env"
    echo "1. Get your API key from https://ai.google.dev/"
    echo "2. Edit backend/.env and set GEMINI_API_KEY=your_actual_key"
    echo ""
    read -p "Press Enter to continue once you've added your API key..."
fi

# Clean up any existing processes
print_status "Cleaning up existing processes..."
pkill -f "python.*app.py" 2>/dev/null || true
pkill -f "uvicorn" 2>/dev/null || true

# Start the unified server
print_status "Starting CyberQuest Jr unified server..."

echo ""
echo -e "${GREEN}🎮 Starting CyberQuest Jr Gaming Platform...${NC}"
echo -e "${BLUE}🤖 AI-powered cybersecurity education for kids${NC}"
echo -e "${YELLOW}🌐 Server will be available at: http://localhost:8000${NC}"
echo ""
echo -e "${PURPLE}Press CTRL+C to stop the server${NC}"
echo ""

# Start the server
$PYTHON_CMD app.py
