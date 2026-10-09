// Injects <link rel="modulepreload"> for entry chunks into dist/index.html
// after each production build.
// Runs automatically as the postbuild npm hook.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const distAssetsDir = './dist/assets';
if (!existsSync(distAssetsDir)) {
  console.log('[modulepreload] No dist/assets directory found: skipping.');
  process.exit(0);
}

const distAssets = readdirSync(distAssetsDir);
const chunks = ['App-', 'HomePage-'];

const preloads = chunks
  .map((prefix) => {
    const file = distAssets.find((f) => f.startsWith(prefix) && f.endsWith('.js'));
    return file ? `  <link rel="modulepreload" href="/assets/${file}" />` : null;
  })
  .filter(Boolean)
  .join('\n');

if (!preloads) {
  console.log('[modulepreload] No matching chunks found: skipping.');
  process.exit(0);
}

const htmlPath = join('./dist', 'index.html');
const html = readFileSync(htmlPath, 'utf8');
if (!html.includes('link rel="modulepreload" href="/assets/App-')) {
  const updated = html.replace('</head>', `${preloads}\n</head>`);
  writeFileSync(htmlPath, updated);
  console.log('[modulepreload] Injected:\n' + preloads);
}
