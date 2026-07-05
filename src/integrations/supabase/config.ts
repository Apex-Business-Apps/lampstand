export interface SupabaseConfig {
  url: string;
  publishableKey: string;
}

function isValidHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

// Real Supabase anon/publishable keys are either signed JWTs (start with eyJ)
// or the newer format publishable keys (start with sb_publishable_).
// A value that fails this check is a placeholder, stale value, or wrong project key.
function isValidApiKey(value: string): boolean {
  return value.startsWith('eyJ') || value.startsWith('sb_publishable_');
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? '';
  const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ?? '';

  if (!url) {
    throw new Error(
      'Supabase configuration error: VITE_SUPABASE_URL is not set. ' +
      'Set this environment variable in your deployment and rebuild.',
    );
  }
  if (!isValidHttpsUrl(url)) {
    throw new Error(
      'Supabase configuration error: VITE_SUPABASE_URL must be a valid HTTPS URL ' +
      '(e.g. https://<project-id>.supabase.co). Check your deployment environment and rebuild.',
    );
  }
  if (!key) {
    throw new Error(
      'Supabase configuration error: VITE_SUPABASE_PUBLISHABLE_KEY is not set. ' +
      'Set this environment variable in your deployment and rebuild.',
    );
  }
  if (!isValidApiKey(key)) {
    // Intentionally omit the key value to avoid logging secrets.
    throw new Error(
      'Supabase configuration error: VITE_SUPABASE_PUBLISHABLE_KEY is not a valid ' +
      'Supabase API key. Ensure the correct anon/publishable key (not a placeholder ' +
      'or test value) is set in your deployment environment and rebuild.',
    );
  }

  return { url, publishableKey: key };
}

export function isSupabaseConfigured(): boolean {
  try {
    getSupabaseConfig();
    return true;
  } catch {
    return false;
  }
}
