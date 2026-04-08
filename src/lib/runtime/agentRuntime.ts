import { checkInputSafety, SAFE_FALLBACK_RESPONSE, shouldCircuitBreak } from '@/lib/safety';
import { getRetrievalAdapter } from '@/lib/adapters';
import { resolvePrimaryProvider, resolveSafeProvider } from '@/lib/providers';
import type { GuidanceResult, ToneStyle } from '@/types';

export type RuntimeState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'muted' | 'disabled' | 'error';

export class CircuitBreaker {
  isOpen() {
    return shouldCircuitBreak();
  }
}

export class SessionStateMachine {
  private state: RuntimeState = 'idle';
  getState() { return this.state; }
  setState(next: RuntimeState) { this.state = next; }
}

export class SafetyGate {
  check(text: string) {
    return checkInputSafety(text);
  }
}

export class RetrievalOrchestrator {
  async retrieve(input: string) {
    return getRetrievalAdapter().search({ query: input, topK: 1 });
  }
}

export class ConversationOrchestrator {
  async composeGuidance(input: string, tone: ToneStyle): Promise<GuidanceResult> {
    const retrieval = await new RetrievalOrchestrator().retrieve(input);
    const passage = retrieval.passages[0] || SAFE_FALLBACK_RESPONSE.passage;
    const provider = resolvePrimaryProvider();
    try {
      return await provider.generateGuidance(input, tone, passage);
    } catch {
      return resolveSafeProvider().generateGuidance(input, tone, passage);
    }
  }
}

export class TurnPipeline {
  private safety = new SafetyGate();
  private circuit = new CircuitBreaker();

  async run(input: string, tone: ToneStyle): Promise<GuidanceResult> {
    if (this.circuit.isOpen()) {
      return {
        id: crypto.randomUUID(),
        concern: input,
        themes: ['circuit-breaker'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: ['Take one minute of silence. What do you need?'],
        createdAt: new Date().toISOString(),
      };
    }
    const safety = this.safety.check(input);
    if (!safety.safe) {
      return {
        id: crypto.randomUUID(),
        concern: input,
        themes: ['safety-fallback'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: safety.reason || SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: ['What would peace look like in this moment?'],
        createdAt: new Date().toISOString(),
      };
    }
    return new ConversationOrchestrator().composeGuidance(input, tone);
  }
}

export class AgentRuntime {
  private stateMachine = new SessionStateMachine();
  private pipeline = new TurnPipeline();

  get state() { return this.stateMachine.getState(); }

  async respond(input: string, tone: ToneStyle) {
    this.stateMachine.setState('thinking');
    try {
      const result = await this.pipeline.run(input, tone);
      this.stateMachine.setState('idle');
      return result;
    } catch {
      this.stateMachine.setState('error');
      throw new Error('Unable to process this request');
    }
  }

  cancel() {
    this.stateMachine.setState('idle');
  }
}
