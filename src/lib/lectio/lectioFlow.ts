/**
 * Lectio Divina - the Church-attested 4-movement contemplative reading
 * of scripture (Lectio · Meditatio · Oratio · Contemplatio).
 *
 * The daytime contemplative counterpart to our evening Examen.
 * Deterministic, dependency-free, tone-adapted, anchored on today's
 * Daily Light passage so the practice is always grounded in real scripture
 * (no AI invention of doctrine). Persists one bounded JournalEntry per day
 * (idempotent by id) and feeds the Resonance Engine with rich signals.
 */
import type { ToneStyle, JournalEntry, ScripturePassage } from '@/types';
import { saveJournalEntry, getJournalEntries } from '@/lib/storage';
import { recordSignal } from '@/lib/resonance/ResonanceEngine';
import { formatLocalDate } from '@/lib/date';

const todayKey = () => formatLocalDate();

export type LectioStepId = 'lectio' | 'meditatio' | 'oratio' | 'contemplatio';

export interface LectioStep {
  id: LectioStepId;
  title: string;
  latin: string;
  prompt: string;
  placeholder: string;
  theme: string;
  signal: 'reflected' | 'returned';
}

const PROMPTS: Record<ToneStyle, Record<LectioStepId, Omit<LectioStep, 'id' | 'signal' | 'latin'>>> = {
  gentle: {
    lectio: { title: 'Read', prompt: 'Read the passage slowly, twice. Which word or phrase quietly catches your attention?', placeholder: 'A word, a phrase…', theme: 'listening' },
    meditatio: { title: 'Reflect', prompt: 'Sit with that word. What might God be inviting you to notice today?', placeholder: 'Let it unfold…', theme: 'discernment' },
    oratio: { title: 'Respond', prompt: 'Speak back to God in your own words - gratitude, longing, or a simple question.', placeholder: 'A short prayer…', theme: 'returning' },
    contemplatio: { title: 'Rest', prompt: 'Set the words aside. Rest a moment in God\u2019s presence. Note what remains.', placeholder: 'A feeling, a stillness…', theme: 'stillness' },
  },
  balanced: {
    lectio: { title: 'Read', prompt: 'Read the passage attentively, then again. What word, phrase, or image rises to meet you?', placeholder: 'Name what stood out…', theme: 'listening' },
    meditatio: { title: 'Meditate', prompt: 'Ponder it. Where does it touch your life right now - memory, hope, or question?', placeholder: 'A connection, a question…', theme: 'discernment' },
    oratio: { title: 'Pray', prompt: 'Respond to God honestly - praise, petition, lament, or thanks.', placeholder: 'Speak from the heart…', theme: 'returning' },
    contemplatio: { title: 'Contemplate', prompt: 'Release words. Abide briefly in stillness. What grace do you carry forward?', placeholder: 'A gift, a quiet…', theme: 'stillness' },
  },
  traditional: {
    lectio: { title: 'Lectio - Read', prompt: 'Read the sacred text reverently. Which verse does the Holy Spirit illumine for you?', placeholder: 'The verse the Lord highlights…', theme: 'listening' },
    meditatio: { title: 'Meditatio - Meditate', prompt: 'Ruminate upon it. How does this Word address your soul, your state, your circumstance?', placeholder: 'The Word applied to your soul…', theme: 'discernment' },
    oratio: { title: 'Oratio - Pray', prompt: 'Address God in response - adoration, contrition, thanksgiving, or supplication.', placeholder: 'A prayer of the heart…', theme: 'returning' },
    contemplatio: { title: 'Contemplatio - Contemplate', prompt: 'Cease from words. Rest silently in the loving presence of God. Receive what He gives.', placeholder: 'A grace received in silence…', theme: 'stillness' },
  },
};

const LATIN: Record<LectioStepId, string> = {
  lectio: 'Lectio',
  meditatio: 'Meditatio',
  oratio: 'Oratio',
  contemplatio: 'Contemplatio',
};

const STEP_ORDER: LectioStepId[] = ['lectio', 'meditatio', 'oratio', 'contemplatio'];
const STEP_SIGNALS: Record<LectioStepId, 'reflected' | 'returned'> = {
  lectio: 'reflected',
  meditatio: 'reflected',
  oratio: 'returned',
  contemplatio: 'returned',
};

export function getLectioSteps(tone: ToneStyle = 'balanced'): LectioStep[] {
  const t = PROMPTS[tone] ? tone : 'balanced';
  return STEP_ORDER.map((id) => ({
    id,
    signal: STEP_SIGNALS[id],
    latin: LATIN[id],
    ...PROMPTS[t][id],
  }));
}

/** Stable id for today's session - guarantees one-per-day idempotency. */
export function todayLectioSessionId(): string {
  return `lectio-${todayKey()}`;
}

export function hasCompletedTodayLectio(): boolean {
  const id = todayLectioSessionId();
  return getJournalEntries().some((e) => e.id === id);
}

export interface LectioResponses {
  lectio: string;
  meditatio: string;
  oratio: string;
  contemplatio: string;
}

/**
 * Persist one Lectio session as a single JournalEntry and feed resonance.
 * Idempotent by today's deterministic id.
 */
export function completeLectio(
  responses: LectioResponses,
  passage: ScripturePassage,
  tone: ToneStyle = 'balanced',
) {
  const steps = getLectioSteps(tone);
  const sections = steps
    .map((s) => `## ${s.title}\n${(responses[s.id] || '').trim()}`)
    .join('\n\n');
  const content = `# Lectio Divina - ${todayKey()}\n\n*${passage.reference}*\n\n> ${passage.text}\n\n${sections}`.trim();

  const entry: JournalEntry = {
    id: todayLectioSessionId(),
    content,
    relatedPassage: passage,
    mood: 'lectio',
    createdAt: new Date().toISOString(),
  };
  saveJournalEntry(entry);

  for (const step of steps) {
    const text = (responses[step.id] || '').trim();
    if (text.length < 2) continue;
    try {
      recordSignal({ signal: step.signal, theme: step.theme, tone, passage });
    } catch { /* best-effort */ }
  }
  return entry;
}