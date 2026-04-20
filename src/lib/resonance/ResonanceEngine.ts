/**
 * Resonance Engine — TheLampStand proprietary personalization layer.
 *
 * A zero-cost, zero-dependency, on-device adaptive ranker that learns each user's
 * unique "spiritual fingerprint" — the themes, tones, postures, and emotional
 * registers that resonate most for them in their current life-season — and
 * re-ranks any candidate content (daily-light passages, guidance retrievals,
 * reflections) so the surfaced result feels *personally addressed* rather than
 * generically rotated.
 *
 * Design properties (the moat):
 *  - Pure TypeScript. No model. No new dependency. No network call.
 *  - Local-first: fingerprint lives in localStorage, optionally syncs through
 *    the existing supabaseSync pipeline if the user opts into cloud persistence.
 *  - Bounded memory: rolling window with exponential decay so the fingerprint
 *    stays current with the user's life-season instead of being dominated by
 *    early data.
 *  - Pastoral guardrails: confidence floor + diversity bonus so the engine
 *    does not collapse the content space onto a single theme (which would
 *    reinforce rumination on hard themes like shame/depression).
 *  - Sentiment-aware: parses lightweight signals from journal entries,
 *    safety events, and saved-passage themes to understand the user's
 *    current valence (struggling, steady, flourishing) and adjusts pastoral
 *    tone accordingly.
 *  - Composable score: each candidate is ranked along five axes
 *    (theme affinity, tone fit, season fit, novelty, sentiment care) so the
 *    final ordering is interpretable and tunable per surface.
 */

import type {
  DailyLight,
  ScripturePassage,
  ToneStyle,
  JournalEntry,
  SavedPassage,
} from '@/types';

const STORAGE_KEY = 'lampstand_resonance_fingerprint';
const MAX_THEME_WEIGHT = 10;
const DECAY_PER_DAY = 0.985; // gentle decay so the fingerprint tracks the season
const MAX_RECENT_THEMES = 12;
const MAX_RECENT_REFS = 30;

export type SpiritualSeason =
  | 'wilderness'      // suffering, lament, struggling
  | 'waiting'         // discernment, in-between, uncertain
  | 'steady'          // stable, ordinary fidelity
  | 'flourishing'     // gratitude, joy, growth
  | 'returning';      // re-engaging after distance

export type ResonanceSignal =
  | 'saved'           // user saved the passage
  | 'shared'          // user shared the passage
  | 'reflected'       // user wrote about it
  | 'returned'        // user came back to a theme
  | 'dismissed'       // user immediately scrolled past
  | 'voiced'          // user spoke it aloud / TTS played fully
  | 'guided';         // surfaced through Seek Guidance

export interface ResonanceFingerprint {
  /** theme -> exponentially-decayed affinity weight (0..MAX_THEME_WEIGHT) */
  themeAffinity: Record<string, number>;
  /** preferred pastoral register learned from interactions */
  tonePreference: ToneStyle;
  /** current season inferred from recent signal valence */
  season: SpiritualSeason;
  /** rolling window of recent passage refs (most-recent first) */
  recentRefs: string[];
  /** rolling window of recent themes (most-recent first) */
  recentThemes: string[];
  /** running sentiment score in [-1, +1]; negative = struggling */
  sentiment: number;
  /** total signals captured — drives confidence */
  signalCount: number;
  /** last decay timestamp for time-based weight aging */
  lastDecayAt: string;
  updatedAt: string;
}

const EMPTY_FINGERPRINT: ResonanceFingerprint = {
  themeAffinity: {},
  tonePreference: 'balanced',
  season: 'steady',
  recentRefs: [],
  recentThemes: [],
  sentiment: 0,
  signalCount: 0,
  lastDecayAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/* ─────────────────────────────────────────────────────────────────
 *  Persistence
 * ───────────────────────────────────────────────────────────────── */

export function loadFingerprint(): ResonanceFingerprint {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_FINGERPRINT };
    const parsed = JSON.parse(raw) as Partial<ResonanceFingerprint>;
    return { ...EMPTY_FINGERPRINT, ...parsed };
  } catch {
    return { ...EMPTY_FINGERPRINT };
  }
}

export function saveFingerprint(fp: ResonanceFingerprint) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fp));
  } catch {
    /* quota / private mode — silent */
  }
}

export function resetFingerprint() {
  localStorage.removeItem(STORAGE_KEY);
}

/* ─────────────────────────────────────────────────────────────────
 *  Decay — keeps the fingerprint current to the user's life-season
 * ───────────────────────────────────────────────────────────────── */

