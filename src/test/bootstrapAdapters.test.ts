import { beforeEach, describe, expect, it, vi } from 'vitest';

const setAIAdapter = vi.fn();

vi.mock('@/lib/adapters', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/adapters')>()),
  setAIAdapter,
}));

describe('bootstrapAdapters', () => {
  beforeEach(() => {
    vi.resetModules();
    setAIAdapter.mockClear();
    vi.unstubAllEnvs();
  });

  it('preserves local fallback when Supabase env is absent', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', '');
    const { bootstrapAdapters } = await import('@/lib/bootstrapAdapters');

    expect(() => bootstrapAdapters()).not.toThrow();
    await vi.waitFor(() => expect(setAIAdapter).not.toHaveBeenCalled());
  });

  it('selects Groq only when required Supabase env exists', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test');
    const { bootstrapAdapters } = await import('@/lib/bootstrapAdapters');

    expect(() => bootstrapAdapters()).not.toThrow();
    await vi.waitFor(() => expect(setAIAdapter).toHaveBeenCalledTimes(1));
    expect(setAIAdapter.mock.calls[0][0].constructor.name).toBe('GroqAIAdapter');
  });
});
