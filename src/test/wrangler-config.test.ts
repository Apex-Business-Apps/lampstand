import { describe, it, expect } from 'vitest';
import fs from 'node:fs';

describe('cloudflare deploy config', () => {
  it('uses explicit assets worker config', () => {
    const raw = fs.readFileSync('wrangler.json', 'utf8');
    const cfg = JSON.parse(raw);
    expect(cfg.main).toBe('src/workers/static-spa.ts');
    expect(cfg.assets?.directory).toBe('./dist');
  });
});
