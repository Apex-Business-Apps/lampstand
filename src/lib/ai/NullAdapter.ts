import { AIProviderAdapter } from './types';

export class NullAdapter implements AIProviderAdapter {
  id = 'null';

  isAvailable(): boolean {
    return true; // Always available fallback
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    return "I am currently unable to connect to the cloud. However, know that God's word remains constant. Consider reading Psalm 46: 'God is our refuge and strength, an ever-present help in trouble.'";
  }
}
