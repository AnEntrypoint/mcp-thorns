export function formatUltraCompact(aggregated) {
  const lines = [];
  const { stats, entities, metrics } = aggregated;

  // Header: total metrics
  const totalFn = Object.values(stats.byLanguage).reduce((s, l) => s + l.functions, 0);
  const totalCls = Object.values(stats.byLanguage).reduce((s, l) => s + l.classes, 0);
  const avgCx = totalFn > 0 ? (Object.values(stats.byLanguage).reduce((s, l) => s + l.complexity, 0) / totalFn).toFixed(1) : 0;
  const avgDepth = metrics.depths.length > 0 ? (metrics.depths.reduce((a, b) => a + b, 0) / metrics.depths.length).toFixed(1) : 0;

  lines.push(`━━━ ${stats.files}f ${k(stats.totalLines)}L ${totalFn}fn ${totalCls}cls cx:${avgCx} d:${avgDepth} ━━━`);

  // Language breakdown (single line per language)
  for (const [lang, ls] of Object.entries(stats.byLanguage).sort((a, b) => b[1].lines - a[1].lines)) {
    const cx = ls.functions > 0 ? (ls.complexity / ls.functions).toFixed(1) : 0;
    const ratio = (ls.lines / stats.totalLines * 100).toFixed(0);
    lines.push(`${lang.substring(0, 2).toUpperCase()} ${ratio}% ${ls.files}f ${k(ls.lines)}L ${ls.functions}fn ${ls.classes}c ${ls.imports}i ${ls.exports}e cx:${cx}`);
  }

  // Top functions (grouped by signature similarity)
  const allFuncs = [];
  for (const [lang, ents] of Object.entries(entities)) {
    for (const [sig, data] of ents.functions) {
      allFuncs.push({ lang, sig, ...data });
    }
  }
  const topFuncs = allFuncs.sort((a, b) => b.count - a.count).slice(0, 10);
  if (topFuncs.length > 0) {
    lines.push('━━━ fn ━━━');
    for (const f of topFuncs) {
      lines.push(`${f.count}× ${f.lang.substring(0, 2)}:${f.sig.substring(0, 40)}`);
    }
  }

  // Top classes
  const allClasses = [];
  for (const [lang, ents] of Object.entries(entities)) {
    for (const [name, data] of ents.classes) {
      allClasses.push({ lang, name, ...data });
    }
  }
  const topClasses = allClasses.sort((a, b) => b.count - a.count).slice(0, 5);
  if (topClasses.length > 0) {
    lines.push('━━━ cls ━━━');
    for (const c of topClasses) {
      lines.push(`${c.count}× ${c.lang.substring(0, 2)}:${c.name}`);
    }
  }

  // Import patterns (most common)
  const allImports = new Map();
  for (const [lang, ents] of Object.entries(entities)) {
    for (const imp of ents.imports) {
      const key = imp.substring(0, 50);
      allImports.set(key, (allImports.get(key) || 0) + 1);
    }
  }
  const topImports = Array.from(allImports).sort((a, b) => b[1] - a[1]).slice(0, 8);
  if (topImports.length > 0) {
    lines.push('━━━ imports ━━━');
    for (const [imp, count] of topImports) {
      lines.push(`${count}× ${imp}`);
    }
  }

  // Top patterns (API calls, common patterns)
  const allPatterns = new Map();
  for (const [lang, ents] of Object.entries(entities)) {
    for (const [pattern, count] of ents.patterns) {
      allPatterns.set(pattern, (allPatterns.get(pattern) || 0) + count);
    }
  }
  const topPatterns = Array.from(allPatterns).sort((a, b) => b[1] - a[1]).slice(0, 12);
  if (topPatterns.length > 0) {
    lines.push('━━━ calls ━━━');
    for (const [pattern, count] of topPatterns) {
      lines.push(`${count}× ${pattern}`);
    }
  }

  // Complexity hotspots
  if (metrics.hotspots.length > 0) {
    lines.push('━━━ ⚠ hotspots ━━━');
    for (const h of metrics.hotspots.slice(0, 5)) {
      lines.push(`cx:${h.cx} d:${h.depth} ${h.file}`);
    }
  }

  return lines.join('\n');
}

function k(num) {
  return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
}