import type { IAIAdapter, ScripturePassage, ToneStyle, Sermon, GuidanceResult } from '@/types';
import { LocalAIAdapter } from './adapters';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const MODEL = 'llama-3.3-70b-versatile';

// Rules to enforce on ALL generation
const BASE_SYSTEM_PROMPT = `You are LampStand, a thoughtful, human, pastor-companion.
CRITICAL RULES:
1. NEVER use em dashes. Use regular dashes, commas, or semicolons.
2. Avoid AI-sounding validation, filler, and customer-support language (e.g. "Absolutely", "Certainly", "Let's", "I hear you", "That's a great question").
3. Do NOT act like a therapist or use motivational fluff.
4. Be calm, reverent, restrained, and plain English.
5. Separate scripture from reflection.`;

export class GroqAIAdapter implements IAIAdapter {
  private fallback = new LocalAIAdapter();

  async fetchGroq(messages: {role: string, content: string}[], isJson = false) {
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
        response_format: isJson ? { type: "json_object" } : { type: "text" },
        temperature: 0.6,
        max_completion_tokens: 800,
      })
    });

    if (!res.ok) {
      throw new Error(`Groq API error: ${res.status}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  }

  async generateReflection(passage: ScripturePassage, tone: ToneStyle): Promise<string> {
    try {
      const content = await this.fetchGroq([
        { role: 'system', content: BASE_SYSTEM_PROMPT },
        { role: 'user', content: `Write a short reflection for the passage ${passage.reference}: "${passage.text}". The tone should be ${tone}. Keep it under 3 paragraphs.` }
      ]);
      return content || await this.fallback.generateReflection(passage, tone);
    } catch (err) {
      console.warn("Groq failed, falling back", err);
      return this.fallback.generateReflection(passage, tone);
    }
  }

  async generateSermon(passage: ScripturePassage, tone: ToneStyle): Promise<Sermon> {
    try {
      const content = await this.fetchGroq([
        { role: 'system', content: BASE_SYSTEM_PROMPT + "\nYou must respond in JSON with the exact following keys: title (string), reflection (string), relevance (string), prayer (string)." },
        { role: 'user', content: `Generate a sermon mode reflection for the passage ${passage.reference}: "${passage.text}". The tone should be ${tone}.` }
      ], true);

      const parsed = JSON.parse(content);
      return {
        id: crypto.randomUUID(),
        title: parsed.title || `Reflections on ${passage.reference}`,
        passage,
        reflection: parsed.reflection || await this.fallback.generateReflection(passage, tone),
        relevance: parsed.relevance || 'A timely word.',
        prayer: parsed.prayer || 'Amen.',
        createdAt: new Date().toISOString()
      };
    } catch (err) {
      console.warn("Groq failed, falling back", err);
      return this.fallback.generateSermon(passage, tone);
    }
  }

  async generateGuidance(concern: string, tone: ToneStyle): Promise<GuidanceResult> {
    try {
      const themes = await this.classifyConcern(concern);
      const primaryTheme = themes[0] || 'peace';

      const content = await this.fetchGroq([
        { role: 'system', content: BASE_SYSTEM_PROMPT + "\nYou must respond in JSON with the exact following keys: pastoralFraming (string), reflectionQuestions (array of strings, max 2), prayer (string)." },
        { role: 'user', content: `The user is seeking guidance about: "${concern}". The tone should be ${tone}. Generate a pastoral response. Do NOT include a passage, just the pastoral framing.` }
      ], true);

      const parsed = JSON.parse(content);

      // Get fallback to steal a passage
      const fallbackData = await this.fallback.generateGuidance(concern, tone);

      return {
        id: crypto.randomUUID(),
        concern,
        themes,
        passage: fallbackData.passage,
        pastoralFraming: parsed.pastoralFraming || fallbackData.pastoralFraming,
        reflectionQuestions: parsed.reflectionQuestions || fallbackData.reflectionQuestions,
        prayer: parsed.prayer,
        createdAt: new Date().toISOString()
      };
    } catch (err) {
      console.warn("Groq failed, falling back", err);
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
