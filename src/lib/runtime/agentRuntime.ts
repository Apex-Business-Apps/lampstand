import type { GuidanceResult, ToneStyle, ScripturePassage } from '@/types';
import { getAIAdapter, getRetrievalAdapter } from '@/lib/adapters';
import { SAFE_FALLBACK_RESPONSE, checkInputSafety, shouldCircuitBreak } from '@/lib/safety';
import { logSafetyEvent } from '@/lib/storage';
import { rankCandidates } from '@/lib/resonance/ResonanceEngine';
import { assembleGuidanceContext } from '@/lib/guidance/contextAssembler';
import type { GroqAIAdapter } from '@/lib/groq';
import { getRequestGuardrail } from '@/lib/agent/Grounding';

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
  async retrieve(query: string): Promise<ScripturePassage[]> {
    const result = await getRetrievalAdapter().search({ query, topK: 5 });
    return result.passages;
  }
}

export class ConversationOrchestrator {
  async synthesizeGuidance(
    input: string,
    tone: ToneStyle,
    opts?: {
      context?: ReturnType<typeof assembleGuidanceContext>;
      bestPassage?: ScripturePassage | null;
    },
  ): Promise<GuidanceResult> {
    const adapter = getAIAdapter();

    // Use enriched path when context is available and the adapter supports it.
    if (opts && 'generateGuidanceWithContext' in adapter && typeof (adapter as GroqAIAdapter).generateGuidanceWithContext === 'function') {
      return (adapter as GroqAIAdapter).generateGuidanceWithContext(
        input,
        tone,
        opts.context ?? null,
        opts.bestPassage ?? null,
      );
    }

    return adapter.generateGuidance(input, tone);
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

    const grounding = getRequestGuardrail(input);
    if (grounding.blocked) {
      return {
        id: 'runtime-guardrail',
        concern: input,
        themes: ['peace'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: grounding.response || SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: [],
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

    // Retrieve candidate passages and apply Resonance ranking to pick the best one.
    // This fixes the previous bug where the retrieval result was silently discarded.
    let bestPassage: ScripturePassage | null = null;
    try {
      const candidates = await this.retrieval.retrieve(input);
      if (candidates.length > 0) {
        const ranked = rankCandidates(candidates.map((p) => ({ passage: p })));
        bestPassage = ranked[0]?.candidate.passage ?? null;
      }
    } catch {
      // Retrieval failure is non-fatal - the AI adapter has its own fallback passage selection.
    }

    // Assemble personal context from localStorage (respects consent flag internally).
    const context = assembleGuidanceContext();

    const result = await this.conversation.synthesizeGuidance(input, tone, { context, bestPassage });

    // Second-pass safeguard: detect AI filler that slipped through despite prompt rules.
    const bannedPattern =
      /(Absolutely|Certainly|Of course|Let's|I hear you|I appreciate that|That's a great question|I'm here for you|It's important to note|At the end of the day)/i;
    if (bannedPattern.test(result.pastoralFraming)) {
      logSafetyEvent({
        id: crypto.randomUUID(),
        type: 'unsafe',
        input: result.pastoralFraming.slice(0, 180),
        action: 'fallback',
        timestamp: new Date().toISOString(),
      });
      result.pastoralFraming =
        'Take a quiet breath. Stay with this passage for one minute. Let the words rest before you respond.';
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
