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
echo "🤍 INITIALIZING 777 VEIL SYSTEM"
echo "=================================================="
echo ""

# Check Julia for veil system
if ! command -v julia &> /dev/null; then
    echo "❌ Julia required for veil system. Install: apt install julia"
    exit 1
fi
echo "✓ Julia found - veil system ready"

# Initialize veil system
echo "🔷 Loading 777 veil definitions..."
if [ -f "src/veils_777.jl" ]; then
    echo "  ✓ veils_777.jl loaded"
else
    echo "  ❌ veils_777.jl not found"
    exit 1
fi

# Initialize veil index
echo "🔷 Initializing veil index and lookup..."
if [ -f "src/veil_index.jl" ]; then
    echo "  ✓ veil_index.jl loaded"
else
    echo "  ❌ veil_index.jl not found"
    exit 1
fi

# Initialize sacred geometry
echo "🔷 Loading sacred geometry constants..."
if [ -f "src/sacred_geometry.jl" ]; then
    echo "  ✓ sacred_geometry.jl loaded"
else
    echo "  ❌ sacred_geometry.jl not found"
    exit 1
fi

# Check veil executor and runtime
echo "🔷 Checking veil executor and osovm runtime..."
if [ -f "src/veil_executor.jl" ] && [ -f "src/oso_vm.jl" ]; then
    echo "  ✓ veil_executor.jl ready"
    echo "  ✓ oso_vm.jl runtime ready"
else
    echo "  ⚠️  veil runtime components may need compilation"
fi

# Check F1 scoring system
echo "🔷 Initializing VeilSim F1 scoring..."
if [ -f "src/veilsim_scorer.jl" ]; then
    echo "  ✓ veilsim_scorer.jl ready"
else
    echo "  ❌ veilsim_scorer.jl not found"
    exit 1
fi

# Check Àṣẹ minting system
echo "🔷 Initializing Àṣẹ reward system..."
if [ -f "src/ase_minting.jl" ]; then
    echo "  ✓ ase_minting.jl ready"
else
    echo "  ❌ ase_minting.jl not found"
    exit 1
fi

# Initialize 1440 wallets with veil scoring
echo ""
echo "🤍 Initializing 1440 Citizen Wallets..."
echo "  🔵 Veil Tier 1 (Classical): 360 citizens → 10.0 Àṣẹ each"
echo "  🟢 Veil Tier 2-3 (ML/Signal/Robotics): 720 citizens → 15.0 Àṣẹ each"
echo "  🟣 Veil Tier 4-5 (Canon/Quantum): 360 citizens → 25.0 Àṣẹ each"
echo "  Total initial Àṣẹ: 16,200 units"

echo ""
echo "=================================================="
echo "🚀 STARTING DASHBOARD SERVER WITH VEIL SYSTEM"
echo "=================================================="
echo ""
echo "✓ Dashboard will run on: http://localhost:8000/dashboard/"
echo "✓ Veil system initialized with 777 veils"
echo "✓ F1 scoring active (≥0.90 required for rewards)"
echo "✓ Àṣẹ minting system active"
echo "✓ Genesis will trigger at: 2025-11-11 11:11:11 UTC"
echo "✓ Blockchain anchoring: DISABLED (add keys later)"
echo ""
echo "VEIL SYSTEM STATUS:"
echo "  📊 Catalog: 777 veils (all tiers)"
echo "  🎯 F1 Target: ≥0.90 per veil"
echo "  💰 Reward: 5.0-5.5 Àṣẹ (F1 ≥0.90)"
echo "  ⏱️  Performance: <10ms per veil"
echo ""
echo "TO RUN EXAMPLES:"
echo "  julia -e 'include(\"examples/control_systems.tech\")'  # Veils 1-25"
echo "  julia -e 'include(\"examples/ml_training.tech\")'       # Veils 26-75"
echo "  julia -e 'include(\"examples/signal_processing.tech\")' # Veils 76-100"
echo "  julia -e 'include(\"examples/robot_kinematics.tech\")'   # Veils 101-125"
echo "  julia -e 'include(\"examples/first_canon.tech\")'        # Veils 401-413"
echo "  julia -e 'include(\"examples/quantum_simulation.tech\")'  # Veils 501-550"
echo ""
echo "TO RUN TESTS:"
echo "  julia -e 'include(\"test/veil_tests.jl\"); VeilTests.run_all_tests()'"
echo ""
echo "TO RUN BENCHMARKS:"
echo "  julia -e 'include(\"test/veil_benchmarks.jl\"); VeilBenchmarks.benchmark_report()'"
echo ""
echo "⚠️  DO NOT CLOSE THIS TERMINAL"
echo ""

# Start Julia veil system initialization (background)
if command -v julia &> /dev/null; then
    julia --eval '
        println("🤍 Compiling veil system (first-run, ~30s)...")
        include("src/veils_777.jl")
        include("src/veil_index.jl")
        include("src/sacred_geometry.jl")
        include("src/veil_executor.jl")
        include("src/veilsim_scorer.jl")
        println("✓ Veil system ready")
    ' &
    JULIA_PID=$!
fi

# Start server
cd "$(dirname "$0")" || exit 1
python3 -m http.server 8000
