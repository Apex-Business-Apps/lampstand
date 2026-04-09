import { SAFE_FALLBACK_RESPONSE } from '@/lib/safety';
import type { GuidanceResult } from '@/types';
import { CircuitBreaker } from './circuitBreaker';
import { SessionStateMachine } from './sessionStateMachine';
import { ConversationOrchestrator, RetrievalOrchestrator, type TurnPipelineInput, type VoiceOrchestrator } from './orchestrators';
import { SafetyGate } from './safetyGate';

interface RuntimeOptions {
  voice?: VoiceOrchestrator;
}

export class TurnPipeline {
  constructor(
    private readonly safetyGate: SafetyGate,
    private readonly retrieval: RetrievalOrchestrator,
    private readonly conversation: ConversationOrchestrator,
  ) {}

  async run({ input, tone }: TurnPipelineInput): Promise<GuidanceResult> {
    const safety = this.safetyGate.validateInput(input);
    if (!safety.allowed) {
      return {
        id: crypto.randomUUID(),
        concern: input,
        themes: ['peace'],
        passage: safety.fallbackPassage ?? SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: safety.reason ?? SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: ['What do you most need right now?'],
        createdAt: new Date().toISOString(),
      };
    }

    await this.retrieval.retrieve(input);
    const generated = await this.conversation.synthesizeGuidance(input, tone);
    const sanitized = this.safetyGate.sanitizeOutput(generated.pastoralFraming);

    if (this.safetyGate.hasBannedPattern(sanitized)) {
      return {
        id: crypto.randomUUID(),
        concern: input,
        themes: ['peace'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: ['What is one quiet step you can take today?'],
        createdAt: new Date().toISOString(),
      };
    }

    return {
      ...generated,
      pastoralFraming: sanitized,
    };
  }
}

export class AgentRuntime {
  readonly stateMachine = new SessionStateMachine();
  readonly circuitBreaker = new CircuitBreaker({ threshold: 5, coolDownMs: 300_000 });
  readonly safetyGate = new SafetyGate();
  readonly retrieval = new RetrievalOrchestrator();
  readonly conversation = new ConversationOrchestrator();
  readonly pipeline = new TurnPipeline(this.safetyGate, this.retrieval, this.conversation);

  constructor(private readonly options: RuntimeOptions = {}) {}

  async handleTextTurn(input: TurnPipelineInput): Promise<GuidanceResult> {
    if (this.circuitBreaker.isOpen) {
      return {
        id: 'circuit-breaker-fallback',
        concern: input.input,
        themes: ['peace'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: ['Would you like to rest with this verse first?'],
        createdAt: new Date().toISOString(),
      };
    }

    this.stateMachine.transition('thinking');

    try {
      const result = await this.pipeline.run(input);
      this.circuitBreaker.recordSuccess();
      this.stateMachine.transition('idle');
      return result;
    } catch {
      this.circuitBreaker.recordFailure();
      this.stateMachine.transition('error');
      return {
        id: crypto.randomUUID(),
        concern: input.input,
        themes: ['peace'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: ['Would you like to try that again?'],
        createdAt: new Date().toISOString(),
      };
    }
  }

  speak(text: string) {
    this.stateMachine.transition('speaking');
    this.options.voice?.speak(text);
  }

  stopSpeaking() {
    this.options.voice?.stop();
    this.stateMachine.transition('idle');
  }
}
