#!/bin/bash

echo "🔥 Starting Prompt Roast Application..."

# Kill any existing processes
pkill -f "tsx.*index.ts" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 1

# Start backend in background
echo "🔧 Starting backend server..."
cd server && ../node_modules/.bin/tsx index.ts &
BACKEND_PID=$!
cd ..

# Wait for backend to initialize
sleep 3

# Start frontend in background  
echo "🎨 Starting frontend server..."
cd client && ../node_modules/.bin/vite --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!
cd ..

# Wait for services to start
sleep 3

echo ""
echo "🔥 Prompt Roast is ready!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3000"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""

# Keep script running
wait