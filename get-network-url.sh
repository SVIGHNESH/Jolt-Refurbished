#!/bin/bash

echo "🌐 JOLT Notes - Network Access Information"
echo "=========================================="
echo ""

# Get local IP
if command -v ip &> /dev/null; then
    LOCAL_IP=$(ip addr show | grep 'inet ' | grep -v '127.0.0.1' | head -1 | awk '{print $2}' | cut -d/ -f1)
elif command -v hostname &> /dev/null; then
    LOCAL_IP=$(hostname -i 2>/dev/null | awk '{print $1}')
fi

if [ -n "$LOCAL_IP" ] && [ "$LOCAL_IP" != "127.0.0.1" ]; then
    echo "✅ Your Network IP: $LOCAL_IP"
    echo ""
    echo "📱 Share this URL with others on your network:"
    echo "   http://$LOCAL_IP:3000"
    echo ""
    echo "💡 Make sure:"
    echo "   1. Server is running (use ./start.sh or npm run dev:network)"
    echo "   2. Other devices are on the same WiFi/LAN"
    echo "   3. Firewall allows port 3000 (run: sudo ufw allow 3000/tcp)"
    echo ""
else
    echo "❌ Could not detect network IP address"
    echo ""
    echo "Try manually with:"
    echo "  ip addr show"
    echo "  or"
    echo "  hostname -I"
fi
