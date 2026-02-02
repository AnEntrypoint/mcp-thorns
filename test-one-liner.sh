#!/bin/bash
# Test script for verifying one-liner execution
# Run this after pushing to GitHub

set -e

echo "=== Testing Thorns One-Liner ==="

# Test 1: One-liner basic execution (current directory)
echo ""
echo "Test 1: One-liner - current directory"
bash <(curl -fsSL https://raw.githubusercontent.com/AnEntrypoint/mcp-thorns/main/one-liner.sh)

# Test 2: One-liner with specific path
echo ""
echo "Test 2: One-liner - specific directory"
bash <(curl -fsSL https://raw.githubusercontent.com/AnEntrypoint/mcp-thorns/main/one-liner.sh) /tmp

# Test 3: Run script with environment check
echo ""
echo "Test 3: Full setup script"
bash <(curl -fsSL https://raw.githubusercontent.com/AnEntrypoint/mcp-thorns/main/run.sh) .

# Test 4: Local execution (if already in repo)
echo ""
echo "Test 4: Local direct execution"
bun index.js . > /dev/null && echo "✓ Bun execution successful"
node index.js . > /dev/null && echo "✓ Node execution successful"

echo ""
echo "=== All tests passed! ==="
