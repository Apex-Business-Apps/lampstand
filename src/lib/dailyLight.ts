import type { DailyLight } from '@/types';
import { DAILY_LIGHT_LIBRARY, hashString } from '@/data/contentLibrary';
import { formatLocalDate } from '@/lib/date';
import { getCachedDaily, setCachedDaily } from '@/lib/storage';

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