import type { IAIAdapter, ScripturePassage, ToneStyle, Sermon, GuidanceResult } from '@/types';
import { LocalAIAdapter } from './adapters';
import type { GuidanceContext } from './guidance/contextAssembler';
import { formatContextForPrompt } from './guidance/contextAssembler';
import { getEdgeFunctionHeaders } from '@/lib/supabaseAuthHeaders';
import { getSupabaseConfig } from '@/integrations/supabase/config';

const { url: SUPABASE_URL } = getSupabaseConfig();

// Shared style guide used for all GroqAIAdapter calls (replaces the old vague SYS string).
// Kept in sync with src/lib/agent/Prompts.ts - the guidance mode here is tighter
// because it must produce structured JSON; the free-text ConversationOrchestrator path
// uses Prompts.ts directly.
const STYLE_GUIDE = `You are Lampstand, a pastoral companion shaped by Scripture.
You do not advise from a distance. You sit with people in what they carry.

Character:
- You speak from earned stillness, not borrowed comfort. Every word should feel considered.
- You listen first, then let scripture illuminate.
- You are a companion, not a coach. Guidance is offered, never imposed.
- You do not minimize pain with quick comfort. Real comfort sits closer and takes longer.

Writing rules:
- Never use em dashes or en dashes. Use commas, semicolons, or separate sentences instead.
- Plain English only. No theological vocabulary unless the person used it first.
- No AI filler: never "Absolutely", "Certainly", "I hear you", "That is a great question", "Of course", "Let us", "I appreciate that", "I understand", "It sounds like".
- No motivational posters, no therapy scripts, no greeting-card faith.
- Do not narrate your process.
- Vary sentence lengths. Short sentences carry weight. Longer ones build thought. Use both.
- Do not use the words "journey" or "walk" in a metaphorical sense.
- When someone shares something painful, do not immediately pivot to a solution.`;

const GUIDANCE_JSON_RULES = `
You are in Guidance Mode. Someone has brought you a real concern.

Read carefully before responding. The surface question may carry something heavier underneath.

Return ONLY a JSON object with these keys:
  "pastoralFraming": One honest acknowledgment sentence, then a 3-4 sentence reflection that draws a scripture passage into contact with their specific situation. Concrete, not generic. 60-90 words total. Do not promise God will solve their specific problem.
  "reflectionQuestions": An array of 1-2 genuinely helpful questions. Return an empty array if questions would not help.
  "prayer": A 30-40 word prayer. Personal and direct. Not a summary of the conversation. Omit if the situation does not call for one.`;

const SERMON_JSON_RULES = `
JSON keys: title, reflection (detailed and illuminating), relevance (deep connection to everyday life), prayer (heartfelt).`;

export class GroqAIAdapter implements IAIAdapter {
  private fallback = new LocalAIAdapter();

  private async ask(messages: { role: string; content: string }[], json = false, maxTokens = 400) {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/groq-guidance`, {
      method: 'POST',
      headers: await getEdgeFunctionHeaders(),
      body: JSON.stringify({ messages, json, maxTokens }),
    });

    if (!res.ok) throw new Error(`groq-guidance ${res.status}`);
    const data = await res.json();
    return data.content;
  }

  async generateReflection(passage: ScripturePassage, tone: ToneStyle): Promise<string> {
    try {
      return (
        (await this.ask(
          [
            { role: 'system', content: STYLE_GUIDE },
            {
              role: 'user',
              content: `Reflect on ${passage.reference}: "${passage.text}". Tone: ${tone}. 2-3 paragraphs. Leave room for the words to settle.`,
            },
          ],
          false,
          600,
        )) || (await this.fallback.generateReflection(passage, tone))
      );
    } catch (e) {
      console.warn('Groq fallback', e);
      return this.fallback.generateReflection(passage, tone);
    }
  }

  async generateSermon(passage: ScripturePassage, tone: ToneStyle): Promise<Sermon> {
    try {
      const raw = await this.ask(
        [
          { role: 'system', content: STYLE_GUIDE + SERMON_JSON_RULES },
          {
            role: 'user',
            content: `Sermon reflection for ${passage.reference}: "${passage.text}". Tone: ${tone}.`,
          },
        ],
        true,
        1200,
      );

      const p = JSON.parse(raw);
      return {
        id: crypto.randomUUID(),
        title: p.title || `On ${passage.reference}`,
        passage,
        reflection: p.reflection || '',
        relevance: p.relevance || '',
        prayer: p.prayer || 'Amen.',
        createdAt: new Date().toISOString(),
      };
    } catch (e) {
      console.warn('Groq fallback', e);
      return this.fallback.generateSermon(passage, tone);
    }
  }

  async generateGuidance(concern: string, tone: ToneStyle): Promise<GuidanceResult> {
    return this.generateGuidanceWithContext(concern, tone, null, null);
  }

  /**
   * Enriched guidance generation with optional personal context and a pre-selected
   * passage. Called by the runtime when context is available; falls back to
   * generateGuidance() signature for compatibility.
   */
  async generateGuidanceWithContext(
    concern: string,
    tone: ToneStyle,
    context: GuidanceContext | null,
    selectedPassage: ScripturePassage | null,
  ): Promise<GuidanceResult> {
    const themes = await this.classifyConcern(concern);

    const systemParts = [STYLE_GUIDE, GUIDANCE_JSON_RULES];
    if (context) {
      systemParts.push(formatContextForPrompt(context));
    }
    const systemPrompt = systemParts.join('\n\n');

    const passageBlock = selectedPassage
      ? `\n\nUse this passage as the scriptural grounding: ${selectedPassage.reference} - "${selectedPassage.text}"`
      : '';

    try {
      const raw = await this.ask(
        [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Guidance for: "${concern}". Tone: ${tone}.${passageBlock}`,
          },
        ],
        true,
        900,
      );

      const p = JSON.parse(raw);
      // Use the Resonance-selected passage when provided; fall back to local retrieval.
      const passage = selectedPassage ?? (await this.fallback.generateGuidance(concern, tone)).passage;

      return {
        id: crypto.randomUUID(),
        concern,
        themes,
        passage,
        pastoralFraming: p.pastoralFraming || (await this.fallback.generateGuidance(concern, tone)).pastoralFraming,
        reflectionQuestions: Array.isArray(p.reflectionQuestions) ? p.reflectionQuestions : [],
        prayer: p.prayer ?? undefined,
        createdAt: new Date().toISOString(),
      };
    } catch (e) {
      console.warn('Groq fallback', e);
      return this.fallback.generateGuidance(concern, tone);
    }
  }

  async classifyConcern(input: string): Promise<string[]> {
    return this.fallback.classifyConcern(input);
  }

  async validateSafety(input: string): Promise<{ safe: boolean; reason?: string }> {
    return this.fallback.validateSafety(input);
  }
}
