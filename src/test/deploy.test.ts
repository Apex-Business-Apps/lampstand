import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Cloudflare Deployment Config', () => {
  it('should have a wrangler.jsonc file', () => {
    const configExists = fs.existsSync(path.resolve(__dirname, '../../wrangler.jsonc'));
    expect(configExists).toBe(true);
  });

  it('should have wrangler.jsonc configured for static pages', () => {
    const content = fs.readFileSync(path.resolve(__dirname, '../../wrangler.jsonc'), 'utf-8');
    expect(content).toContain('assets');
    expect(content).toContain('"directory"');
    expect(content).toContain('"./dist"');
  });
});
