import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Mock the supabase-js module
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

describe('Supabase Client Initialization', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('should initialize with environment variables', async () => {
    const mockUrl = 'https://test.supabase.co';
    const mockKey = 'test-key';

    // Set environment variables using vi.stubEnv
    vi.stubEnv('VITE_SUPABASE_URL', mockUrl);
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', mockKey);

    // Import the client (this will trigger createClient call)
    await import('./client');

    expect(createClient).toHaveBeenCalledWith(
      mockUrl,
      mockKey,
      expect.any(Object)
    );
  });

  it('should throw error if environment variables are missing', async () => {
    // Ensure environment variables are missing
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', '');

    // We expect the import to fail because of the throw in client.ts
    await expect(import('./client')).rejects.toThrow(
      'Missing Supabase environment variables'
    );
  });
});
