import type { DailyLight } from '@/types';
import { DAILY_LIGHT_LIBRARY, hashString } from '@/data/contentLibrary';
import { formatLocalDate } from '@/lib/date';
import { getCachedDaily, setCachedDaily } from '@/lib/storage';
import { supabase } from '@/integrations/supabase/client';

/**
 * Get today's daily light, avoiding recently-seen passages for authenticated users.
 * Falls back to deterministic local rotation for guests.
 */
export function getDailyLight(date = new Date()): DailyLight {
  const localDate = formatLocalDate(date);
  const cached = getCachedDaily();
  if (cached?.date === localDate) return cached;

  const seed = hashString(localDate);
  let selected = DAILY_LIGHT_LIBRARY[seed % DAILY_LIGHT_LIBRARY.length];

  if (cached && DAILY_LIGHT_LIBRARY.length > 1 && selected.passage.reference === cached.passage.reference) {
    selected = DAILY_LIGHT_LIBRARY[(seed + 1) % DAILY_LIGHT_LIBRARY.length];
  }

  const daily: DailyLight = {
    id: `daily-${selected.passage.id}-${localDate}`,
    date: localDate,
    ...selected,
  };

  setCachedDaily(daily);
  return daily;
}

/**
 * Enhanced version: checks Supabase history to avoid repeats for authenticated users.
 * Call this from the DailyLightPage when user is logged in.
 */
export async function getDailyLightWithHistory(userId: string, date = new Date()): Promise<DailyLight> {
  const localDate = formatLocalDate(date);
  const cached = getCachedDaily();
  if (cached?.date === localDate) return cached;

  // Fetch recent history (last 20 days) to avoid repeats
  let recentRefs: Set<string> = new Set();
  try {
    const { data } = await supabase
      .from('daily_light_history')
      .select('passage_ref')
      .eq('user_id', userId)
      .order('shown_date', { ascending: false })
      .limit(20);
    if (data) {
      recentRefs = new Set(data.map(r => r.passage_ref));
    }
  } catch {
    // Fall through to deterministic selection
  }

  const seed = hashString(localDate);
  const lib = DAILY_LIGHT_LIBRARY;

  // Try to find an entry not in recent history
  let selected = lib[seed % lib.length];
  if (recentRefs.size > 0 && recentRefs.size < lib.length) {
    const unseen = lib.filter(e => !recentRefs.has(e.passage.reference));
    if (unseen.length > 0) {
      selected = unseen[seed % unseen.length];
    }
  }

  const daily: DailyLight = {
    id: `daily-${selected.passage.id}-${localDate}`,
    date: localDate,
    ...selected,
  };

  setCachedDaily(daily);

  // Record in history (fire and forget)
  supabase
    .from('daily_light_history')
    .upsert({
      user_id: userId,
      passage_ref: selected.passage.reference,
      theme: selected.theme,
      shown_date: localDate,
    }, { onConflict: 'user_id,shown_date' })
    .then(({ error }) => {
      if (error) console.warn('[daily-light] history write failed:', error.message);
    });

  return daily;
}
