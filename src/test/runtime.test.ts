import { describe, expect, it } from 'vitest';
import { CircuitBreaker } from '@/lib/runtime/circuitBreaker';
import { SessionStateMachine } from '@/lib/runtime/sessionStateMachine';
import { SafetyGate } from '@/lib/runtime/safetyGate';

describe('CircuitBreaker', () => {
  it('opens after threshold failures', () => {
    const breaker = new CircuitBreaker({ threshold: 2, coolDownMs: 10_000 });
    expect(breaker.isOpen).toBe(false);
    breaker.recordFailure();
    expect(breaker.isOpen).toBe(false);
    breaker.recordFailure();
    expect(breaker.isOpen).toBe(true);
  });
});

describe('SessionStateMachine', () => {
  it('rejects invalid transitions', () => {
    const machine = new SessionStateMachine();
    expect(machine.transition('speaking')).toBe(false);
    expect(machine.state).toBe('idle');
    expect(machine.transition('thinking')).toBe(true);
    expect(machine.transition('speaking')).toBe(true);
  });
});

describe('SafetyGate', () => {
  it('flags banned output patterns', () => {
    const gate = new SafetyGate();
    expect(gate.hasBannedPattern('Absolutely, I hear you.')).toBe(true);
    expect(gate.hasBannedPattern('Take one quiet step today.')).toBe(false);
  });

  it('sanitizes em dash characters in output', () => {
    const gate = new SafetyGate();
    expect(gate.sanitizeOutput('Stay still — and pray.')).toBe('Stay still , and pray.');
  });
});
