import { cn } from '@/lib/utils';
import type { RuntimeState } from '@/lib/runtime/agentRuntime';

interface AgentPresenceProps {
  state: RuntimeState;
  muted?: boolean;
  intensity?: number;
  reducedMotion?: boolean;
}

export function AgentPresence({ state, muted, intensity = 0.5, reducedMotion = false }: AgentPresenceProps) {
  const scale = state === 'speaking' ? 1 + intensity * 0.14 : 1;
  return (
    <div className="relative mx-auto h-24 w-24">
      <div
        className={cn('absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-orange-300 to-amber-500 opacity-80',
          !reducedMotion && state !== 'disabled' && 'animate-agent-presence')}
        style={{ transform: `scale(${scale})`, animationPlayState: reducedMotion ? 'paused' : 'running' }}
      />
      <div className="absolute inset-3 rounded-full bg-background/80 backdrop-blur-sm" />
      <div className="absolute inset-0 flex items-center justify-center text-xs font-ui text-foreground/70">
        {muted ? 'Muted' : state}
      </div>
    </div>
  );
}
