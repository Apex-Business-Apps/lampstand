export const MESSAGE_PATTERNS = {
  agentStates: {
    idle: 'Be still and know',
    listening: 'Listening...',
    thinking: 'Reflecting...',
    speaking: 'Speaking...',
    error: 'Something interrupted. Let us pause.'
  },
  quickActions: [
    'Reflect on today’s passage',
    'Help me pray',
    'Make this a journal entry',
    'Give me a short Examen',
    'Help me with a sermon outline'
  ],
  fallbacks: {
    contextMissing: 'I may need a little more context to help well here.',
    interrupted: 'Something interrupted that response. Try again.',
    circuitBreaker: "Let's take a gentle pause. Here is a passage to rest with.",
    generationError: 'I had trouble preparing guidance. Here is a safe passage instead.'
  },
  emptyStates: {
    journal: 'A quiet place for your thoughts today.',
    saved: 'Your saved passages will rest here.',
    circles: 'Your small, quiet community.'
  },
  contextNotes: {
    today: 'Using: Today’s Light',
    journal: 'Using: Recent journal context',
    conversation: 'Using: Current conversation only',
    lectio: 'Using: Lectio progress and saved passage'
  }
};

export function getFallbackMessage(reason: 'context' | 'error' | 'interrupted'): string {
  switch (reason) {
    case 'context': return MESSAGE_PATTERNS.fallbacks.contextMissing;
    case 'interrupted': return MESSAGE_PATTERNS.fallbacks.interrupted;
    case 'error': return MESSAGE_PATTERNS.fallbacks.generationError;
    default: return MESSAGE_PATTERNS.fallbacks.generationError;
  }
}
