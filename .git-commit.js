#!/usr/bin/env node
import { execSync } from 'child_process';
import { chdir } from 'process';

try {
  chdir('/home/user/thorns');

  console.log('Adding changes...');
  execSync('git add .thornsignore ignore-parser.js package.json README.md run.sh one-liner.sh test-one-liner.sh verify-setup.mjs', { stdio: 'inherit' });

  console.log('\nChecking status...');
  const status = execSync('git status --short', { encoding: 'utf8' });
  console.log(status);

  console.log('\nCreating commit...');
  const commitMsg = `5.2.0 - Bun support, comprehensive ignore patterns, GitHub one-liner execution

- Added 160+ ignore patterns for home directories and language caches
- Implemented bun runtime support with auto-fallback to node
- Created one-liner.sh for direct GitHub execution (no npm install)
- Created run.sh for Docker/CI with auto-detection
- Updated README with compatibility matrix and execution methods
- Expanded hardcoded fallback patterns for safety

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>`;

  execSync(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });

  console.log('\nPushing to remote...');
  execSync('git push origin main', { stdio: 'inherit' });

  console.log('\n✅ All changes committed and pushed successfully!');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
