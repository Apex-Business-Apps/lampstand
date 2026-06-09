/**
 * Guidance Context Assembler
 *
 * Collects a compact, privacy-respecting snapshot of the user's current spiritual
 * context from localStorage and the Resonance fingerprint, then formats it for
 * injection into the guidance system prompt.
 *
 * Rules:
 *  - Only runs when the user has consented to localAdaptiveMemory.
 *  - Pure read: never writes to storage.
 *  - Gracefully returns null when data is absent or consent is denied.
 *  - Strictly bounded output: the formatted context must stay under MAX_CONTEXT_CHARS
 *    so it cannot crowd out the grounding passages in the combined prompt.
 */

import {
  getConsentState,
  getSavedPassages,
  getJournalEntries,
  getCachedDaily,
} from '@/lib/storage';
import {
  loadFingerprint,
  describeFingerprint,
} from '@/lib/resonance/ResonanceEngine';
import type { SpiritualSeason } from '@/lib/resonance/ResonanceEngine';

const MAX_JOURNAL_EXCERPT_CHARS = 90;
const MAX_JOURNAL_ENTRIES = 3;
const MAX_SAVED_REFS = 5;
const MAX_CONTEXT_CHARS = 600;

export interface GuidanceContext {
  resonanceSeason: SpiritualSeason;
  topThemes: string[];
  sentimentLabel: 'struggling' | 'steady' | 'flourishing';
  savedPassageRefs: string[];
  recentJournalExcerpts: string[];
  currentDailyTheme: string;
  signalCount: number;
}

/**
 * Assemble personal context for guidance generation.
 * Returns null if the user has not consented or if no meaningful context exists.
 */
export function assembleGuidanceContext(): GuidanceContext | null {
  try {
    const consent = getConsentState();
    if (!consent.localAdaptiveMemory) return null;

    const fp = loadFingerprint();
    const { topThemes, season, signalCount } = describeFingerprint(fp);

    const sentimentLabel: GuidanceContext['sentimentLabel'] =
      fp.sentiment <= -0.2 ? 'struggling'
        : fp.sentiment >= 0.2 ? 'flourishing'
          : 'steady';

    const savedPassageRefs = getSavedPassages()
      .slice(0, MAX_SAVED_REFS)
      .map((s) => s.passage.reference)
      .filter(Boolean);

    const recentJournalExcerpts = getJournalEntries()
      .slice(0, MAX_JOURNAL_ENTRIES)
      .map((e) => e.content.slice(0, MAX_JOURNAL_EXCERPT_CHARS).trim())
      .filter(Boolean);

    const cached = getCachedDaily();
    const currentDailyTheme = cached?.theme ?? '';

    // Require at least one signal before injecting context so cold-start users
    // aren't shown a default-state description that looks oddly prescriptive.
    const hasMeaningfulContext =
      signalCount > 0 ||
      savedPassageRefs.length > 0 ||
      recentJournalExcerpts.length > 0;

    if (!hasMeaningfulContext) return null;

    return {
      resonanceSeason: season,
      topThemes,
      sentimentLabel,
      savedPassageRefs,
      recentJournalExcerpts,
      currentDailyTheme,
      signalCount,
    };
  } catch {
    return null;
  }
}

/**
 * Render GuidanceContext as a compact system-prompt section.
 * Hard-truncated to MAX_CONTEXT_CHARS to prevent context flooding.
 */
export function formatContextForPrompt(ctx: GuidanceContext): string {
  const lines: string[] = ['--- Listener Context ---'];

  if (ctx.resonanceSeason !== 'steady') {
    const seasonLabels: Record<SpiritualSeason, string> = {
      wilderness: 'working through struggle or suffering',
      waiting: 'in a season of uncertainty or discernment',
      flourishing: 'in a season of gratitude and growth',
      returning: 'returning after a period of distance from faith',
      steady: 'in ordinary, faithful daily life',
    };
    lines.push(`Season: ${seasonLabels[ctx.resonanceSeason]}`);
  }

  if (ctx.topThemes.length > 0) {
    lines.push(`Themes they return to: ${ctx.topThemes.join(', ')}`);
  }

  if (ctx.sentimentLabel !== 'steady') {
    lines.push(`Current tone: ${ctx.sentimentLabel}`);
  }

  if (ctx.savedPassageRefs.length > 0) {
    lines.push(`Passages they have saved: ${ctx.savedPassageRefs.join('; ')}`);
  }

  if (ctx.currentDailyTheme) {
    lines.push(`Today's daily light theme: ${ctx.currentDailyTheme}`);
  }

  if (ctx.recentJournalExcerpts.length > 0) {
    lines.push('Recent journal excerpts:');
    for (const excerpt of ctx.recentJournalExcerpts) {
      lines.push(`  - "${excerpt}${excerpt.length >= MAX_JOURNAL_EXCERPT_CHARS ? '...' : ''}"`);
    }
  }

  lines.push(
    'Let this context shape the pastoral register and passage selection, but do not reference it directly or explain that you are using it.',
    '--- End Context ---',
  );

  return lines.join('\n').slice(0, MAX_CONTEXT_CHARS);
}
