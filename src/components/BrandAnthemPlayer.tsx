import React, { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/* ── BrandAnthemPlayer ────────────────────────────────────────────────────────
 *  Sticky ambient music player — marketing hero only (mounted in MarketingPage).
 *  z-[500] — topmost layer, on par with modals. ConsentModal overlay (same z, later DOM) still
 *  covers the player when open; once dismissed the player is always reachable.
 *  Positioned bottom-left so it never collides with the FloatingAgent FAB (bottom-right).
 *  Cleans up on unmount so audio stops when the user navigates away.
 * ─────────────────────────────────────────────────────────────────────────── */
export function BrandAnthemPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;
    // Attempt autoplay on landing; browsers may block — handled gracefully.
    audio.play().then(() => setPlaying(true)).catch(() => {});
    return () => {
      audio.pause();
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <div
      className={`pointer-events-auto fixed bottom-6 left-6 z-[500] flex items-center gap-2.5 rounded-full border bg-[#0a0a0a]/85 px-3.5 py-2 shadow-[0_2px_16px_-4px_rgba(242,166,73,0.25)] backdrop-blur-md transition-all duration-300 ${
        playing
          ? "border-[#D97736]/60 shadow-[0_0_14px_-2px_rgba(242,166,73,0.35)]"
          : "border-[#D97736]/25"
      }`}
    >
      <audio ref={audioRef} src="/brand-anthem.mp3" loop preload="metadata" />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause anthem" : "Play anthem"}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#F2A649] to-[#D97736] text-[#0a0a0a] transition-transform hover:scale-105 active:scale-95"
      >
        {playing ? (
          <Pause className="h-3.5 w-3.5 fill-current" />
        ) : (
          <Play className="h-3.5 w-3.5 fill-current" />
        )}
      </button>
      <div className="flex flex-col leading-tight">
        <span className="select-none text-[11px] font-semibold text-[#d0d0d0]">
          The Lamp's Light
        </span>
        <span className="select-none text-[9px] font-medium uppercase tracking-[0.14em] text-[#6a6a6a]">
          by JR
        </span>
      </div>
    </div>
  );
}
