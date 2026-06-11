import { cn } from '@/lib/utils';

interface CrossSilhouetteProps {
  className?: string;
}

/**
 * A quiet cross standing in the dark — a silhouette rimmed by faint dawn
 * light from behind. Meant to be barely noticed, then never forgotten.
 */
export function CrossSilhouette({ className }: CrossSilhouetteProps) {
  return (
    <div className={cn('pointer-events-none relative flex items-center justify-center', className)} aria-hidden="true">
      {/* light breaking from behind the cross */}
      <div className="absolute h-[120%] w-[160%] rounded-full bg-[radial-gradient(circle,hsl(var(--sacred-gold)/0.085)_0%,hsl(var(--warm-glow)/0.035)_45%,transparent_70%)]" />
      <svg viewBox="0 0 140 260" className="relative h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* silhouette, darker than the night behind it */}
        <path
          d="M61 16 h18 v54 h48 v18 h-48 v156 h-18 V88 H13 V70 h48 Z"
          fill="hsl(26 36% 4.5%)"
        />
        {/* rim light catching the edges */}
        <path
          d="M61 16 h18 v54 h48 v18 h-48 v156 h-18 V88 H13 V70 h48 Z"
          stroke="hsl(42 70% 60% / 0.22)"
          strokeWidth="1.4"
        />
      </svg>
    </div>
  );
}
