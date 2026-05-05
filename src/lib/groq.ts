import type { IAIAdapter, ScripturePassage, ToneStyle, Sermon, GuidanceResult } from '@/types';
import { LocalAIAdapter } from './adapters';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const MODEL = 'llama-3.3-70b-versatile';

// System prompt focused on depth, connection, and enlightenment
const SYS = `You are LampStand, a calm, deeply empathetic, and enlightening pastoral companion.
Your purpose is to offer profound connection, meaningful explanation, and thoughtful guidance.
Rules: no em dashes; no therapy-speak; use plain, beautiful English; separate scripture from reflection; be detailed, expansive, and deeply encouraging. Provide paths and nudges toward spiritual enlightenment.`;

export class GroqAIAdapter implements IAIAdapter {
  private fallback = new LocalAIAdapter();

  private async ask(messages: {role: string, content: string}[], json = false, maxTokens = 400) {
    if (!GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY");

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        response_format: json ? { type: "json_object" } : { type: "text" },
        temperature: 0.5,
        max_completion_tokens: maxTokens,
      })
    });

    if (!res.ok) throw new Error(`Groq ${res.status}`);
    const data = await res.json();
    return data.choices[0].message.content;
  }

  async generateReflection(passage: ScripturePassage, tone: ToneStyle): Promise<string> {
    try {
      return await this.ask([
        { role: 'system', content: SYS },
        { role: 'user', content: `Reflect deeply on ${passage.reference}: "${passage.text}". Tone: ${tone}. Provide an enlightening, multi-paragraph reflection that offers genuine connection and a path forward.` }
      ], false, 800) || await this.fallback.generateReflection(passage, tone);
    } catch (e) {
      console.warn("Groq fallback", e);
      return this.fallback.generateReflection(passage, tone);
    }
  }

  async generateSermon(passage: ScripturePassage, tone: ToneStyle): Promise<Sermon> {
    try {
      const raw = await this.ask([
        { role: 'system', content: SYS + '\nJSON keys: title, reflection (detailed and illuminating), relevance (deep connection to everyday life), prayer (heartfelt). Give detailed, expansive answers.' },
        { role: 'user', content: `Sermon reflection for ${passage.reference}: "${passage.text}". Tone: ${tone}. Offer deep enlightenment and connection.` }
      ], true, 1200);

      const p = JSON.parse(raw);
      return {
        id: crypto.randomUUID(), title: p.title || `On ${passage.reference}`,
        passage, reflection: p.reflection || '', relevance: p.relevance || '',
        prayer: p.prayer || 'Amen.', createdAt: new Date().toISOString()
      };
    } catch (e) {
      console.warn("Groq fallback", e);
      return this.fallback.generateSermon(passage, tone);
    }
  }

  async generateGuidance(concern: string, tone: ToneStyle): Promise<GuidanceResult> {
    try {
      const themes = await this.classifyConcern(concern);
      const raw = await this.ask([
        { role: 'system', content: SYS + '\nJSON keys: pastoralFraming (expansive, offering enlightenment and deep connection), reflectionQuestions (2-3 deeply thought-provoking questions), prayer (meaningful and heartfelt).' },
        { role: 'user', content: `Guidance for: "${concern}". Tone: ${tone}. Offer deep enlightenment, explanation, and connection.` }
      ], true, 1000);

      const p = JSON.parse(raw);
      const fb = await this.fallback.generateGuidance(concern, tone);

      return {
        id: crypto.randomUUID(), concern, themes,
        passage: fb.passage,
        pastoralFraming: p.pastoralFraming || fb.pastoralFraming,
        reflectionQuestions: p.reflectionQuestions || fb.reflectionQuestions,
        prayer: p.prayer, createdAt: new Date().toISOString()
      };
    } catch (e) {
      console.warn("Groq fallback", e);
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
