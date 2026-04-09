import { SafetyCheckResult } from './AgentInterfaces';

export class SafetyGate {
  private bannedPatterns = [
    /absolutely/i, /certainly/i, /of course/i, /let['']s/i,
    /i hear you/i, /i appreciate that/i, /that['']s a great question/i,
    /i['']m here for you/i, /it['']s important to note/i, /at the end of the day/i,
    /—/, /–/ // Em and En dashes
  ];

  async preClassification(input: string): Promise<SafetyCheckResult> {
    // Basic malicious prompt check
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('ignore previous instructions') || lowerInput.includes('system prompt')) {
      return { isSafe: false, reason: 'prompt_injection' };
    }
    return { isSafe: true };
  }

  async validateOutput(output: string): Promise<SafetyCheckResult> {
    // Check for banned AI phrasing
    for (const pattern of this.bannedPatterns) {
      if (pattern.test(output)) {
        console.warn(`SafetyGate Triggered: Banned pattern matched -> ${pattern}`);
        // In a real strict environment, we might reject. For now, we clean it.
        // We'll return false to let the orchestrator know it needs cleaning or fallback.
        return { isSafe: false, reason: 'banned_pattern' };
      }
    }
    return { isSafe: true };
  }

  cleanOutput(output: string): string {
    let cleaned = output.replace(/—/g, ',').replace(/–/g, ',');
    return cleaned;
  }
}
