import type {
  UserProfile,
  SavedPassage,
  JournalEntry,
  LocalKnowledge,
  SafetyEvent,
  DailyLight,
  ConsentState,
  AuthState,
  VoicePreference,
  SyncState,
  PresenceScore,
} from '@/types';
import { formatLocalDate, getRelativeLocalDate } from '@/lib/date';

const KEYS = {
  profile: 'lampstand_profile',
  saved: 'lampstand_saved',
  journal: 'lampstand_journal',
  knowledge: 'lampstand_knowledge',
  safety: 'lampstand_safety',
  dailyCache: 'lampstand_daily_cache',
  consent: 'lampstand_consent',
  authState: 'lampstand_auth_state',
  voicePrefs: 'lampstand_voice_preferences',
  syncState: 'lampstand_sync_state',
  presenceScore: 'lampstand_presence_score',
  voiceHistory: 'lampstand_voice_history',
} as const;

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getProfile(): UserProfile | null {
  return get<UserProfile | null>(KEYS.profile, null);
}
export function saveProfile(p: UserProfile) { set(KEYS.profile, p); }
export function clearProfile() { localStorage.removeItem(KEYS.profile); }

export function getSavedPassages(): SavedPassage[] { return get(KEYS.saved, []); }
export function savePassage(p: SavedPassage) {
  const all = getSavedPassages();
  if (!all.find((s) => s.id === p.id)) {
    all.unshift(p);
    set(KEYS.saved, all);
    incrementPresenceScore(3);
  }
}
export function savePassages(passages: SavedPassage[]) {
  if (passages.length === 0) return;
  const all = getSavedPassages();
  const existingIds = new Set<string>();
  for (const s of all) {
    existingIds.add(s.id);
  }

  const toAdd: SavedPassage[] = [];
  const processedNewIds = new Set<string>();
  for (const p of passages) {
    if (!existingIds.has(p.id) && !processedNewIds.has(p.id)) {
      toAdd.push(p);
      processedNewIds.add(p.id);
    }
  }

  if (toAdd.length > 0) {
    // Reverse to maintain unshift order if the input was already ordered
    all.unshift(...toAdd.reverse());
    set(KEYS.saved, all);
    incrementPresenceScore(3 * toAdd.length);
  }
}
export function removePassage(id: string) {
  set(KEYS.saved, getSavedPassages().filter((p) => p.id !== id));
}

export function getJournalEntries(): JournalEntry[] { return get(KEYS.journal, []); }
export function saveJournalEntry(e: JournalEntry) {
  const all = getJournalEntries();
  const idx = all.findIndex((j) => j.id === e.id);
  if (idx >= 0) all[idx] = e;
  else all.unshift(e);
  set(KEYS.journal, all);
  incrementPresenceScore(4);
}
export function saveJournalEntries(entries: JournalEntry[]) {
  if (entries.length === 0) return;
  const all = getJournalEntries();
  let changed = false;

  const entryMap = new Map<string, number>();
  for (let i = 0; i < all.length; i++) {
    entryMap.set(all[i].id, i);
  }

  const newEntries: JournalEntry[] = [];
  const processedNewIds = new Set<string>();
  for (const e of entries) {
    const idx = entryMap.get(e.id);
    if (idx !== undefined) {
      all[idx] = e;
      changed = true;
    } else if (!processedNewIds.has(e.id)) {
      newEntries.push(e);
      processedNewIds.add(e.id);
    }
  }

  if (newEntries.length > 0) {
    // Reverse to maintain unshift order if the input was already ordered
    all.unshift(...newEntries.reverse());
    changed = true;
    incrementPresenceScore(4 * newEntries.length);
  }

  if (changed) {
    set(KEYS.journal, all);
  }
}
export function removeJournalEntry(id: string) {
  set(KEYS.journal, getJournalEntries().filter((e) => e.id !== id));
}

