import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SEED_PASSAGES } from '@/data/seed';
import { CONTENT_PASSAGES, DAILY_LIGHT_LIBRARY } from '@/data/contentLibrary';
import { getGroundedSermonDrafts, buildGroundedSermon } from '@/data/sermonLibrary';
import { getDailyLight } from '@/lib/dailyLight';
import { resetAllData } from '@/lib/storage';

describe('Production Capacity & Invariant Verification', () => {
  it('verifies dataset expansion counts match exact production targets', () => {
    expect(SEED_PASSAGES.length).toBe(131);
    expect(CONTENT_PASSAGES.length).toBe(240);
    expect(DAILY_LIGHT_LIBRARY.length).toBe(161);
    const drafts = getGroundedSermonDrafts();
    expect(Object.keys(drafts).length).toBe(178);
  });

  it('verifies all SEED_PASSAGES have valid schemas, positive chapter/verses, and unique IDs', () => {
    const idSet = new Set<string>();
    for (const p of SEED_PASSAGES) {
      expect(p.id).toBeTruthy();
      expect(p.book).toBeTruthy();
      expect(p.text).toBeTruthy();
      expect(p.translation).toBeTruthy();
      expect(p.reference).toBeTruthy();
      expect(p.chapter).toBeGreaterThan(0);
      expect(p.verseStart).toBeGreaterThan(0);
      expect(p.verseEnd).toBeGreaterThanOrEqual(p.verseStart);
      expect(idSet.has(p.id), `Duplicate ID in SEED_PASSAGES: ${p.id}`).toBe(false);
      idSet.add(p.id);
    }
  });

  it('verifies 100% coverage in SERMON_LIBRARY for all SEED_PASSAGES with unique reflections and relevance', () => {
    const drafts = getGroundedSermonDrafts();
    for (const passage of SEED_PASSAGES) {
      const draft = drafts[passage.id];
      expect(draft, `Missing draft for ${passage.id} (${passage.reference})`).toBeDefined();
      expect(draft.title).toBeTruthy();
      expect(draft.reflection).toBeTruthy();
      expect(draft.relevance).toBeTruthy();
      expect(draft.prayer).toBeTruthy();
    }

    const sermonKeys = Object.keys(drafts);
    const reflections = new Set(sermonKeys.map(k => drafts[k].reflection));
    const relevances = new Set(sermonKeys.map(k => drafts[k].relevance));
    expect(reflections.size).toBe(sermonKeys.length);
    expect(relevances.size).toBe(sermonKeys.length);
  });

  it('verifies all sermon drafts are free of generic banned phrases', () => {
    const drafts = getGroundedSermonDrafts();
    const bannedPhrases = [
      'does not speak from a distance',
      'offers something that the world cannot manufacture',
      'functions as an anchor',
      'not the final word on our own lives',
    ];

    for (const [id, draft] of Object.entries(drafts)) {
      const fullText = `${draft.reflection} ${draft.relevance} ${draft.prayer}`;
      for (const phrase of bannedPhrases) {
        expect(fullText, `Found banned phrase "${phrase}" in draft ${id}`).not.toContain(phrase);
      }
    }
  });

  it('generates multi-tone grounded sermons for all 131 passages with proper tone suffixes', () => {
    for (const passage of SEED_PASSAGES) {
      const gentle = buildGroundedSermon(passage, 'gentle');
      const traditional = buildGroundedSermon(passage, 'traditional');
      const balanced = buildGroundedSermon(passage, 'balanced');

      expect(gentle.reflection).toContain('Read this passage slowly');
      expect(traditional.reflection).toContain('The Church has received this kind of word');
      expect(balanced.reflection).toContain('The passage is not a slogan');
    }
  });

  it('verifies every entry in DAILY_LIGHT_LIBRARY has defined passage and complete devotional fields', () => {
    for (let i = 0; i < DAILY_LIGHT_LIBRARY.length; i++) {
      const item = DAILY_LIGHT_LIBRARY[i];
      expect(item.passage, `Undefined passage at index ${i}`).toBeDefined();
      expect(item.passage.id).toBeTruthy();
      expect(item.passage.reference).toBeTruthy();
      expect(item.passage.text).toBeTruthy();
      expect(item.reflection).toBeTruthy();
      expect(item.prayer).toBeTruthy();
      expect(item.theme).toBeTruthy();
    }
  });

  it('simulates 365 days of Daily Light rotation with zero null references or exceptions', () => {
    resetAllData();
    const baseDate = new Date(2026, 0, 1, 8, 0, 0);
    const observedReferences = new Set<string>();

    for (let day = 0; day < 365; day++) {
      const currentDate = new Date(baseDate.getTime() + day * 86400000);
      const dl = getDailyLight(currentDate);
      expect(dl).toBeDefined();
      expect(dl.passage).toBeDefined();
      expect(dl.passage.reference).toBeTruthy();
      observedReferences.add(dl.passage.reference);
    }

    expect(observedReferences.size).toBeGreaterThanOrEqual(100);
  });

  it('verifies zero em-dashes or en-dashes across all touched source files', () => {
    const touchedFiles = [
      'src/data/seed.ts',
      'src/data/sermonLibrary.ts',
      'src/data/contentLibrary.ts',
      'src/lib/agent/Prompts.ts',
      'src/lib/agent/Grounding.ts',
      'src/lib/runtime/agentRuntime.ts',
      'src/components/PwaInstallHarness.tsx',
      'src/hooks/usePwaInstall.ts',
      'src/components/AppShell.tsx',
      'src/pages/SettingsPage.tsx',
      'src/pages/InstallPage.tsx',
      'tests/e2e/pwa.spec.ts',
      'src/test/production-capacity.test.ts',
      'package.json',
    ];

    for (const file of touchedFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const dashes = content.match(/[\u2014\u2013]/g);
      expect(dashes, `Prohibited dash found in ${file}`).toBeNull();
    }
  });
});
