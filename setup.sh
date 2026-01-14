#!/bin/bash
# Quick start script for HR Ticket Triage System
# Launches all three services in separate terminal tabs/windows

set -e

echo "🚀 HR Ticket Triage System - Quick Start"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "${BLUE}📦 Step 1: Setting up Backend (Python Virtual Environment)${NC}"
cd "$SCRIPT_DIR/backend"

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment and installing dependencies..."
source venv/bin/activate
pip install -q -r requirements.txt

echo "Generating mock data..."
python3 app/services/mock_data.py

echo -e "${GREEN}✓ Backend setup complete${NC}"
echo ""

echo -e "${BLUE}📦 Step 2: Setting up Frontend (Node.js)${NC}"
cd "$SCRIPT_DIR/frontend"

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

echo -e "${GREEN}✓ Frontend setup complete${NC}"
echo ""

echo "========================================"
echo -e "${GREEN}✨ Setup Complete!${NC}"
echo ""
echo "To start the system, run these commands in 2 separate terminals:"
echo ""
echo -e "${YELLOW}Terminal 1 - Backend:${NC}"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo -e "${YELLOW}Terminal 2 - Frontend (with integrated analytics):${NC}"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then visit:"
echo "  🌐 Application: http://localhost:5173"
echo "  📊 Analytics: http://localhost:5173/analytics (integrated)"
echo "  🔧 API Docs: http://localhost:8000/docs"
echo ""

