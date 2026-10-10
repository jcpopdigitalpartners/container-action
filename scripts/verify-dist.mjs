import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const required = [
  'index.html',
  'prerequisites/index.html',
  'resources/shared-state/index.html',
  'module-3/index.html',
  'audio/course-prerequisites.mp3',
  'audio/module-0.mp3',
  'audio/module-1-part-1.mp3',
  'audio/module-1-part-2.mp3',
  'audio/module-1-part-3.mp3',
  'audio/module-2-part-1.mp3',
  'audio/module-2-part-2.mp3',
  'audio/module-2-part-3.mp3',
  'audio/module-3-part-1.mp3',
  'audio/module-3-part-2.mp3',
  'audio/module-3-part-3.mp3',
  'video/iso-mod2-animation.mp4',
  'video/iso-mod2-poster.jpg',
  'downloads/module-1-labs.zip',
  'downloads/module-2-terminal-lab.zip',
];
const failures = [];
for (const rel of required) {
  const file = join(dist, rel);
  if (!existsSync(file) || !statSync(file).isFile() || statSync(file).size === 0) {
    failures.push(`Missing or empty output: dist/${rel}`);
  }
}
const builtHome = join(dist, 'index.html');
if (existsSync(builtHome)) {
  const html = readFileSync(builtHome, 'utf8');
  const [owner = '', repository = ''] = (process.env.GITHUB_REPOSITORY || '').split('/');
  const expected = process.env.ASTRO_BASE || (process.env.GITHUB_ACTIONS === 'true' && owner && repository && repository !== `${owner}.github.io` ? `/${repository}/` : '/');
  const normalized = `/${expected.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/');
  if (!html.includes(`data-asset-base="${normalized}"`)) {
    failures.push(`Expected data-asset-base="${normalized}" missing from dist/index.html`);
  }
  if (!html.includes('Check course prerequisites')) {
    failures.push('Opening prerequisite link missing');
  }
}
const assetDir = join(dist, '_astro');
if (!existsSync(assetDir) || readdirSync(assetDir).length === 0) {
  failures.push('Astro compiled assets not found in dist/_astro');
}
if (failures.length) {
  console.error('GitHub Pages artifact verification FAILED:');
  failures.forEach(x => console.error(`- ${x}`));
  process.exit(1);
}
console.log(`GitHub Pages artifact verification: PASS (${required.length} files, compiled assets, correct site base)`);
