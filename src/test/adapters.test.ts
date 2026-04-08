import { describe, it, expect } from 'vitest';
import { LocalAIAdapter, getAIAdapter, setAIAdapter } from '../lib/adapters';

describe('AI Adapters', () => {
  it('LocalAIAdapter classifies concerns correctly', async () => {
    const adapter = new LocalAIAdapter();
    const themes = await adapter.classifyConcern('I am feeling very lonely');
    expect(themes).toContain('loneliness');
  });

  it('Allows swapping adapters', () => {
    const defaultAdapter = getAIAdapter();
    const newAdapter = new LocalAIAdapter();
    setAIAdapter(newAdapter);
    expect(getAIAdapter()).toBe(newAdapter);

    // restore
    setAIAdapter(defaultAdapter);
  });
});
