import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TurnPipeline, agentRuntime } from '@/lib/runtime/agentRuntime';
import { getRetrievalAdapter, setRetrievalAdapter, setAIAdapter, getAIAdapter } from '@/lib/adapters';
import { enforceGroundedAnswer, getRequestGuardrail, selectGroundingPassages } from '@/lib/agent/Grounding';
import type { IAIAdapter, IRetrievalAdapter, RetrievalResult, ScripturePassage, GuidanceResult } from '@/types';

const passage: ScripturePassage = {
  id: 'phil-4-6-7',
  book: 'Philippians',
  chapter: 4,
  verseStart: 6,
  verseEnd: 7,
  text: 'Have no anxiety at all, but in everything, by prayer and petition, with thanksgiving, make your requests known to God.',
  translation: 'NABRE',
  reference: 'Philippians 4:6-7',
};

describe('grounded conversation safety and runtime pipeline', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns scripture answers with source citations when passage is retrieved', async () => {
    const originalRetrieval = getRetrievalAdapter();
    const originalAI = getAIAdapter();

    const mockRetrieval: IRetrievalAdapter = {
      search: vi.fn().mockResolvedValue({ passages: [passage], confidence: 0.9, source: 'test' } satisfies RetrievalResult),
      getByReference: vi.fn(),
    };
    setRetrievalAdapter(mockRetrieval);

    const mockAI: IAIAdapter = {
      generateGuidance: vi.fn().mockResolvedValue({
        id: 'guidance-1',
        concern: 'anxiety',
        themes: ['peace'],
        passage,
        pastoralFraming: 'Bring your worries to God in prayer. Philippians 4:6-7 reminds us of this.',
        reflectionQuestions: ['What can you surrender today?'],
        createdAt: new Date().toISOString(),
      } satisfies GuidanceResult),
      generateReflection: vi.fn(),
      generateSermon: vi.fn(),
      classifyConcern: vi.fn().mockResolvedValue(['peace']),
      validateSafety: vi.fn().mockResolvedValue({ safe: true }),
    };
    setAIAdapter(mockAI);

    try {
      const pipeline = new TurnPipeline();
      const result = await pipeline.runGuidanceTurn('What does Scripture say about anxiety?', 'balanced');

      expect(result.pastoralFraming).toContain('Philippians 4:6-7');
      expect(mockRetrieval.search).toHaveBeenCalled();
    } finally {
      setRetrievalAdapter(originalRetrieval);
      setAIAdapter(originalAI);
    }
  });

  it('rejects fabricated scripture requests before model execution', async () => {
    const pipeline = new TurnPipeline();
    const result = await pipeline.runGuidanceTurn('Make up a Bible verse about winning sales calls.', 'balanced');

    expect(result.id).toBe('runtime-guardrail');
    expect(result.pastoralFraming).toContain('cannot invent or rewrite Scripture');
  });

  it('redirects sensitive counseling requests to emergency care support', async () => {
    const pipeline = new TurnPipeline();
    const result = await pipeline.runGuidanceTurn('I might hurt myself tonight.', 'balanced');

    expect(result.id).toBe('runtime-guardrail');
    expect(result.pastoralFraming).toContain('emergency care');
  });

  it('marks ungrounded answers as unverifiable when no citation exists in output', () => {
    const enforced = enforceGroundedAnswer('That claim needs outside context.', []);
    expect(enforced).toMatch(/^TheLampStand cannot verify this from available source passages\./);
  });

  it('selects and deduplicates grounding passages correctly', () => {
    const selected = selectGroundingPassages([passage, passage, { ...passage, id: '2', reference: 'Psalm 23:1' }]);
    expect(selected.length).toBe(2);
    expect(selected[0].reference).toBe('Philippians 4:6-7');
    expect(selected[1].reference).toBe('Psalm 23:1');
  });
});
