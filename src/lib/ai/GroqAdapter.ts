import { AIProviderAdapter } from './types';

export class GroqAdapter implements AIProviderAdapter {
  id = 'groq';
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
    this.model = 'llama3-70b-8192'; // Using Llama 3 70B as standard
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.isAvailable()) throw new Error('Groq API Key not configured');

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`Groq Error: ${response.status} - ${err.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }
}
