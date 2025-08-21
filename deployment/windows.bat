@echo off
setlocal enabledelayedexpansion

rem CyberQuest Jr - Windows Deployment Script
title CyberQuest Jr - Deployment

echo [INFO] 🧹 Cleaning previous installs and build artifacts...
if exist "frontend\node_modules" rmdir /s /q "frontend\node_modules"
if exist "frontend\dist" rmdir /s /q "frontend\dist"
if exist "frontend\.vite" rmdir /s /q "frontend\.vite"
if exist "backend\__pycache__" rmdir /s /q "backend\__pycache__"
del /q "backend\*.pyc"
if exist "backend\cyberquest.db" del /q "backend\cyberquest.db"
echo [SUCCESS] Old dependencies and build artifacts removed.

echo [INFO] 🚀 Starting CyberQuest Jr deployment...

rem Check Python
python --version >nul 2>&1
if errorlevel 1 (
    py --version >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Python not found! Please install Python 3.8+ from https://python.org
        pause
        exit /b 1
    ) else (
        set PYTHON_CMD=py
        set PIP_CMD=py -m pip
    )
) else (
    set PYTHON_CMD=python
    set PIP_CMD=pip
)

echo [INFO] 📦 Installing Python dependencies...
cd backend
%PIP_CMD% install --upgrade pip
%PIP_CMD% install -r requirements.txt --user
echo [SUCCESS] Python dependencies installed successfully
cd ..

echo [INFO] 📦 Installing Node.js dependencies...
cd frontend
call npm install
echo [SUCCESS] Node.js dependencies installed successfully
call npm run build
echo [SUCCESS] Frontend built successfully
cd ..

echo [INFO] 📁 Copying frontend files to backend...
if exist "backend\static" rmdir /s /q "backend\static"
mkdir "backend\static"
xcopy "frontend\dist\*" "backend\static\" /s /e /y >nul
echo [SUCCESS] Frontend files copied to backend\static

echo [INFO] 🗄️  Initializing database...
cd backend
%PYTHON_CMD% -c "from app import Base, engine; Base.metadata.create_all(bind=engine); print('Database initialized successfully')"
echo [SUCCESS] Database initialized
cd ..

echo [INFO] 🚀 Starting CyberQuest Jr server...
cd backend
%PYTHON_CMD% app.py
