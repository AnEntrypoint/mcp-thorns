import { relative, dirname, resolve, join, extname } from 'path';

export function extractDependencies(tree, sourceCode, filePath, lang) {
  const deps = {
    imports: new Set(),
    exports: new Set(),
    importPaths: new Set(),
    exportedNames: new Set()
  };

  function extractImportPath(node) {
    // Find string literal in import statement
    for (const child of node.children) {
      if (child.type === 'string' || child.type === 'string_literal' ||
          child.type === 'interpreted_string_literal') {
        return child.text.replace(/['"]/g, '');
      }
    }
    return null;
  }

  function extractExportedName(node) {
    for (const child of node.children) {
      if (child.type.includes('identifier') || child.type.includes('name')) {
        return child.text;
      }
      if (child.type.includes('declaration')) {
        return extractExportedName(child);
      }
    }
    return null;
  }

  function traverse(node) {
    const type = node.type;

    // Import statements
    if (type === 'import_statement' || type === 'import_from_statement' ||
        type === 'import_declaration' || type === 'use_declaration') {
      const path = extractImportPath(node);
      if (path) {
        deps.importPaths.add(path);
        deps.imports.add(node.text.slice(0, 80));
      }
    }

    // Export statements
    if (type.includes('export')) {
      const name = extractExportedName(node);
      if (name) {
        deps.exportedNames.add(name);
      }
      deps.exports.add(node.text.slice(0, 80));
    }

    for (const child of node.children) {
      traverse(child);
    }
  }

  traverse(tree.rootNode);
  return deps;
}

export function buildDependencyGraph(fileAnalysis) {
  const graph = {
    nodes: new Map(),
    edges: [],
    orphans: new Set(),
    entryPoints: new Set(),
    coupling: new Map()
  };

  // Create nodes
  for (const [path, data] of Object.entries(fileAnalysis)) {
    graph.nodes.set(path, {
      imports: data.imports,
      exports: data.exports,
      importPaths: data.importPaths,
      exportedNames: data.exportedNames,
      importedBy: new Set(),
      importsFrom: new Set()
    });
  }

  // Build edges
  for (const [fromPath, data] of graph.nodes) {
    const fromDir = dirname(fromPath);

    for (const impPath of data.importPaths) {
      // Try to resolve the import to an actual file
      const resolved = resolveImport(impPath, fromDir, fileAnalysis);
      if (resolved) {
        data.importsFrom.add(resolved);
        const targetNode = graph.nodes.get(resolved);
        if (targetNode) {
          targetNode.importedBy.add(fromPath);
        }
        graph.edges.push({ from: fromPath, to: resolved, type: 'import' });
      }
    }
  }

  // Identify orphans (files not imported by anyone)
  for (const [path, data] of graph.nodes) {
    if (data.importedBy.size === 0) {
      graph.orphans.add(path);
    }
  }

  // Identify entry points (files that don't import anything)
  for (const [path, data] of graph.nodes) {
    if (data.importsFrom.size === 0 && data.importedBy.size > 0) {
      graph.entryPoints.add(path);
    }
  }

  // Calculate coupling (files with most dependencies)
  for (const [path, data] of graph.nodes) {
    const coupling = data.importsFrom.size + data.importedBy.size;
    if (coupling > 0) {
      graph.coupling.set(path, {
        in: data.importedBy.size,
        out: data.importsFrom.size,
        total: coupling
      });
    }
  }

  return graph;
}

function resolveImport(importPath, fromDir, fileAnalysis) {
  // Handle relative imports
  if (importPath.startsWith('.')) {
    const resolved = resolve(fromDir, importPath);

    // Try exact match
    if (fileAnalysis[resolved]) return resolved;

    // Try with common extensions
    const exts = ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs', '/index.js', '/index.ts'];
    for (const ext of exts) {
      const withExt = resolved + ext;
      if (fileAnalysis[withExt]) return withExt;
    }
  }

  // For absolute/package imports, try to find in fileAnalysis
  for (const path of Object.keys(fileAnalysis)) {
    if (path.includes(importPath)) {
      return path;
    }
  }

  return null;
}

export function analyzeModules(fileAnalysis, baseDir) {
  const modules = new Map();

  for (const path of Object.keys(fileAnalysis)) {
    const rel = relative(baseDir, path);
    const parts = rel.split(/[\/\\]/);
    const moduleName = parts[0];

    if (!modules.has(moduleName)) {
      modules.set(moduleName, {
        files: 0,
        imports: 0,
        exports: 0,
        internalDeps: 0,
        externalDeps: 0
      });
    }

    const mod = modules.get(moduleName);
    mod.files++;
  }

  return modules;
}