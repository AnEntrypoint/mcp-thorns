# Thorns - Compact Tree-sitter Codebase Analysis

Cross-platform codebase analysis tool using tree-sitter for maximum insight with minimal output.

## Features

- **Cross-platform**: Works on WSL, Linux, Windows, and macOS (arm64/x64)
- **Multi-language**: JavaScript, TypeScript, Python, Rust, Go, C/C++, Java, C#, Ruby, PHP, JSON
- **Compact output**: Dense, information-rich statistics
- **Fast**: Native tree-sitter parsing with prebuilt binaries
- **No build required**: Pure JavaScript with native bindings

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

Analyze current directory:
```bash
npx thorns
```

Analyze specific directory:
```bash
npx thorns /path/to/codebase
```

Local usage after install:
```bash
node index.js [directory]
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

Legend:
- Header: `files` `lines` `functions` `classes` `avg_complexity` `avg_depth`
- Lang: 2-letter code, % of codebase, files(f), lines(L), functions(fn), classes(c), imports(i), exports(e), complexity(cx)
- fn: Most common function signatures with parameter count
- cls: Most common class/struct/interface names
- imports: Most frequently used imports (deduplicated)
- calls: Most common API/function calls
- hotspots: Files with high complexity(cx) or depth(d)

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