import type { GuidanceResult, ToneStyle, ScripturePassage } from '@/types';
import { getAIAdapter, getRetrievalAdapter } from '@/lib/adapters';
import { SAFE_FALLBACK_RESPONSE, checkInputSafety, shouldCircuitBreak } from '@/lib/safety';
import { logSafetyEvent } from '@/lib/storage';
import { rankCandidates } from '@/lib/resonance/ResonanceEngine';
import { assembleGuidanceContext } from '@/lib/guidance/contextAssembler';
import type { GroqAIAdapter } from '@/lib/groq';
import { getRequestGuardrail, normalizeUserInput } from '@/lib/agent/Grounding';

const BOOK_ABBREVIATIONS: Record<string, string> = {
  Genesis: '(?:Gen(?:esis)?|Ge)',
  Exodus: '(?:Exod(?:us)?|Ex)',
  Leviticus: '(?:Lev(?:iticus)?|Le)',
  Numbers: '(?:Num(?:bers)?|Nu)',
  Deuteronomy: '(?:Deut(?:eronomy)?|Dt)',
  Joshua: '(?:Josh(?:ua)?|Jos)',
  Judges: '(?:Judg(?:es)?|Jdg)',
  Ruth: '(?:Ruth?|Rth)',
  '1 Samuel': '(?:(?:1|I)\\s*Sam(?:uel)?|(?:1|I)\\s*Sa)',
  '2 Samuel': '(?:(?:2|II)\\s*Sam(?:uel)?|(?:2|II)\\s*Sa)',
  '1 Kings': '(?:(?:1|I)\\s*K(?:in)?gs?|(?:1|I)\\s*Ki)',
  '2 Kings': '(?:(?:2|II)\\s*K(?:in)?gs?|(?:2|II)\\s*Ki)',
  '1 Chronicles': '(?:(?:1|I)\\s*Chr(?:onicles)?|(?:1|I)\\s*Ch)',
  '2 Chronicles': '(?:(?:2|II)\\s*Chr(?:onicles)?|(?:2|II)\\s*Ch)',
  Ezra: '(?:Ezra?|Ezr)',
  Nehemiah: '(?:Neh(?:emiah)?|Ne)',
  Esther: '(?:Esth(?:er)?|Est)',
  Job: '(?:Job|Jb)',
  Psalms: '(?:Ps(?:alm)?s?|Psa)',
  Psalm: '(?:Ps(?:alm)?s?|Psa)',
  Proverbs: '(?:Prov(?:erbs)?|Prv|Pr)',
  Ecclesiastes: '(?:Eccl(?:esiastes)?|Ecc)',
  'Song of Solomon': '(?:Song(?:\\s+of\\s+(?:Solomon|Songs))?|SOS|Canticles)',
  'Song of Songs': '(?:Song(?:\\s+of\\s+(?:Solomon|Songs))?|SOS|Canticles)',
  Wisdom: '(?:Wis(?:dom)?|Ws)',
  Sirach: '(?:Sir(?:ach)?|Ecclus?)',
  Tobit: '(?:Tob(?:it)?)',
  Judith: '(?:Jdt|Jud(?:ith)?)',
  Baruch: '(?:Bar(?:uch)?)',
  '1 Maccabees': '(?:(?:1|I)\\s*Macc(?:abees)?|(?:1|I)\\s*Mac)',
  '2 Maccabees': '(?:(?:2|II)\\s*Macc(?:abees)?|(?:2|II)\\s*Mac)',
  Isaiah: '(?:Isa(?:iah)?|Is)',
  Jeremiah: '(?:Jer(?:emiah)?|Jr)',
  Lamentations: '(?:Lam(?:entations)?|La)',
  Ezekiel: '(?:Ezek(?:iel)?|Eze)',
  Daniel: '(?:Dan(?:iel)?|Da)',
  Hosea: '(?:Hos(?:ea)?|Ho)',
  Joel: '(?:Joel?|Jl)',
  Amos: '(?:Amos?|Am)',
  Obadiah: '(?:Obad(?:iah)?|Ob)',
  Jonah: '(?:Jonah?|Jnh)',
  Micah: '(?:Mic(?:ah)?|Mc)',
  Nahum: '(?:Nah(?:um)?|Na)',
  Habakkuk: '(?:Hab(?:akkuk)?|Hb)',
  Zephaniah: '(?:Zeph(?:aniah)?|Zep)',
  Haggai: '(?:Hag(?:gai)?|Hg)',
  Zechariah: '(?:Zech(?:ariah)?|Zec)',
  Malachi: '(?:Mal(?:achi)?|Ml)',
  Matthew: '(?:Matt(?:hew)?|Mt)',
  Mark: '(?:Mark?|Mk)',
  Luke: '(?:Luke?|Lk)',
  John: '(?:John|Jn|Jhn)',
  Acts: '(?:Acts?|Ac)',
  Romans: '(?:Rom(?:ans)?|Ro)',
  '1 Corinthians': '(?:(?:1|I)\\s*Cor(?:inthians)?|(?:1|I)\\s*Co)',
  '2 Corinthians': '(?:(?:2|II)\\s*Cor(?:inthians)?|(?:2|II)\\s*Co)',
  Galatians: '(?:Gal(?:atians)?|Ga)',
  Ephesians: '(?:Eph(?:esians)?|Ep)',
  Philippians: '(?:Phil(?:ippians)?|Php)',
  Colossians: '(?:Col(?:ossians)?|Col)',
  '1 Thessalonians': '(?:(?:1|I)\\s*Thess(?:alonians)?|(?:1|I)\\s*Th)',
  '2 Thessalonians': '(?:(?:2|II)\\s*Thess(?:alonians)?|(?:2|II)\\s*Th)',
  '1 Timothy': '(?:(?:1|I)\\s*Tim(?:othy)?|(?:1|I)\\s*Ti)',
  '2 Timothy': '(?:(?:2|II)\\s*Tim(?:othy)?|(?:2|II)\\s*Ti)',
  Titus: '(?:Tit(?:us)?|Ti)',
  Philemon: '(?:Phlm|Philem(?:on)?|Phm)',
  Hebrews: '(?:Heb(?:rews)?|He)',
  James: '(?:Jas|James?|Jm)',
  '1 Peter': '(?:(?:1|I)\\s*Pet(?:er)?|(?:1|I)\\s*Pe)',
  '2 Peter': '(?:(?:2|II)\\s*Pet(?:er)?|(?:2|II)\\s*Pe)',
  '1 John': '(?:(?:1|I)\\s*(?:John|Jn|Jhn)|(?:1|I)\\s*Jn)',
  '2 John': '(?:(?:2|II)\\s*(?:John|Jn|Jhn)|(?:2|II)\\s*Jn)',
  '3 John': '(?:(?:3|III)\\s*(?:John|Jn|Jhn)|(?:3|III)\\s*Jn)',
  Jude: '(?:Jude?|Jd)',
  Revelation: '(?:Rev(?:elation)?|Rv|Apoc(?:alypse)?)',
};

