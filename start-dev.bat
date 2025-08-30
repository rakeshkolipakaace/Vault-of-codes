@echo off
REM Barter Marketplace Development Startup Script for Windows

echo 🚀 Starting Barter Marketplace Development Environment...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd backend
call npm install

echo 🔧 Setting up backend environment...
if not exist .env (
    copy env.example .env
    echo ✅ Created .env file from template
)

echo 🖥️ Starting backend server...
start "Backend Server" cmd /k "npm run dev"
cd ..

echo 📦 Installing frontend dependencies...
cd frontend
call npm install

echo 🖥️ Starting frontend development server...
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo ✅ Development environment started!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo 📚 API Docs: http://localhost:5000/api/health
echo.
echo Close the command windows to stop the servers
pause 