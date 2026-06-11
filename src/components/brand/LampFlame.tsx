import { cn } from '@/lib/utils';

interface LampFlameProps {
  className?: string;
  /** Render the small gold base bar beneath the flame */
  withBase?: boolean;
}

/**
 * Pure-CSS animated flame — three teardrop layers breathing gently over a
 * pulsing halo, with a slow sway. Size with width/height utilities.
 */
export function LampFlame({ className, withBase = true }: LampFlameProps) {
  return (
    <div className={cn('lamp-flame', className)} aria-hidden="true">
      <div className="lamp-flame__halo" />
      <div className="lamp-flame__layers">
        <div className="lamp-flame__layer lamp-flame__outer" />
        <div className="lamp-flame__layer lamp-flame__mid" />
        <div className="lamp-flame__layer lamp-flame__core" />
      </div>
      {withBase && <div className="lamp-flame__base" />}
    </div>
  );
}
