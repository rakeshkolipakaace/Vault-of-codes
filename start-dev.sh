#!/bin/bash

# Barter Marketplace Development Startup Script

echo "🚀 Starting Barter Marketplace Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (optional check)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found in PATH. Make sure MongoDB is installed and running."
fi

# Function to start backend
start_backend() {
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    
    echo "🔧 Setting up backend environment..."
    if [ ! -f .env ]; then
        cp env.example .env
        echo "✅ Created .env file from template"
    fi
    
    echo "🖥️  Starting backend server..."
    npm run dev &
    BACKEND_PID=$!
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    
    echo "🖥️  Starting frontend development server..."
    npm run dev &
    FRONTEND_PID=$!
    cd ..
}

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start both servers
start_backend
start_frontend

echo "✅ Development environment started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo "📚 API Docs: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for both processes
wait 