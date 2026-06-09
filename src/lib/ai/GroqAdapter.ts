import { AIProviderAdapter } from './types';

export class GroqAdapter implements AIProviderAdapter {
  id = 'groq';
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor() {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    this.supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
  }

  isAvailable(): boolean {
    return !!(this.supabaseUrl && this.supabaseKey);
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.isAvailable()) throw new Error('Supabase configuration missing');

    const messages: Array<{ role: string; content: string }> = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await fetch(`${this.supabaseUrl}/functions/v1/groq-guidance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      },
      body: JSON.stringify({ messages, maxTokens: 1024 }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`groq-guidance Error: ${response.status} - ${err.error || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.content || '';
  }
}
