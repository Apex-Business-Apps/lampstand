import { describe, it, expect, beforeEach } from 'vitest';
import { CircuitBreaker } from '@/lib/runtime/agentRuntime';
import { logSafetyEvent } from '@/lib/storage';
import { CIRCUIT_BREAKER_THRESHOLD, SAFE_FALLBACK_RESPONSE } from '@/lib/safety';

describe('CircuitBreaker (live runtime)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts closed when there are no recent safety events', () => {
    const breaker = new CircuitBreaker();
    expect(breaker.isOpen()).toBe(false);
  });

  it('opens after reaching threshold of recent safety events within 5 minutes', () => {
    const breaker = new CircuitBreaker();
    expect(breaker.isOpen()).toBe(false);

    for (let i = 0; i < CIRCUIT_BREAKER_THRESHOLD; i++) {
      logSafetyEvent({
        id: `event-${i}`,
        type: 'injection',
        input: 'test',
        action: 'blocked',
        timestamp: new Date().toISOString(),
      });
    }

    expect(breaker.isOpen()).toBe(true);
    expect(SAFE_FALLBACK_RESPONSE.message).toContain('gentle pause');
  });
});
