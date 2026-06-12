import React, { useRef, useCallback } from "react";
import { ArrowRight, Flame, HeartHandshake, PlayCircle, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: Sun,
    title: "Daily Light",
    description:
      "A fresh scripture passage and a short, grounded reflection — ready every morning in under three minutes.",
  },
  {
    icon: HeartHandshake,
    title: "Pastoral Guidance",
    description:
      "Ask anything — doubt, grief, decisions, joy. Get scripture-first answers in a warm, non-judgmental voice.",
  },
  {
    icon: PlayCircle,
    title: "Sermon Mode",
    description:
      "Turn any passage into a structured, spoken teaching for study groups, devotionals, or the drive to work.",
  },
];

const journey = [
  {
    step: "01",
    title: "Choose your tone",
    description:
      "Set your spiritual voice once, then LampStand keeps every reflection consistent with it.",
  },
  {
    step: "02",
    title: "Receive focused guidance",
    description:
      "Ask one question, get scripture-first insight, prayer, and a practical next action.",
  },
  {
    step: "03",
    title: "Build momentum",
    description:
      "Save passages, keep a journal, and carry one clear thought through your day.",
  },
];

export default function MarketingPage() {
  const navigate = useNavigate();

  /* ── Refs for the two cursor-reactive layers ───────────────────── */
  const obsidianRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const hasMovedRef = useRef(false);
  const rafRef = useRef<number>(0);

  /* ── Shared cursor update (mouse + touch) ──────────────────────── */
  const updateCursor = useCallback((x: number, y: number) => {
    /* Fade the hint on first interaction */
    if (!hasMovedRef.current) {
      hasMovedRef.current = true;
      if (hintRef.current) {
        hintRef.current.style.opacity = "0";
      }
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const px = `${x}px`;
      const py = `${y}px`;
      obsidianRef.current?.style.setProperty("--mx", px);
      obsidianRef.current?.style.setProperty("--my", py);
      glowRef.current?.style.setProperty("--mx", px);
      glowRef.current?.style.setProperty("--my", py);
    });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => updateCursor(e.clientX, e.clientY),
    [updateCursor],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const t = e.touches[0];
      if (t) updateCursor(t.clientX, t.clientY);
    },
    [updateCursor],
  );

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden bg-[#090a0f] text-foreground selection:bg-[#F2A649]/30"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/*
       * ╔══════════════════════════════════════════════════════════╗
       * ║  LAYER 1 — Scripture texture: always present, full-bleed ║
       * ╚══════════════════════════════════════════════════════════╝
       */}
      <div className="fixed inset-0 z-[1] pointer-events-none" aria-hidden="true">
        <img
          src="/images/bible_texture.png"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.8 }}
          loading="eager"
          decoding="async"
        />
      </div>

      {/*
       * ╔══════════════════════════════════════════════════════════╗
       * ║  LAYER 2 — Cross silhouette: centrepiece, dark void      ║
       * ╚══════════════════════════════════════════════════════════╝
       */}
      <div
        className="fixed inset-0 z-[2] flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="/images/cross_silhouette.png"
          alt=""
          className="object-contain brightness-0"
          style={{ width: "72vmin", height: "auto", opacity: 0.9 }}
          loading="eager"
          decoding="async"
        />
      </div>

      {/*
       * ╔══════════════════════════════════════════════════════════╗
       * ║  LAYER 10 — Obsidian mask: the darkness.                 ║
       * ║  Cursor burns away the mask, revealing scripture below.  ║
       * ║  Initial position is off-screen (--mx:-500px) so the     ║
       * ║  page starts completely dark until the user moves.       ║
       * ╚══════════════════════════════════════════════════════════╝
       *
       * HOW THE MASK WORKS:
       *   mask-image transparent = this layer is invisible  → reveals scripture
       *   mask-image black       = this layer is visible    → shows darkness
       *   Result: a transparent "hole" where the cursor sits.
       */}
      <div
        ref={obsidianRef}
        className="fixed inset-0 z-[10] pointer-events-none will-change-transform"
        style={
          {
            background: "rgba(9,10,15,0.97)",
            WebkitMaskImage:
              "radial-gradient(circle 150px at var(--mx, -500px) var(--my, -500px), transparent 0%, transparent 25%, rgba(0,0,0,0.45) 58%, black 82%)",
            maskImage:
              "radial-gradient(circle 150px at var(--mx, -500px) var(--my, -500px), transparent 0%, transparent 25%, rgba(0,0,0,0.45) 58%, black 82%)",
          } as React.CSSProperties
        }
      />

      {/*
       * ╔══════════════════════════════════════════════════════════╗
       * ║  LAYER 11 — Amber warm glow: the lamp's warmth           ║
       * ║  Adds candlelight colour inside the revealed circle.     ║
       * ╚══════════════════════════════════════════════════════════╝
       */}
      <div
        ref={glowRef}
        className="fixed inset-0 z-[11] pointer-events-none will-change-transform"
        style={
          {
            background:
              "radial-gradient(circle 230px at var(--mx, -500px) var(--my, -500px), rgba(242,166,73,0.22) 0%, rgba(242,166,73,0.07) 55%, transparent 100%)",
            mixBlendMode: "screen",
          } as React.CSSProperties
        }
      />

      {/*
       * ╔══════════════════════════════════════════════════════════╗
       * ║  LAYER 60 — UI: header, hero copy, CTAs                 ║
       * ╚══════════════════════════════════════════════════════════╝
       */}

      {/* Header */}
      <header className="fixed left-8 right-8 top-8 flex items-center justify-between z-[60] lg:left-16 lg:right-16 lg:top-12 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#111] border border-[#333]">
            <Flame className="h-5 w-5 text-[#F2A649]" />
          </div>
          <span className="font-display text-2xl font-semibold tracking-tight sm:text-3xl text-white">
            LampStand
          </span>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate("/auth")}
          className="font-semibold text-[#a0a0a0] hover:text-white"
        >
          Log In
        </Button>
      </header>

      {/* Hero copy — left hemisphere */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 w-full lg:w-[52%] pl-8 pr-8 lg:pl-16 xl:pl-32 flex flex-col justify-center pointer-events-auto z-[60]">
        <div className="flex flex-col gap-6 w-full max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#D97736]/30 bg-[#090a0f]/80 px-4 py-1.5 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F2A649] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F2A649]" />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e0e0e0]">
              A Catholic-friendly scripture companion
            </p>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-tight text-white drop-shadow-xl">
            Walk into the <br />
            <span className="bg-gradient-to-br from-[#F2A649] to-[#D97736] bg-clip-text text-transparent italic pr-4">
              Light.
            </span>
          </h1>

          {/* Body */}
          <p className="font-body text-xl leading-relaxed text-[#a0a0a0] sm:text-2xl font-medium drop-shadow-md">
            LampStand is a quiet, intelligent companion for daily scripture and
            warm pastoral conversation. No noise. Just the word, and a steady
            voice beside you.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button
              size="lg"
              className="h-14 px-8 text-base font-semibold border-none bg-[#D97736] hover:bg-[#c2682d] text-white shadow-[0_4px_20px_-4px_rgba(217,119,54,0.5)]"
              onClick={() => navigate("/onboarding")}
            >
              Light your lamp
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-7 text-base border-[hsl(var(--primary)/0.5)] bg-[#090a0f]/80 text-[#d0d0d0] hover:bg-[#D97736]/15 hover:text-white backdrop-blur"
              onClick={() => navigate("/lite?source=web")}
            >
              Try without signing up
            </Button>
          </div>
        </div>
      </div>

      {/* Cursor discovery hint — fades on first move */}
      <div
        ref={hintRef}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] pointer-events-none select-none"
        style={{ transition: "opacity 0.9s ease" }}
        aria-hidden="true"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a0a0a0]/50 text-center">
          Move your cursor to reveal
        </p>
      </div>

      {/*
       * ╔══════════════════════════════════════════════════════════╗
       * ║  BELOW THE FOLD — scrollable content (z-60, bg-cover)   ║
       * ╚══════════════════════════════════════════════════════════╝
       */}
      <section className="relative mt-[100vh] mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-16 z-[60] bg-background">
        {/* Feature cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item, index) => (
            <article
              key={item.title}
              className="group rounded-2xl border border-border/70 bg-card/80 p-8 transition-all hover:-translate-y-1 hover:border-[hsl(var(--primary)/0.5)] hover:shadow-[0_20px_60px_-24px_hsl(var(--primary)/0.4)] animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.1)] text-primary transition-transform group-hover:scale-110">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-2xl font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        {/* Journey section */}
        <section className="mt-32 rounded-3xl border border-border/70 bg-card/75 p-10 sm:p-16">
          <div className="mb-12 flex items-center gap-4">
            <Flame className="h-8 w-8 text-primary" />
            <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              How LampStand creates momentum
            </h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {journey.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-border bg-background/70 p-8"
              >
                <p className="text-xs font-semibold tracking-[0.22em] text-primary">
                  STEP {item.step}
                </p>
                <h4 className="mt-4 font-display text-2xl font-semibold tracking-tight">
                  {item.title}
                </h4>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-32 border-t border-border/50 pt-10 text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-4">
            <Link to="/legal/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <span>·</span>
            <Link to="/legal/terms" className="hover:text-foreground">
              Terms
            </Link>
            <span>·</span>
            <Link to="/legal/disclaimer" className="hover:text-foreground">
              AI Disclaimer
            </Link>
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-muted-foreground/70">
            APEX Business Systems Ltd. · Edmonton, AB Canada
          </p>
        </footer>
      </section>
    </div>
  );
}
