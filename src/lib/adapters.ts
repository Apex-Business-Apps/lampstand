import type {
  IRetrievalAdapter, IAIAdapter, RetrievalRequest, RetrievalResult,
  ScripturePassage, ToneStyle, Sermon, GuidanceResult,
} from '@/types';
import { SEED_PASSAGES, SEED_GUIDANCE_MAP } from '@/data/seed';
import { buildGroundedSermon } from '@/data/sermonLibrary';
import { getKnowledge, updateKnowledge } from './storage';
import { checkInputSafety } from './safety';
import { GraphRAGAdapter, setGraphRAGFallback } from './retrieval/graphRAGAdapter';

// ─── Utility: cosine similarity via TF-IDF term overlap ───────────────────────
function tokenize(text: string): Record<string, number> {
  const terms = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
  const tf: Record<string, number> = {};
  for (const t of terms) tf[t] = (tf[t] || 0) + 1;
  return tf;
}

function cosineSim(a: Record<string, number>, b: Record<string, number>): number {
  let dot = 0, magA = 0, magB = 0;
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    const av = a[k] || 0, bv = b[k] || 0;
    dot += av * bv; magA += av * av; magB += bv * bv;
  }
  return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
}

// ─── Theme → passage keyword expansion (semantic bridge) ─────────────────────
// Bridges the gap between concern themes and passage content.
// TF-IDF alone cannot match "loneliness" → Psalm 23 because the word is absent.
// This map injects theme-relevant keywords into the retrieval query.
const THEME_PASSAGE_KEYWORDS: Record<string, string[]> = {
  fear:        ['fear', 'afraid', 'anxious', 'strength', 'uphold', 'peace', 'troubled'],
  grief:       ['broken', 'brokenhearted', 'crushed', 'close', 'saves', 'mourn', 'loss'],
  loneliness:  ['shepherd', 'alone', 'walk', 'valley', 'comfort', 'lead', 'restore'],
  forgiveness: ['love', 'patient', 'kind', 'bears', 'endures', 'mercy', 'forgive'],
  purpose:     ['plans', 'future', 'hope', 'welfare', 'direction', 'path', 'calling'],
  peace:       ['still', 'know', 'rest', 'quiet', 'peace', 'settle', 'calm'],
  gratitude:   ['thankful', 'thanksgiving', 'prayer', 'peace', 'understanding', 'guards'],
  temptation:  ['rest', 'burden', 'yoke', 'come', 'labor', 'meek', 'humble'],
  conflict:    ['peace', 'troubled', 'afraid', 'heart', 'leave', 'give'],
  uncertainty: ['trust', 'heart', 'paths', 'straight', 'mindful', 'wisdom'],
  crisis:      ['brokenhearted', 'crushed', 'close', 'saves', 'spirit'],
};

// ─── Synonym expansion map (v2 classification) ──────────────────────────────
const THEME_SYNONYMS: Record<string, string[]> = {
  fear:         ['afraid', 'scared', 'fear', 'worry', 'anxious', 'anxiety', 'panic', 'terrified',
                  'dread', 'nervous', 'frightened', 'apprehensive', 'uneasy', 'tense', 'stressed'],
  grief:        ['loss', 'grief', 'died', 'death', 'mourning', 'miss', 'gone', 'bereaved',
                  'heartbroken', 'broken', 'hurting', 'devastated', 'crushed', 'sorrow', 'sad'],
  loneliness:   ['alone', 'lonely', 'isolated', 'nobody', 'no one', 'disconnected', 'invisible',
                  'abandoned', 'left out', 'forgotten', 'unloved', 'friendless'],
  forgiveness:  ['forgive', 'forgiveness', 'guilt', 'sorry', 'regret', 'ashamed', 'shame',
                  'blame', 'resentment', 'bitter', 'hurt', 'wronged', 'mistake', 'failed'],
  purpose:      ['purpose', 'meaning', 'why', 'direction', 'lost', 'confused', 'pointless',
                  'empty', 'aimless', 'drift', 'calling', 'vocation', 'path', 'future'],
  gratitude:    ['thankful', 'grateful', 'blessed', 'gratitude', 'appreciate', 'thankfulness',
                  'abundance', 'gift', 'joy', 'content', 'fortunate'],
  temptation:   ['tempt', 'struggle', 'weak', 'failing', 'addiction', 'habit', 'compulsion',
                  'urge', 'craving', 'relapse', 'sin', 'vice', 'overcome'],
  conflict:     ['fight', 'argument', 'conflict', 'disagree', 'angry', 'anger',
                  'dispute', 'tension', 'hostile', 'hurt', 'betrayed', 'trust broken'],
  peace:        ['peace', 'calm', 'rest', 'still', 'quiet', 'serene', 'settle', 'breathe',
                  'pause', 'overwhelm', 'chaos', 'noise'],
  uncertainty:  ['uncertain', 'unsure', 'doubt', "don't know", 'confused', 'unclear', 'unknown',
                  'indecisive', 'what if', 'waiting', 'limbo', 'crossroads'],
  crisis:       ['hurt myself', 'kill myself', 'end it', 'suicide', 'want to die', 'no reason to live',
                  'give up', 'hopeless', 'not worth it', "can't go on", 'harm myself'],
};

