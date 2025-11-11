#!/bin/bash

# BIPỌ̀N39 Genesis Dashboard Launcher
# Bínò ÈL Guà Ọmọ Kọ́dà Àṣẹ

echo "🤍🗿⚖️🕊️🌄"
echo "ỌBÀTÁLÁ — GENESIS DASHBOARD"
echo "======================================"
echo ""
echo "Starting web server..."
echo ""

# Change to osovm directory (parent of dashboard)
cd /data/data/com.termux/files/home/osovm

# Start Python HTTP server on port 8000
echo "Dashboard URL: http://localhost:8000/dashboard/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "Àṣẹ. Àṣẹ. Àṣẹ."
echo "======================================"
echo ""

python -m http.server 8000
