import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { HerodianLamp } from './HerodianLamp';
import { LampFlame } from './LampFlame';

interface LampScene3DProps {
  className?: string;
}

const MAX_TILT_Y = 9; // deg, toward the pointer
const MAX_TILT_X = 5;
const EASE = 0.055; // lerp factor — slow, weighty, graceful

/**
 * The hero's living centerpiece: a circa-30AD Herodian clay lamp on a 3D
 * stage. Idle, it levitates and sways on offset timelines; under a pointer
 * it turns gently toward the light's keeper. The flame burns calm at the
 * nozzle — steady, not nervous.
 */
export function LampScene3D({ className }: LampScene3DProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const pivotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const pivot = pivotRef.current;
    if (!scene || !pivot) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const surface = scene.closest('section') ?? scene.parentElement ?? scene;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let raf = 0;
    let settled = true;

    const tick = () => {
      curX += (targetX - curX) * EASE;
      curY += (targetY - curY) * EASE;
      pivot.style.transform = `rotateY(${curY.toFixed(3)}deg) rotateX(${curX.toFixed(3)}deg)`;
      if (Math.abs(targetX - curX) + Math.abs(targetY - curY) > 0.01) {
        raf = requestAnimationFrame(tick);
      } else {
        settled = true;
      }
    };
    const wake = () => {
      if (settled) {
        settled = false;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = scene.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetY = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width * 0.9))) * MAX_TILT_Y;
      targetX = Math.max(-1, Math.min(1, -(e.clientY - cy) / (rect.height * 0.9))) * MAX_TILT_X;
      wake();
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      wake();
    };

    surface.addEventListener('pointermove', onMove as EventListener);
    surface.addEventListener('pointerleave', onLeave);
    return () => {
      surface.removeEventListener('pointermove', onMove as EventListener);
      surface.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={sceneRef} className={cn('lamp-scene', className)} aria-hidden="true">
      <div className="lamp-scene__halo" />
      <div ref={pivotRef} className="lamp-scene__pivot">
        <div className="lamp-scene__sway">
          <div className="lamp-scene__float">
            <div className="relative mx-auto w-72 sm:w-[22rem]">
              {/* flame rising from the charred wick at the left nozzle */}
              <LampFlame
                className="absolute bottom-[46%] left-[20%] z-10 h-32 w-32 -translate-x-1/2 sm:h-36 sm:w-36"
                withBase={false}
              />
              <HerodianLamp />
            </div>
          </div>
        </div>
      </div>
      {/* light pooling on the unseen ground */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-8 mx-auto h-20 w-[85%] rounded-full bg-[radial-gradient(ellipse,hsl(var(--warm-glow)/0.26),transparent_70%)] blur-lg" />
    </div>
  );
}
