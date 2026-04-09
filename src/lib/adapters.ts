import type { IRetrievalAdapter, IAIAdapter, RetrievalRequest, RetrievalResult, ScripturePassage, ToneStyle, Sermon, GuidanceResult } from '@/types';
import { SEED_PASSAGES, SEED_SERMONS, SEED_GUIDANCE_MAP } from '@/data/seed';

// ─── Local Retrieval Adapter (seed data, swappable for RAG) ───
export class LocalRetrievalAdapter implements IRetrievalAdapter {
  async search(req: RetrievalRequest): Promise<RetrievalResult> {
    const query = req.query.toLowerCase();
    const matches = SEED_PASSAGES.filter(p =>
      p.text.toLowerCase().includes(query) ||
      p.book.toLowerCase().includes(query) ||
      p.reference.toLowerCase().includes(query)
    ).slice(0, req.topK || 3);

    if (matches.length === 0) {
      // Return a random passage as fallback
      const random = SEED_PASSAGES[Math.floor(Math.random() * SEED_PASSAGES.length)];
      return { passages: [random], confidence: 0.3, source: 'local-seed-fallback' };
    }
    return { passages: matches, confidence: 0.8, source: 'local-seed' };
  }

  async getByReference(ref: string): Promise<ScripturePassage | null> {
    return SEED_PASSAGES.find(p => p.reference === ref) || null;
  }
}

// ─── Local AI Adapter (uses seed content, swappable for Groq/OpenAI/etc) ───
export class LocalAIAdapterBase implements IAIAdapter {
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
    const mapped = SEED_GUIDANCE_MAP[primaryTheme];
    if (mapped) return { ...mapped, id: crypto.randomUUID(), concern, themes, createdAt: new Date().toISOString() };

    const fallback = SEED_GUIDANCE_MAP['peace'];
    return { ...fallback, id: crypto.randomUUID(), concern, themes, createdAt: new Date().toISOString() };
  }

  async classifyConcern(input: string): Promise<string[]> {
    const lower = input.toLowerCase();
    const themeKeywords: Record<string, string[]> = {
      fear: ['afraid', 'scared', 'fear', 'worry', 'anxious', 'anxiety', 'panic'],
      grief: ['loss', 'grief', 'died', 'death', 'mourning', 'miss', 'gone'],
      loneliness: ['alone', 'lonely', 'isolated', 'nobody', 'no one'],
      forgiveness: ['forgive', 'forgiveness', 'guilt', 'sorry', 'regret', 'ashamed'],
      purpose: ['purpose', 'meaning', 'why', 'direction', 'lost', 'confused'],
      gratitude: ['thankful', 'grateful', 'blessed', 'gratitude', 'appreciate'],
      temptation: ['tempt', 'struggle', 'weak', 'failing', 'addiction'],
      conflict: ['fight', 'argument', 'conflict', 'disagree', 'angry', 'anger'],
      peace: ['peace', 'calm', 'rest', 'still', 'quiet'],
      uncertainty: ['uncertain', 'unsure', 'doubt', 'don\'t know', 'confused'],
    };
    const found: string[] = [];
    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some(k => lower.includes(k))) found.push(theme);
    }
    return found.length > 0 ? found : ['peace'];
  }

  async validateSafety(input: string): Promise<{ safe: boolean; reason?: string }> {
    // Delegated to safety.ts — this is the adapter stub for remote validation
    return { safe: true };
  }
}

// ─── Singleton instances ───
let retrievalAdapter: IRetrievalAdapter = new LocalRetrievalAdapter();
let aiAdapter: IAIAdapter = new LocalAIAdapterBase();

export function getRetrievalAdapter(): IRetrievalAdapter { return retrievalAdapter; }
export function getAIAdapter(): IAIAdapter { return aiAdapter; }
export function setRetrievalAdapter(a: IRetrievalAdapter) { retrievalAdapter = a; }
export function setAIAdapter(a: IAIAdapter) { aiAdapter = a; }

import { AgentRuntime } from './ai/AgentRuntime';

export class GroqAIAdapter extends LocalAIAdapterBase {
  private runtime = new AgentRuntime();

  async generateGuidance(concern: string, tone: ToneStyle): Promise<GuidanceResult> {
    const rawOutput = await this.runtime.runGuidanceTurn(concern);
    // Parse the raw output assuming it's text.
    // Let's create a synthesized result
    return {
      id: crypto.randomUUID(),
      concern,
      themes: ['guidance'],
      passage: {
        id: crypto.randomUUID(),
        reference: "A word of reflection",
        book: "Reflection",
        chapter: 1,
        verse: 1,
        text: rawOutput.substring(0, 150) + "..."
      },
      reflection: rawOutput,
      prayer: "Lord, grant us wisdom and peace in this reflection. Amen.",
      createdAt: new Date().toISOString()
    };
  }
}

// Override the AI adapter injection if GROQ API key is present
if (import.meta.env.VITE_GROQ_API_KEY) {
  setAIAdapter(new GroqAIAdapter());
}
