export class CircuitBreaker {
  private errorCount = 0;
  private maxErrors = 3;
  private resetTimeout = 60000; // 1 min
  private lastErrorTime = 0;

  recordError() {
    this.errorCount++;
    this.lastErrorTime = Date.now();
  }

  isOpen(): boolean {
    if (this.errorCount >= this.maxErrors) {
      if (Date.now() - this.lastErrorTime > this.resetTimeout) {
        // Half-open state
        this.errorCount = 0;
        return false;
      }
      return true;
    }
    return false;
  }

  getFallbackResponse(): string {
    return "I am taking a gentle pause. In quiet moments like this, we remember Psalm 46:10: 'Be still, and know that I am God.'";
  }
}
