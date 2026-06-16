import React from "react";

/**
 * CandleRevealCanvas — global obsidian mask with pointer-tracked candlelight glow.
 *
 * Single full-viewport fixed canvas (z-100). Every frame it:
 *   1. Fills the entire canvas with fully opaque #0a0a0a.
 *   2. Melts a soft, ORGANIC, noise-distorted glow around the pointer
 *      (destination-out + blurred radial falloff) — a glow, never a spotlight.
 *   3. Washes the whole illuminated surface in warm amber (flames are not white)
 *      with a halo that bleeds past the reveal onto the dark mask.
 *   4. Static punch-out at the lamp's fixed screen position — the lamp is a real
 *      light source, it permanently illuminates the text beneath it.
 *
 * The glow breathes ±10px and each vertex carries its own phase/frequency,
 * simulating the irregular pool of light from a single candle flame.
 *
 * Mounted once at the top level of the landing page — not inside any section.
 */

const VERTS = 16;          // vertices in the organic polygon
const BASE_RADIUS = 110;   // px — intimate candlelight, not a spotlight
const VERT_VARIATION = 26; // px — per-vertex radius offset amplitude
const BREATH = 10;         // px — global breathing oscillation
const EDGE_BLUR = 24;      // px — feathering of the reveal edge (soft glow)

type Vert = { p1: number; p2: number; f1: number; f2: number; amp: number };

export default function CandleRevealCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pos = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.45 };
    const target = { x: pos.x, y: pos.y };

    // Per-vertex pseudo-random phases/frequencies → value-noise style edge
    const verts: Vert[] = Array.from({ length: VERTS }, (_, i) => {
      const seed = Math.sin(i * 127.1 + 311.7) * 43758.5453;
      const r = seed - Math.floor(seed);
      return {
        p1: r * Math.PI * 2,
        p2: r * 17.3,
        f1: 1.1 + r * 1.6,
        f2: 2.3 + ((r * 7.9) % 1) * 2.1,
        amp: 0.55 + r * 0.45,
      };
    });

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }

    function onPointer(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
    }

    /** Build the organic blob path at a given scale. Returns max radius used. */
    function blobPath(t: number, cx: number, cy: number, scale: number): number {
      const breath = Math.sin(t * 1.7) * BREATH * 0.6 + Math.sin(t * 2.9 + 1.3) * BREATH * 0.4;
      const radii: number[] = [];
      let maxR = 0;
      for (let i = 0; i < VERTS; i++) {
        const v = verts[i];
        const n = Math.sin(t * v.f1 + v.p1) * 0.6 + Math.sin(t * v.f2 + v.p2) * 0.4;
        const r = (BASE_RADIUS + breath + n * VERT_VARIATION * v.amp) * scale;
        radii.push(r);
        if (r > maxR) maxR = r;
      }
      const pts = radii.map((r, i) => {
        const a = (i / VERTS) * Math.PI * 2;
        return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
      });
      ctx.beginPath();
      const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
      });
      let m = mid(pts[VERTS - 1], pts[0]);
      ctx.moveTo(m.x, m.y);
      for (let i = 0; i < VERTS; i++) {
        const next = pts[(i + 1) % VERTS];
        m = mid(pts[i], next);
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, m.x, m.y);
      }
      ctx.closePath();
      return maxR;
    }

    function draw(now: number) {
      const t = now / 1000;
      pos.x += (target.x - pos.x) * 0.22;
      pos.y += (target.y - pos.y) * 0.22;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = window.innerWidth;
      const h = window.innerHeight;

      // 1 — fully opaque obsidian mask, edge to edge
      ctx.globalCompositeOperation = "source-over";
      ctx.filter = "none";
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, w, h);

      // 2 — cursor blob: melt the glow out of the mask
      ctx.globalCompositeOperation = "destination-out";
      ctx.filter = `blur(${EDGE_BLUR}px)`;
      const maxR = blobPath(t, pos.x, pos.y, 1);
      const punch = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, maxR * 1.1);
      punch.addColorStop(0, "rgba(0,0,0,1)");
      punch.addColorStop(0.5, "rgba(0,0,0,0.9)");
      punch.addColorStop(0.8, "rgba(0,0,0,0.5)");
      punch.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = punch;
      ctx.fill();

      // 3 — cursor amber wash
      ctx.globalCompositeOperation = "source-over";
      ctx.filter = `blur(${EDGE_BLUR + 6}px)`;
      blobPath(t, pos.x, pos.y, 1.35);
      const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, maxR * 1.45);
      glow.addColorStop(0, "rgba(235,140,60,0.30)");
      glow.addColorStop(0.45, "rgba(220,120,45,0.22)");
      glow.addColorStop(0.75, "rgba(190,95,35,0.12)");
      glow.addColorStop(1, "rgba(160,75,25,0)");
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.filter = "none";
      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
    />
  );
}
