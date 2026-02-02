#!/bin/bash
# Minimal one-liner for running Thorns directly from GitHub
# Requires: bun (or node as fallback)
# Usage: bash <(curl -fsSL https://raw.githubusercontent.com/AnEntrypoint/mcp-thorns/main/one-liner.sh) [path]

set -e
T=$(mktemp -d)
cd "$T"
trap "rm -rf '$T'" EXIT

# Download minimal set of files
for f in index.js lib.js analyzer.js compact-formatter.js dependency-analyzer.js advanced-metrics.js ignore-parser.js queries.js .thornsignore; do
  curl -fsSL -o "$f" "https://raw.githubusercontent.com/AnEntrypoint/mcp-thorns/main/$f"
done

# Fetch package.json for dependencies info (not executed, just for reference)
curl -fsSL -o package.json "https://raw.githubusercontent.com/AnEntrypoint/mcp-thorns/main/package.json"

# Execute with bun if available, fallback to node
if command -v bun &> /dev/null; then
  bun index.js "${1:-.}"
else
  node index.js "${1:-.}"
fi
