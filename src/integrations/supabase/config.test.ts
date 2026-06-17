import { describe, it, expect, vi, beforeEach } from 'vitest';

const VALID_URL = 'https://example.supabase.co';
const VALID_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.test';

describe('getSupabaseConfig', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('returns config when URL and key are valid', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', VALID_URL);
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', VALID_KEY);
    const { getSupabaseConfig } = await import('./config');

    const config = getSupabaseConfig();
    expect(config.url).toBe(VALID_URL);
    expect(config.publishableKey).toBe(VALID_KEY);
  });

  it('throws when VITE_SUPABASE_URL is missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', VALID_KEY);
    const { getSupabaseConfig } = await import('./config');

    expect(() => getSupabaseConfig()).toThrow('VITE_SUPABASE_URL is not set');
  });

  it('throws when VITE_SUPABASE_URL is not a valid HTTPS URL', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'http://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', VALID_KEY);
    const { getSupabaseConfig } = await import('./config');

    expect(() => getSupabaseConfig()).toThrow('VITE_SUPABASE_URL must be a valid HTTPS URL');
  });

  it('throws when VITE_SUPABASE_PUBLISHABLE_KEY is missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', VALID_URL);
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', '');
    const { getSupabaseConfig } = await import('./config');

    expect(() => getSupabaseConfig()).toThrow('VITE_SUPABASE_PUBLISHABLE_KEY is not set');
  });

  it('throws when VITE_SUPABASE_PUBLISHABLE_KEY is a test/placeholder value', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', VALID_URL);
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'test_anon_key');
    const { getSupabaseConfig } = await import('./config');

    expect(() => getSupabaseConfig()).toThrow('not a valid Supabase API key');
  });

  it('throws for other non-JWT placeholder keys', async () => {
    for (const placeholder of ['mock-key', 'your-anon-key', 'changeme', 'anon-key']) {
      vi.stubEnv('VITE_SUPABASE_URL', VALID_URL);
      vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', placeholder);
      const { getSupabaseConfig } = await import('./config');
      expect(() => getSupabaseConfig()).toThrow('not a valid Supabase API key');
      vi.resetModules();
    }
  });

  it('does not include the key value in error messages', async () => {
    const secretKey = 'test_anon_key_secret_value_12345';
    vi.stubEnv('VITE_SUPABASE_URL', VALID_URL);
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', secretKey);
    const { getSupabaseConfig } = await import('./config');

    let errorMessage = '';
    try {
      getSupabaseConfig();
    } catch (e) {
      errorMessage = (e as Error).message;
    }
    expect(errorMessage).not.toContain(secretKey);
  });
});

describe('isSupabaseConfigured', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('returns true when config is valid', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', VALID_URL);
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', VALID_KEY);
    const { isSupabaseConfigured } = await import('./config');

    expect(isSupabaseConfigured()).toBe(true);
  });

  it('returns false when URL is missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', VALID_KEY);
    const { isSupabaseConfigured } = await import('./config');

    expect(isSupabaseConfigured()).toBe(false);
  });

  it('returns false when key is missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', VALID_URL);
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', '');
    const { isSupabaseConfigured } = await import('./config');

    expect(isSupabaseConfigured()).toBe(false);
  });

  it('returns false when key is test_anon_key', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', VALID_URL);
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'test_anon_key');
    const { isSupabaseConfigured } = await import('./config');

    expect(isSupabaseConfigured()).toBe(false);
  });
});
