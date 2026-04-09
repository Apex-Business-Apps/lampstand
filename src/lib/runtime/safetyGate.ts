import { SAFE_FALLBACK_RESPONSE, checkInputSafety } from '@/lib/safety';
import type { ScripturePassage } from '@/types';

const BANNED_PATTERNS = [
  /^absolutely\b/i,
  /^certainly\b/i,
  /^of course\b/i,
  /\blet['’]s\b/i,
  /\bi hear you\b/i,
  /\bi appreciate that\b/i,
  /that['’]s a great question/i,
  /\bi['’]m here for you\b/i,
  /it['’]s important to note/i,
  /at the end of the day/i,
  /—/,
  /\s–\s/,
];

export interface SafetyGateResult {
  allowed: boolean;
  reason?: string;
  fallbackPassage?: ScripturePassage;
}

export class SafetyGate {
  validateInput(input: string): SafetyGateResult {
    const result = checkInputSafety(input);
    if (result.safe) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: result.reason,
      fallbackPassage: SAFE_FALLBACK_RESPONSE.passage,
    };
  }

  sanitizeOutput(text: string): string {
    return text
      .replace(/[—–]/g, ',')
      .replace(/\s+/g, ' ')
      .trim();
  }

  hasBannedPattern(text: string): boolean {
    return BANNED_PATTERNS.some((pattern) => pattern.test(text));
  }
}