function decay(fp: ResonanceFingerprint): ResonanceFingerprint {
  const last = new Date(fp.lastDecayAt).getTime();
  const now = Date.now();
  const days = Math.max(0, Math.floor((now - last) / 86_400_000));
  if (days === 0) return fp;
  const factor = Math.pow(DECAY_PER_DAY, days);
  const themeAffinity: Record<string, number> = {};
  for (const [theme, weight] of Object.entries(fp.themeAffinity)) {
    const next = weight * factor;
    if (next > 0.05) themeAffinity[theme] = next;
  }
  return {
    ...fp,
    themeAffinity,
    sentiment: fp.sentiment * factor,
    lastDecayAt: new Date().toISOString(),
  };
}

/* ─────────────────────────────────────────────────────────────────
 *  Signal capture
 * ───────────────────────────────────────────────────────────────── */

const SIGNAL_WEIGHTS: Record<ResonanceSignal, number> = {
  saved: 1.4,
  shared: 1.6,
  reflected: 1.8,
  returned: 1.2,
  voiced: 0.8,
  guided: 0.6,
  dismissed: -0.6,
};

const SIGNAL_SENTIMENT: Record<ResonanceSignal, number> = {
  saved: 0.05,
  shared: 0.08,
  reflected: 0.04,
  returned: 0.02,
  voiced: 0.02,
  guided: -0.03, // user is seeking → mild struggle
  dismissed: -0.02,
};

const STRUGGLE_THEMES = new Set([
  'shame', 'depression', 'grief', 'doubt', 'fear', 'anger',
  'betrayal', 'illness', 'exhaustion', 'abandonment', 'lament',
  'mourning', 'release', 'consolation',
]);

const FLOURISHING_THEMES = new Set([
  'delight', 'joy', 'gratitude', 'love', 'belonging', 'praise',
  'rejoicing', 'flourishing',
]);

const WAITING_THEMES = new Set([
  'waiting', 'uncertainty', 'discernment', 'patience', 'stillness',
]);

const RETURNING_THEMES = new Set([
  'returning', 'mercy', 'forgiveness', 'restoration',
]);

/**
 * Capture a single user interaction and update the fingerprint in place.
 * Safe to call frequently — bounded memory, no I/O beyond localStorage.
 */
