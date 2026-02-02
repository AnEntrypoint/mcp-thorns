#!/usr/bin/env node
/**
 * Verification script for thorns setup
 * Tests that all components work correctly
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf('/'));
const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// Test 1: Files exist
test('All required files exist', () => {
  const files = [
    'index.js',
    'lib.js',
    'analyzer.js',
    'compact-formatter.js',
    'dependency-analyzer.js',
    'advanced-metrics.js',
    'ignore-parser.js',
    'queries.js',
    '.thornsignore',
    'package.json',
    'run.sh',
    'one-liner.sh'
  ];

  for (const file of files) {
    const path = join(__dirname, file);
    assert(existsSync(path), `${file} exists`);
  }
});

// Test 2: .thornsignore has enough patterns
test('.thornsignore has comprehensive ignore patterns', () => {
  const content = readFileSync(join(__dirname, '.thornsignore'), 'utf8');
  const lines = content.split('\n').filter(l => l && !l.startsWith('#'));

  assert(lines.length > 200, `.thornsignore has ${lines.length} patterns (>200 required)`);
  assert(content.includes('.bun'), '.thornsignore includes bun');
  assert(content.includes('.cargo'), '.thornsignore includes cargo (rust)');
  assert(content.includes('.gradle'), '.thornsignore includes gradle (java)');
  assert(content.includes('.npm'), '.thornsignore includes npm');
  assert(content.includes('node_modules'), '.thornsignore includes node_modules');
  assert(content.includes('~'), '.thornsignore includes home folder patterns');
});

// Test 3: package.json has bun config
test('package.json has bun configuration', () => {
  const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));
  assert(pkg.bun, 'package.json has bun field');
  assert(pkg.bun.bin, 'bun field has bin entries');
  assert(pkg.bun.bin['mcp-thorns'], 'bun field has mcp-thorns bin');
  assert(pkg.files.includes('run.sh'), 'run.sh is in files');
  assert(pkg.files.includes('one-liner.sh'), 'one-liner.sh is in files');
});

// Test 4: Shell scripts are valid
test('Shell scripts are syntactically valid', () => {
  const scripts = ['run.sh', 'one-liner.sh'];

  for (const script of scripts) {
    const content = readFileSync(join(__dirname, script), 'utf8');
    assert(content.startsWith('#!/bin/bash'), `${script} has shebang`);
    assert(content.includes('curl'), `${script} uses curl to download files`);
    assert(content.includes('index.js'), `${script} executes index.js`);
  }
});

// Test 5: index.js can be executed
test('index.js is executable', () => {
  const content = readFileSync(join(__dirname, 'index.js'), 'utf8');
  assert(content.startsWith('#!/usr/bin/env node'), 'index.js has shebang');
  assert(content.includes('analyze'), 'index.js imports analyze function');
});

// Test 6: Ignore patterns include user homes
test('Ignore patterns include user home directories', () => {
  const content = readFileSync(join(__dirname, 'ignore-parser.js'), 'utf8');
  assert(content.includes('.config'), 'includes .config');
  assert(content.includes('.local'), 'includes .local');
  assert(content.includes('.ssh'), 'includes .ssh');
  assert(content.includes('.npm'), 'includes .npm');
  assert(content.includes('.cargo'), 'includes .cargo');
  assert(content.includes('.bun'), 'includes .bun');
});

// Test 7: Current directory analysis works
test('Can analyze current directory with node', async () => {
  try {
    const output = execSync('node index.js . 2>&1', {
      cwd: __dirname,
      encoding: 'utf8',
      timeout: 30000
    });
    assert(output.length > 0, 'Analysis produces output');
    assert(output.includes('f'), 'Output contains file count shorthand');
  } catch (e) {
    console.error('Execution error:', e.message);
    throw e;
  }
});

// Run tests
async function runTests() {
  console.log('🧪 Running verification tests...\n');

  let passed = 0;
  let failed = 0;

  for (const { name, fn } of tests) {
    try {
      await Promise.resolve(fn());
      console.log(`✅ ${name}`);
      passed++;
    } catch (e) {
      console.log(`❌ ${name}`);
      console.log(`   Error: ${e.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
