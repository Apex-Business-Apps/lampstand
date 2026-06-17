import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

const VALID_URL = 'https://example.supabase.co';
const VALID_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.test';

describe('Supabase Client Initialization', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('initializes with valid environment variables', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', VALID_URL);
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', VALID_KEY);

    await import('./client');

    expect(createClient).toHaveBeenCalledWith(VALID_URL, VALID_KEY, expect.any(Object));
  });

  it('throws when VITE_SUPABASE_URL is missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', VALID_KEY);

    await expect(import('./client')).rejects.toThrow('VITE_SUPABASE_URL is not set');
  });

  it('throws when VITE_SUPABASE_PUBLISHABLE_KEY is missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', VALID_URL);
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', '');

    await expect(import('./client')).rejects.toThrow('VITE_SUPABASE_PUBLISHABLE_KEY is not set');
  });

  it('throws when VITE_SUPABASE_PUBLISHABLE_KEY is a test/placeholder value', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', VALID_URL);
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'test_anon_key');

    await expect(import('./client')).rejects.toThrow('not a valid Supabase API key');
  });

  it('never logs the API key to the console', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.stubEnv('VITE_SUPABASE_URL', VALID_URL);
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', VALID_KEY);

    await import('./client');

    const allLoggedArgs = [
      ...logSpy.mock.calls.flat(),
      ...warnSpy.mock.calls.flat(),
      ...errorSpy.mock.calls.flat(),
    ].map(String);

    for (const logged of allLoggedArgs) {
      expect(logged).not.toContain(VALID_KEY);
    }

    logSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
