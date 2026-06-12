import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const MarketingPage: React.FC = () => {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);

  // Track pointer relative to the page; drive the obsidian "wipe" + amber glow.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // Default the spotlight near the lamp wick on the right so the page reads
    // beautifully on first paint, before any cursor movement.
    const setXY = (x: number, y: number) => {
      el.style.setProperty('--x', `${x}px`);
      el.style.setProperty('--y', `${y}px`);
    };
    setXY(window.innerWidth * 0.78, window.innerHeight * 0.42);

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const bounds = el.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setXY(x, y));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Irregular, asymmetric "candle glow" mask: three offset, differently-sized
  // radial gradients composited together so the reveal never looks geometric.
  const wipeMask =
    'radial-gradient(190px 150px at calc(var(--x,50%) - 14px) calc(var(--y,50%) + 22px), #000 18%, rgba(0,0,0,0.55) 55%, transparent 88%),' +
    'radial-gradient(120px 170px at calc(var(--x,50%) + 28px) calc(var(--y,50%) - 18px), #000 14%, rgba(0,0,0,0.5) 58%, transparent 90%),' +
    'radial-gradient(80px 90px  at calc(var(--x,50%) + 42px) calc(var(--y,50%) + 36px), #000 10%, transparent 85%)';

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen w-full bg-[#050505] text-[#f4eadd] font-serif overflow-hidden"
    >
      {/* ===== LAYER 1: Bible text spread across entire page ===== */}
      <img
        src="/images/bible_texture.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover z-[10] select-none pointer-events-none"
      />

      {/* ===== LAYER 2: Cross silhouette, dead-center on the page ===== */}
      <div className="absolute inset-0 z-[20] flex items-center justify-center pointer-events-none">
        <img
          src="/images/cross_silhouette.png"
          alt=""
          aria-hidden="true"
          className="h-[78vh] max-h-[820px] w-auto object-contain opacity-95"
          style={{ filter: 'brightness(0)' }}
        />
      </div>

      {/* ===== LAYER 3: Obsidian mask — fixed full-viewport wipe ===== */}
      <div
        className="fixed inset-0 z-[30] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, #0b0a0c 0%, #050505 55%, #020203 100%)',
          WebkitMaskImage: wipeMask,
          maskImage: wipeMask,
          WebkitMaskComposite: 'source-over',
          maskComposite: 'add',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        } as React.CSSProperties}
      />

      {/* ===== LAYER 4: Amber candle illumination following pointer ===== */}
      <div
        className="fixed inset-0 z-[35] pointer-events-none mix-blend-screen"
        style={{
          background:
            'radial-gradient(220px 180px at calc(var(--x,50%) - 10px) calc(var(--y,50%) + 18px), rgba(249,115,22,0.55), rgba(234,88,12,0.25) 45%, transparent 78%),' +
            'radial-gradient(140px 120px at calc(var(--x,50%) + 22px) calc(var(--y,50%) - 12px), rgba(255,176,80,0.45), transparent 80%),' +
            'radial-gradient(90px 70px  at calc(var(--x,50%) + 6px)  calc(var(--y,50%) + 4px),  rgba(255,220,170,0.55), transparent 85%)',
          transition: 'background 60ms linear',
        }}
      />

      {/* ===== LAYER 5: Header / Nav ===== */}
      <header className="absolute top-0 left-0 w-full p-6 md:p-8 flex justify-between items-center z-[70]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border border-[#f97316]/40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span className="text-[#f97316] text-base">🔥</span>
          </div>
          <span className="text-xl md:text-2xl font-medium tracking-wide">LampStand</span>
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="text-sm tracking-widest uppercase hover:text-[#f97316] transition-colors"
        >
          Log In
        </button>
      </header>

      {/* ===== LAYER 6: Split hero content ===== */}
      <div className="relative z-[60] min-h-screen w-full flex flex-col md:flex-row items-center">
        {/* Left: text block */}
        <div className="w-full md:w-1/2 px-8 md:px-16 lg:px-24 pt-28 md:pt-0">
          <div className="max-w-xl">
            <div className="inline-block px-4 py-1.5 rounded-full border border-[#f97316]/30 bg-black/40 backdrop-blur-sm mb-8 text-xs tracking-widest uppercase text-[#f4eadd]/80">
              <span className="text-[#f97316] mr-2">•</span> A Catholic-Friendly Scripture Companion
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal leading-[0.95] mb-6 tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              Walk into the <br />
              <span className="italic bg-gradient-to-r from-[#fbbf24] via-[#f97316] to-[#ea580c] bg-clip-text text-transparent">
                Light.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[#f4eadd]/85 mb-10 leading-relaxed max-w-md drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              LampStand is a quiet, intelligent companion for daily scripture and warm pastoral
              conversation. No noise. Just the Word, and a steady voice beside you.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/auth')}
                className="px-8 py-4 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-[0_10px_40px_-10px_rgba(249,115,22,0.6)]"
              >
                Light your lamp <span>→</span>
              </button>
              <button
                onClick={() => navigate('/lite?source=web')}
                className="px-8 py-4 border border-[#f4eadd]/25 rounded-lg hover:bg-[#f4eadd]/5 transition-colors text-sm bg-black/30 backdrop-blur-sm"
              >
                Try without signing up
              </button>
            </div>
          </div>
        </div>

        {/* Right: lampstand hero with animated flame */}
        <div className="w-full md:w-1/2 relative flex items-center justify-center min-h-[60vh] md:min-h-screen">
          <div className="relative w-[88%] max-w-[640px] aspect-square">
            <img
              src="/images/lampstand.png"
              alt="Golden lampstand"
              className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
            />

            {/* Animated teardrop flame at the wick */}
            <div
              className="absolute top-[34.5%] left-[72%] w-4 h-9 origin-bottom pointer-events-none animate-realistic-fire"
              style={{
                borderRadius: '50% 50% 20% 20% / 80% 80% 30% 30%',
                background:
                  'radial-gradient(circle at 50% 100%, rgba(255,255,255,1) 0%, rgba(255,255,0,1) 15%, rgba(249,115,22,1) 40%, rgba(234,88,12,0.8) 70%, rgba(10,10,10,0) 100%)',
                mixBlendMode: 'screen',
                boxShadow:
                  '0 -2px 14px 2px rgba(249,115,22,0.85), 0 -8px 30px 6px rgba(234,88,12,0.55), 0 -16px 60px 12px rgba(249,115,22,0.35)',
                filter: 'blur(1px)',
              } as React.CSSProperties}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-4 bg-blue-500 rounded-full blur-[2px] opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;
