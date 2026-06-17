import { supabase, supabasePublishableKey } from '@/integrations/supabase/client';

/**
 * Returns headers for Supabase edge function calls:
 * - Always includes apikey (publishable/anon key, required by Supabase)
 * - Sends Authorization: Bearer <session_token> only when authenticated
 * - Leaves Authorization unset for anonymous guest mode so edge functions do
 *   not mistake the publishable key for a user session token
 */
export async function getEdgeFunctionHeaders(): Promise<Record<string, string>> {
  const base: Record<string, string> = {
    'Content-Type': 'application/json',
    apikey: supabasePublishableKey,
  };

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      base['Authorization'] = `Bearer ${session.access_token}`;
    }
  } catch {
    // Anonymous-safe fallback: apikey remains present, Authorization is omitted.
  }

  return base;
}
