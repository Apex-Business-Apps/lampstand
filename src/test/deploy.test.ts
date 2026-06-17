import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Cloudflare Deployment Config', () => {
  // wrangler.jsonc was removed (F-013: stale 2024-03-20 compatibility_date duplicate).
  // wrangler.json is now the single canonical dev/staging config.
  it('should have a wrangler.json dev config file', () => {
    const configExists = fs.existsSync(path.resolve(__dirname, '../../wrangler.json'));
    expect(configExists).toBe(true);
  });

  it('should have wrangler.json configured for static pages', () => {
    const content = fs.readFileSync(path.resolve(__dirname, '../../wrangler.json'), 'utf-8');
    expect(content).toContain('assets');
    expect(content).toContain('"directory"');
    expect(content).toContain('"./dist"');
  });
});
