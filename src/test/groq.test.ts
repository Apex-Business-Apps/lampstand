import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ScripturePassage } from '../types';
import { GroqAIAdapter } from '../lib/groq';

describe('GroqAIAdapter', () => {
  const dummyPassage: ScripturePassage = {
    id: '1',
    book: 'John',
    chapter: 11,
    verseStart: 35,
    verseEnd: 35,
    text: 'Jesus wept.',
    translation: 'KJV',
    reference: 'John 11:35'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('generateReflection uses fallback when fetch fails', async () => {
    const adapter = new GroqAIAdapter();

    // Force the `ask` method to throw an error (simulating network failure or missing API key)
    // We cast to unknown then object to avoid @typescript-eslint/no-explicit-any error
    // since ask is a private method
    vi.spyOn(adapter as unknown as { ask: () => Promise<string> }, 'ask')
      .mockRejectedValue(new Error('Network error'));

    // Mock console.warn to verify it was called and keep test output clean
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Call the method being tested
    const result = await adapter.generateReflection(dummyPassage, 'gentle');

    // Verify fallback behavior
    expect(consoleSpy).toHaveBeenCalledWith("Groq fallback", expect.any(Error));
    // The fallback LocalAIAdapter returns a specific string format
    expect(result).toContain('John 11:35 speaks to something timeless');

    consoleSpy.mockRestore();
  });

  it('generateSermon uses fallback when fetch fails', async () => {
    const adapter = new GroqAIAdapter();
    vi.spyOn(adapter as unknown as { ask: () => Promise<string> }, 'ask')
      .mockRejectedValue(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await adapter.generateSermon(dummyPassage, 'gentle');

    expect(consoleSpy).toHaveBeenCalledWith("Groq fallback", expect.any(Error));
    expect(result.title).toBeDefined();

    consoleSpy.mockRestore();
  });

  it('generateGuidance uses fallback when fetch fails', async () => {
    const adapter = new GroqAIAdapter();
    vi.spyOn(adapter as unknown as { ask: () => Promise<string> }, 'ask')
      .mockRejectedValue(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await adapter.generateGuidance("I feel lonely", 'gentle');

    expect(consoleSpy).toHaveBeenCalledWith("Groq fallback", expect.any(Error));
    expect(result.concern).toBe("I feel lonely");

    consoleSpy.mockRestore();
  });
});
