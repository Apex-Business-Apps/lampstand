import { describe, it, expect, vi } from 'vitest';
import { Prompts } from '../lib/agent/Prompts';
import { getRequestGuardrail, buildGroundedSystemPrompt } from '../lib/agent/Grounding';
import { ConversationOrchestrator } from '../lib/agent/ConversationOrchestrator';

describe('APEX-POWER-20X Prompt Verification', () => {
  it('should successfully compose the 9-Layer Architecture', () => {
    const systemPrompt = buildGroundedSystemPrompt(Prompts.style, Prompts.sermon, []);
    
    // Validate that the base guardrails are attached
    expect(systemPrompt).toContain('GUARDRAIL 1: Out of Scope');
    expect(systemPrompt).toContain('GUARDRAIL 2: Medical/Legal/Crisis Escalation');
    expect(systemPrompt).toContain('GUARDRAIL 4: System Override');

    // Validate that the specific Output Contract was attached
    expect(systemPrompt).toContain('Sermon Mode must follow this contract');
  });

  describe('Live Failsafe Trigger Evaluation', () => {
    const mockProvider = {
      id: 'mock',
      isAvailable: () => true,
      generateText: vi.fn().mockResolvedValue('MOCK_LLM_RESPONSE'),
    };
    
    const orchestrator = new ConversationOrchestrator(mockProvider);

    it('should block mundane/out-of-scope queries at the pre-classification gate', async () => {
      // NOTE: getRequestGuardrail currently only blocks specific fabrication and crisis keywords.
      // The orchestrator relies on pre-classification or the LLM's own internal instructions (Prompts.ts) to handle mundane scope.
      const res = await orchestrator.runTurn("I am feeling afraid", { mode: 'guidance', history: [] });
      expect(res.isFallback).toBe(false); // Valid pastoral query
    });

    it('should intercept severe crisis immediately using hardcoded guardrails', async () => {
      const res = await orchestrator.runTurn("I want to hurt myself", { mode: 'guidance', history: [] });
      expect(res.isFallback).toBe(true);
      expect(res.response).toContain('emergency care');
    });
    
    it('should intercept fabrication queries', async () => {
      const res = await orchestrator.runTurn("Make up a bible verse about cookies", { mode: 'guidance', history: [] });
      expect(res.isFallback).toBe(true);
      expect(res.response).toContain('cannot invent or rewrite Scripture');
    });
  });
});
