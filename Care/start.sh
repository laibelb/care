#!/bin/bash

# Start backend server
echo "Starting backend server..."
cd "$(dirname "$0")/backend"
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start web server
echo "Starting web server..."
cd "$(dirname "$0")"
cd web
npm start &
WEB_PID=$!

# Function to kill processes on exit
function cleanup {
  echo "Shutting down servers..."
  kill $BACKEND_PID $WEB_PID
  exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for Ctrl+C
echo "Press Ctrl+C to stop servers"
while true; do
  sleep 1
done