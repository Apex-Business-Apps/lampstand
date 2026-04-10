import { SafetyCheckResult } from './AgentInterfaces';

export class SafetyGate {
  private bannedPatterns = [
    /absolutely/i, /certainly/i, /of course/i, /let['']s/i,
    /i hear you/i, /i appreciate that/i, /that['']s a great question/i,
    /i['']m here for you/i, /it['']s important to note/i, /at the end of the day/i,
    /—/, /–/ // Em and En dashes
  ];

  private injectionPatterns = [
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
    /repeat\s+after\s+me/i,
    /translate\s+.+\s+to\s+.+:/i,
    /do\s+not\s+follow\s+(any|your)/i,
    /new\s+instructions?:/i,
    /forget\s+(everything|all|your)/i,
    /reveal\s+(your|the)\s+(system|prompt|instructions)/i,
  ];

  async preClassification(input: string): Promise<SafetyCheckResult> {
    const trimmed = input.trim();
    if (!trimmed) return { isSafe: true };

    for (const pattern of this.injectionPatterns) {
      if (pattern.test(trimmed)) {
        return { isSafe: false, reason: 'prompt_injection' };
      }
    }

    return { isSafe: true };
  }

  async validateOutput(output: string): Promise<SafetyCheckResult> {
    for (const pattern of this.bannedPatterns) {
      if (pattern.test(output)) {
        return { isSafe: false, reason: 'banned_pattern' };
      }
    }
    return { isSafe: true };
  }

  cleanOutput(output: string): string {
    return output.replace(/—/g, ',').replace(/–/g, ',');
  }
}
