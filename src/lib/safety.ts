import type { SafetyEvent } from '@/types';
import { logSafetyEvent } from './storage';

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|system)/i,
  /disregard\s+(all\s+)?(instructions|rules|safety)/i,
  /you\s+are\s+now/i,
  /pretend\s+to\s+be/i,
  /act\s+as\s+(if|a|an)/i,
  /system\s*prompt/i,
  /reveal\s+(your\s+)?(instructions|prompt|system)/i,
  /\bDAN\b/,
  /jailbreak/i,
  /bypass\s+(safety|filter|guard|policy)/i,
  /override\s+(safety|system|rules)/i,
  /developer\s+mode/i,
];

const ABUSE_PATTERNS = [
  /\b(fuck|shit|damn|hell|bitch|ass)\b/i,
  /hate\s+(god|jesus|christ|church)/i,
];

const SENSITIVE_CRISIS_PATTERNS = [
  /\b(suicide|kill myself|end my life|self-harm|self harm|hurt myself|want to die)\b/i,
  /\b(domestic abuse|sexual assault|physical violence)\b/i,
];

const OUT_OF_SCOPE_PATTERNS = [
  /stock\s*(market|price|tip|pick)/i,
  /crypto(currency)?|bitcoin|ethereum/i,
  /betting|gambling|casino|lottery/i,
  /political\s+(party|candidate|campaign)/i,
  /who\s+to\s+vote/i,
  /medical\s+(diagnosis|prescription|dosage)/i,
  /legal\s+(advice|lawsuit|contract)/i,
];

export interface SafetyCheckResult {
  safe: boolean;
  type?: SafetyEvent['type'];
  reason?: string;
}

export function checkInputSafety(input: string): SafetyCheckResult {
  const trimmed = input.trim();
  if (!trimmed) return { safe: true };

  for (const p of SENSITIVE_CRISIS_PATTERNS) {
    if (p.test(trimmed)) {
      const event: SafetyEvent = {
        id: crypto.randomUUID(),
        type: 'crisis',
        input: trimmed.slice(0, 200),
        action: 'blocked',
        timestamp: new Date().toISOString(),
      };
      logSafetyEvent(event);
      return {
        safe: false,
        type: 'crisis',
        reason: 'If you or someone you know is struggling or in crisis, help is available. You are not alone. Please dial 988 in the US/Canada or contact your local emergency services immediately for trained support.',
      };
    }
  }

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
      return {
        safe: false,
        type: 'injection',
        reason: 'This input contains instructions that fall outside what TheLampStand is called to do. I am here for quiet spiritual reflection.',
      };
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
      return {
        safe: false,
        type: 'abuse',
        reason: 'I sense strong distress. Would you like to sit with a quiet passage about peace instead?',
      };
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
      return {
        safe: false,
        type: 'out-of-scope',
        reason: 'That is outside the scope of what I can offer. I am here for scripture, reflection, and spiritual accompaniment.',
      };
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
