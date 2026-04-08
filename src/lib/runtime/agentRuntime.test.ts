import { describe, expect, it } from 'vitest';
import { AgentRuntime } from '@/lib/runtime/agentRuntime';

describe('AgentRuntime', () => {
  it('returns scripture fallback when circuit breaker is open', async () => {
    localStorage.setItem('lampstand_safety', JSON.stringify(new Array(6).fill(0).map(() => ({ timestamp: new Date().toISOString() }))));
    const runtime = new AgentRuntime();
    const response = await runtime.respond('help me', 'balanced');
    expect(response.themes[0]).toContain('circuit-breaker');
  });
});
