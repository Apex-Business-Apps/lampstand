export type SessionState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'error'
  | 'disabled'
  | 'muted';

const ALLOWED_TRANSITIONS: Record<SessionState, SessionState[]> = {
  idle: ['listening', 'thinking', 'disabled', 'muted', 'error'],
  listening: ['idle', 'thinking', 'error'],
  thinking: ['idle', 'speaking', 'error'],
  speaking: ['idle', 'thinking', 'muted', 'error'],
  muted: ['idle', 'thinking', 'speaking', 'error'],
  disabled: ['idle'],
  error: ['idle'],
};

export class SessionStateMachine {
  private current: SessionState = 'idle';

  get state(): SessionState {
    return this.current;
  }

  transition(next: SessionState): boolean {
    if (!ALLOWED_TRANSITIONS[this.current].includes(next)) {
      return false;
    }
    this.current = next;
    return true;
  }

  reset(): void {
    this.current = 'idle';
  }
}
