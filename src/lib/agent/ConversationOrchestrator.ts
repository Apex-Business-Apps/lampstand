import { AIProviderAdapter } from '../ai/types';
import { AgentRuntimeContext, TurnResult } from './AgentInterfaces';
import { SafetyGate } from './SafetyGate';
import { CircuitBreaker } from './CircuitBreaker';
import { RetrievalOrchestrator } from './RetrievalOrchestrator';
import { Prompts } from './Prompts';

export class ConversationOrchestrator {
  private safetyGate = new SafetyGate();
  private circuitBreaker = new CircuitBreaker();
  private retrieval = new RetrievalOrchestrator();

  constructor(private provider: AIProviderAdapter) {}

  async runTurn(input: string, context: AgentRuntimeContext): Promise<TurnResult> {
    if (this.circuitBreaker.isOpen()) {
      return { id: crypto.randomUUID(), response: this.circuitBreaker.getFallbackResponse(), isFallback: true, circuitBroken: true };
    }

    const preCheck = await this.safetyGate.preClassification(input);
    if (!preCheck.isSafe) {
      return { id: crypto.randomUUID(), response: "I cannot process that request. Let us focus on scripture and peace.", isFallback: true, circuitBroken: false };
    }

    const passages = await this.retrieval.retrieveContext(input);
    const contextText = passages.map(p => `${p.reference}: ${p.text}`).join('\n');

    const systemPrompt = `${Prompts.style}\n\n${Prompts[context.mode]}\n\nRelevant Scripture:\n${contextText}`;

    // Build multi-turn messages for conversational memory
    const historyWindow = (context.history || []).slice(-6);
    const fullPrompt = historyWindow.length > 0
      ? `Previous conversation:\n${historyWindow.map(m => `${m.role}: ${m.content}`).join('\n')}\n\nUser: ${input}`
      : input;

    try {
      let output = await this.provider.generateText(fullPrompt, systemPrompt);

      const postCheck = await this.safetyGate.validateOutput(output);
      if (!postCheck.isSafe) {
        output = this.safetyGate.cleanOutput(output);
      }

      this.circuitBreaker.recordSuccess();

      return {
        id: crypto.randomUUID(),
        response: output,
        isFallback: false,
        circuitBroken: false,
        metadata: { passages }
      };
    } catch (e) {
      console.error("Orchestrator Error:", e);
      this.circuitBreaker.recordError();
      return { id: crypto.randomUUID(), response: this.circuitBreaker.getFallbackResponse(), isFallback: true, circuitBroken: true };
    }
  }
}
