import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('SEO & Sitemap Contract', () => {
  it('contains public/sitemap.xml with canonical application and information URLs', () => {
    expect(fs.existsSync('public/sitemap.xml')).toBe(true);
    const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');

    const expectedUrls = [
      'https://thelampstand.icu/',
      'https://thelampstand.icu/app',
      'https://thelampstand.icu/daily',
      'https://thelampstand.icu/guidance',
      'https://thelampstand.icu/sermon',
      'https://thelampstand.icu/lectio',
      'https://thelampstand.icu/examen',
      'https://thelampstand.icu/journal',
      'https://thelampstand.icu/saved',
      'https://thelampstand.icu/kids',
      'https://thelampstand.icu/install',
      'https://thelampstand.icu/legal/privacy',
      'https://thelampstand.icu/legal/terms',
      'https://thelampstand.icu/legal/disclaimer',
    ];

    const locMatches = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g)).map((m) => m[1]);
    expect(locMatches).toEqual(expectedUrls);
    expect(sitemap).toContain('<lastmod>2026-08-25</lastmod>');
  });

  it('includes Sitemap directive and AI crawler rules in public/robots.txt', () => {
    expect(fs.existsSync('public/robots.txt')).toBe(true);
    const robots = fs.readFileSync('public/robots.txt', 'utf8');
    expect(robots).toContain('Sitemap: https://thelampstand.icu/sitemap.xml');
    expect(robots).toContain('User-agent: Googlebot');
    expect(robots).toContain('User-agent: GPTBot');
    expect(robots).toContain('User-agent: PerplexityBot');
    expect(robots).toContain('User-agent: ClaudeBot');
  });

  it('declares full Schema.org @graph with WebApplication, Organization, and FAQPage in index.html', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    expect(html).toContain('"isAccessibleForFree": true');
    expect(html).toContain('"@type": "Organization"');
    expect(html).toContain('"@type": "FAQPage"');
    expect(html).toContain('"@type": "WebSite"');
    expect(html).toContain('TheLampStand: Free Daily Bible Companion & AI Pastoral Guidance');
  });
});
