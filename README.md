# Thorns - Ultra-Compact Codebase Intelligence

Cross-platform codebase analysis using tree-sitter for maximum insight with minimal output.

## Features

- **Cross-platform**: WSL, Linux, Windows, macOS (arm64/x64)
- **12 languages**: JavaScript, TypeScript, Python, Rust, Go, C/C++, Java, C#, Ruby, PHP, JSON
- **Dependency graph**: File-level imports, orphans, circular deps
- **Code duplication**: AST-based clone detection
- **Coupling metrics**: Most connected files
- **File sizes**: Distribution and largest files
- **Identifier usage**: Most common variables/functions
- **Complexity hotspots**: High cx/depth files
- **Ultra-compact**: Zero unnecessary tokens
- **Fast**: Native parsers, ~1000 files/sec

## Installation

```bash
npx thorns [directory]
```

Or install globally:

```bash
npm install -g thorns
thorns [directory]
```

Or install locally:

```bash
npm install
```

## Usage

### CLI

Analyze current directory:
```bash
npx mcp-thorns
```

Analyze specific directory:
```bash
npx mcp-thorns /path/to/codebase
```

### Programmatic API

```javascript
import { analyze } from 'mcp-thorns';

// Get ultra-compact analysis as a string
const output = analyze('./path/to/codebase');
console.log(output);

// Or use the raw functions for custom formatting
import { analyzeCodebase, formatUltraCompact } from 'mcp-thorns';

const data = analyzeCodebase('./path/to/codebase');
const formatted = formatUltraCompact(data);
```

## Output Format

Ultra-compact cheat sheet with maximum information density:

```
━━━ 47f 8.5kL 44fn 5cls cx:7.9 d:21.7 ━━━
JA 97% 40f 8.3kL 44fn 5c 575i 96e cx:7.9
JS 3% 7f 214L 0fn 0c 0i 0e cx:0
━━━ fn ━━━
7× Ja:main(1)
6× Ja:uuid(1)
5× Ja:createApp(1)
4× Ja:verifyApps(1)
3× Ja:processNextApp(1)
━━━ cls ━━━
2× Ja:StatelessMCPTools
2× Ja:ValidationSystem
━━━ imports ━━━
2× import { CallToolRequestSchema...
1× import WebSocket from 'ws';
━━━ calls ━━━
504× console.log
63× ws.on
51× setTimeout
━━━ ⚠ hotspots ━━━
cx:57 d:19 src/validation-system.js
cx:20 d:28 src/stateless-mcp-tools-basic.js
```

**Legend:**
- `KEY`: Abbreviations used throughout
- `TOT`: Total files, lines, functions, classes, avg complexity, avg depth, orphans, duplicates, circular deps
- Language rows: % of codebase, file/line/function/class/import/export counts, avg complexity
- `TOP_FN`: Most common function signatures (count × lang : signature)
- `TOP_CLS`: Most common classes
- `TOP_IMP`: Most frequent imports
- `TOP_CALLS`: Most called functions/APIs
- `HOT`: Complexity hotspots (cx=complexity, d=depth)
- `ORPH`: Orphaned files (not imported anywhere)
- `COUP`: Coupling (files with most dependencies, in=imported by, out=imports from)
- `DUP`: Duplicate code (count × hash : files)
- `CIRC`: Circular dependencies
- `SIZE`: Largest files
- `DIST`: File size distribution
- `IDS`: Most used identifiers/variables

## Supported Languages

- JavaScript (.js, .mjs, .cjs, .jsx)
- TypeScript (.ts, .tsx)
- Python (.py)
- Rust (.rs)
- Go (.go)
- C (.c, .h)
- C++ (.cpp, .cc, .cxx, .hpp)
- Java (.java)
- C# (.cs)
- Ruby (.rb)
- PHP (.php)
- JSON (.json)

## Ignored Directories

Automatically skips: `node_modules`, `.git`, `dist`, `build`, `coverage`, `.next`, `out`, `vendor`, `target`

## Requirements

- Node.js >= 18.0.0
- Prebuilt binaries download automatically for supported platforms

## How It Works

1. Walks directory tree, filtering by extension
2. Parses each file with tree-sitter
3. Analyzes AST for functions, classes, imports, exports, complexity
4. Aggregates statistics by language
5. Outputs compact summary

## Performance

- Skips files > 1MB
- Uses native parsers (not WASM)
- Minimal memory footprint
- Processes ~1000 files/second on modern hardware