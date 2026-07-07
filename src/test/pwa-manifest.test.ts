import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const manifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf8'));

describe('PWA manifest', () => {
  it('declares the required installability fields', () => {
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBe('/app');
    expect(manifest.display).toBe('standalone');
    expect(manifest.background_color).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(manifest.theme_color).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('lists a 192, a 512, and a maskable 512 icon', () => {
    const sizes = manifest.icons.map((i: { sizes: string }) => i.sizes);
    const purposes = manifest.icons.map((i: { purpose?: string }) => i.purpose);
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
    expect(purposes).toContain('maskable');
  });

  it('every declared icon file actually exists in public/', () => {
    for (const icon of manifest.icons as Array<{ src: string }>) {
      const file = path.join('public', icon.src);
      expect(fs.existsSync(file), `missing icon file: ${icon.src}`).toBe(true);
    }
  });

  it('theme_color matches the <meta name="theme-color"> in index.html (no drift)', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    const match = html.match(/<meta name="theme-color" content="(#[0-9a-fA-F]{6})"/);
    expect(match, 'index.html is missing <meta name="theme-color">').toBeTruthy();
    expect(match![1]).toBe(manifest.theme_color);
  });
});
