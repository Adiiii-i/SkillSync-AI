#!/bin/bash
# Skillify - Local Hosting Script

# 1. Kill any existing instances on common ports
echo "🛑 Clearing existing Dev ports..."
lsof -i :5173 -t | xargs kill -9 2>/dev/null
lsof -i :8000 -t | xargs kill -9 2>/dev/null

# 2. Start Backend
echo "🚀 Starting Python Backend on port 8000..."
cd "$(dirname "$0")/backend"
source venv/bin/activate
# Ensure OpenAI is latest for NVIDIA compatibility
# pip install --upgrade openai
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# 3. Start Frontend
echo "💻 Starting React Frontend on port 5173..."
cd "../frontend"
npm run dev -- --port 5173 &
FRONTEND_PID=$!

echo "✨ Skillify is now booting up!"
echo "-----------------------------------"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8000 (API Health: http://localhost:8000/)"
echo "-----------------------------------"
echo "Use Ctrl+C here to stop all services."

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
