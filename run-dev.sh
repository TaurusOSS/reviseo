#!/bin/bash

echo "🚀 Starting Reviseo in development mode..."
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup INT TERM

echo "🔧 Starting backend..."
./gradlew :backend:bootRun &
BACKEND_PID=$!

sleep 5

echo "📱 Starting frontend..."
./gradlew :frontend:npmDev &
FRONTEND_PID=$!

wait