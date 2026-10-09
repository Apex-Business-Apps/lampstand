// Injects <link rel="modulepreload"> into dist/index.html and
// wires the production hashed entry script & stylesheet into dist/sw.js
// so the Service Worker precaches the built application shell on install.
// Runs automatically as the postbuild npm hook.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const distAssetsDir = './dist/assets';
if (!existsSync(distAssetsDir)) {
  console.log('[postbuild] No dist/assets directory found, skipping.');
  process.exit(0);
}

const distAssets = readdirSync(distAssetsDir);
const entryJs = distAssets.find((f) => f.startsWith('index-') && f.endsWith('.js'));
const entryCss = distAssets.find((f) => f.startsWith('index-') && f.endsWith('.css'));
const appJs = distAssets.find((f) => f.startsWith('App-') && f.endsWith('.js'));
const homeJs = distAssets.find((f) => f.startsWith('HomePage-') && f.endsWith('.js'));

// 1. Modulepreload injection into dist/index.html
const htmlPath = join('./dist', 'index.html');
if (existsSync(htmlPath) && entryJs) {
  let html = readFileSync(htmlPath, 'utf8');
  const preloads = [entryJs, appJs, homeJs]
    .filter(Boolean)
    .map((file) => `  <link rel="modulepreload" href="/assets/${file}" />`)
    .join('\n');

  if (!html.includes(`href="/assets/${entryJs}" rel="modulepreload"`)) {
    html = html.replace('</head>', `${preloads}\n</head>`);
    writeFileSync(htmlPath, html);
    console.log('[postbuild] Injected modulepreloads into dist/index.html:\n' + preloads);
  }
}

// 2. Precache injection into dist/sw.js
const swPath = join('./dist', 'sw.js');
if (existsSync(swPath) && (entryJs || entryCss)) {
  let sw = readFileSync(swPath, 'utf8');
  const assetsToPrecache = [
    entryJs ? `/assets/${entryJs}` : null,
    entryCss ? `/assets/${entryCss}` : null,
    appJs ? `/assets/${appJs}` : null,
    homeJs ? `/assets/${homeJs}` : null,
  ].filter(Boolean);

  const precacheEntries = assetsToPrecache
    .map((asset) => `  '${asset}',`)
    .join('\n');

  if (sw.includes('const PRECACHE_URLS = [')) {
    sw = sw.replace(
      'const PRECACHE_URLS = [',
      `const PRECACHE_URLS = [\n${precacheEntries}`
    );
    writeFileSync(swPath, sw);
    console.log('[postbuild] Injected precache assets into dist/sw.js:\n' + assetsToPrecache.join('\n'));
  }
}
