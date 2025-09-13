#!/bin/bash

# Start the API server in the background
echo "Starting API server on port 5174..."
cd server && npm start &
API_PID=$!
cd ..

# Wait a moment for the API server to start
sleep 2

# Start the Vite development server
echo "Starting Vite development server..."
npm run dev

# When the script exits, kill the API server
kill $API_PID