const defaultKnowledge: LocalKnowledge = {
  preferredReflectionLength: 'medium',
  frequentTopics: [],
  averageSessionMinutes: 0,
  preferredWording: 'reflective',
  interactionCount: 0,
  lastActive: '',
  streak: 0,
  lastStreakDate: '',
};
export function getKnowledge(): LocalKnowledge { return get(KEYS.knowledge, defaultKnowledge); }
export function updateKnowledge(partial: Partial<LocalKnowledge>) {
  set(KEYS.knowledge, { ...getKnowledge(), ...partial });
}
export function updateStreak() {
  const k = getKnowledge();
  const today = formatLocalDate();
  const yesterday = getRelativeLocalDate(-1);
  if (k.lastStreakDate === today) return;
  const streak = k.lastStreakDate === yesterday ? k.streak + 1 : 1;
  updateKnowledge({ streak, lastStreakDate: today, lastActive: today, interactionCount: k.interactionCount + 1 });
  incrementPresenceScore(5);
}
export function clearKnowledge() { set(KEYS.knowledge, defaultKnowledge); }

export function getSafetyEvents(): SafetyEvent[] { return get(KEYS.safety, []); }
export function logSafetyEvent(e: SafetyEvent) {
  const all = getSafetyEvents();
  all.push(e);
  if (all.length > 100) all.shift();
  set(KEYS.safety, all);
}

export function getCachedDaily(): DailyLight | null { return get(KEYS.dailyCache, null); }
export function setCachedDaily(d: DailyLight) { set(KEYS.dailyCache, d); }

const defaultConsent: ConsentState = {
  localAdaptiveMemory: true,
  localJournalStorage: true,
  optionalCloudSync: false,
  notifications: false,
  microphone: false,
  voiceOutput: false,
  analyticsTelemetry: false,
  accountLinkedPersistence: false,
  updatedAt: new Date(0).toISOString(),
};
export function getConsentState(): ConsentState { return get(KEYS.consent, defaultConsent); }
export function saveConsentState(partial: Partial<ConsentState>) {
  set(KEYS.consent, { ...getConsentState(), ...partial, updatedAt: new Date().toISOString() });
}

const defaultAuthState: AuthState = { mode: 'guest', updatedAt: new Date(0).toISOString() };
export function getAuthState(): AuthState { return get(KEYS.authState, defaultAuthState); }
export function saveAuthState(partial: Partial<AuthState>) {
  set(KEYS.authState, { ...getAuthState(), ...partial, updatedAt: new Date().toISOString() });
}

const defaultVoice: VoicePreference = { enabled: false, muted: false, speed: 1, allowKidsModeVoice: false };
export function getVoicePreferences(): VoicePreference { return get(KEYS.voicePrefs, defaultVoice); }
export function saveVoicePreferences(partial: Partial<VoicePreference>) {
  set(KEYS.voicePrefs, { ...getVoicePreferences(), ...partial });
}

const defaultSync: SyncState = { enabled: false, provider: 'none' };
export function getSyncState(): SyncState { return get(KEYS.syncState, defaultSync); }
export function saveSyncState(partial: Partial<SyncState>) {
  set(KEYS.syncState, { ...getSyncState(), ...partial });
}

const defaultPresence: PresenceScore = { score: 10, state: 'ember', lastActivityAt: new Date().toISOString() };
export function getPresenceScore(): PresenceScore {
  const value = get(KEYS.presenceScore, defaultPresence);
  const daysAway = Math.floor((Date.now() - new Date(value.lastActivityAt).getTime()) / 86400000);
  if (daysAway <= 2) return value;
  const decayed = Math.max(5, value.score - daysAway * 2);
  const state = derivePresenceState(decayed);
  const updated = { score: decayed, state, lastActivityAt: value.lastActivityAt };
  set(KEYS.presenceScore, updated);
  return updated;
}

export function incrementPresenceScore(delta: number) {
  const current = getPresenceScore();
  const score = Math.min(100, current.score + delta);
  set(KEYS.presenceScore, { score, state: derivePresenceState(score), lastActivityAt: new Date().toISOString() });
}

function derivePresenceState(score: number): PresenceScore['state'] {
  if (score >= 85) return 'sacred-heart';
  if (score >= 60) return 'radiance';
  if (score >= 30) return 'flame';
  return 'ember';
}

export function pushVoiceTranscript(transcript: string) {
  const history = get<string[]>(KEYS.voiceHistory, []);
  history.unshift(transcript.slice(0, 1000));
  set(KEYS.voiceHistory, history.slice(0, 50));
}

export function clearVoiceHistory() {
  localStorage.removeItem(KEYS.voiceHistory);
}

export function resetAllData() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
