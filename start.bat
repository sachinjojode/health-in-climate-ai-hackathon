@echo off
REM Health Notifier Startup Script for Windows
REM This script starts both the backend and frontend servers

echo 🏥 Health Notifier - Starting Full Stack Application
echo ==================================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Check if backend is set up
if not exist "backend\.env" (
    echo ⚠️  Backend not set up yet. Running setup...
    cd backend
    python setup.py
    cd ..
    echo ✅ Backend setup completed
    echo 📝 Please edit backend\.env with your API keys before continuing
    echo    See backend\API_SETUP_GUIDE.md for instructions
    pause
)

REM Start backend
echo 🚀 Starting backend server...
start "Backend Server" cmd /k "cd backend && python main.py"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend
echo 🚀 Starting frontend server...
start "Frontend Server" cmd /k "npm run dev"

echo ✅ Both servers are starting...
echo 🎉 Health Notifier is ready!
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
echo Press any key to exit...
pause >nul
