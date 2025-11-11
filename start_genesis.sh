#!/bin/bash
# 🤍🗿⚖️🕊️🌄
# ỌBÀTÁLÁ GENESIS v8 — STARTUP SCRIPT

echo "=================================================="
echo "🤍🗿⚖️🕊️🌄 GENESIS STARTUP v8"
echo "=================================================="
echo ""

# Get current time
NOW=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
GENESIS="2025-11-11 11:11:11 UTC"

echo "📍 Current Time: $NOW"
echo "📍 Genesis Time: $GENESIS"
echo ""

# Check prerequisites
echo "⚙️  Checking prerequisites..."

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Install: apt install python3"
    exit 1
fi
echo "✓ Python 3 found"

# Check Julia
if ! command -v julia &> /dev/null; then
    echo "⚠️  Julia not found. Recommend: apt install julia"
fi
echo "✓ Julia available (or will be needed at genesis)"

# Check files
echo ""
echo "📂 Checking required files..."

FILES=(
    "dashboard/index.html"
    "dashboard/app.js"
    "dashboard/style.css"
    "genesis_handshake_v8.tech"
    "whisper_ase_v8.jl"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ❌ $file NOT FOUND"
    fi
done

echo ""
echo "⏳ Generating files needed at genesis..."

# Create placeholder for genesis_whisper.wav if not exists
if [ ! -f "genesis_whisper.wav" ]; then
    echo "  ⚠️  genesis_whisper.wav missing (will be generated at Step 4)"
fi

# Create placeholder for world_id_proof.json if not exists
if [ ! -f "world_id_proof.json" ]; then
    echo "  ⚠️  world_id_proof.json missing (verify at world.id/bino.1111)"
fi

echo ""
echo "=================================================="
echo "🚀 STARTING DASHBOARD SERVER"
echo "=================================================="
echo ""
echo "✓ Dashboard will run on: http://localhost:8000/dashboard/"
echo "✓ Genesis will trigger at: 2025-11-11 11:11:11 UTC"
echo "✓ Audio capture: DISABLED (add whisper later)"
echo "✓ Blockchain anchoring: DISABLED (add keys later)"
echo ""
echo "TO CUSTOMIZE:"
echo "  export GENESIS_WHISPER='your message here'"
echo "  export SKIP_AUDIO=false  (when ready with genesis_whisper.wav)"
echo "  export SKIP_ANCHORING=false  (when ready with blockchain keys)"
echo ""
echo "⚠️  DO NOT CLOSE THIS TERMINAL"
echo ""

# Start server
cd "$(dirname "$0")" || exit 1
python3 -m http.server 8000
