import { describe, expect, it } from 'vitest';
import { SEED_PASSAGES } from '../data/seed';
import { buildGroundedSermon, getGroundedSermonDrafts } from '../data/sermonLibrary';
import { LocalAIAdapter } from '../lib/adapters';

describe('grounded sermon library', () => {
  it('covers every seeded sermon passage without falling back to generic copy', () => {
    const drafts = getGroundedSermonDrafts();
    for (const passage of SEED_PASSAGES) {
      expect(drafts[passage.id], `${passage.reference} needs a grounded sermon draft`).toBeDefined();
    }
  });

  it('produces unique passage-specific reflections and relevance sections', () => {
    const sermons = SEED_PASSAGES.map((passage) => buildGroundedSermon(passage, 'balanced'));
    expect(new Set(sermons.map((sermon) => sermon.reflection)).size).toBe(SEED_PASSAGES.length);
    expect(new Set(sermons.map((sermon) => sermon.relevance)).size).toBe(SEED_PASSAGES.length);
  });

  it('does not reuse the old generic sermon scaffold', () => {
    const bannedPhrases = [
      'does not speak from a distance',
      'offers something that the world cannot manufacture',
      'functions as an anchor',
      'not the final word on our own lives',
    ];

    for (const passage of SEED_PASSAGES) {
      const sermon = buildGroundedSermon(passage, 'balanced');
      const fullText = `${sermon.reflection}\n${sermon.relevance}\n${sermon.prayer}`;
      for (const phrase of bannedPhrases) {
        expect(fullText).not.toContain(phrase);
      }
    }
  });

  it('grounds Matthew 5:14-16 in its own textual context', () => {
    const passage = SEED_PASSAGES.find((item) => item.id === 'matt-5-14-16');
    expect(passage).toBeDefined();

    const sermon = buildGroundedSermon(passage!, 'balanced');
    expect(sermon.title).toContain('Light');
    expect(sermon.reflection).toContain('Beatitudes');
    expect(sermon.reflection).toContain('lamp');
    expect(sermon.reflection).toContain('good works');
    expect(sermon.relevance).toContain('self-promotion');
  });

  it('LocalAIAdapter uses the grounded sermon engine', async () => {
    const adapter = new LocalAIAdapter();
    const passage = SEED_PASSAGES.find((item) => item.id === 'matt-5-14-16')!;
    const sermon = await adapter.generateSermon(passage, 'balanced');

    expect(sermon.title).toBe('Light Placed Where It Can Serve');
    expect(sermon.reflection).toContain('Beatitudes');
  });
});
