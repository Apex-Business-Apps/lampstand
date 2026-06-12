import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const MarketingPage: React.FC = () => {
  const navigate = useNavigate();
  const maskRef = useRef<HTMLDivElement>(null);

  // Global Tracking Engine (Bypasses React state lag)
  useEffect(() => {
    const updateCoordinates = (e: MouseEvent) => {
      if (maskRef.current) {
        const bounds = maskRef.current.getBoundingClientRect();
        const cursorX = e.clientX - bounds.left;
        const cursorY = e.clientY - bounds.top;
        maskRef.current.style.setProperty('--x', `${cursorX}px`);
        maskRef.current.style.setProperty('--y', `${cursorY}px`);
      }
    };
    window.addEventListener('mousemove', updateCoordinates);
    return () => window.removeEventListener('mousemove', updateCoordinates);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-[#f4eadd] font-serif overflow-hidden flex flex-col md:flex-row">

      {/* =========================================
      LEFT HEMISPHERE: UI & TYPOGRAPHY
      ========================================= */}
      <div className="relative w-full md:w-1/2 min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 z-[60]">

        {/* Header/Nav */}
        <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-[60]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#f97316]/30 flex items-center justify-center">
              <span className="text-[#f97316] text-sm">🔥</span>
            </div>
            <span className="text-xl font-medium tracking-wide">LampStand</span>
          </div>
          <button 
            onClick={() => navigate('/auth')} 
            className="text-sm tracking-widest hover:text-[#f97316] transition-colors"
          >
            Log In
          </button>
        </div>

        {/* Hero Content */}
        <div className="max-w-xl relative z-[60]">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[#f97316]/20 bg-[#f97316]/5 mb-8 text-xs tracking-widest uppercase text-[#f4eadd]/70">
            <span className="text-[#f97316] mr-2">•</span> A Catholic-Friendly Scripture Companion
          </div>

          <h1 className="text-6xl md:text-7xl font-normal leading-tight mb-4 tracking-tight">
            Walk into the <br/>
            <span className="text-[#f97316] italic">Light.</span>
          </h1>

          <p className="text-lg text-[#f4eadd]/70 mb-10 leading-relaxed max-w-md">
            LampStand is a quiet, intelligent companion for daily scripture and warm pastoral conversation. No noise. Just the word, and a steady voice beside you.
          </p>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/auth')} 
              className="px-8 py-4 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Light your lamp <span>→</span>
            </button>
            <button 
              onClick={() => navigate('/lite?source=web')} 
              className="px-8 py-4 border border-[#f4eadd]/20 rounded-lg hover:bg-[#f4eadd]/5 transition-colors text-sm"
            >
              Try without signing up
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
      RIGHT HEMISPHERE: ILLUMINATION PHYSICS
      ========================================= */}
      <div className="relative w-full h-full isolate overflow-hidden bg-[#050505]">
        {/* LAYER 20: SCRIPTURE MASK SIBLING */}
        <div ref={maskRef} className="absolute inset-0 w-full h-full z-[20] pointer-events-none mix-blend-screen" style={{ WebkitMaskImage: 'radial-gradient(150px 110px at calc(var(--x, 50%) - 10px) calc(var(--y, 50%) + 10px), black 30%, transparent 80%), radial-gradient(110px 150px at calc(var(--x, 50%) + 20px) calc(var(--y, 50%) - 15px), black 30%, transparent 80%)', maskImage: 'radial-gradient(150px 110px at calc(var(--x, 50%) - 10px) calc(var(--y, 50%) + 10px), black 30%, transparent 80%), radial-gradient(110px 150px at calc(var(--x, 50%) + 20px) calc(var(--y, 50%) - 15px), black 30%, transparent 80%)', WebkitMaskComposite: 'source-over', maskComposite: 'add', transition: 'none' }}>
          {/* Amber Fire Tint Overlays */}
          <div className="absolute inset-0 bg-[#f97316]/30 mix-blend-color-burn pointer-events-none"></div>
          <div className="absolute inset-0 bg-[#ea580c]/25 mix-blend-overlay pointer-events-none"></div>
          <img src="/regular_bible_texture.png" alt="Scripture Background" className="absolute inset-0 w-full h-full object-cover opacity-100" style={{ transform: 'none !important', perspective: 'none !important', borderRadius: '0 !important', filter: 'none !important' }} />
        </div>

        {/* LAYER 30: CENTERPIECE CROSS (RESTORED) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-48 z-[30] opacity-100 pointer-events-none flex flex-col items-center justify-center mix-blend-multiply">
          <div className="absolute w-8 h-48 bg-[#050505]"></div>
          <div className="absolute w-32 h-8 bg-[#050505] top-12"></div>
        </div>

        {/* LAYER 50: LAMPSTAND & FLAME SIBLING */}
        <div className="absolute inset-0 z-[50] flex items-center justify-center pointer-events-none">
          <div className="relative w-full max-w-[800px] aspect-square pointer-events-auto">
            {/* Lampstand Base - Black background blocked via mix-blend-screen */}
            <img src="/images/lampstand.png" alt="Lamp Stand" className="absolute inset-0 w-full h-full object-contain z-[50] mix-blend-screen" style={{ clipPath: 'polygon(0 0, 81% 0, 81% 100%, 0 100%)' }} />
            {/* CSS Teardrop Flame */}
            <div className="absolute top-[34.5%] left-[72%] w-4 h-9 z-[60] origin-bottom pointer-events-none animate-realistic-fire" style={{ borderRadius: '50% 50% 20% 20% / 80% 80% 30% 30%', background: 'radial-gradient(circle at 50% 100%, rgba(255,255,255,1) 0%, rgba(255,255,0,1) 15%, rgba(249,115,22,1) 40%, rgba(234,88,12,0.8) 70%, rgba(10,10,10,0) 100%)', mixBlendMode: 'screen', boxShadow: '0 -2px 10px 1px rgba(249,115,22,0.7), 0 -5px 15px 2px rgba(234,88,12,0.5)', filter: 'blur(1px)' }}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-4 bg-blue-500 rounded-full blur-[2px] opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;
