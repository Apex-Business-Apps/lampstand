import type { GuidanceResult, Sermon, ScripturePassage, ToneStyle } from '@/types';
import { LocalAIAdapter } from '@/lib/adapters';
import { validateGeneratedOutput } from '@/lib/safety';

export interface AIProviderAdapter {
  provider: string;
  available(): boolean;
  generateGuidance(concern: string, tone: ToneStyle, passage: ScripturePassage): Promise<GuidanceResult>;
}

class GroqProviderAdapter implements AIProviderAdapter {
  provider = 'groq';
  private apiKey = import.meta.env.VITE_GROQ_API_KEY;
  private model = import.meta.env.VITE_GROQ_MODEL || 'llama-3.1-8b-instant';

  available() {
    return Boolean(this.apiKey);
  }

  async generateGuidance(concern: string, _tone: ToneStyle, passage: ScripturePassage): Promise<GuidanceResult> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Write in plain English with quiet dignity. Separate Scripture, Reflection, and Prayer. Never use em dashes. Avoid filler and banned phrases.',
          },
          {
            role: 'user',
            content: `Concern: ${concern}\nPassage: ${passage.reference} ${passage.text}`,
          },
        ],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      throw new Error('Groq request failed');
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || '';
    const safe = validateGeneratedOutput(text);
    if (!safe.safe) {
      throw new Error(safe.reason || 'Safety validation failed');
    }

    return {
      id: crypto.randomUUID(),
      concern,
      themes: ['peace'],
      passage,
      pastoralFraming: text,
      reflectionQuestions: ['What part of this scripture is calling you today?'],
      prayer: 'Lord, give me wisdom and calm for this moment. Amen.',
      createdAt: new Date().toISOString(),
    };
  }
}

class LocalFallbackProvider implements AIProviderAdapter {
  provider = 'local-fallback';
  private local = new LocalAIAdapter();
  available() { return true; }
  async generateGuidance(concern: string, tone: ToneStyle, _passage: ScripturePassage): Promise<GuidanceResult> {
    return this.local.generateGuidance(concern, tone);
  }
}

class ScriptureOnlyProvider implements AIProviderAdapter {
  provider = 'scripture-only';
  available() { return true; }
  async generateGuidance(concern: string, _tone: ToneStyle, passage: ScripturePassage): Promise<GuidanceResult> {
    return {
      id: crypto.randomUUID(),
      concern,
      themes: ['scripture-only'],
      passage,
      pastoralFraming: 'Generation is unavailable right now. Sit with this passage slowly.',
      reflectionQuestions: ['What word or phrase stands out to you?'],
      createdAt: new Date().toISOString(),
    };
  }
}

export function resolvePrimaryProvider(): AIProviderAdapter {
  const groq = new GroqProviderAdapter();
  if (groq.available()) return groq;
  return new LocalFallbackProvider();
}

export function resolveSafeProvider(): AIProviderAdapter {
  return new ScriptureOnlyProvider();
}

export type { Sermon };
