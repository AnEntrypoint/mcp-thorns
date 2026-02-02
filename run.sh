#!/bin/bash
# One-liner GitHub execution script for Thorns
# Usage: bash <(curl -fsSL https://raw.githubusercontent.com/AnEntrypoint/mcp-thorns/main/run.sh) [target-path]

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
GITHUB_REPO="AnEntrypoint/mcp-thorns"
GITHUB_BRANCH="main"
GITHUB_RAW="https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}"
TARGET_PATH="${1:-.}"
TEMP_DIR=""

# Cleanup on exit
cleanup() {
  if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
  fi
}
trap cleanup EXIT

# Detect available runtime
detect_runtime() {
  if command -v bun &> /dev/null; then
    echo "bun"
    return 0
  elif command -v node &> /dev/null; then
    echo "node"
    return 0
  else
    echo ""
    return 1
  fi
}

# Create temp directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

echo -e "${YELLOW}📦 Downloading Thorns from GitHub...${NC}"

# Download all necessary files
files=("index.js" "lib.js" "analyzer.js" "compact-formatter.js" "dependency-analyzer.js" "advanced-metrics.js" "ignore-parser.js" "queries.js" ".thornsignore" "package.json")

for file in "${files[@]}"; do
  echo -n "  Fetching $file... "
  if curl -fsSL -o "$file" "${GITHUB_RAW}/${file}"; then
    echo -e "${GREEN}✓${NC}"
  else
    echo -e "${RED}✗ Failed to download $file${NC}"
    exit 1
  fi
done

echo -e "${YELLOW}🔍 Analyzing codebase at: $TARGET_PATH${NC}"

# Detect runtime
RUNTIME=$(detect_runtime)

if [ -z "$RUNTIME" ]; then
  echo -e "${RED}Error: Neither 'bun' nor 'node' found in PATH${NC}"
  echo "Please install one of:"
  echo "  - Bun: curl -fsSL https://bun.sh/install | bash"
  echo "  - Node: https://nodejs.org/"
  exit 1
fi

echo -e "${YELLOW}Using runtime: $RUNTIME${NC}"

# Execute thorns
if [ "$RUNTIME" = "bun" ]; then
  bun index.js "$TARGET_PATH"
else
  node index.js "$TARGET_PATH"
fi
