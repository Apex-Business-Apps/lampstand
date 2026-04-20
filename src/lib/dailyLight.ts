import type { DailyLight } from '@/types';
import { DAILY_LIGHT_LIBRARY, hashString } from '@/data/contentLibrary';
import { formatLocalDate } from '@/lib/date';
import { getCachedDaily, setCachedDaily } from '@/lib/storage';
import { supabase } from '@/integrations/supabase/client';
import { rankCandidates, loadFingerprint } from '@/lib/resonance/ResonanceEngine';

/**
 * Get today's daily light, avoiding recently-seen passages for authenticated users.
 * Falls back to deterministic local rotation for guests, but uses the local
 * Resonance fingerprint to personalize even guest selections.
 */
export function getDailyLight(date = new Date()): DailyLight {
  const localDate = formatLocalDate(date);
  const cached = getCachedDaily();
  if (cached?.date === localDate) return cached;

  const fp = loadFingerprint();
  let template: typeof DAILY_LIGHT_LIBRARY[number];

  if (fp.signalCount > 0) {
    // Personalized path — let Resonance order candidates and pick the top-ranked
    // one that is not the cached/last-shown reference (novelty already part of score).
    const ranked = rankCandidates(
      DAILY_LIGHT_LIBRARY.map((entry) => ({ theme: entry.theme, passage: entry.passage })),
      fp,
    );
    const top = ranked[0]?.candidate;
    template = DAILY_LIGHT_LIBRARY.find(
      (e) => e.passage.reference === top?.passage.reference && e.theme === top?.theme,
    ) ?? DAILY_LIGHT_LIBRARY[hashString(localDate) % DAILY_LIGHT_LIBRARY.length];
  } else {
    // Cold-start path — deterministic by date for guests.
    const seed = hashString(localDate);
    template = DAILY_LIGHT_LIBRARY[seed % DAILY_LIGHT_LIBRARY.length];
    if (cached && DAILY_LIGHT_LIBRARY.length > 1 && template.passage.reference === cached.passage.reference) {
      template = DAILY_LIGHT_LIBRARY[(seed + 1) % DAILY_LIGHT_LIBRARY.length];
    }
  }

  const daily: DailyLight = {
    id: `daily-${template.passage.id}-${localDate}`,
    date: localDate,
    ...template,
  };

  setCachedDaily(daily);
  return daily;
}

/**
 * Enhanced version: checks Supabase history to avoid repeats for authenticated users
 * and applies Resonance ranking for personalized selection.
 */
export async function getDailyLightWithHistory(userId: string, date = new Date()): Promise<DailyLight> {
  const localDate = formatLocalDate(date);
  const cached = getCachedDaily();
  if (cached?.date === localDate) return cached;

  // Fetch recent history (last 30 days) to avoid repeats
  let recentRefs: Set<string> = new Set();
  try {
    const { data } = await supabase
      .from('daily_light_history')
      .select('passage_ref')
      .eq('user_id', userId)
      .order('shown_date', { ascending: false })
      .limit(30);
    if (data) {
      recentRefs = new Set(data.map(r => r.passage_ref));
    }
  } catch {
    // Fall through to local-only selection
  }

  const fp = loadFingerprint();
  const lib = DAILY_LIGHT_LIBRARY;

  // Filter out anything seen in last 30 days unless that would empty the pool.
  const eligible = recentRefs.size > 0 && recentRefs.size < lib.length
    ? lib.filter((e) => !recentRefs.has(e.passage.reference))
    : lib;

  // Rank the eligible pool with the Resonance Engine.
  const ranked = rankCandidates(
    eligible.map((entry) => ({ theme: entry.theme, passage: entry.passage })),
    fp,
  );
  const top = ranked[0]?.candidate;
  const selected = eligible.find(
    (e) => e.passage.reference === top?.passage.reference && e.theme === top?.theme,
  ) ?? eligible[hashString(localDate) % eligible.length] ?? lib[0];

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
