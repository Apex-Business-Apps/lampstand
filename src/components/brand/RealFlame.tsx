import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * A real flame, painted: layered translucent flame bodies whose outlines are
 * deformed each frame by low-frequency noise — laminar and calm like an oil
 * wick, not a cartoon teardrop. Additive compositing gives the gas-glow core,
 * a faint blue combustion ring sits at the base, and a wide warm halo breathes
 * around it. Exported as a painter so WebGL can use the same canvas as a
 * live texture.
 */

/** Smooth pseudo-noise from stacked sines — cheap, organic, loopless. */
function drift(seed: number, t: number) {
  return (
    Math.sin(t * 1.1 + seed * 12.9) * 0.5 +
    Math.sin(t * 2.3 + seed * 7.3) * 0.32 +
    Math.sin(t * 4.1 + seed * 3.7) * 0.18
  );
}

export interface FlamePainter {
  /** Advance time (seconds) and repaint. */
  draw: (dt: number) => void;
  canvas: HTMLCanvasElement;
}

export function createFlamePainter(
  canvas: HTMLCanvasElement,
  { halo = true }: { halo?: boolean } = {},
): FlamePainter {
  const ctx = canvas.getContext('2d')!;
  let t = Math.random() * 100;

  type Layer = {
    scale: number;
    blur: number;
    stops: Array<[number, string]>;
  };
  const layers: Layer[] = [
    {
      scale: 1,
      blur: 5,
      stops: [
        [0, 'rgba(255, 84, 8, 0.0)'],
        [0.22, 'rgba(255, 96, 12, 0.55)'],
        [0.6, 'rgba(255, 140, 26, 0.82)'],
        [1, 'rgba(255, 170, 40, 0.0)'],
      ],
    },
    {
      scale: 0.74,
      blur: 2,
      stops: [
        [0, 'rgba(255, 150, 30, 0.1)'],
        [0.35, 'rgba(255, 192, 64, 0.9)'],
        [0.85, 'rgba(255, 224, 120, 0.95)'],
        [1, 'rgba(255, 236, 160, 0.0)'],
      ],
    },
    {
      scale: 0.46,
      blur: 0,
      stops: [
        [0, 'rgba(255, 214, 110, 0.2)'],
        [0.4, 'rgba(255, 244, 200, 0.96)'],
        [0.9, 'rgba(255, 252, 235, 1)'],
        [1, 'rgba(255, 255, 245, 0.0)'],
      ],
    },
  ];

  function flameBody(cx: number, baseY: number, W: number, H: number, s: number, time: number, seed: number) {
    const tipX = cx + drift(3 + seed, time) * W * 0.22;
    const tipY = baseY - H * s * (1 + drift(4 + seed, time) * 0.04);
    const midL = drift(5 + seed, time * 1.3) * W * 0.1;
    const midR = drift(6 + seed, time * 1.3) * W * 0.1;
    const w = W * s;
    // narrow at the wick, swelling at the waist, tapering to the tip —
    // the profile of a real laminar flame
    const baseW = w * 0.55;

    ctx.beginPath();
    ctx.moveTo(cx - baseW, baseY - H * 0.04 * s);
    ctx.bezierCurveTo(
      cx - w * 1.08, baseY - H * 0.38 * s,
      cx - w * 0.46 + midL, baseY - H * 0.78 * s,
      tipX, tipY,
    );
    ctx.bezierCurveTo(
      cx + w * 0.46 + midR, baseY - H * 0.78 * s,
      cx + w * 1.08, baseY - H * 0.38 * s,
      cx + baseW, baseY - H * 0.04 * s,
    );
    ctx.quadraticCurveTo(cx, baseY + H * 0.012, cx - baseW, baseY - H * 0.04 * s);
    ctx.closePath();
  }

  function draw(dt: number) {
    t += dt;
    const w = canvas.width;
    const h = canvas.height;
    if (w === 0 || h === 0) return;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2 + drift(1, t * 0.7) * w * 0.012;
    const baseY = h * 0.93;
    const H = h * 0.82 * (1 + drift(2, t) * 0.035);
    const W = w * 0.14 * (1 + drift(7, t * 1.6) * 0.05);

    // ambient halo — kept well inside the canvas so no edge ever shows
    if (halo) {
      const r = Math.min(w, h) * 0.48;
      const hy = baseY - H * 0.42;
      const g = ctx.createRadialGradient(cx, hy, 0, cx, hy, r);
      g.addColorStop(0, `rgba(255, 158, 44, ${0.3 + drift(8, t) * 0.05})`);
      g.addColorStop(0.5, 'rgba(255, 130, 30, 0.1)');
      g.addColorStop(1, 'rgba(255, 120, 20, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.globalCompositeOperation = 'lighter';

    // blue combustion ring at the wick — tight and faint
    const blue = ctx.createRadialGradient(cx, baseY - H * 0.04, 0, cx, baseY - H * 0.04, W * 1.05);
    blue.addColorStop(0, 'rgba(96, 138, 255, 0.26)');
    blue.addColorStop(0.55, 'rgba(70, 100, 230, 0.1)');
    blue.addColorStop(1, 'rgba(60, 80, 200, 0)');
    ctx.fillStyle = blue;
    ctx.beginPath();
    ctx.ellipse(cx, baseY - H * 0.04, W * 1.05, W * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const grad = ctx.createLinearGradient(0, baseY, 0, baseY - H * layer.scale);
      for (const [pos, color] of layer.stops) grad.addColorStop(pos, color);
      ctx.save();
      if (layer.blur > 0 && 'filter' in ctx) ctx.filter = `blur(${layer.blur}px)`;
      ctx.fillStyle = grad;
      flameBody(cx, baseY, W, H, layer.scale, t, i * 11);
      ctx.fill();
      ctx.restore();
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  return { draw, canvas };
}

interface RealFlameProps {
  className?: string;
}

/** DOM-mounted realistic flame. Size with width/height classes. */
export function RealFlame({ className }: RealFlameProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const painter = createFlamePainter(canvas);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      painter.draw(0.016);
      return () => ro.disconnect();
    }

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      painter.draw(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={cn('pointer-events-none', className)} aria-hidden="true" />;
}
