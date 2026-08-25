import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('SEO & Sitemap Contract', () => {
  it('contains public/sitemap.xml with exactly the 10 canonical URLs', () => {
    expect(fs.existsSync('public/sitemap.xml')).toBe(true);
    const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');

    const expectedUrls = [
      'https://thelampstand.icu/',
      'https://thelampstand.icu/app',
      'https://thelampstand.icu/daily',
      'https://thelampstand.icu/guidance',
      'https://thelampstand.icu/lectio',
      'https://thelampstand.icu/examen',
      'https://thelampstand.icu/saved',
      'https://thelampstand.icu/journal',
      'https://thelampstand.icu/sermon',
      'https://thelampstand.icu/kids',
    ];

    const locMatches = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g)).map((m) => m[1]);
    expect(locMatches).toEqual(expectedUrls);
    expect(locMatches).toHaveLength(10);
  });

  it('includes Sitemap directive in public/robots.txt', () => {
    expect(fs.existsSync('public/robots.txt')).toBe(true);
    const robots = fs.readFileSync('public/robots.txt', 'utf8');
    expect(robots).toContain('Sitemap: https://thelampstand.icu/sitemap.xml');
  });

  it('declares isAccessibleForFree in index.html schema.org WebApplication JSON-LD', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    expect(html).toContain('"isAccessibleForFree": true');
  });
});
