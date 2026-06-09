export type ToneSurface = 'daily-light' | 'lectio' | 'examen' | 'journal' | 'guidance' | 'settings' | 'error';

export interface VoiceConfig {
  surface: ToneSurface;
  tone: string;
  maxSentences: number;
  bridgeAction: string;
}

export const TONE_MAP: Record<ToneSurface, VoiceConfig> = {
  'daily-light': {
    surface: 'daily-light',
    tone: 'luminous, concise, orienting, reflective',
    maxSentences: 3,
    bridgeAction: 'Carry this into your day.'
  },
  'lectio': {
    surface: 'lectio',
    tone: 'spacious, invitational, step-based, unhurried',
    maxSentences: 4,
    bridgeAction: 'Rest here a moment.'
  },
  'examen': {
    surface: 'examen',
    tone: 'spacious, invitational, step-based, unhurried',
    maxSentences: 4,
    bridgeAction: 'Go in peace.'
  },
  'journal': {
    surface: 'journal',
    tone: 'honest, practical, lightly encouraging, non-performative',
    maxSentences: 5,
    bridgeAction: 'Leave it here.'
  },
  'guidance': {
    surface: 'guidance',
    tone: 'thoughtful, discerning, human, sensitive, never canned',
    maxSentences: 5,
    bridgeAction: 'What is one small next step?'
  },
  'settings': {
    surface: 'settings',
    tone: 'clear, respectful, low-drama, concrete',
    maxSentences: 2,
    bridgeAction: ''
  },
  'error': {
    surface: 'error',
    tone: 'respectful, direct, low-drama, recoverable',
    maxSentences: 2,
    bridgeAction: 'Try again.'
  }
};

export const ANTI_PATTERNS = [
  "I'm here for you.",
  "That sounds really difficult.",
  "Let's unpack that.",
  "As an AI",
  "It's important to note that",
  "Oops!",
  "Uh-oh!",
  "An unexpected error occurred."
];

export function shapeResponse(text: string, surface: ToneSurface): string {
  let shapedText = text;
  // Naive filter for anti-patterns (in reality, prompt generation should enforce this)
  ANTI_PATTERNS.forEach(pattern => {
    const regex = new RegExp(pattern, 'gi');
    shapedText = shapedText.replace(regex, '');
  });
  // Truncate multiple spaces and clean up
  return shapedText.replace(/\s{2,}/g, ' ').trim();
}
