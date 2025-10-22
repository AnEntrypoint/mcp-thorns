# Thorns - Ultra-Compact Codebase Intelligence

**Maximum structural insight with minimum tokens.** Replaces mermaid flow charts with instant, self-explanatory architecture analysis.

## ✨ What It Does

Thorns provides an **instant structural overview** of any codebase in a format that's:
- **Ultra-compact** - Zero waste, maximum information density
- **Self-explanatory** - Any agent can understand without prior knowledge
- **Comprehensive** - Entry points, flow patterns, modules, dependencies, issues
- **Actionable** - Only shows problems that need fixing

## 🎯 Perfect For Hook Mode

```bash
# Instant codebase snapshot for Claude Code hooks
npx mcp-thorns .
```

**Sample Output:**
```
# 166f 35.3kL 267fn 97cls cx8.3

**Langs:** Jav99% JSO1%

## 🔄 Architecture

**Entry:** three(13↓) ↓
**Distributors:** three(13↓) → 13+ files
**Clusters:** src(17f,30cx)
**External:** lodash-es, react, three, @fastify (+2)
**Pattern:** Linear flow system
## 🚨 Issues

- 🔄 Circular: three.js→three.js
- 📋 Duplication: 10 clones (5+ copies)
- 🔥 Complexity: ClientControls.js, Video.js (+50)
- 📁 Large files: Video.js:1166L, UI.js:1113L (+8)

## 📦 Modules

- src: 17f, 30cx (100% activity)
```

## 📊 Ultra-Compact Format

**Abbreviations (intuitive):**
- `f` = files, `L` = lines, `fn` = functions, `cls` = classes, `cx` = complexity
- `↓` = imported by, `↑` = imports from, `→` = flows to
- Numbers in parentheses = connection counts

**Sections Explained:**
- **Header**: File count, lines, functions, classes, average complexity
- **Langs**: Language distribution with percentages
- **Architecture**: Complete import/export flow analysis
  - **Entry**: Entry points (files others depend on)
  - **Core**: Main execution path through system
  - **Distributors**: Files that spread to many consumers
  - **Clusters**: Module groupings with connectivity
  - **External**: Key external dependencies
  - **Pattern**: Architecture type (Linear, Hub-and-spoke, Multi-entry)
- **Issues**: Critical problems needing attention
  - **Circular**: Import cycles breaking architecture
  - **Duplication**: Code clones for consolidation
  - **Complexity**: Files needing refactoring
  - **Large files**: Files too big to maintain
- **Modules**: Structural breakdown by directory

## 🚀 Installation

```bash
# Quick analysis (no installation needed)
npx mcp-thorns [directory]

# Install globally
npm install -g mcp-thorns
thorns [directory]

# Install locally for API use
npm install mcp-thorns
```

## 💻 Usage

### CLI
```bash
# Analyze current directory
npx mcp-thorns

# Analyze specific directory
npx mcp-thorns /path/to/codebase
```

### Programmatic API
```javascript
import { analyze } from 'mcp-thorns';

// Get ultra-compact analysis
const output = analyze('./src');
console.log(output);

// Raw data for custom processing
import { analyzeCodebase, formatUltraCompact } from 'mcp-thorns';
const data = analyzeCodebase('./src');
const formatted = formatUltraCompact(data);
```

## 🏗️ Architecture Insights

Thorns replaces visual flow charts with detailed text analysis:

**Flow Patterns Detected:**
- **Linear flow system**: Sequential execution path
- **Hub-and-spoke architecture**: Central coordinator with satellites
- **Multi-entry system**: Multiple independent entry points
- **Decentralized modules**: Independent components
- **Isolated components**: Disconnected code

**Connection Analysis:**
- **Entry points**: Files with many importers, few dependencies
- **Distributors**: Files that spread code throughout system
- **Core hubs**: Most connected architectural components
- **Orphans**: Unused files (excluding obvious entry points)
- **Clusters**: Logical module groupings

## 🛠️ Supported Languages

- **JavaScript** (.js, .mjs, .cjs, .jsx)
- **TypeScript** (.ts, .tsx)
- **Python** (.py)
- **Rust** (.rs)
- **Go** (.go)
- **C/C++** (.c, .cpp, .cc, .cxx, .h, .hpp)
- **Java** (.java)
- **C#** (.cs)
- **Ruby** (.rb)
- **PHP** (.php)
- **JSON** (.json)

## 🚫 Smart Filtering

Automatically ignores build artifacts and non-essential files:
- Build directories: `dist/`, `build/`, `out/`, `target/`
- Dependencies: `node_modules/`, `vendor/`, `Pods/`
- Caches: `.cache/`, `.next/`, `.nuxt/`, `coverage/`
- Config: `.vscode/`, `.idea/`, OS files
- Generated files > 200KB (build artifacts, minified code)

**Files > 200KB are excluded** because they're typically build artifacts, not source code.

## 🎯 Use Cases

### **Hook Mode Integration**
Perfect for Claude Code hooks to provide instant context:
```bash
# Claude Code hook setup
~/.claude/thorns-context-hook.sh
```

### **Code Reviews**
Instant understanding of codebase structure before diving in.

### **Architecture Documentation**
Generate structural overviews for documentation.

### **Refactoring Planning**
Identify complexity hotspots, duplication, and architectural issues.

### **Onboarding**
Quick structural orientation for new team members.

## ⚡ Performance

- **Fast**: ~1000 files/second with native tree-sitter parsers
- **Memory efficient**: Processes files incrementally
- **Smart filtering**: Skips 95%+ of irrelevant files automatically
- **Cross-platform**: Works on WSL, Linux, macOS, Windows

## 🔧 Requirements

- **Node.js** >= 18.0.0
- **No additional dependencies** - tree-sitter parsers included

## 📈 Why Thorns?

1. **Instant Understanding**: Get structural insight in seconds, not hours
2. **Zero Learning Curve**: Output is self-explanatory
3. **Comprehensive**: Replaces multiple analysis tools
4. **Token Efficient**: Perfect for AI assistant integration
5. **Actionable**: Focuses on problems that matter
6. **Universal**: Works across languages and project types

## 🤝 Contributing

Contributions welcome! Please ensure all changes maintain the ultra-compact, self-explanatory output format.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Stop drowning in documentation. Start with insight.** 🚀