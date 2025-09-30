export function formatUltraCompact(aggregated) {
  const lines = [];
  const { stats, entities, metrics, depGraph, duplicates, circular, fileSizes, identifiers } = aggregated;

  // Inline legend with explicit explanations
  lines.push('=== CODEBASE ANALYSIS ===');
  lines.push('f=files L=lines fn=functions cls=classes i=imports e=exports cx=complexity d=AST-depth (N)=param-count');
  lines.push('orph=orphaned-files dup=duplicate-code circ=circular-deps in/out=dependency-coupling');
  lines.push('');

  // Header: total metrics
  const totalFn = Object.values(stats.byLanguage).reduce((s, l) => s + l.functions, 0);
  const totalCls = Object.values(stats.byLanguage).reduce((s, l) => s + l.classes, 0);
  const avgCx = totalFn > 0 ? (Object.values(stats.byLanguage).reduce((s, l) => s + l.complexity, 0) / totalFn).toFixed(1) : 0;
  const avgDepth = metrics.depths.length > 0 ? (metrics.depths.reduce((a, b) => a + b, 0) / metrics.depths.length).toFixed(1) : 0;

  lines.push(`TOTALS: ${stats.files}f ${k(stats.totalLines)}L ${totalFn}fn ${totalCls}cls cx${avgCx} d${avgDepth} | Issues: ${depGraph.orphans.size}orph ${duplicates.length}dup ${circular.length}circ`);

  // Language breakdown
  for (const [lang, ls] of Object.entries(stats.byLanguage).sort((a, b) => b[1].lines - a[1].lines)) {
    const cx = ls.functions > 0 ? (ls.complexity / ls.functions).toFixed(1) : 0;
    const ratio = (ls.lines / stats.totalLines * 100).toFixed(0);
    lines.push(`${lang} ${ratio}%: ${ls.files}f ${k(ls.lines)}L ${ls.functions}fn ${ls.classes}cls ${ls.imports}i ${ls.exports}e cx${cx}`);
  }

  // Top functions (most frequently defined)
  const allFuncs = [];
  for (const [lang, ents] of Object.entries(entities)) {
    for (const [sig, data] of ents.functions) {
      allFuncs.push({ lang, sig, ...data });
    }
  }
  const topFuncs = allFuncs.sort((a, b) => b.count - a.count).slice(0, 10);
  if (topFuncs.length > 0) {
    lines.push('TOP-FUNCTIONS(most-defined): ' + topFuncs.map(f => `${f.count}×${f.lang.slice(0,2)}:${f.sig.slice(0,35)}`).join(' | '));
  }

  // Top classes (most frequently defined)
  const allClasses = [];
  for (const [lang, ents] of Object.entries(entities)) {
    for (const [name, data] of ents.classes) {
      allClasses.push({ lang, name, ...data });
    }
  }
  const topClasses = allClasses.sort((a, b) => b.count - a.count).slice(0, 5);
  if (topClasses.length > 0) {
    lines.push('TOP-CLASSES(most-defined): ' + topClasses.map(c => `${c.count}×${c.lang.slice(0,2)}:${c.name}`).join(' | '));
  }

  // Import patterns (most common dependencies)
  const allImports = new Map();
  for (const [lang, ents] of Object.entries(entities)) {
    for (const imp of ents.imports) {
      const key = imp.slice(0, 40);
      allImports.set(key, (allImports.get(key) || 0) + 1);
    }
  }
  const topImports = Array.from(allImports).sort((a, b) => b[1] - a[1]).slice(0, 8);
  if (topImports.length > 0) {
    lines.push('TOP-IMPORTS(common-deps): ' + topImports.map(([i, c]) => `${c}×${i}`).join(' | '));
  }

  // API calls (most frequent function calls)
  const allPatterns = new Map();
  for (const [lang, ents] of Object.entries(entities)) {
    for (const [pattern, count] of ents.patterns) {
      allPatterns.set(pattern, (allPatterns.get(pattern) || 0) + count);
    }
  }
  const topPatterns = Array.from(allPatterns).sort((a, b) => b[1] - a[1]).slice(0, 12);
  if (topPatterns.length > 0) {
    lines.push('TOP-CALLS(frequent-invocations): ' + topPatterns.map(([p, c]) => `${c}×${p}`).join(' '));
  }

  // Hotspots (most complex files - refactor candidates)
  if (metrics.hotspots.length > 0) {
    lines.push('HOTSPOTS(complex-files): ' + metrics.hotspots.slice(0, 5).map(h => `cx${h.cx}d${h.depth}:${h.file}`).join(' | '));
  }

  // Orphans (files not imported anywhere - potential dead code or entry points)
  if (depGraph && depGraph.orphans.size > 0) {
    const orphList = Array.from(depGraph.orphans).slice(0, 10).join(' ');
    lines.push(`ORPHANS(unused-or-entries): ${orphList}`);
  }

  // Coupling (most connected files - central hubs, refactor candidates)
  if (depGraph && depGraph.coupling.size > 0) {
    const topCoupled = Array.from(depGraph.coupling).sort((a, b) => b[1].total - a[1].total).slice(0, 5);
    lines.push('COUPLING(central-files): ' + topCoupled.map(([f, c]) => `${f}(${c.in}←imports ${c.out}→uses)`).join(' | '));
  }

  // Duplicates (similar function implementations - structural clones, consolidation candidates)
  if (duplicates && duplicates.length > 0) {
    lines.push('DUPLICATES(code-clones): ' + duplicates.slice(0, 5).map(d => `${d.count}×copies hash${d.hash.slice(0,4)} in[${d.instances.map(i => i.file.split('/').pop()).join(',')}]`).join(' | '));
  }

  // Circular dependencies (import cycles - architecture issues)
  if (circular && circular.length > 0) {
    lines.push('CIRCULAR-DEPS(import-cycles): ' + circular.slice(0, 3).map(c => c.join('→')).join(' | '));
  }

  // File sizes (maintainability risk - large files harder to maintain)
  if (fileSizes && fileSizes.largest) {
    lines.push('LARGEST-FILES(split-candidates): ' + fileSizes.largest.slice(0, 5).map(s => `${s.file}(${s.lines}L)`).join(' '));
    if (fileSizes.distribution) {
      const d = fileSizes.distribution;
      lines.push(`FILE-SIZE-DISTRIBUTION: tiny(<50)=${d.tiny} small(50-200)=${d.small} medium(200-500)=${d.medium} large(500-1k)=${d.large} huge(>1k)=${d.huge}`);
    }
  }

  // Top identifiers (most used variable names in codebase)
  if (identifiers) {
    const topIds = Array.from(identifiers).sort((a, b) => b[1] - a[1]).slice(0, 15);
    lines.push('TOP-IDENTIFIERS(common-names): ' + topIds.map(([n, c]) => `${c}×"${n}"`).join(' '));
  }

  return lines.join('\n');
}

function k(num) {
  return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
}