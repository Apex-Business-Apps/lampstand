import { AIProviderAdapter } from '../ai/types';
import { AgentRuntimeContext, TurnResult } from './AgentInterfaces';
import { SafetyGate } from './SafetyGate';
import { CircuitBreaker } from './CircuitBreaker';
import { RetrievalOrchestrator } from './RetrievalOrchestrator';
import { Prompts } from './Prompts';
import { buildGroundedSystemPrompt, enforceGroundedAnswer, getRequestGuardrail, normalizeUserInput, selectGroundingPassages } from './Grounding';

export class ConversationOrchestrator {
  private safetyGate = new SafetyGate();
  private circuitBreaker = new CircuitBreaker();
  private retrieval = new RetrievalOrchestrator();

  constructor(private provider: AIProviderAdapter) {}

  async runTurn(input: string, context: AgentRuntimeContext): Promise<TurnResult> {
    const normalizedInput = normalizeUserInput(input);
    const requestGuardrail = getRequestGuardrail(normalizedInput);
    if (requestGuardrail.blocked) {
      return { id: crypto.randomUUID(), response: requestGuardrail.response || 'I cannot process that request safely.', isFallback: true, circuitBroken: false, metadata: { reason: requestGuardrail.reason } };
    }

    if (this.circuitBreaker.isOpen()) {
      return { id: crypto.randomUUID(), response: this.circuitBreaker.getFallbackResponse(), isFallback: true, circuitBroken: true };
    }

    const preCheck = await this.safetyGate.preClassification(normalizedInput);
    if (!preCheck.isSafe) {
      return { id: crypto.randomUUID(), response: "I cannot process that request. Let us focus on scripture and peace.", isFallback: true, circuitBroken: false };
    }

    const passages = selectGroundingPassages(await this.retrieval.retrieveContext(normalizedInput));
    const systemPrompt = buildGroundedSystemPrompt(Prompts.style, Prompts[context.mode], passages);

    // Build multi-turn messages for conversational memory
    const historyWindow = (context.history || []).slice(-6);
    const fullPrompt = historyWindow.length > 0
      ? `Previous conversation:\n${historyWindow.map(m => `${m.role}: ${normalizeUserInput(m.content)}`).join('\n')}\n\nUser: ${normalizedInput}`
      : normalizedInput;

    try {
      let output = await this.provider.generateText(fullPrompt, systemPrompt);

      const postCheck = await this.safetyGate.validateOutput(output);
      if (!postCheck.isSafe) {
        output = this.safetyGate.cleanOutput(output);
      }

      output = enforceGroundedAnswer(output, passages);

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
