@echo off
setlocal enabledelayedexpansion

echo.
echo ██████╗██╗   ██╗██████╗ ███████╗██████╗  ██████╗ ██╗   ██╗███████╗███████╗████████╗    ██╗██████╗
echo ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝    ██║██╔══██╗
echo ██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝██║   ██║██║   ██║█████╗  ███████╗   ██║       ██║██████╔╝
echo ██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║  ██   ██║██╔══██╗
echo ╚██████╗   ██║   ██████╔╝███████╗██║  ██║╚██████╔╝╚██████╔╝███████╗███████║   ██║  ╚█████╔╝██║  ██║
echo  ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝   ╚════╝ ╚═╝  ╚═╝
echo.
echo ^🛡️  AI-Powered Cybersecurity Gaming Platform for Kids (Google GenAI)
echo ========================================================================
echo.

REM Go to project root directory
cd /d "%~dp0\.."

REM Check Python
echo [INFO] Checking Python...
python --version >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Python not found! Please install Python 3.8 or higher.
    echo Visit: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

REM Check Node.js
echo [INFO] Checking Node.js...
node --version >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Node.js not found! Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
cd backend

echo [INFO] Installing Python packages...
python -m pip install --upgrade pip

echo [INFO] Installing core dependencies...
python -m pip install --upgrade pip wheel setuptools

echo [INFO] Installing Google GenAI and FastAPI...
python -m pip install fastapi==0.104.1 "uvicorn[standard]" --no-cache-dir
python -m pip install "google-generativeai>=0.8.0" --no-cache-dir
if !errorlevel! neq 0 (
    echo [ERROR] Failed to install dependencies. Trying alternative mirror...
    python -m pip install fastapi==0.104.1 "uvicorn[standard]" "google-generativeai>=0.8.0" --no-cache-dir --index-url https://pypi.tuna.tsinghua.edu.cn/simple
    if !errorlevel! neq 0 (
        echo [ERROR] Dependency installation failed.
        pause
        exit /b 1
    )
)

echo [INFO] Installing SQLAlchemy and database dependencies...
python -m pip install "sqlalchemy>=2.0.35" python-dotenv==1.0.0 --no-cache-dir
if !errorlevel! neq 0 (
    echo [ERROR] Failed to install database dependencies. Trying alternative mirror...
    python -m pip install sqlalchemy==2.0.23 python-dotenv==1.0.0 --no-cache-dir --index-url https://pypi.tuna.tsinghua.edu.cn/simple
    if !errorlevel! neq 0 (
        echo [ERROR] Database dependencies installation failed.
        pause
        exit /b 1
    )
)

echo [INFO] Installing Pydantic and type hints...
python -m pip install "pydantic>=2.0.0" "typing-extensions>=4.8.0" --no-cache-dir
if !errorlevel! neq 0 (
    echo [ERROR] Failed to install Pydantic. Trying alternative mirror...
    python -m pip install "pydantic>=2.0.0" "typing-extensions>=4.8.0" --no-cache-dir --index-url https://pypi.tuna.tsinghua.edu.cn/simple
    if !errorlevel! neq 0 (
        echo [ERROR] Pydantic installation failed.
        pause
        exit /b 1
    )
)

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
cd ..\frontend
call npm install
if !errorlevel! neq 0 (
    echo [ERROR] Failed to install Node.js packages
    pause
    exit /b 1
)

REM Build frontend
echo [INFO] Building frontend...
call npm run build
if !errorlevel! neq 0 (
    echo [ERROR] Failed to build frontend
    pause
    exit /b 1
)

REM Copy frontend build to backend/static
echo [INFO] Copying frontend build to backend/static...
cd ..
if not exist "backend\static" mkdir backend\static
xcopy frontend\dist backend\static /E /I /Y >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Failed to copy frontend files
    pause
    exit /b 1
)
echo [SUCCESS] Frontend files copied to backend/static

REM Check environment configuration
cd backend
echo [INFO] Checking environment configuration...
if not exist ".env" (
    echo [WARNING] Environment file not found! Creating .env...
    echo # Google GenAI Configuration > .env
    echo GEMINI_API_KEY= >> .env
    echo DATABASE_URL=sqlite:///./cyberquest_game.db >> .env
    echo [WARNING] Please add your Google GenAI API key to backend\.env
    echo 1. Get your API key from https://ai.google.dev/
    echo 2. Edit backend\.env and set GEMINI_API_KEY=your_actual_key
    echo.
    pause
)

REM Start backend server
echo [INFO] Starting CyberQuest Jr server...
echo [INFO] Google GenAI powered cybersecurity gaming platform
echo Server will be available at: http://localhost:8000
echo Press Ctrl+C to stop
echo.

python app.py
pause
