interface CircuitBreakerOptions {
  threshold?: number;
  coolDownMs?: number;
}

export class CircuitBreaker {
  private readonly threshold: number;
  private readonly coolDownMs: number;
  private failures = 0;
  private openedAt = 0;

  constructor(options: CircuitBreakerOptions = {}) {
    this.threshold = options.threshold ?? 3;
    this.coolDownMs = options.coolDownMs ?? 60_000;
  }

  recordSuccess(): void {
    this.failures = 0;
    this.openedAt = 0;
  }

  recordFailure(): void {
    this.failures += 1;
    if (this.failures >= this.threshold) {
      this.openedAt = Date.now();
    }
  }

  get isOpen(): boolean {
    if (!this.openedAt) {
      return false;
    }
    if (Date.now() - this.openedAt > this.coolDownMs) {
      this.recordSuccess();
      return false;
    }
    return true;
  }
}
