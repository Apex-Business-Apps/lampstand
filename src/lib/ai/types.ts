export interface AIProviderAdapter {
  id: string;
  generateText(prompt: string, systemPrompt?: string): Promise<string>;
  isAvailable(): boolean;
}

export interface AgentContext {
  mode: 'guidance' | 'sermon' | 'daily' | 'kids';
  conversationHistory: { role: 'user' | 'assistant', content: string }[];
}

export interface SafetyCheckResult {
  isSafe: boolean;
  reason?: string;
}
