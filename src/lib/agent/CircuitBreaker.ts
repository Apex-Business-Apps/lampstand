type CircuitState = 'closed' | 'open' | 'half-open';

export class CircuitBreaker {
  private errorCount = 0;
  private successCount = 0;
  private maxErrors = 3;
  private halfOpenSuccessThreshold = 2;
  private resetTimeout = 60000; // 1 min
  private lastErrorTime = 0;
  private state: CircuitState = 'closed';

  recordError() {
    this.errorCount++;
    this.successCount = 0;
    this.lastErrorTime = Date.now();

    if (this.errorCount >= this.maxErrors) {
      this.state = 'open';
    }
  }

  recordSuccess() {
    if (this.state === 'half-open') {
      this.successCount++;
      if (this.successCount >= this.halfOpenSuccessThreshold) {
        this.state = 'closed';
        this.errorCount = 0;
        this.successCount = 0;
      }
    } else if (this.state === 'closed') {
      // Decay error count on success in closed state
      this.errorCount = Math.max(0, this.errorCount - 1);
    }
  }

  isOpen(): boolean {
    if (this.state === 'open') {
      if (Date.now() - this.lastErrorTime > this.resetTimeout) {
        this.state = 'half-open';
        this.successCount = 0;
        return false; // Allow one probe request
      }
      return true;
    }
    return false;
  }

  getState(): CircuitState {
    return this.state;
  }

  getFallbackResponse(): string {
    return "I am taking a gentle pause. In quiet moments like this, we remember Psalm 46:10: 'Be still, and know that I am God.'";
  }
}
