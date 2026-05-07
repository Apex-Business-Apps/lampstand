import { GroqAIAdapter } from './groq';
import type { IRetrievalAdapter, IAIAdapter, RetrievalRequest, RetrievalResult, ScripturePassage, ToneStyle, Sermon, GuidanceResult } from '@/types';
import { SEED_SERMONS } from '@/data/seed';
import { CONTENT_PASSAGES, pickGuidanceVariant } from '@/data/contentLibrary';
import { checkInputSafety } from './safety';

// ─── Tokenization helpers for fuzzy retrieval ───
function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
}

function stem(word: string): string {
  return word
    .replace(/(ing|ed|ly|ness|ment|tion|sion|ful|less|able|ible|ous|ive|ity)$/i, '')
    .replace(/ies$/, 'y')
    .replace(/([^s])s$/, '$1');
}

function computeScore(query: string, passage: ScripturePassage): number {
  const queryTokens = tokenize(query).map(stem);
  const passageText = `${passage.text} ${passage.book} ${passage.reference}`.toLowerCase();
  const passageTokens = tokenize(passageText).map(stem);
  const passageSet = new Set(passageTokens);

  let score = 0;
  for (const token of queryTokens) {
    if (passageSet.has(token)) {
      score += 2; // exact stem match
    } else {
      // partial substring match
      for (const pt of passageSet) {
        if (pt.includes(token) || token.includes(pt)) {
          score += 1;
          break;
        }
      }
    }
  }

  // Normalize by query length to avoid bias toward longer queries
  return queryTokens.length > 0 ? score / queryTokens.length : 0;
}

// ─── Local Retrieval Adapter (seed data, swappable for RAG) ───
export class LocalRetrievalAdapter implements IRetrievalAdapter {
  async search(req: RetrievalRequest): Promise<RetrievalResult> {
    const query = req.query.toLowerCase();

    // Score all passages using fuzzy token matching
    const scored = CONTENT_PASSAGES
      .map(p => ({ passage: p, score: computeScore(query, p) }))
      .sort((a, b) => b.score - a.score);

    const topK = Math.min(Math.max(req.topK || 3, 1), 5);
    const threshold = 0.3;
    const matches = scored.filter(s => s.score >= threshold).slice(0, topK);

    if (matches.length === 0) {
      return { passages: [], confidence: 0, source: 'local-seed-no-match' };
    }

    const topScore = matches[0].score;
    const confidence = Math.min(0.95, 0.5 + topScore * 0.15);
    return { passages: matches.map(m => m.passage), confidence, source: 'local-seed' };
  }

  async getByReference(ref: string): Promise<ScripturePassage | null> {
    return CONTENT_PASSAGES.find(p => p.reference === ref) || null;
  }
}

// ─── Local AI Adapter (uses seed content, swappable for Groq/OpenAI/etc) ───
export class LocalAIAdapter implements IAIAdapter {
  async generateReflection(passage: ScripturePassage, tone: ToneStyle): Promise<string> {
    const toneMap = {
      gentle: 'In this quiet moment, consider what these words might mean for you today. There is no rush — just let them rest in your heart.',
      balanced: 'This passage invites us to pause and reflect. What resonates with you? What challenge does it gently place before you?',
      traditional: 'The Church has long treasured these words. They call us to deeper contemplation of God\'s presence in our daily walk.',
    };
    return `${toneMap[tone]}\n\n${passage.reference} speaks to something timeless — the enduring invitation to trust, to hope, and to remain open to grace.`;
  }

  async generateSermon(passage: ScripturePassage, tone: ToneStyle): Promise<Sermon> {
    const seed = SEED_SERMONS.find(s => s.passage.reference === passage.reference);
    if (seed) return seed;
    return {
      id: crypto.randomUUID(),
      title: `Reflections on ${passage.reference}`,
      passage,
      reflection: await this.generateReflection(passage, tone),
      relevance: 'These words meet us where we are — in the ordinary moments of life where we most need to remember we are not alone.',
      prayer: 'Lord, open our hearts to receive what these words offer. Help us carry their light into the day ahead. Amen.',
      createdAt: new Date().toISOString(),
    };
  }

  async generateGuidance(concern: string, tone: ToneStyle): Promise<GuidanceResult> {
    const themes = await this.classifyConcern(concern);
    const primaryTheme = themes[0] || 'peace';
    const mapped = pickGuidanceVariant(primaryTheme, concern);
    return { ...mapped, id: crypto.randomUUID(), concern, themes, createdAt: new Date().toISOString() };
  }

  async classifyConcern(input: string): Promise<string[]> {
    const lower = input.toLowerCase();
    const themeKeywords: Record<string, string[]> = {
      fear: ['afraid', 'scared', 'fear', 'worry', 'anxious', 'anxiety', 'panic', 'nervous', 'dread', 'terrified'],
      grief: ['loss', 'grief', 'died', 'death', 'mourning', 'miss', 'gone', 'funeral', 'passed away', 'bereaved'],
      loneliness: ['alone', 'lonely', 'isolated', 'nobody', 'no one', 'disconnected', 'abandoned'],
      forgiveness: ['forgive', 'forgiveness', 'guilt', 'sorry', 'regret', 'ashamed', 'shame', 'blame'],
      purpose: ['purpose', 'meaning', 'why', 'direction', 'lost', 'confused', 'calling', 'vocation'],
      gratitude: ['thankful', 'grateful', 'blessed', 'gratitude', 'appreciate', 'thanksgiving'],
      temptation: ['tempt', 'struggle', 'weak', 'failing', 'addiction', 'urge', 'resist'],
      conflict: ['fight', 'argument', 'conflict', 'disagree', 'angry', 'anger', 'resentment', 'frustrat'],
      peace: ['peace', 'calm', 'rest', 'still', 'quiet', 'serene', 'tranquil'],
      uncertainty: ['uncertain', 'unsure', 'doubt', 'don\'t know', 'confused', 'indecisive', 'hesitant'],
    };
    const found: string[] = [];
    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some(k => lower.includes(k))) found.push(theme);
    }
    return found.length > 0 ? found : ['peace'];
  }

  async validateSafety(input: string): Promise<{ safe: boolean; reason?: string }> {
    return checkInputSafety(input);
  }
}

// ─── Singleton instances ───
let retrievalAdapter: IRetrievalAdapter = new LocalRetrievalAdapter();
let aiAdapter: IAIAdapter = import.meta.env.VITE_GROQ_API_KEY ? new GroqAIAdapter() : new LocalAIAdapter();

export function getRetrievalAdapter(): IRetrievalAdapter { return retrievalAdapter; }
export function getAIAdapter(): IAIAdapter { return aiAdapter; }
export function setRetrievalAdapter(a: IRetrievalAdapter) { retrievalAdapter = a; }
export function setAIAdapter(a: IAIAdapter) { aiAdapter = a; }
