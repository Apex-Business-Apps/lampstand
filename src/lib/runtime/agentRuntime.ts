import type { GuidanceResult, ToneStyle } from '@/types';
import { getAIAdapter, getRetrievalAdapter } from '@/lib/adapters';
import { SAFE_FALLBACK_RESPONSE, checkInputSafety, shouldCircuitBreak } from '@/lib/safety';
import { logSafetyEvent } from '@/lib/storage';

export class CircuitBreaker {
  isOpen() {
    return shouldCircuitBreak();
  }
}

export class SessionStateMachine {
  private state: 'idle' | 'listening' | 'thinking' | 'speaking' | 'error' = 'idle';
  get current() { return this.state; }
  transition(next: SessionStateMachine['state']) { this.state = next; }
}

export class SafetyGate {
  evaluate(input: string) {
    return checkInputSafety(input);
  }
}

export class RetrievalOrchestrator {
  async retrieve(query: string) {
    return getRetrievalAdapter().search({ query, topK: 1 });
  }
}

export class ConversationOrchestrator {
  async synthesizeGuidance(input: string, tone: ToneStyle): Promise<GuidanceResult> {
    return getAIAdapter().generateGuidance(input, tone);
  }
}

export class TurnPipeline {
  constructor(
    private safety = new SafetyGate(),
    private retrieval = new RetrievalOrchestrator(),
    private conversation = new ConversationOrchestrator(),
    private breaker = new CircuitBreaker(),
  ) {}

  async runGuidanceTurn(input: string, tone: ToneStyle): Promise<GuidanceResult> {
    if (this.breaker.isOpen()) {
      return {
        id: 'runtime-circuit-break',
        concern: input,
        themes: ['peace'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: ['What small next step can you take now?'],
        createdAt: new Date().toISOString(),
      };
    }

    const safety = this.safety.evaluate(input);
    if (!safety.safe) {
      return {
        id: `runtime-${safety.type}`,
        concern: input,
        themes: ['peace'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: safety.reason || SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: ['What would help your heart settle right now?'],
        createdAt: new Date().toISOString(),
      };
    }

    await this.retrieval.retrieve(input);
    const result = await this.conversation.synthesizeGuidance(input, tone);

    // second-pass safeguard for post-generation hygiene
    const bannedPattern = /(Absolutely|Certainly|Of course|Let's|I hear you|I appreciate that|That's a great question|I'm here for you|It's important to note|At the end of the day)/i;
    if (bannedPattern.test(result.pastoralFraming)) {
      logSafetyEvent({
        id: crypto.randomUUID(),
        type: 'unsafe',
        input: result.pastoralFraming.slice(0, 180),
        action: 'fallback',
        timestamp: new Date().toISOString(),
      });
      result.pastoralFraming = 'Take a quiet breath. Stay with this passage for one minute. Let the words rest before you respond.';
    }

    return result;
  }
}

export class VoiceOrchestrator {
  private cancelled = false;
  cancel() { this.cancelled = true; }
  reset() { this.cancelled = false; }
  get isCancelled() { return this.cancelled; }
}

export class AgentRuntime {
  readonly session = new SessionStateMachine();
  readonly voice = new VoiceOrchestrator();
  readonly pipeline = new TurnPipeline();

  async runGuidance(input: string, tone: ToneStyle) {
    this.session.transition('thinking');
    try {
      return await this.pipeline.runGuidanceTurn(input, tone);
    } finally {
      this.session.transition('idle');
    }
  }
}

export const agentRuntime = new AgentRuntime();