// Negation window check - "not afraid" should not match 'fear'
const NEGATION_RE = /\b(not|never|no longer|didn't|don't|won't|wasn't|isn't|aren't)\b.{0,20}$/i;

function classifyConcernV2(input: string): string[] {
  const lower = input.toLowerCase();
  const found: string[] = [];

  for (const [theme, keywords] of Object.entries(THEME_SYNONYMS)) {
    for (const kw of keywords) {
      const idx = lower.indexOf(kw);
      if (idx === -1) continue;
      const prefix = lower.slice(Math.max(0, idx - 30), idx);
      if (NEGATION_RE.test(prefix)) continue;
      found.push(theme);
      break;
    }
  }

  return found.length > 0 ? [...new Set(found)] : ['peace'];
}

// ─── Concern intensity scoring ────────────────────────────────────────────────
// Returns 0.0–1.0 urgency score. Higher = more intense / urgent concern.
// Used to calibrate reflection depth and pastoral framing weight.
const INTENSITY_AMPLIFIERS = [
  /completely|totally|utterly|absolutely|always|never|every\s+day/i,
  /can't\s+(stop|cope|function|breathe|go\s+on)/i,
  /no\s+(one|hope|reason|way|point)/i,
  /nothing\s+(works|helps|matters)/i,
  /worst|darkest|desperate|unbearable|overwhelming/i,
];

function scoreConcernIntensity(input: string): number {
  if (!input) return 0;
  let score = 0.3; // baseline - any concern deserves attention
  const wordCount = input.trim().split(/\s+/).length;
  // Longer disclosures indicate more willingness to share (moderate boost)
  if (wordCount > 20) score += 0.1;
  if (wordCount > 50) score += 0.1;
  for (const pattern of INTENSITY_AMPLIFIERS) {
    if (pattern.test(input)) {
      score += 0.15;
      break; // one amplifier match is enough
    }
  }
  return Math.min(1.0, score);
}

