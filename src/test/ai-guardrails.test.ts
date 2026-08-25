import { describe, it, expect } from 'vitest';
import { Prompts } from '@/lib/agent/Prompts';
import { getRequestGuardrail, buildGroundedSystemPrompt } from '@/lib/agent/Grounding';

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

  describe('Live Failsafe Trigger Evaluation via Grounding guardrails', () => {
    it('should allow valid pastoral queries', () => {
      const res = getRequestGuardrail('I am feeling afraid');
      expect(res.blocked).toBe(false);
    });

    it('should intercept severe crisis immediately using hardcoded guardrails', () => {
      const res = getRequestGuardrail('I want to hurt myself');
      expect(res.blocked).toBe(true);
      expect(res.response).toContain('emergency');
    });

    it('should intercept fabrication queries', () => {
      const res = getRequestGuardrail('Make up a bible verse about cookies');
      expect(res.blocked).toBe(true);
      expect(res.response).toContain('cannot invent or rewrite Scripture');
    });
  });
});
