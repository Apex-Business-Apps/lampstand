import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');

describe('index.html PWA wiring', () => {
  it('links the manifest', () => {
    expect(html).toContain('<link rel="manifest" href="/manifest.json" />');
  });

  it('declares a viewport meta tag (required for standalone display)', () => {
    expect(html).toMatch(/<meta name="viewport" content="width=device-width, initial-scale=1\.0" \/>/);
  });

  it('declares an apple-touch-icon (iOS home screen icon)', () => {
    expect(html).toMatch(/<link rel="apple-touch-icon" sizes="180x180" href="[^"]+"\s*\/?>/);
    const iconPath = html.match(/<link rel="apple-touch-icon" sizes="180x180" href="([^"]+)"/)![1];
    expect(fs.existsSync(`public${iconPath}`), `missing apple-touch-icon file: ${iconPath}`).toBe(true);
  });

  it('declares a favicon', () => {
    expect(html).toMatch(/<link rel="icon" type="image\/x-icon" href="\/favicon\.ico">/);
  });
});
