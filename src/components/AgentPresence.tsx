import { cn } from '@/lib/utils';
import presenceImg from '@/assets/lampstand-presence.png';

export type AgentMode = 'idle' | 'listening' | 'thinking' | 'speaking' | 'muted' | 'disabled' | 'error';

interface AgentPresenceProps {
  mode?: AgentMode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  intensity?: number;
}

const sizes = {
  sm: 'w-16 h-16',
  md: 'w-28 h-28',
  lg: 'w-40 h-40',
};

export function AgentPresence({ mode = 'idle', className = '', size = 'md', intensity = 0.5 }: AgentPresenceProps) {
  const getAnimationClass = () => {
    switch (mode) {
      case 'listening': return 'animate-pulse scale-105 opacity-100 transition-all duration-700';
      case 'thinking': return 'animate-spin-slow opacity-80 scale-95 transition-all duration-1000';
      case 'speaking': return 'transition-all duration-150';
      case 'muted': return 'opacity-40 scale-90 grayscale-[30%] transition-all duration-1000';
      case 'disabled': return 'opacity-20 grayscale transition-all duration-1000';
      case 'error': return 'animate-pulse opacity-50 bg-destructive/20';
      case 'idle':
      default: return 'animate-glow-pulse opacity-80 transition-all duration-1000';
    }
  };

  const speakingStyle = mode === 'speaking' ? {
    transform: `scale(${1 + (intensity * 0.15)})`,
    opacity: 0.7 + (intensity * 0.3),
    filter: `brightness(${1 + (intensity * 0.2)})`
  } : {};

  return (
    <div className={cn('relative flex items-center justify-center', sizes[size], className)}>
      <div
        className={cn(
          "absolute inset-0 rounded-full blur-[40px] transition-all duration-500",
          mode === 'muted' || mode === 'disabled' ? 'bg-muted' : 'bg-[radial-gradient(circle,hsl(var(--warm-glow)/0.6),hsl(var(--sacred-gold)/0.2),transparent)]',
          mode === 'error' && 'bg-[radial-gradient(circle,hsl(var(--destructive)/0.3),transparent)]',
          getAnimationClass()
        )}
        style={speakingStyle}
      />
      <img
        src={presenceImg}
        alt="LampStand Presence"
        className={cn(
          'relative z-10 w-full h-full object-contain mix-blend-screen transition-all duration-500',
          mode === 'muted' || mode === 'disabled' ? 'opacity-40' : 'opacity-90',
          mode === 'listening' ? 'scale-105 filter drop-shadow-[0_0_15px_rgba(255,200,100,0.6)]' : '',
          mode === 'thinking' ? 'opacity-70 scale-95 filter drop-shadow-[0_0_8px_rgba(255,180,50,0.4)]' : ''
        )}
        style={mode === 'speaking' ? speakingStyle : {}}
      />
    </div>
  );
}
