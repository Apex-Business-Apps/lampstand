import { beforeEach, describe, expect, it, vi } from 'vitest';

const getSession = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: { getSession },
  },
  supabasePublishableKey: 'anon-key',
}));

describe('edge function auth headers', () => {
  beforeEach(() => {
    vi.resetModules();
    getSession.mockReset();
  });

  it('uses the signed-in session access token for authenticated calls', async () => {
    getSession.mockResolvedValue({ data: { session: { access_token: 'session-token' } } });
    const { getEdgeFunctionHeaders } = await import('@/lib/supabaseAuthHeaders');

    await expect(getEdgeFunctionHeaders()).resolves.toMatchObject({
      apikey: 'anon-key',
      Authorization: 'Bearer session-token',
    });
  });

  it('does not pretend anonymous calls are authenticated users', async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    const { getEdgeFunctionHeaders } = await import('@/lib/supabaseAuthHeaders');

    const headers = await getEdgeFunctionHeaders();
    expect(headers.apikey).toBe('anon-key');
    expect(headers.Authorization).toBeUndefined();
  });

  it('omits Authorization when session lookup fails', async () => {
    getSession.mockRejectedValue(new Error('private browsing storage failure'));
    const { getEdgeFunctionHeaders } = await import('@/lib/supabaseAuthHeaders');

    const headers = await getEdgeFunctionHeaders();
    expect(headers.apikey).toBe('anon-key');
    expect(headers.Authorization).toBeUndefined();
  });
});
