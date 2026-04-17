/**
 * Supabase cloud sync — bidirectional persistence for authenticated users.
 * Local-first: writes always go to localStorage immediately,
 * then sync to Supabase in the background when authenticated.
 */
import { supabase } from '@/integrations/supabase/client';
import {
  getProfile, saveProfile,
  getSavedPassages, savePassage, savePassages,
  getJournalEntries, saveJournalEntry, saveJournalEntries,
} from '@/lib/storage';
import type { UserProfile, SavedPassage, JournalEntry } from '@/types';
import type { Json } from '@/integrations/supabase/types';

/** Push local profile to Supabase (upsert by user_id) */
export async function syncProfileToCloud(userId: string): Promise<void> {
  const profile = getProfile();
  if (!profile) return;

  const { error } = await supabase.from('profiles').upsert({
    user_id: userId,
    first_name: profile.firstName,
    tone_style: profile.toneStyle,
    faith_familiarity: profile.faithFamiliarity,
    reading_preference: profile.readingPreference,
    voice_gender: profile.voiceGender,
    kids_mode: profile.kidsMode,
    onboarding_complete: profile.onboardingComplete,
  }, { onConflict: 'user_id' });

  if (error) console.warn('[sync] profile push failed:', error.message);
}

/** Pull cloud profile into local storage */
export async function pullProfileFromCloud(userId: string): Promise<void> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return;

  const local = getProfile();
  const merged: UserProfile = {
    id: local?.id || data.id,
    firstName: data.first_name || local?.firstName || 'Friend',
    toneStyle: (data.tone_style as UserProfile['toneStyle']) || local?.toneStyle || 'balanced',
    faithFamiliarity: (data.faith_familiarity as UserProfile['faithFamiliarity']) || local?.faithFamiliarity || 'familiar',
    preferredUses: local?.preferredUses || ['daily'],
    kidsMode: data.kids_mode ?? local?.kidsMode ?? false,
    readingPreference: (data.reading_preference as UserProfile['readingPreference']) || local?.readingPreference || 'balanced',
    voiceGender: (data.voice_gender as UserProfile['voiceGender']) || local?.voiceGender || 'male',
    notificationsEnabled: local?.notificationsEnabled ?? false,
    notificationTime: local?.notificationTime || '07:00',
    onboardingComplete: data.onboarding_complete ?? local?.onboardingComplete ?? false,
    createdAt: local?.createdAt || data.created_at,
  };
  saveProfile(merged);
}

/** Push saved passages to Supabase */
export async function syncPassagesToCloud(userId: string): Promise<void> {
  const passages = getSavedPassages();
  if (passages.length === 0) return;

  const rows = passages.map(p => ({
    user_id: userId,
    passage_ref: p.passage.reference,
    passage_data: JSON.parse(JSON.stringify(p.passage)) as Json,
    note: p.note || null,
    saved_at: p.savedAt,
  }));

  const { error } = await supabase.from('saved_passages').upsert(rows, { onConflict: 'id', ignoreDuplicates: true });
  if (error) console.warn('[sync] passages push failed:', error.message);
}

/** Pull saved passages from cloud */
export async function pullPassagesFromCloud(userId: string): Promise<void> {
  const { data, error } = await supabase
    .from('saved_passages')
    .select('*')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false })
    .limit(200);

  if (error || !data) return;

  const localIds = new Set(getSavedPassages().map(p => p.id));
  const newPassages: SavedPassage[] = [];
  for (const row of data) {
    if (localIds.has(row.id)) continue;
    newPassages.push({
      id: row.id,
      passage: row.passage_data as unknown as SavedPassage['passage'],
      note: row.note || undefined,
      savedAt: row.saved_at,
    });
  }
  if (newPassages.length > 0) {
    savePassages(newPassages);
  }
}

/** Push journal entries to Supabase */
export async function syncJournalToCloud(userId: string): Promise<void> {
  const entries = getJournalEntries();
  if (entries.length === 0) return;

  const rows = entries.map(e => ({
    user_id: userId,
    content: e.content,
    mood: e.mood || null,
    related_passage: e.relatedPassage ? (JSON.parse(JSON.stringify(e.relatedPassage)) as Json) : null,
  }));

  const { error } = await supabase.from('journal_entries').upsert(rows, { onConflict: 'id', ignoreDuplicates: true });
  if (error) console.warn('[sync] journal push failed:', error.message);
}

/** Pull journal entries from cloud */
export async function pullJournalFromCloud(userId: string): Promise<void> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(500);

  if (error || !data) return;

  const localIds = new Set(getJournalEntries().map(e => e.id));
  const newEntries: JournalEntry[] = [];
  for (const row of data) {
    if (localIds.has(row.id)) continue;
    newEntries.push({
      id: row.id,
      content: row.content,
      mood: row.mood || undefined,
      relatedPassage: row.related_passage as unknown as JournalEntry['relatedPassage'],
      createdAt: row.created_at,
    });
  }
  if (newEntries.length > 0) {
    saveJournalEntries(newEntries);
  }
}

/** Full bidirectional sync — call after login or on app init when authenticated */
export async function runFullSync(userId: string): Promise<void> {
  await Promise.all([
    pullProfileFromCloud(userId),
    pullPassagesFromCloud(userId),
    pullJournalFromCloud(userId),
  ]);
  // Then push local additions
  await Promise.all([
    syncProfileToCloud(userId),
    syncPassagesToCloud(userId),
    syncJournalToCloud(userId),
  ]);
}
