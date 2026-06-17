import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getSupabaseConfig } from './config';

const { url, publishableKey } = getSupabaseConfig();

export const supabasePublishableKey = publishableKey;

export const supabase = createClient<Database>(url, publishableKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
