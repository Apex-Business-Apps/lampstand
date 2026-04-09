import type { GuidanceResult, ToneStyle } from '@/types';
import { getAIAdapter, getRetrievalAdapter } from '@/lib/adapters';

export class RetrievalOrchestrator {
  async retrieve(query: string) {
    const retrieval = getRetrievalAdapter();
    return retrieval.search({ query, topK: 1 });
  }
}

export class ConversationOrchestrator {
  async synthesizeGuidance(input: string, tone: ToneStyle): Promise<GuidanceResult> {
    const ai = getAIAdapter();
    return ai.generateGuidance(input, tone);
  }
}

export interface VoiceOrchestrator {
  speak(text: string): void;
  stop(): void;
}

export interface TurnPipelineInput {
  input: string;
  tone: ToneStyle;
}
