import { GroqAdapter } from './GroqAdapter';
import { NullAdapter } from './NullAdapter';
import { ConversationOrchestrator } from '../agent/ConversationOrchestrator';

export class AgentRuntime {
  public orchestrator: ConversationOrchestrator;

  constructor() {
    const groq = new GroqAdapter();
    const provider = groq.isAvailable() ? groq : new NullAdapter();
    this.orchestrator = new ConversationOrchestrator(provider);
  }

  async runGuidanceTurn(userMessage: string, history: { role: "user" | "assistant" | "system", content: string }[] = []): Promise<string> {
    const result = await this.orchestrator.runTurn(userMessage, {
      sessionId: 'default',
      mode: 'guidance',
      history
    });
    return result.response;
  }
}
