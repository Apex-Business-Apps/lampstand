/**
 * The Daily Examen — Ignatian 5-step contemplative practice.
 *
 * Deterministic, dependency-free, tone-adapted. Generates prompts locally
 * (no model calls), feeds rich signals into the Resonance Engine, and
 * persists a single bounded JournalEntry per session so /journal stays
 * the single source of truth (idempotent — same sessionId never duplicates).
 *
 * Theology guardrail: the Examen is a Church-attested practice. We never
 * invent doctrine; prompts only invite reflection, never declare it.
 */
import type { ToneStyle, JournalEntry } from '@/types';
import { saveJournalEntry, getJournalEntries } from '@/lib/storage';
import { recordSignal } from '@/lib/resonance/ResonanceEngine';
import { todayKey } from '@/lib/date';

export type ExamenStepId =
  | 'presence'
  | 'gratitude'
  | 'review'
  | 'sorrow'
  | 'resolve';

export interface ExamenStep {
  id: ExamenStepId;
  title: string;
  prompt: string;
  placeholder: string;
  /** Theme tag for resonance — chosen for pastoral, not doctrinal, weight. */
  theme: string;
  /** Signal strength hint: gratitude/resolve flourishing; sorrow consolation. */
  signal: 'reflected' | 'returned';
}

const PROMPTS: Record<ToneStyle, Record<ExamenStepId, Omit<ExamenStep, 'id' | 'signal'>>> = {
  gentle: {
    presence: { title: 'Become Present', prompt: 'Take a slow breath. You are not alone. Where do you feel God meeting you right now?', placeholder: 'A word, a feeling, a place…', theme: 'stillness' },
    gratitude: { title: 'Give Thanks', prompt: 'What in today, however small, would you like to thank God for?', placeholder: 'A kindness, a small mercy…', theme: 'gratitude' },
    review: { title: 'Review the Day', prompt: 'Walk gently through the hours. What moments stand out — light or shadow?', placeholder: 'No need to list everything…', theme: 'discernment' },
    sorrow: { title: 'Notice Where You Stumbled', prompt: 'Without harshness, name a moment you wish had gone differently.', placeholder: 'You are loved through this…', theme: 'consolation' },
    resolve: { title: 'Look to Tomorrow', prompt: 'What is one small grace you would ask for tomorrow?', placeholder: 'A hope, a courage, a patience…', theme: 'returning' },
  },
  balanced: {
    presence: { title: 'Become Present', prompt: 'Settle into stillness. Recall that God is here. What is the state of your heart this evening?', placeholder: 'Name it honestly…', theme: 'stillness' },
    gratitude: { title: 'Give Thanks', prompt: 'Look back over the day. What gifts — people, moments, small graces — surface?', placeholder: 'Anything you noticed…', theme: 'gratitude' },
    review: { title: 'Review the Day', prompt: 'Replay the day. Where did you sense consolation? Where desolation?', placeholder: 'A scene, a conversation…', theme: 'discernment' },
    sorrow: { title: 'Acknowledge Shortcomings', prompt: 'Name where you fell short — in word, action, or omission — without condemnation.', placeholder: 'Honest, not punishing…', theme: 'consolation' },
    resolve: { title: 'Resolve for Tomorrow', prompt: 'Looking ahead, what one intention will you carry into tomorrow?', placeholder: 'A concrete step…', theme: 'returning' },
  },
  traditional: {
    presence: { title: 'Place Yourself in God\u2019s Presence', prompt: 'Recall that you stand before the Lord. Quiet the soul and beg the light of the Holy Spirit.', placeholder: 'A prayer of placing…', theme: 'stillness' },
    gratitude: { title: 'Give Thanks for Benefits Received', prompt: 'For what graces of this day do you owe particular thanks to God?', placeholder: 'Name the benefits…', theme: 'gratitude' },
    review: { title: 'Examine the Day Hour by Hour', prompt: 'Pass through the day. Note the motions of the soul — consolations and desolations.', placeholder: 'Hour by hour…', theme: 'discernment' },
    sorrow: { title: 'Ask Pardon for Faults', prompt: 'With contrition, name your faults of thought, word, deed, and omission.', placeholder: 'In humility…', theme: 'consolation' },
    resolve: { title: 'Resolve and Beg Grace', prompt: 'Resolve amendment for tomorrow and beg the grace to fulfill it.', placeholder: 'A firm purpose…', theme: 'returning' },
  },
};

const STEP_ORDER: ExamenStepId[] = ['presence', 'gratitude', 'review', 'sorrow', 'resolve'];
const STEP_SIGNALS: Record<ExamenStepId, 'reflected' | 'returned'> = {
  presence: 'returned',
  gratitude: 'reflected',
  review: 'reflected',
  sorrow: 'reflected',
  resolve: 'returned',
};

export function getExamenSteps(tone: ToneStyle = 'balanced'): ExamenStep[] {
  const t = PROMPTS[tone] ? tone : 'balanced';
  return STEP_ORDER.map((id) => ({
    id,
    signal: STEP_SIGNALS[id],
    ...PROMPTS[t][id],
  }));
}

/** Stable id for today's session — guarantees one-per-day idempotency. */
export function todayExamenSessionId(): string {
  return `examen-${todayKey()}`;
}

/** Has the user already completed today's Examen? */
export function hasCompletedTodayExamen(): boolean {
  const id = todayExamenSessionId();
  return getJournalEntries().some((e) => e.id === id);
}

export interface ExamenResponses {
  presence: string;
  gratitude: string;
  review: string;
  sorrow: string;
  resolve: string;
}

/**
 * Persist one Examen session as a single JournalEntry and feed resonance.
 * Idempotent: uses today's deterministic id so re-completing the same day
 * updates the entry in place (saveJournalEntry already dedupes by id).
 */
export function completeExamen(responses: ExamenResponses, tone: ToneStyle = 'balanced') {
  const steps = getExamenSteps(tone);
  const sections = steps
    .map((s) => `## ${s.title}\n${(responses[s.id] || '').trim()}`)
    .join('\n\n');
  const content = `# Daily Examen — ${todayKey()}\n\n${sections}`.trim();

  const entry: JournalEntry = {
    id: todayExamenSessionId(),
    content,
    mood: 'examen',
    createdAt: new Date().toISOString(),
  };
  saveJournalEntry(entry);

  // Feed resonance per-step — only when the user actually wrote something.
  for (const step of steps) {
    const text = (responses[step.id] || '').trim();
    if (text.length < 2) continue;
    try {
      recordSignal({ signal: step.signal, theme: step.theme, tone });
    } catch { /* resonance is best-effort */ }
  }
  return entry;
}
