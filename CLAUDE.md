# Technical Notes

## Architecture

Tree-sitter AST analyzer for multi-language codebases. Detects dead code, unused exports, circular dependencies, and provides AI-ready context summaries.

## Core Components

- lib.js: Main analysis engine, orchestrates all analyzers
- dependency-analyzer.js: Import/export detection and dependency graph construction
- analyzer.js: Entity extraction (functions, classes, patterns)
- compact-formatter.js: Output formatting for AI consumption
- advanced-metrics.js: Complexity metrics, duplication detection

## Import/Export Detection

Supports both ES6 modules and CommonJS:
- ES6: import/export statements via tree-sitter nodes
- CommonJS: require() calls and module.exports via call_expression nodes
- Dynamic imports: import() expressions

Resolution handles relative paths, extensions (.js/.ts/.jsx/.tsx/.mjs/.cjs), and index files.

## Dead Code Detection Logic

File marked as having unused exports when:
- importedBy.size === 0 (no files import it)
- exportedNames.size > 0 (it has exports)
- NOT an entry point (index/main/app/server)
- NOT a config file

## Recent Fixes (v4.1.0)

Added CommonJS support to eliminate false positives:
- dependency-analyzer.js:46-63: Detects require() calls via call_expression nodes
- dependency-analyzer.js:34-54: Extracts CommonJS export names from module.exports
- dependency-analyzer.js:150-196: Improved import path resolution with better matching logic

Previous issue: Only detected ES6 imports, missing require() usage, causing false positives in mixed codebases.
