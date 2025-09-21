#!/bin/bash

# Health Notifier Startup Script
# This script starts both the backend and frontend servers

echo "🏥 Health Notifier - Starting Full Stack Application"
echo "=================================================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Check if backend is set up
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend not set up yet. Running setup..."
    cd backend
    python3 setup.py
    cd ..
    echo "✅ Backend setup completed"
    echo "📝 Please edit backend/.env with your API keys before continuing"
    echo "   See backend/API_SETUP_GUIDE.md for instructions"
    read -p "Press Enter when you've configured your API keys..."
fi

# Start backend
echo "🚀 Starting backend server..."
cd backend
python3 main.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if ! curl -s http://localhost:5000/api/health > /dev/null; then
    echo "❌ Backend failed to start. Check backend logs."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Backend is running on http://localhost:5000"

# Start frontend
echo "🚀 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

echo "✅ Frontend is running on http://localhost:3000"
echo ""
echo "🎉 Health Notifier is ready!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
