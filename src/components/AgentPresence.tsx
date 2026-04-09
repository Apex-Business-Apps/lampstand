import { GlowOrb } from './GlowOrb';

interface AgentPresenceProps {
  size?: 'sm' | 'md' | 'lg';
  isListening?: boolean;
  isThinking?: boolean;
  isSpeaking?: boolean;
  className?: string;
}

export function AgentPresence({ size = 'md', isListening, isThinking, isSpeaking, className = '' }: AgentPresenceProps) {
  let stateClass = '';
  if (isListening) {
    stateClass = 'animate-pulse scale-110 shadow-[0_0_40px_hsl(var(--primary))]';
  } else if (isThinking) {
    stateClass = 'animate-ping scale-105 opacity-80';
  } else if (isSpeaking) {
    stateClass = 'animate-bounce'; // Subtle bounce or glow
  }

  return (
    <div className={`relative flex items-center justify-center ${className} transition-all duration-500`}>
      <div className={`transition-all duration-300 ${stateClass} rounded-full`}>
        <GlowOrb size={size} showImage={true} />
      </div>
    </div>
  );
}
