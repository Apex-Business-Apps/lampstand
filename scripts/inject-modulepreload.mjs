// Injects <link rel="modulepreload"> for vendor-react and vendor-query
// into dist/index.html after each production build.
// Runs automatically as the postbuild npm hook.

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const distAssets = readdirSync('./dist/assets');
const chunks = ['vendor-react', 'vendor-query'];

const preloads = chunks
  .map((name) => {
    const file = distAssets.find((f) => f.startsWith(name) && f.endsWith('.js'));
    return file ? `  <link rel="modulepreload" href="/assets/${file}" />` : null;
  })
  .filter(Boolean)
  .join('\n');

if (!preloads) {
  console.log('[modulepreload] No matching chunks found — skipping.');
  process.exit(0);
}

const htmlPath = join('./dist', 'index.html');
const html = readFileSync(htmlPath, 'utf8');
const updated = html.replace('</head>', `${preloads}\n</head>`);
writeFileSync(htmlPath, updated);
console.log('[modulepreload] Injected:\n' + preloads);