// ─── Reflection templates: tone × variant (5 per tone, rotated) ──────────────
// Expanded from 3→5 variants per tone = 15 total (up from 9).
const REFLECTION_BANK: Record<ToneStyle, string[]> = {
  gentle: [
    `Take a slow breath and let these words settle over you - there's no rush here. This passage isn't asking you to perform or produce. It's simply offering you something: a quiet reminder that you're held.\n\nWhat would it feel like today, even for one moment, to trust that? Not to figure it all out - just to rest in it.`,
    `Sometimes scripture meets us before we're ready for it. And that's exactly the point. These words aren't waiting for you to have your life together before they apply.\n\nWhatever you're carrying today - let this passage be a small lamp, not a floodlight. One gentle step of light is enough.`,
    `There's a tenderness in this passage that deserves your full attention, even just for a moment. It doesn't demand. It doesn't scold. It simply invites.\n\nYou don't have to respond perfectly to an invitation. You just have to show up.`,
    `Some days the most faithful thing we can do is simply to receive. Not to strive, not to understand fully, not to fix anything - just to open our hands and let this word land where it will.\n\nYou are not required to be okay. You are only invited to be here.`,
    `This passage has been a companion to people in moments exactly like yours - uncertain, heavy, searching. It has not grown thin with time. Let it be with you now, not as theology to master, but as a hand extended toward you.`,
  ],
  balanced: [
    `This passage opens something worth sitting with - not as theology to master, but as a living word for today. Scripture has a way of speaking directly to what we didn't even know we were carrying.\n\nWhat resonates? And what does it gently challenge in you? Both are worth noticing.`,
    `There's a tension in this kind of passage - between what we know intellectually and what we feel in the lived moment. That tension isn't a failure of faith; it's often where the deepest formation happens.\n\nLet it do its work. You don't have to resolve it today.`,
    `The invitation here is both simple and demanding: to pay attention. To let a word, a phrase, a promise land somewhere real in your life right now.\n\nWhat would it look like to actually receive this - not just read it?`,
    `Faith rarely feels like certainty. More often, it looks like choosing to act on what we believe is true even when we can't fully feel it. This passage speaks to that gap between knowing and feeling.\n\nWhere is that gap in your life right now?`,
    `Scripture doesn't require that we agree with it before it can work in us. Sometimes we bring our questions, our doubts, even our resistance - and find that the word is larger than all of them.\n\nBring whatever you're carrying to this text. Let it be the container for your honesty.`,
  ],
  traditional: [
    `The Church has meditated on these words across centuries, and they have not grown thin. Each generation finds in them a freshness - because they speak to what is most permanent in the human condition.\n\nBring your whole self to this text: your questions, your struggles, your longing. That is what lectio divina has always invited.`,
    `In the tradition of the saints, scripture was never merely read - it was prayed. We enter these words not to extract information, but to be encountered by the Living God who speaks through them.\n\nLet the passage turn you, as a page is turned. Let it reveal something.`,
    `Holy Scripture carries the weight of God's fidelity across time. When we read it faithfully, we are joining a great cloud of witnesses who have found these same words to be a lamp and a light.\n\nReceive this passage with the reverence it deserves - and the expectancy that it has something particular for you today.`,
    `The Fathers of the Church understood that sacred reading is a form of prayer. We do not master the text; the text, under the action of the Spirit, begins to master us - shaping our desires, correcting our vision, enlarging our hope.\n\nSit with these words. Let them do their slow work.`,
    `Every word of scripture was written within a community of faith, and it is best received within one. Even in your private reading, you are not alone - the whole communion of saints has prayed these words before you.\n\nYou are held by more than you know.`,
  ],
};

// ─── Concern-specific anchor lines ───────────────────────────────────────────
// Injected at the end of reflections when a specific concern is known.
// Bridges the gap between generic reflection templates and the user's actual situation.
function buildConcernAnchor(concern: string, themes: string[], passage: ScripturePassage): string {
  const primaryTheme = themes[0];
  const concernSnippet = concern.length > 60
    ? concern.slice(0, 57).trim() + '…'
    : concern;

  const themeAnchors: Partial<Record<string, string>> = {
    fear:        `What you're describing - "${concernSnippet}" - is exactly the kind of weight this passage was written to meet.`,
    grief:       `In the midst of what you're carrying - "${concernSnippet}" - this passage stands close, not with answers, but with presence.`,
    loneliness:  `"${concernSnippet}" - these words are heard. This passage says you are accompanied, even when it doesn't feel that way.`,
    forgiveness: `The struggle you've named - "${concernSnippet}" - is one scripture speaks to honestly and without condemnation.`,
    purpose:     `The searching you're doing - "${concernSnippet}" - is not wasted. This passage holds a promise about the path ahead.`,
    peace:       `"${concernSnippet}" - this passage offers a stillness that doesn't require circumstances to change first.`,
    temptation:  `The struggle you're facing - "${concernSnippet}" - is one this passage speaks to with compassion, not judgment.`,
    conflict:    `What you're navigating - "${concernSnippet}" - is genuinely hard. This passage offers a foundation to stand on.`,
    uncertainty: `"${concernSnippet}" - uncertainty is not the absence of faith. This passage holds space for exactly where you are.`,
    gratitude:   `Even amid complexity, "${concernSnippet}" - this passage invites a perspective that holds both the hard and the good.`,
  };

  const anchor = themeAnchors[primaryTheme]
    ?? `*${passage.reference}* - this passage has been a companion to countless people across centuries. Let it be one for you today.`;

  return `\n\n${anchor}`;
}

// ─── Sermon content is now generated from a passage-specific research bank ─────

