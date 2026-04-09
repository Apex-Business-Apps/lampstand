export interface AgentRuntimeContext {
  userId?: string;
  sessionId: string;
  mode: 'guidance' | 'daily' | 'sermon' | 'kids';
  history: Message[];
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface SafetyCheckResult {
  isSafe: boolean;
  reason?: string;
}

export interface TurnResult {
  id: string;
  response: string;
  isFallback: boolean;
  circuitBroken: boolean;
  metadata?: Record<string, unknown>;
}
