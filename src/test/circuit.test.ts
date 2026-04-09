import { describe, it, expect } from 'vitest';
import { CircuitBreaker } from '../lib/agent/CircuitBreaker';

describe('CircuitBreaker', () => {
  it('should open after 3 errors', () => {
    const breaker = new CircuitBreaker();
    expect(breaker.isOpen()).toBe(false);

    breaker.recordError();
    breaker.recordError();
    expect(breaker.isOpen()).toBe(false);

    breaker.recordError();
    expect(breaker.isOpen()).toBe(true);
    expect(breaker.getFallbackResponse()).toContain('pause');
  });
});