// ─── Multi-theme composite guidance ──────────────────────────────────────────
// Returns guidance data + an internal `_isCrisis` sentinel.
// The sentinel is stripped before the public GuidanceResult is assembled.
type CompositeGuidance = Omit<GuidanceResult, 'id' | 'concern' | 'themes' | 'createdAt'> & { _isCrisis?: boolean };

function buildCompositeGuidance(
  themes: string[],
  concern: string,
  tone: ToneStyle,
): CompositeGuidance {
  const primary = themes[0];
  const secondary = themes[1];

  // Crisis pathway - always fires for crisis theme. Never bypassed.
  if (themes.includes('crisis')) {
    return {
      passage: SEED_PASSAGES[8], // Psalm 34:18 - "The LORD is close to the brokenhearted"
      pastoralFraming: `What you're carrying right now sounds incredibly heavy. I want you to know: you don't have to carry it alone, and you don't have to carry it right now.\n\nThere are people trained to walk through this with you - please reach out to a crisis line (988 in the US/Canada) or someone you trust.\n\nI'm here for scripture and reflection, but your safety matters more than anything else. Here is a passage that has brought comfort to many in the darkest moments:`,
      reflectionQuestions: [
        'Is there one person you can reach out to right now?',
        'What would it mean to let someone carry this with you?',
      ],
      prayer: `God, you are close to the brokenhearted. Be close to this person right now. Amen.`,
      _isCrisis: true,
    };
  }

  const base = SEED_GUIDANCE_MAP[primary] ?? SEED_GUIDANCE_MAP['peace'];

  if (!secondary || secondary === primary) {
    return { ...base };
  }

  // Blend: primary passage + secondary framing injection + combined questions
  const secondaryData = SEED_GUIDANCE_MAP[secondary];
  const extraQuestion = secondaryData?.reflectionQuestions?.[0];

  return {
    ...base,
    pastoralFraming: `${base.pastoralFraming}\n\nI notice something else in what you've shared - there may be a thread of **${secondary}** here too. These two experiences often travel together. Both deserve attention, and neither cancels the other out.`,
    reflectionQuestions: [
      ...base.reflectionQuestions,
      ...(extraQuestion ? [extraQuestion] : []),
    ],
  };
}

