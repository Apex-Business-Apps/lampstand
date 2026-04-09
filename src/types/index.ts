// ─── User & Profile ───
export type ToneStyle = 'gentle' | 'balanced' | 'traditional';
export type FaithFamiliarity = 'new' | 'familiar' | 'very-familiar';
export type UseCase = 'daily' | 'learning' | 'crisis' | 'prayer' | 'family';
export type ReadingPreference = 'modern' | 'balanced' | 'traditional';

export type VoiceGender = 'male' | 'female';

export interface UserProfile {
  id: string;
  firstName: string;
  toneStyle: ToneStyle;
  faithFamiliarity: FaithFamiliarity;
  preferredUses: UseCase[];
  kidsMode: boolean;
  readingPreference: ReadingPreference;
  voiceGender: VoiceGender;
  notificationsEnabled: boolean;
  notificationTime: string; // HH:mm
  onboardingComplete: boolean;
  createdAt: string;
}

// ─── Content ───
export interface ScripturePassage {
  id: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  text: string;
  translation: string;
  reference: string; // e.g. "John 14:1-4"
}

export interface DailyLight {
  id: string;
  date: string; // YYYY-MM-DD
  passage: ScripturePassage;
  reflection: string;
  prayer: string;
  theme: string;
}

export interface Sermon {
  id: string;
  title: string;
  passage: ScripturePassage;
  reflection: string;
  relevance: string;
  prayer?: string;
  createdAt: string;
}

export interface GuidanceResult {
  id: string;
  concern: string;
  themes: string[];
  passage: ScripturePassage;
  pastoralFraming: string;
  reflectionQuestions: string[];
  prayer?: string;
  createdAt: string;
}

// ─── Journal & Saved ───
export interface SavedPassage {
  id: string;
  passage: ScripturePassage;
  note?: string;
  savedAt: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  relatedPassage?: ScripturePassage;
  mood?: string;
  createdAt: string;
}

// ─── Local Adaptive Knowledge ───
export interface LocalKnowledge {
  preferredReflectionLength: 'short' | 'medium' | 'long';
  frequentTopics: string[];
  averageSessionMinutes: number;
  preferredWording: 'reflective' | 'direct';
  interactionCount: number;
  lastActive: string;
  streak: number;
  lastStreakDate: string;
}

// ─── Safety ───
export interface SafetyEvent {
  id: string;
  type: 'injection' | 'hijack' | 'abuse' | 'out-of-scope' | 'unsafe';
  input: string;
  action: 'blocked' | 'fallback' | 'scripture-only';
  timestamp: string;
}

// ─── Retrieval Adapters ───
export interface RetrievalRequest {
  query: string;
  context?: string;
  topK?: number;
  translation?: string;
}

export interface RetrievalResult {
  passages: ScripturePassage[];
  confidence: number;
  source: string;
}

export interface IRetrievalAdapter {
  search(req: RetrievalRequest): Promise<RetrievalResult>;
  getByReference(ref: string): Promise<ScripturePassage | null>;
}

export interface IAIAdapter {
  generateReflection(passage: ScripturePassage, tone: ToneStyle, context?: string): Promise<string>;
  generateSermon(passage: ScripturePassage, tone: ToneStyle): Promise<Sermon>;
  generateGuidance(concern: string, tone: ToneStyle): Promise<GuidanceResult>;
  classifyConcern(input: string): Promise<string[]>;
  validateSafety(input: string): Promise<{ safe: boolean; reason?: string }>;
}

// ─── Content Admin ───
export interface ContentTheme {
  id: string;
  name: string;
  passages: string[]; // references
  active: boolean;
  order: number;
}

export interface TranslationConfig {
  id: string;
  name: string;
  abbreviation: string;
  readabilityLevel: ReadingPreference;
  available: boolean;
}

// ─── Notification ───
export interface NotificationConfig {
  enabled: boolean;
  time: string;
  title: string;
  bodyTemplate: string;
}

// ─── Onboarding ───
export type OnboardingStep = 'welcome' | 'name' | 'tone' | 'faith' | 'use' | 'kids' | 'notifications' | 'reading' | 'complete';

// ─── Consent/Auth/Sync Extensions ───
export interface ConsentState {
  localAdaptiveMemory: boolean;
  localJournalStorage: boolean;
  optionalCloudSync: boolean;
  notifications: boolean;
  microphone: boolean;
  voiceOutput: boolean;
  analyticsTelemetry: boolean;
  accountLinkedPersistence: boolean;
  updatedAt: string;
}

export interface AuthState {
  mode: 'guest' | 'authenticated';
  userId?: string;
  email?: string;
  updatedAt: string;
}

export interface NotificationPreference {
  enabled: boolean;
  time: string;
}

export interface VoicePreference {
  enabled: boolean;
  muted: boolean;
  speed: number;
  allowKidsModeVoice: boolean;
}

export interface SyncState {
  enabled: boolean;
  lastSyncedAt?: string;
  provider: 'none' | 'supabase';
}

export interface PresenceScore {
  score: number;
  state: 'ember' | 'flame' | 'radiance' | 'sacred-heart';
  lastActivityAt: string;
}
