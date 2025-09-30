export function formatUltraCompact(aggregated) {
  const lines = [];
  const { stats, entities, metrics } = aggregated;

  // Inline legend
  lines.push('LEGEND: f=files L=lines fn=functions cls=classes i=imports e=exports cx=complexity d=depth');

  // Header: total metrics
  const totalFn = Object.values(stats.byLanguage).reduce((s, l) => s + l.functions, 0);
  const totalCls = Object.values(stats.byLanguage).reduce((s, l) => s + l.classes, 0);
  const avgCx = totalFn > 0 ? (Object.values(stats.byLanguage).reduce((s, l) => s + l.complexity, 0) / totalFn).toFixed(1) : 0;
  const avgDepth = metrics.depths.length > 0 ? (metrics.depths.reduce((a, b) => a + b, 0) / metrics.depths.length).toFixed(1) : 0;

  lines.push(`TOTAL: ${stats.files}f ${k(stats.totalLines)}L ${totalFn}fn ${totalCls}cls cx${avgCx} d${avgDepth}`);

  // Language breakdown
  for (const [lang, ls] of Object.entries(stats.byLanguage).sort((a, b) => b[1].lines - a[1].lines)) {
    const cx = ls.functions > 0 ? (ls.complexity / ls.functions).toFixed(1) : 0;
    const ratio = (ls.lines / stats.totalLines * 100).toFixed(0);
    lines.push(`${lang} ${ratio}%: ${ls.files}f ${k(ls.lines)}L ${ls.functions}fn ${ls.classes}cls ${ls.imports}i ${ls.exports}e cx${cx}`);
  }

  // Top functions
  const allFuncs = [];
  for (const [lang, ents] of Object.entries(entities)) {
    for (const [sig, data] of ents.functions) {
      allFuncs.push({ lang, sig, ...data });
    }
  }
  const topFuncs = allFuncs.sort((a, b) => b.count - a.count).slice(0, 10);
  if (topFuncs.length > 0) {
    lines.push('TOP_FN: ' + topFuncs.map(f => `${f.count}×${f.lang.slice(0,2)}:${f.sig.slice(0,35)}`).join(' | '));
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
    lines.push('TOP_CLS: ' + topClasses.map(c => `${c.count}×${c.lang.slice(0,2)}:${c.name}`).join(' | '));
  }

  // Import patterns
  const allImports = new Map();
  for (const [lang, ents] of Object.entries(entities)) {
    for (const imp of ents.imports) {
      const key = imp.slice(0, 40);
      allImports.set(key, (allImports.get(key) || 0) + 1);
    }
  }
  const topImports = Array.from(allImports).sort((a, b) => b[1] - a[1]).slice(0, 8);
  if (topImports.length > 0) {
    lines.push('TOP_IMP: ' + topImports.map(([i, c]) => `${c}×${i}`).join(' | '));
  }

  // API calls
  const allPatterns = new Map();
  for (const [lang, ents] of Object.entries(entities)) {
    for (const [pattern, count] of ents.patterns) {
      allPatterns.set(pattern, (allPatterns.get(pattern) || 0) + count);
    }
  }
  const topPatterns = Array.from(allPatterns).sort((a, b) => b[1] - a[1]).slice(0, 12);
  if (topPatterns.length > 0) {
    lines.push('TOP_CALLS: ' + topPatterns.map(([p, c]) => `${c}×${p}`).join(' '));
  }

  // Hotspots
  if (metrics.hotspots.length > 0) {
    lines.push('HOTSPOTS: ' + metrics.hotspots.slice(0, 5).map(h => `cx${h.cx}d${h.depth}:${h.file}`).join(' | '));
  }

  return lines.join('\n');
}

function k(num) {
  return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
}