export function hasScriptureCitation(text: string, passage: ScripturePassage | null): boolean {
  if (!passage?.reference) return false;

  // Exact literal reference match
  const escapedRef = passage.reference.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (new RegExp(escapedRef, 'i').test(text)) return true;

  // Book name alias / abbreviation match with chapter:verse(s)
  const bookName = passage.book || passage.reference.split(/\s+\d/)[0]?.trim();
  const bookPattern = BOOK_ABBREVIATIONS[bookName] || escapedRef;
  const match = passage.reference.match(/(\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?/);

  if (match) {
    const [, chapter, startVerse, endVerse] = match;
    const versePattern = endVerse
      ? `${chapter}\\s*:\\s*(?:${startVerse}\\s*-\\s*${endVerse}|${startVerse})`
      : `${chapter}\\s*:\\s*${startVerse}`;
    const flexibleRegex = new RegExp(`\\b${bookPattern}\\.?\\s*${versePattern}\\b`, 'i');
    if (flexibleRegex.test(text)) return true;
  }

  return false;
}

export function sanitizeAIFiller(text: string): { sanitized: string; hadFiller: boolean } {
  const bannedPattern =
    /(Absolutely|Certainly|Of course|Let's|I hear you|I appreciate that|That's a great question|I'm here for you|It's important to note|At the end of the day|In this journey|It is worth noting|Diving into|Let's unpack|Navigating the complexities|Remember that|It is important to remember)/i;

  if (!bannedPattern.test(text)) {
    return { sanitized: text, hadFiller: false };
  }

  // Split into sentences preserving punctuation
  const sentences = text.match(/[^.!?]+(?:[.!?]+["']?|$)/g) || [text];
  const kept = sentences
    .filter((sentence) => !bannedPattern.test(sentence))
    .map((s) => s.trim())
    .filter(Boolean);
  const candidate = kept.join(' ').trim();

  // If candidate retains at least half the original character length and is non-empty, use it.
  if (candidate.length >= Math.floor(text.length * 0.5) && candidate.length > 0) {
    return { sanitized: candidate, hadFiller: true };
  }

  return {
    sanitized: 'Take a quiet breath. Stay with this passage for one minute. Let the words rest before you respond.',
    hadFiller: true,
  };
}

export function ensureRuntimeGrounding(result: GuidanceResult, passage: ScripturePassage | null): GuidanceResult {
  if (!passage?.reference) {
    const prefix = 'TheLampStand cannot verify this from available source passages.';
    return {
      ...result,
      pastoralFraming: result.pastoralFraming.trim().startsWith(prefix)
        ? result.pastoralFraming
        : `${prefix} ${result.pastoralFraming}`,
    };
  }

  const hasCitation = hasScriptureCitation(result.pastoralFraming, passage);
  return hasCitation
    ? result
    : { ...result, pastoralFraming: `${result.pastoralFraming}\n\nSources: ${passage.reference}.` };
}

export class CircuitBreaker {
  isOpen() {
    return shouldCircuitBreak();
  }
}

export class SessionStateMachine {
  private state: 'idle' | 'listening' | 'thinking' | 'speaking' | 'error' = 'idle';
  get current() { return this.state; }
  transition(next: SessionStateMachine['state']) { this.state = next; }
}

export class SafetyGate {
  evaluate(input: string) {
    return checkInputSafety(input);
  }
}

export class RetrievalOrchestrator {
  async retrieve(query: string): Promise<ScripturePassage[]> {
    const result = await getRetrievalAdapter().search({ query, topK: 5 });
    return result.passages;
  }
}

export class ConversationOrchestrator {
  async synthesizeGuidance(
    input: string,
    tone: ToneStyle,
    opts?: {
      context?: ReturnType<typeof assembleGuidanceContext>;
      bestPassage?: ScripturePassage | null;
    },
  ): Promise<GuidanceResult> {
    const adapter = getAIAdapter();

    // Use enriched path when context is available and the adapter supports it.
    if (opts && 'generateGuidanceWithContext' in adapter && typeof (adapter as GroqAIAdapter).generateGuidanceWithContext === 'function') {
      return (adapter as GroqAIAdapter).generateGuidanceWithContext(
        input,
        tone,
        opts.context ?? null,
        opts.bestPassage ?? null,
      );
    }

    return adapter.generateGuidance(input, tone);
  }
}

export class TurnPipeline {
  constructor(
    private safety = new SafetyGate(),
    private retrieval = new RetrievalOrchestrator(),
    private conversation = new ConversationOrchestrator(),
    private breaker = new CircuitBreaker(),
  ) {}

  async runGuidanceTurn(input: string, tone: ToneStyle): Promise<GuidanceResult> {
    const normalizedInput = normalizeUserInput(input);

    if (this.breaker.isOpen()) {
      return {
        id: 'runtime-circuit-break',
        concern: normalizedInput,
        themes: ['peace'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: ['What small next step can you take now?'],
        createdAt: new Date().toISOString(),
      };
    }

    const grounding = getRequestGuardrail(normalizedInput);
    if (grounding.blocked) {
      return {
        id: 'runtime-guardrail',
        concern: normalizedInput,
        themes: ['peace'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: grounding.response || SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: [],
        createdAt: new Date().toISOString(),
      };
    }

    const safety = this.safety.evaluate(normalizedInput);
    if (!safety.safe) {
      return {
        id: `runtime-${safety.type}`,
        concern: normalizedInput,
        themes: ['peace'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: safety.reason || SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: ['What would help your heart settle right now?'],
        createdAt: new Date().toISOString(),
      };
    }

    // Retrieve candidate passages and apply Resonance ranking to pick the best one.
    let bestPassage: ScripturePassage | null = null;
    try {
      const candidates = await this.retrieval.retrieve(normalizedInput);
      if (candidates.length > 0) {
        const ranked = rankCandidates(candidates.map((p) => ({ passage: p })));
        bestPassage = ranked[0]?.candidate.passage ?? null;
      }
    } catch {
      // Retrieval failure is non-fatal - the AI adapter has its own fallback passage selection.
    }

    // Assemble personal context from localStorage (respects consent flag internally).
    const context = assembleGuidanceContext();

    const synthesized = await this.conversation.synthesizeGuidance(
      normalizedInput,
      tone,
      { context, bestPassage },
    );

    // Second-pass safeguard: targeted removal of AI filler
    const { sanitized, hadFiller } = sanitizeAIFiller(synthesized.pastoralFraming);
    if (hadFiller) {
      logSafetyEvent({
        id: crypto.randomUUID(),
        type: 'unsafe',
        input: synthesized.pastoralFraming.slice(0, 180),
        action: 'fallback',
        timestamp: new Date().toISOString(),
      });
      synthesized.pastoralFraming = sanitized;
    }

    const result = ensureRuntimeGrounding(synthesized, bestPassage);

    if (!result.reflectionQuestions || result.reflectionQuestions.length === 0) {
      result.reflectionQuestions = getAdaptiveReflectionQuestions(
        result.themes?.[0],
        context?.spiritualSeason,
      );
    }

    return result;
  }
}

export function getAdaptiveReflectionQuestions(theme?: string, season?: string): string[] {
  if (season === 'wilderness' || theme === 'lament' || theme === 'grief') {
    return ['Where in this quiet space might God be meeting you today?'];
  }
  if (season === 'waiting' || theme === 'waiting' || theme === 'uncertainty') {
    return ["What would it mean to release the urgency of the timing into God's care?"];
  }
  if (season === 'returning' || theme === 'reconciliation' || theme === 'forgiveness') {
    return ['What burden or shame can you lay down as you return to peace?'];
  }
  if (season === 'flourishing' || theme === 'gratitude' || theme === 'praise') {
    return ['Who in your life can you encourage with this gift of hope?'];
  }
  if (theme === 'burnout' || theme === 'rest' || theme === 'weariness') {
    return ['What expectation or self-imposed burden can you surrender to Christ today?'];
  }
  if (theme === 'vocation' || theme === 'purpose' || theme === 'calling') {
    return ['How does knowing your identity is in God free your work from anxiety today?'];
  }
  if (theme === 'anxiety' || theme === 'fear') {
    return ["What is the single small thing within your reach today, trusting God with tomorrow?"];
  }
  return ['What small, faithful step can you take in quiet trust right now?'];
}

/** Lightweight cancellation-state tracker for the agent turn pipeline.
 * NOT the audio VoiceOrchestrator: see src/lib/voice/VoiceOrchestrator.ts for TTS/STT. */
export class VoiceCancellationController {
  private cancelled = false;
  cancel() { this.cancelled = true; }
  reset() { this.cancelled = false; }
  get isCancelled() { return this.cancelled; }
}

export class AgentRuntime {
  readonly session = new SessionStateMachine();
  readonly voice = new VoiceCancellationController();
  readonly pipeline = new TurnPipeline();

  async runGuidance(input: string, tone: ToneStyle) {
    this.session.transition('thinking');
    try {
      return await this.pipeline.runGuidanceTurn(input, tone);
    } finally {
      this.session.transition('idle');
    }
  }
}

export const agentRuntime = new AgentRuntime();