// ─── Local Retrieval Adapter - TF-IDF + semantic theme boosting ───────────────
export class LocalRetrievalAdapter implements IRetrievalAdapter {
  async search(req: RetrievalRequest): Promise<RetrievalResult> {
    const knowledge = getKnowledge();

    // Build expanded query: user query + theme-bridge keywords + frequent topics
    const themes = req.context ? req.context.split(',').map(t => t.trim()) : [];
    const themeKeywords = themes
      .flatMap(t => THEME_PASSAGE_KEYWORDS[t] ?? [])
      .join(' ');
    const expandedQuery = [req.query, themeKeywords].filter(Boolean).join(' ');

    const queryTf = tokenize(expandedQuery);

    const scored = SEED_PASSAGES.map(p => {
      const passageTf = tokenize(p.text + ' ' + p.book + ' ' + p.reference);
      let score = cosineSim(queryTf, passageTf);

      // Boost passages matching classified themes via SEED_GUIDANCE_MAP
      for (const theme of themes) {
        const guidancePassage = SEED_GUIDANCE_MAP[theme]?.passage;
        if (guidancePassage && guidancePassage.id === p.id) {
          score *= 2.0; // Strong boost: this passage was hand-curated for this theme
        }
      }

      // Moderate boost for frequent user topics (behavioral personalization)
      if (knowledge.frequentTopics.some(t => p.text.toLowerCase().includes(t))) {
        score *= 1.3;
      }

      return { passage: p, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const topK = req.topK || 3;
    const top = scored.slice(0, topK).filter(s => s.score > 0).map(s => s.passage);

    if (top.length === 0) {
      const random = SEED_PASSAGES[Math.floor(Math.random() * SEED_PASSAGES.length)];
      return { passages: [random], confidence: 0.3, source: 'local-seed-fallback' };
    }

    return {
      passages: top,
      confidence: Math.min(0.95, scored[0].score * 2),
      source: 'local-tfidf-semantic',
    };
  }

  async getByReference(ref: string): Promise<ScripturePassage | null> {
    const normalised = ref.trim().toLowerCase();
    return (
      SEED_PASSAGES.find(p => p.reference.toLowerCase() === normalised) ??
      SEED_PASSAGES.find(p => p.reference.toLowerCase().includes(normalised)) ??
      null
    );
  }
}

// ─── Local AI Adapter ─────────────────────────────────────────────────────────
export class LocalAIAdapter implements IAIAdapter {

  // generateReflection now receives the user's concern for personalized anchoring.
  // Falls back gracefully when concern is absent (e.g., DailyLight flow).
  async generateReflection(
    passage: ScripturePassage,
    tone: ToneStyle,
    concern?: string,
  ): Promise<string> {
    const knowledge = getKnowledge();
    const bank = REFLECTION_BANK[tone];
    const variant = knowledge.interactionCount % bank.length;
    const base = bank[variant];

    let anchor: string;
    if (concern && concern.trim().length > 0) {
      // Classify concern to build a specific, contextual anchor
      const themes = classifyConcernV2(concern);
      anchor = buildConcernAnchor(concern, themes, passage);
    } else {
      // Generic anchor for non-guided contexts
      anchor = `\n\n*${passage.reference}* - ${
        knowledge.preferredReflectionLength === 'short'
          ? 'Let these words land where they will.'
          : 'This passage has been a companion to countless people across centuries. Let it be one for you today.'
      }`;
    }

    updateKnowledge({ interactionCount: knowledge.interactionCount + 1 });
    return base + anchor;
  }

  async generateSermon(passage: ScripturePassage, tone: ToneStyle): Promise<Sermon> {
    return buildGroundedSermon(passage, tone);
  }

  async generateGuidance(concern: string, tone: ToneStyle): Promise<GuidanceResult> {
    const themes = await this.classifyConcern(concern);
    const knowledge = getKnowledge();

    // Update frequent topics for behavioral personalization
    const updated = [...new Set([...knowledge.frequentTopics, ...themes])].slice(-10);
    updateKnowledge({ frequentTopics: updated });

    // Score intensity - available for future adaptive depth logic
    const _intensity = scoreConcernIntensity(concern);

    // Build composite guidance with concern context
    const composite = buildCompositeGuidance(themes, concern, tone);

    // Generate a concern-aware reflection for the matched passage
    const reflection = await this.generateReflection(composite.passage, tone, concern);

    // Strip internal sentinel before assembling the public GuidanceResult
    const { _isCrisis, ...guidanceData } = composite;

    return {
      ...guidanceData,
      // Blend concern-specific reflection into pastoralFraming for non-crisis responses
      ...(!_isCrisis && { pastoralFraming: `${guidanceData.pastoralFraming}\n\n${reflection}` }),
      id: crypto.randomUUID(),
      concern,
      themes,
      createdAt: new Date().toISOString(),
    };
  }

  async classifyConcern(input: string): Promise<string[]> {
    return classifyConcernV2(input);
  }

  async validateSafety(input: string): Promise<{ safe: boolean; reason?: string }> {
    const result = checkInputSafety(input);
    if (!result.safe) {
      return { safe: false, reason: result.reason };
    }
    return { safe: true };
  }
}

// ─── Singleton instances ───────────────────────────────────────────────────────
// VITE_ENABLE_GRAPH_RAG=true opts in to GraphRAG (Hugging Face CDN + Worker).
// Default is LocalRetrievalAdapter (TF-IDF, works under any CSP).
const _localRetrievalInstance = new LocalRetrievalAdapter();
let retrievalAdapter: IRetrievalAdapter =
  import.meta.env.VITE_ENABLE_GRAPH_RAG === 'true'
    ? new GraphRAGAdapter()
    : _localRetrievalInstance;
let aiAdapter: IAIAdapter = new LocalAIAdapter();

// Wire up CSP fallback so GraphRAGAdapter can fall back without circular import.
setGraphRAGFallback(_localRetrievalInstance);

export function getRetrievalAdapter(): IRetrievalAdapter { return retrievalAdapter; }
export function getAIAdapter(): IAIAdapter { return aiAdapter; }
export function setRetrievalAdapter(a: IRetrievalAdapter) { retrievalAdapter = a; }
export function setAIAdapter(a: IAIAdapter) { aiAdapter = a; }

// ─── Exported utilities (for testing) ────────────────────────────────────────
export { classifyConcernV2, scoreConcernIntensity };
