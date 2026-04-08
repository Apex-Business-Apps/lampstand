import type { SafetyEvent } from '@/types';
import { logSafetyEvent } from './storage';

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous/i,
  /disregard\s+(all\s+)?instructions/i,
  /you\s+are\s+now/i,
  /pretend\s+to\s+be/i,
  /act\s+as\s+(if|a)/i,
  /system\s*prompt/i,
  /\bDAN\b/,
  /jailbreak/i,
  /bypass\s+(safety|filter|guard)/i,
  /override\s+(safety|system)/i,
];

const ABUSE_PATTERNS = [
  /\b(fuck|shit|damn|hell|bitch|ass)\b/i,
  /kill\s+(your|my)self/i,
  /hate\s+(god|jesus|christ|church)/i,
];

const OUT_OF_SCOPE_PATTERNS = [
  /stock\s*(market|price|tip)/i,
  /crypto(currency)?/i,
  /betting|gambling/i,
  /political\s+(party|candidate)/i,
  /who\s+to\s+vote/i,
];

export interface SafetyCheckResult {
  safe: boolean;
  type?: SafetyEvent['type'];
  reason?: string;
}

export function checkInputSafety(input: string): SafetyCheckResult {
  const trimmed = input.trim();
  if (!trimmed) return { safe: true };

  for (const p of INJECTION_PATTERNS) {
    if (p.test(trimmed)) {
      const event: SafetyEvent = {
        id: crypto.randomUUID(),
        type: 'injection',
        input: trimmed.slice(0, 200),
        action: 'blocked',
        timestamp: new Date().toISOString(),
      };
      logSafetyEvent(event);
      return { safe: false, type: 'injection', reason: 'This input appears to contain instructions that fall outside what I can help with.' };
    }
  }

  for (const p of ABUSE_PATTERNS) {
    if (p.test(trimmed)) {
      const event: SafetyEvent = {
        id: crypto.randomUUID(),
        type: 'abuse',
        input: trimmed.slice(0, 200),
        action: 'fallback',
        timestamp: new Date().toISOString(),
      };
      logSafetyEvent(event);
      return { safe: false, type: 'abuse', reason: 'I sense some strong feelings. Would you like to sit with a passage about peace instead?' };
    }
  }

  for (const p of OUT_OF_SCOPE_PATTERNS) {
    if (p.test(trimmed)) {
      const event: SafetyEvent = {
        id: crypto.randomUUID(),
        type: 'out-of-scope',
        input: trimmed.slice(0, 200),
        action: 'fallback',
        timestamp: new Date().toISOString(),
      };
      logSafetyEvent(event);
      return { safe: false, type: 'out-of-scope', reason: 'That\'s outside the scope of what I can offer. I\'m here for scripture, reflection, and spiritual guidance.' };
    }
  }

  return { safe: true };
}

export const SAFE_FALLBACK_RESPONSE = {
  message: "Let's take a gentle pause here. Here is a passage to sit with:",
  passage: {
    id: 'fallback-psalm-46',
    book: 'Psalms',
    chapter: 46,
    verseStart: 10,
    verseEnd: 10,
    text: '"Be still, and know that I am God."',
    translation: 'NABRE',
    reference: 'Psalm 46:10',
  },
};

export const CIRCUIT_BREAKER_THRESHOLD = 5;

export function shouldCircuitBreak(): boolean {
  try {
    const events = JSON.parse(localStorage.getItem('lampstand_safety') || '[]');
    const recent = events.filter((e: SafetyEvent) => {
      const diff = Date.now() - new Date(e.timestamp).getTime();
      return diff < 300000; // 5 minutes
    });
    return recent.length >= CIRCUIT_BREAKER_THRESHOLD;
  } catch { return false; }
}


const BANNED_OUTPUT_PATTERNS = [
  /Absolutely\b/i,
  /Certainly\b/i,
  /Of course\b/i,
  /Let[’']s\b/i,
  /I hear you\b/i,
  /I appreciate that\b/i,
  /That[’']s a great question\b/i,
  /I[’']m here for you\b/i,
  /It[’']s important to note\b/i,
  /At the end of the day\b/i,
  /—|–/,
];

export function validateGeneratedOutput(output: string): SafetyCheckResult {
  for (const pattern of BANNED_OUTPUT_PATTERNS) {
    if (pattern.test(output)) {
      return { safe: false, type: 'unsafe', reason: 'Generated output did not pass style and safety constraints.' };
    }
  }
  return { safe: true };
}