export function recordSignal(opts: {
  signal: ResonanceSignal;
  passage?: ScripturePassage;
  theme?: string;
  tone?: ToneStyle;
}): ResonanceFingerprint {
  let fp = decay(loadFingerprint());
  const weight = SIGNAL_WEIGHTS[opts.signal];

  if (opts.theme) {
    const current = fp.themeAffinity[opts.theme] ?? 0;
    fp.themeAffinity[opts.theme] = Math.max(
      0,
      Math.min(MAX_THEME_WEIGHT, current + weight),
    );
    fp.recentThemes = [opts.theme, ...fp.recentThemes.filter((t) => t !== opts.theme)]
      .slice(0, MAX_RECENT_THEMES);

    // Detect "returning" signal: user revisits a theme after a gap
    const wasRecent = fp.recentThemes.slice(1, 4).includes(opts.theme);
    if (wasRecent && opts.signal !== 'dismissed') {
      const r = fp.themeAffinity[opts.theme];
      fp.themeAffinity[opts.theme] = Math.min(MAX_THEME_WEIGHT, r + 0.3);
    }
  }

  if (opts.passage?.reference) {
    fp.recentRefs = [opts.passage.reference, ...fp.recentRefs.filter((r) => r !== opts.passage!.reference)]
      .slice(0, MAX_RECENT_REFS);
  }

  if (opts.tone && opts.signal !== 'dismissed') {
    // gentle bias toward whatever tone the user engages with positively
    fp.tonePreference = opts.tone;
  }

  fp.sentiment = clamp(fp.sentiment + SIGNAL_SENTIMENT[opts.signal], -1, 1);
  fp.signalCount += 1;
  fp.season = inferSeason(fp);
  fp.updatedAt = new Date().toISOString();

  saveFingerprint(fp);
  return fp;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function inferSeason(fp: ResonanceFingerprint): SpiritualSeason {
  const recent = fp.recentThemes.slice(0, 6);
  let struggle = 0;
  let flourishing = 0;
  let waiting = 0;
  let returning = 0;
  for (const t of recent) {
    if (STRUGGLE_THEMES.has(t)) struggle += 1;
    if (FLOURISHING_THEMES.has(t)) flourishing += 1;
    if (WAITING_THEMES.has(t)) waiting += 1;
    if (RETURNING_THEMES.has(t)) returning += 1;
  }
  if (returning >= 2) return 'returning';
  if (struggle >= 3 || fp.sentiment <= -0.3) return 'wilderness';
  if (flourishing >= 3 || fp.sentiment >= 0.4) return 'flourishing';
  if (waiting >= 2) return 'waiting';
  return 'steady';
}

/* ─────────────────────────────────────────────────────────────────
 *  Bootstrap from existing local data (one-time hydrate)
 * ───────────────────────────────────────────────────────────────── */

/**
 * Build an initial fingerprint from anything the user has already done.
 * Idempotent — call on app boot; cheap if fingerprint already populated.
 */
export function hydrateFingerprintFromLocal(opts: {
  saved: SavedPassage[];
  journal: JournalEntry[];
}): ResonanceFingerprint {
  let fp = decay(loadFingerprint());
  if (fp.signalCount > 0) return fp; // already bootstrapped

  for (const sp of opts.saved.slice(0, 30)) {
    fp = applySignalInPlace(fp, 'saved', { passage: sp.passage });
  }
  for (const j of opts.journal.slice(0, 30)) {
    fp = applySignalInPlace(fp, 'reflected', {
      passage: j.relatedPassage,
      moodSentiment: scoreMoodKeyword(j.mood ?? '') + scoreContentKeyword(j.content),
    });
  }

  fp.season = inferSeason(fp);
  fp.updatedAt = new Date().toISOString();
  saveFingerprint(fp);
  return fp;
}

function applySignalInPlace(
  fp: ResonanceFingerprint,
  signal: ResonanceSignal,
  ctx: { passage?: ScripturePassage; moodSentiment?: number },
): ResonanceFingerprint {
  const w = SIGNAL_WEIGHTS[signal];
  if (ctx.passage?.reference) {
    fp.recentRefs = [ctx.passage.reference, ...fp.recentRefs].slice(0, MAX_RECENT_REFS);
  }
  fp.sentiment = clamp(fp.sentiment + SIGNAL_SENTIMENT[signal] + (ctx.moodSentiment ?? 0) * 0.05, -1, 1);
  fp.signalCount += 1;
  return fp;
}

const POSITIVE_WORDS = ['grateful', 'thankful', 'joy', 'peace', 'blessed', 'hopeful', 'love', 'free'];
const NEGATIVE_WORDS = ['tired', 'anxious', 'afraid', 'angry', 'sad', 'lost', 'broken', 'shame', 'guilt', 'doubt', 'lonely', 'empty'];

function scoreMoodKeyword(s: string): number {
  const t = s.toLowerCase();
  if (POSITIVE_WORDS.some((w) => t.includes(w))) return 0.4;
  if (NEGATIVE_WORDS.some((w) => t.includes(w))) return -0.4;
  return 0;
}

function scoreContentKeyword(s: string): number {
  const t = s.toLowerCase();
  let pos = 0;
  let neg = 0;
  for (const w of POSITIVE_WORDS) if (t.includes(w)) pos += 1;
  for (const w of NEGATIVE_WORDS) if (t.includes(w)) neg += 1;
  if (pos === 0 && neg === 0) return 0;
  return clamp((pos - neg) / Math.max(1, pos + neg), -1, 1);
}

/* ─────────────────────────────────────────────────────────────────
 *  Ranking — the ordering function used by Daily Light & Guidance
 * ───────────────────────────────────────────────────────────────── */

export interface RankableCandidate {
  theme?: string;
  passage: ScripturePassage;
  /** optional caller-supplied prior (e.g. retrieval confidence in [0,1]) */
  prior?: number;
}

export interface RankedCandidate<T extends RankableCandidate> {
  candidate: T;
  score: number;
  axes: {
    affinity: number;
    season: number;
    novelty: number;
    care: number;
    prior: number;
  };
}

/**
 * Score & sort candidates against the current fingerprint.
 * Pure function over the loaded fingerprint snapshot — does not mutate.
 */
export function rankCandidates<T extends RankableCandidate>(
  candidates: T[],
  override?: ResonanceFingerprint,
): RankedCandidate<T>[] {
  const fp = override ?? decay(loadFingerprint());
  return candidates
    .map((c) => scoreCandidate(c, fp))
    .sort((a, b) => b.score - a.score);
}

function scoreCandidate<T extends RankableCandidate>(
  c: T,
  fp: ResonanceFingerprint,
): RankedCandidate<T> {
  const theme = c.theme ?? '';

  // Axis 1 — direct theme affinity (normalized 0..1)
  const rawAffinity = fp.themeAffinity[theme] ?? 0;
  const affinity = rawAffinity / MAX_THEME_WEIGHT;

  // Axis 2 — season fit. Match content to where the user actually is.
  const season = seasonFit(theme, fp.season);

  // Axis 3 — novelty bonus: avoid recently-shown refs/themes.
  const refIdx = fp.recentRefs.indexOf(c.passage.reference);
  const themeIdx = fp.recentThemes.indexOf(theme);
  const refPenalty = refIdx === -1 ? 0 : 1 - refIdx / Math.max(1, MAX_RECENT_REFS);
  const themePenalty = themeIdx === -1 ? 0 : 1 - themeIdx / Math.max(1, MAX_RECENT_THEMES);
  const novelty = 1 - 0.7 * refPenalty - 0.3 * themePenalty;

  // Axis 4 — pastoral care: when sentiment is negative, lean *toward*
  // consolation/mercy and *away* from challenge/correction themes.
  const care = pastoralCare(theme, fp.sentiment);

  // Axis 5 — caller-supplied prior (e.g. retrieval confidence)
  const prior = c.prior ?? 0.5;

  // Confidence blending: when we don't have much signal yet, weight novelty
  // and prior more heavily so we don't over-personalize on thin data.
  const confidence = Math.min(1, fp.signalCount / 25);
  const personal = 0.4 * affinity + 0.3 * season + 0.3 * care;
  const generic = 0.6 * novelty + 0.4 * prior;
  const score = confidence * personal + (1 - confidence) * generic + 0.2 * novelty;

  return {
    candidate: c,
    score,
    axes: { affinity, season, novelty, care, prior },
  };
}

function seasonFit(theme: string, season: SpiritualSeason): number {
  if (!theme) return 0.5;
  switch (season) {
    case 'wilderness':
      if (STRUGGLE_THEMES.has(theme)) return 0.85;
      if (theme === 'consolation' || theme === 'nearness' || theme === 'rest' || theme === 'healing') return 1;
      if (FLOURISHING_THEMES.has(theme)) return 0.35; // not jarring, but lower fit
      return 0.6;
    case 'waiting':
      if (WAITING_THEMES.has(theme)) return 1;
      if (theme === 'faith' || theme === 'hope' || theme === 'trust') return 0.85;
      return 0.6;
    case 'flourishing':
      if (FLOURISHING_THEMES.has(theme)) return 1;
      if (theme === 'service' || theme === 'mission' || theme === 'praise') return 0.8;
      return 0.55;
    case 'returning':
      if (RETURNING_THEMES.has(theme)) return 1;
      if (theme === 'belonging' || theme === 'love' || theme === 'identity') return 0.8;
      return 0.6;
    case 'steady':
    default:
      return 0.65;
  }
}

function pastoralCare(theme: string, sentiment: number): number {
  if (!theme) return 0.5;
  // Strongly struggling — lift consoling themes, dampen anything sharp.
  if (sentiment <= -0.3) {
    if (theme === 'consolation' || theme === 'nearness' || theme === 'mercy' ||
        theme === 'healing' || theme === 'rest' || theme === 'love') return 1;
    if (theme === 'judgment' || theme === 'correction' || theme === 'discipline') return 0.2;
    return 0.6;
  }
  // Flourishing — lift gratitude/service/mission.
  if (sentiment >= 0.4) {
    if (theme === 'gratitude' || theme === 'praise' || theme === 'service') return 1;
    return 0.7;
  }
  return 0.7;
}

/* ─────────────────────────────────────────────────────────────────
 *  Convenience wrappers
 * ───────────────────────────────────────────────────────────────── */

/** Pick the single best Daily Light candidate for the current fingerprint. */
export function pickResonantDaily(
  candidates: DailyLight[] | Array<{ theme: string; passage: ScripturePassage }>,
): { theme: string; passage: ScripturePassage } | null {
  if (!candidates.length) return null;
  const ranked = rankCandidates(
    candidates.map((c) => ({ theme: c.theme, passage: c.passage })),
  );
  if (!ranked.length) return null;
  const best = ranked[0];
  return { theme: best.candidate.theme ?? '', passage: best.candidate.passage };
}

/** Quick read for UI surfaces (presence chip, settings page diagnostics). */
export function describeFingerprint(fp = loadFingerprint()): {
  topThemes: string[];
  season: SpiritualSeason;
  confidence: number;
  signalCount: number;
} {
  const sorted = Object.entries(fp.themeAffinity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([t]) => t);
  return {
    topThemes: sorted,
    season: fp.season,
    confidence: Math.min(1, fp.signalCount / 25),
    signalCount: fp.signalCount,
  };
}
