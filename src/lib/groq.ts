import type { IAIAdapter, ScripturePassage, ToneStyle, Sermon, GuidanceResult } from '@/types';
import { LocalAIAdapter } from './adapters';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const MODEL = 'llama-3.3-70b-versatile';

// Compact system prompt — optimised for minimal token overhead
const SYS = `You are LampStand, a calm pastoral companion.
Rules: no em dashes; no filler ("Absolutely","I hear you"); no therapy-speak; plain English; separate scripture from reflection; be brief.`;

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
        { role: 'user', content: `Reflect on ${passage.reference}: "${passage.text}". Tone: ${tone}. Max 2 short paragraphs.` }
      ], false, 250) || await this.fallback.generateReflection(passage, tone);
    } catch (e) {
      console.warn("Groq fallback", e);
      return this.fallback.generateReflection(passage, tone);
    }
  }

  async generateSermon(passage: ScripturePassage, tone: ToneStyle): Promise<Sermon> {
    try {
      const raw = await this.ask([
        { role: 'system', content: SYS + '\nJSON keys: title, reflection, relevance, prayer. Keep each under 80 words.' },
        { role: 'user', content: `Sermon reflection for ${passage.reference}: "${passage.text}". Tone: ${tone}.` }
      ], true, 350);

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
        { role: 'system', content: SYS + '\nJSON keys: pastoralFraming (max 60 words), reflectionQuestions (max 2, each under 15 words), prayer (max 40 words).' },
        { role: 'user', content: `Guidance for: "${concern}". Tone: ${tone}.` }
      ], true, 300);

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
