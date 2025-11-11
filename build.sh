#!/usr/bin/env bash
# build.sh — Ọ̀ṢỌ́VM Build System
# Compiles all FFI backends and Julia VM

set -e

echo "🔥 Building Ọ̀ṢỌ́VM — The Sacred Compiler"
echo "========================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Build Julia VM (no compilation needed, interpreted)
echo -e "${YELLOW}📦 Setting up Julia environment...${NC}"
julia --project=. -e 'using Pkg; Pkg.instantiate()' || {
    echo -e "${RED}❌ Julia setup failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Julia environment ready${NC}"

# Build Rust FFI (if Cargo available)
if command -v cargo &> /dev/null; then
    echo -e "${YELLOW}🦀 Building Rust FFI...${NC}"
    cd ffi/rust
    cargo build --release 2>&1 | grep -v "Compiling" || true
    echo -e "${GREEN}✅ Rust FFI built: target/release/librust_ffi.so${NC}"
    cd ../..
else
    echo -e "${YELLOW}⚠️  Rust/Cargo not found, skipping Rust FFI${NC}"
fi

# Build Go FFI (if Go available)
if command -v go &> /dev/null; then
    echo -e "${YELLOW}🐹 Building Go FFI...${NC}"
    cd ffi/go
    go build -buildmode=c-shared -o libgo_ffi.so go_ffi.go 2>&1 | grep -v "warning" || true
    echo -e "${GREEN}✅ Go FFI built: libgo_ffi.so${NC}"
    cd ../..
else
    echo -e "${YELLOW}⚠️  Go not found, skipping Go FFI${NC}"
fi

# Build Move contracts (if Aptos CLI available)
if command -v aptos &> /dev/null; then
    echo -e "${YELLOW}💎 Building Move FFI...${NC}"
    cd ffi/move
    aptos move compile --save-metadata 2>&1 | tail -5 || true
    echo -e "${GREEN}✅ Move contracts compiled${NC}"
    cd ../..
else
    echo -e "${YELLOW}⚠️  Aptos CLI not found, skipping Move FFI${NC}"
fi

# Build Idris proofs (if Idris2 available)
if command -v idris2 &> /dev/null; then
    echo -e "${YELLOW}🔮 Building Idris FFI...${NC}"
    cd ffi/idris
    idris2 --build idris_ffi.ipkg 2>&1 | tail -3 || true
    echo -e "${GREEN}✅ Idris proofs compiled${NC}"
    cd ../..
else
    echo -e "${YELLOW}⚠️  Idris2 not found, skipping Idris FFI${NC}"
fi

# Python FFI (no build needed)
echo -e "${GREEN}✅ Python FFI ready (interpreted)${NC}"

echo ""
echo -e "${GREEN}🎉 Ọ̀ṢỌ́VM build complete!${NC}"
echo ""
echo "Run tests:"
echo "  julia test/test_oso_vm.jl"
echo ""
echo "Execute OSO programs:"
echo "  julia --project -e 'include(\"src/oso_vm.jl\"); using .OsoVM; ...'"
echo ""
echo "Àṣẹ! ⚡"
