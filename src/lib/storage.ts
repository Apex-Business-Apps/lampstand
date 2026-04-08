import type {
  UserProfile, SavedPassage, JournalEntry, LocalKnowledge, SafetyEvent, DailyLight, ConsentSettings
} from '@/types';

const KEYS = {
  profile: 'lampstand_profile',
  saved: 'lampstand_saved',
  journal: 'lampstand_journal',
  knowledge: 'lampstand_knowledge',
  safety: 'lampstand_safety',
  dailyCache: 'lampstand_daily_cache',
  consent: 'lampstand_consent',
} as const;

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function set(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Profile ───
export function getProfile(): UserProfile | null {
  return get<UserProfile | null>(KEYS.profile, null);
}
export function saveProfile(p: UserProfile) { set(KEYS.profile, p); }
export function clearProfile() { localStorage.removeItem(KEYS.profile); }

// ─── Saved Passages ───
export function getSavedPassages(): SavedPassage[] { return get(KEYS.saved, []); }
export function savePassage(p: SavedPassage) {
  const all = getSavedPassages();
  if (!all.find(s => s.id === p.id)) { all.unshift(p); set(KEYS.saved, all); }
}
export function removePassage(id: string) {
  set(KEYS.saved, getSavedPassages().filter(p => p.id !== id));
}

// ─── Journal ───
export function getJournalEntries(): JournalEntry[] { return get(KEYS.journal, []); }
export function saveJournalEntry(e: JournalEntry) {
  const all = getJournalEntries();
  const idx = all.findIndex(j => j.id === e.id);
  if (idx >= 0) all[idx] = e; else all.unshift(e);
  set(KEYS.journal, all);
}
export function removeJournalEntry(id: string) {
  set(KEYS.journal, getJournalEntries().filter(e => e.id !== id));
}

// ─── Local Knowledge ───
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
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (k.lastStreakDate === today) return;
  const streak = k.lastStreakDate === yesterday ? k.streak + 1 : 1;
  updateKnowledge({ streak, lastStreakDate: today, lastActive: today, interactionCount: k.interactionCount + 1 });
}
export function clearKnowledge() { set(KEYS.knowledge, defaultKnowledge); }

// ─── Safety Events ───
export function getSafetyEvents(): SafetyEvent[] { return get(KEYS.safety, []); }
export function logSafetyEvent(e: SafetyEvent) {
  const all = getSafetyEvents();
  all.push(e);
  if (all.length > 100) all.shift();
  set(KEYS.safety, all);
}

// ─── Daily Cache ───
export function getCachedDaily(): DailyLight | null { return get(KEYS.dailyCache, null); }
export function setCachedDaily(d: DailyLight) { set(KEYS.dailyCache, d); }

// ─── Full Reset ───
export function resetAllData() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}


const defaultConsent: ConsentSettings = {
  localMemory: false,
  notifications: false,
  microphone: false,
  voicePlayback: false,
  cloudSync: false,
  kidsVoiceEnabled: false,
};

export function getConsentSettings(): ConsentSettings { return get(KEYS.consent, defaultConsent); }
export function saveConsentSettings(settings: ConsentSettings) { set(KEYS.consent, settings); }
