#!/bin/bash
# LinkedSpark Quick Start
# This script sets up and runs LinkedSpark locally

set -e

echo "🏖️ Out Of Office - Quick Start"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Run this script from the linkedspark directory${NC}"
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
npm install

echo ""
echo "🔧 Step 2: Checking Aztec toolchain..."

# Check for nargo
if ! command -v nargo &> /dev/null; then
    echo -e "${YELLOW}Nargo not found. Install with:${NC}"
    echo "  curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash"
    echo "  noirup"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ Nargo found: $(nargo --version)${NC}"
fi

# Check for aztec CLI
if ! command -v aztec &> /dev/null; then
    echo -e "${YELLOW}Aztec CLI not found. For full deployment, install with:${NC}"
    echo "  curl -s https://install.aztec.network | bash"
    echo "  aztecup"
    echo ""
fi

echo ""
echo "🏗️  Step 3: Compiling contract..."
if [ -d "contracts/out_of_office" ]; then
    cd contracts/out_of_office
    if command -v nargo &> /dev/null; then
        nargo compile
        echo -e "${GREEN}✓ Contract compiled${NC}"
    else
        echo -e "${YELLOW}⚠ Skipping compile (nargo not installed)${NC}"
    fi
    cd ../..
fi

echo ""
echo "📝 Step 4: Generating TypeScript bindings..."
if command -v aztec &> /dev/null; then
    npm run codegen || echo -e "${YELLOW}⚠ Codegen skipped${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo -e "${GREEN}  Setup Complete!${NC}"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo ""
echo "1. Start Aztec Sandbox (in new terminal):"
echo "   ${YELLOW}npm run sandbox${NC}"
echo ""
echo "2. Deploy contract (in another terminal):"
echo "   ${YELLOW}npm run deploy:local${NC}"
echo ""
echo "3. Start frontend:"
echo "   ${YELLOW}npm run dev${NC}"
echo ""
echo "4. Open http://localhost:5173"
echo ""
echo "═══════════════════════════════════════════════════════"
echo ""
echo "For full docs, see DEPLOYMENT.md"
echo ""
