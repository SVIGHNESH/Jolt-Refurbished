#!/bin/bash

echo "🚀 JOLT Notes - Setup & Start"
echo "=============================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

# Get local IP address
echo "🌐 Getting network information..."
if command -v ip &> /dev/null; then
    LOCAL_IP=$(ip route get 1 2>/dev/null | grep -oP 'src \K\S+')
fi
if [ -z "$LOCAL_IP" ] && command -v hostname &> /dev/null; then
    LOCAL_IP=$(hostname -i 2>/dev/null | awk '{print $1}')
fi
if [ -z "$LOCAL_IP" ] || [ "$LOCAL_IP" == "127.0.0.1" ]; then
    # Fallback: try to get IP from network interfaces
    LOCAL_IP=$(ip addr show 2>/dev/null | grep 'inet ' | grep -v '127.0.0.1' | head -1 | awk '{print $2}' | cut -d/ -f1)
fi

if [ -n "$LOCAL_IP" ] && [ "$LOCAL_IP" != "127.0.0.1" ]; then
    echo "📡 Network access will be enabled at: http://$LOCAL_IP:3000"
else
    echo "⚠️  Could not detect network IP. Will use localhost only."
fi
echo ""

# Start the dev server with network access
echo "🎨 Starting JOLT Notes development server..."
echo "📍 Local:   http://localhost:3000"
if [ -n "$LOCAL_IP" ] && [ "$LOCAL_IP" != "127.0.0.1" ]; then
    echo "📍 Network: http://$LOCAL_IP:3000"
fi
echo ""
echo "💡 Tip: Make sure firewall allows port 3000"
echo "    sudo ufw allow 3000/tcp"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Use environment variable method which is more reliable
export HOSTNAME=0.0.0.0
npm run dev -- --hostname 0.0.0.0
