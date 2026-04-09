import { useRef, useEffect, useCallback } from 'react';

interface BurningBushCanvasProps {
  intensity: number; // 0-1 audio amplitude
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export function BurningBushCanvas({ intensity, className = '' }: BurningBushCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const intensityRef = useRef(intensity);

  // Keep intensity ref in sync without re-running animation loop
  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  const createParticle = useCallback((w: number, h: number, amp: number): Particle => {
    const centerX = w / 2;
    const baseY = h * 0.72;
    const spread = 40 + amp * 80;

    return {
      x: centerX + (Math.random() - 0.5) * spread,
      y: baseY + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * (1 + amp * 2),
      vy: -(1.5 + Math.random() * 3 + amp * 4),
      life: 0,
      maxLife: 40 + Math.random() * 60 + amp * 30,
      size: 2 + Math.random() * 6 + amp * 8,
      hue: 15 + Math.random() * 30, // orange-gold range
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = particlesRef.current;

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const amp = intensityRef.current;

      // Clear with fade trail — brighter base (#1a1610)
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(26, 22, 16, 0.15)';
      ctx.fillRect(0, 0, w, h);

      // Spawn particles — more when speaking
      const spawnCount = Math.floor(2 + amp * 12);
      for (let i = 0; i < spawnCount; i++) {
        if (particles.length < 400) {
          particles.push(createParticle(w, h, amp));
        }
      }

      // Draw glow base
      const centerX = w / 2;
      const baseY = h * 0.72;
      const glowRadius = 80 + amp * 120;
      const glowGrad = ctx.createRadialGradient(centerX, baseY - 60, 10, centerX, baseY - 60, glowRadius);
      glowGrad.addColorStop(0, `hsla(36, 90%, 65%, ${0.3 + amp * 0.4})`);
      glowGrad.addColorStop(0.4, `hsla(25, 80%, 50%, ${0.15 + amp * 0.2})`);
      glowGrad.addColorStop(1, 'transparent');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      // Update & draw particles
      ctx.globalCompositeOperation = 'lighter';
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx + Math.sin(p.life * 0.1) * (0.5 + amp);
        p.y += p.vy;
        p.vy *= 0.98;
        p.size *= 0.985;

        const progress = p.life / p.maxLife;
        const alpha = progress < 0.1 ? progress * 10 : Math.max(0, 1 - progress);

        if (p.life >= p.maxLife || p.size < 0.5) {
          particles.splice(i, 1);
          continue;
        }

        // Core bright particle
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        const lightness = 60 + (1 - progress) * 30;
        grad.addColorStop(0, `hsla(${p.hue + (1 - progress) * 15}, 95%, ${lightness}%, ${alpha * 0.9})`);
        grad.addColorStop(0.5, `hsla(${p.hue}, 80%, ${lightness - 15}%, ${alpha * 0.5})`);
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Inner flame core — bright white-gold center
      const coreSize = 15 + amp * 25;
      const coreGrad = ctx.createRadialGradient(centerX, baseY - 30, 0, centerX, baseY - 30, coreSize);
      coreGrad.addColorStop(0, `hsla(45, 100%, 95%, ${0.6 + amp * 0.4})`);
      coreGrad.addColorStop(0.3, `hsla(40, 90%, 70%, ${0.3 + amp * 0.3})`);
      coreGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, baseY - 30, coreSize, 0, Math.PI * 2);
      ctx.fill();

      // Ember sparks on high intensity
      if (amp > 0.4) {
        for (let i = 0; i < Math.floor(amp * 5); i++) {
          const sx = centerX + (Math.random() - 0.5) * 60;
          const sy = baseY - 50 - Math.random() * 100 * amp;
          const ss = 1 + Math.random() * 2;
          ctx.fillStyle = `hsla(42, 100%, 80%, ${0.4 + Math.random() * 0.4})`;
          ctx.beginPath();
          ctx.arc(sx, sy, ss, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
