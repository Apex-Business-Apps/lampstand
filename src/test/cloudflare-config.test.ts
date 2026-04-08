import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('cloudflare deploy configuration', () => {
  it('has explicit wrangler config and SPA redirects', () => {
    expect(fs.existsSync('wrangler.toml')).toBe(true);
    expect(fs.readFileSync('wrangler.toml', 'utf8')).toContain('pages_build_output_dir = "dist"');
    expect(fs.readFileSync('public/_redirects', 'utf8')).toContain('/index.html 200');
  });
});
