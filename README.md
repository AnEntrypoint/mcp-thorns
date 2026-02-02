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
- **Ultra-comprehensive ignoring**: Auto-loads .gitignore, .dockerignore, .npmignore + 200+ built-in patterns
- **Smart filtering**: Ignores node_modules, target, vendor, dist, build, .cache, etc. across all languages
- **Ultra-compact**: Zero unnecessary tokens
- **Fast**: Native parsers, ~1000 files/sec, skips 96%+ of irrelevant files

## Usage

### Quick Start

Analyze current directory:
```bash
bunx mcp-thorns
```

Analyze specific directory:
```bash
bunx mcp-thorns /path/to/codebase
```

### Install Globally with Bun

```bash
bun add -g mcp-thorns
```

Then use:
```bash
thorns /path/to/codebase
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
- Abbreviations: `f`=files `L`=lines `fn`=functions `cls`=classes `i`=imports `e`=exports `cx`=complexity `d`=AST-depth `(N)`=param-count
- Issues: `orph`=orphaned-files `dup`=duplicate-code `circ`=circular-deps `in/out`=dependency-coupling
- `TOTALS`: Total files, lines, functions, classes, avg complexity, avg depth | Issues counts
- Language rows: % of codebase, file/line/function/class/import/export counts, avg complexity
- `TOP-FUNCTIONS(most-defined)`: Most common function signatures (count × lang : signature)
- `TOP-CLASSES(most-defined)`: Most common classes
- `TOP-IMPORTS(common-deps)`: Most frequent imports
- `TOP-CALLS(frequent-invocations)`: Most called functions/APIs
- `HOTSPOTS(complex-files)`: Complexity hotspots - refactor candidates (cx=complexity, d=depth)
- `ORPHANS(unused-or-entries)`: Files not imported anywhere - potential dead code or entry points
- `COUPLING(central-files)`: Files with most dependencies - central hubs, refactor candidates (in←imports, out→uses)
- `DUPLICATES(code-clones)`: AST-based structural clones - consolidation candidates (count × hash : files)
- `CIRCULAR-DEPS(import-cycles)`: Import cycles - architecture issues
- `LARGEST-FILES(split-candidates)`: Largest files - maintainability risk
- `FILE-SIZE-DISTRIBUTION`: File size distribution by line count
- `TOP-IDENTIFIERS(common-names)`: Most used variable names in codebase

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

## Ignored Directories & Files

Automatically skips 200+ patterns including:
- **VCS**: `.git`, `.svn`, `.hg`, `CVS`
- **Build artifacts**: `dist`, `build`, `out`, `target`, `vendor`
- **Language-specific**: `node_modules`, `__pycache__`, `.gradle`, `Pods`, etc.
- **Caches**: `.cache`, `.next`, `.nuxt`, `.parcel-cache`, `.vite`, `.turbo`
- **IDEs**: `.vscode`, `.idea`, `.vs`, `.sublime-*`
- **Test & coverage**: `.pytest_cache`, `.nyc_output`, `coverage`, `htmlcov`
- **Home directories**: `~/.cache`, `~/.config`, `~/.local`, `~/.npm`, `~/.cargo`, etc. (when analyzing subdirs)
- **Lock files**: `bun.lockb`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
- **Custom patterns**: Loads and merges `.gitignore`, `.dockerignore`, `.npmignore`, `.thornsignore`

Thorns prioritizes speed by ignoring 96%+ of non-code files.

## Requirements

- **Runtime**: Bun >= 1.0
- **Platform**: Linux, macOS, Windows (WSL2), Docker
- Prebuilt binaries download automatically for supported platforms

## Compatibility

✅ **Linux**: Ubuntu, Debian, Alpine, Fedora, Arch
✅ **macOS**: Intel & Apple Silicon (arm64)
✅ **Windows**: WSL2, Git Bash, PowerShell
✅ **Docker**: All Linux images (Alpine, Debian, Ubuntu)
✅ **CI/CD**: GitHub Actions, GitLab CI, Jenkins, CircleCI
✅ **Cloud**: AWS Lambda (with Node/Bun layer), GCP Cloud Functions

## Execution Methods

| Method | Best For | Requirements |
|--------|----------|--------------|
| bunx | Quick analysis | `bun` |
| Bun global | Repeated use | `bun` |
| Programmatic | Integration | Bun |

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
# Triggered npm publishing
