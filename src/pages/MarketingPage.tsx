import React from "react";
import { ArrowRight, Flame, HeartHandshake, PlayCircle, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: Sun,
    title: "Daily Light",
    description: "A fresh scripture passage and a short, grounded reflection - ready every morning in under three minutes.",
  },
  {
    icon: HeartHandshake,
    title: "Pastoral Guidance",
    description: "Ask anything - doubt, grief, decisions, joy. Get scripture-first answers in a warm, non-judgmental voice.",
  },
  {
    icon: PlayCircle,
    title: "Sermon Mode",
    description: "Turn any passage into a structured, spoken teaching for study groups, devotionals, or the drive to work.",
  },
];

const journey = [
  {
    step: "01",
    title: "Choose your tone",
    description: "Set your spiritual voice once, then LampStand keeps every reflection consistent with it.",
  },
  {
    step: "02",
    title: "Receive focused guidance",
    description: "Ask one question, get scripture-first insight, prayer, and a practical next action.",
  },
  {
    step: "03",
    title: "Build momentum",
    description: "Save passages, keep a journal, and carry one clear thought through your day.",
  },
];


export default function MarketingPage() {
  const navigate = useNavigate();

  const maskRef = React.useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const x = `${e.clientX}px`;
    const y = `${e.clientY}px`;
    if (maskRef.current) {
      maskRef.current.style.setProperty('--x', x);
      maskRef.current.style.setProperty('--y', y);
    }
  }

  return (
    <div
      className="relative min-h-screen w-full bg-[#090a0f] text-foreground selection:bg-[#F2A649]/30 overflow-hidden"
      onMouseMove={handleMouseMove}
    >

      {/* ═══════════════════════════════════════════════════════
          LAYER 0 (z-[0]): Global Background Canvas
          Applied via className bg-[#090a0f] on root div above.
          ═══════════════════════════════════════════════════════ */}

      {/* LAYER 20: SCRIPTURE MASK SIBLING */}
      <div
        ref={maskRef}
        className="absolute inset-0 w-full h-full z-[20] pointer-events-none mix-blend-screen"
        style={{
          WebkitMaskImage: 'radial-gradient(ellipse 140px 90px at calc(var(--x) - 10px) calc(var(--y) + 5px), black 20%, transparent 80%), radial-gradient(ellipse 90px 140px at calc(var(--x) + 15px) calc(var(--y) - 20px), black 10%, transparent 70%)',
          WebkitMaskComposite: 'source-over',
          maskComposite: 'add',
          transition: 'none'
        }}
      >
        {/* Amber Tint */}
        <div className="absolute inset-0 bg-[#f97316]/25 mix-blend-color-burn pointer-events-none"></div>
        <div className="absolute inset-0 bg-[#ea580c]/20 mix-blend-overlay pointer-events-none"></div>

        <img
          src="/images/bible_page_texture_1781232668928.png"
          alt="Scripture Background"
          className="absolute inset-0 w-full h-full object-cover opacity-100"
          style={{ transform: 'none !important' as React.CSSProperties['transform'] }}
        />
      </div>

      {/* LAYER 30: CENTERPIECE CROSS */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-48 z-[30] opacity-90 pointer-events-none flex flex-col items-center justify-center">
        <div className="absolute w-8 h-48 bg-[#090a0f]"></div>
        <div className="absolute w-32 h-8 bg-[#090a0f] top-12"></div>
      </div>

      {/* LAYER 50: LAMPSTAND & FLAME SIBLING */}
      <div className="absolute inset-0 z-[50] flex items-center justify-center pointer-events-none">
        <div className="relative w-full max-w-[800px] aspect-square pointer-events-auto">
          <img
            src="/images/lampstand_transparent.png"
            alt="Lamp Stand"
            className="absolute inset-0 w-full h-full object-contain z-[50]"
          />
          {/* Single CSS Flame Node - Locked to aspect ratio */}
          <div
            className="absolute top-[34.5%] left-[72%] w-4 h-9 z-[60] origin-bottom pointer-events-none animate-realistic-fire"
            style={{
              borderRadius: '50% 50% 20% 20% / 80% 80% 30% 30%',
              background: 'radial-gradient(circle at 50% 100%, rgba(255,255,255,1) 0%, rgba(255,255,0,1) 15%, rgba(249,115,22,1) 40%, rgba(234,88,12,0.8) 70%, rgba(10,10,10,0) 100%)',
              mixBlendMode: 'screen',
              boxShadow: '0 -2px 10px 1px rgba(249,115,22,0.7), 0 -5px 15px 2px rgba(234,88,12,0.5)',
              filter: 'blur(1px)',
            }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-4 bg-blue-500 rounded-full blur-[2px] opacity-60"></div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          LAYER 60 (z-[60]): Typography & UI Elements
          ═══════════════════════════════════════════════════════ */}

      {/* Header */}
      <header className="fixed left-8 right-8 top-8 flex items-center justify-between z-[60] lg:left-16 lg:right-16 lg:top-12 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#111] border border-[#333]">
            <Flame className="h-5 w-5 text-[#F2A649]" />
          </div>
          <span className="font-display text-2xl font-semibold tracking-tight sm:text-3xl text-white">LampStand</span>
        </div>
        <Button variant="ghost" onClick={() => navigate("/auth")} className="font-semibold text-[#a0a0a0] hover:text-white">
          Log In
        </Button>
      </header>

      {/* LEFT HEMISPHERE: Typography Block */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 w-full lg:w-1/2 pl-8 pr-8 lg:pl-16 xl:pl-32 flex flex-col justify-center pointer-events-auto z-[60]">
        <div className="flex flex-col gap-6 w-full max-w-xl">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#D97736]/30 bg-[#090a0f]/80 px-4 py-1.5 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F2A649] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F2A649]" />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e0e0e0]">
              A Catholic-friendly scripture companion
            </p>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-tight text-white drop-shadow-xl">
            Walk into the <br /><span className="bg-gradient-to-br from-[#F2A649] to-[#D97736] bg-clip-text text-transparent italic pr-4">Light.</span>
          </h1>

          <p className="font-body text-xl leading-relaxed text-[#a0a0a0] sm:text-2xl font-medium drop-shadow-md">
            LampStand is a quiet, intelligent companion for daily scripture and warm pastoral conversation. No noise. Just the word, and a steady voice beside you.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button size="lg" className="h-14 px-8 text-base font-semibold border-none bg-[#D97736] hover:bg-[#c2682d] text-white shadow-[0_4px_20px_-4px_rgba(217,119,54,0.5)]" onClick={() => navigate("/onboarding")}>
              Light your lamp
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-7 text-base border-[hsl(var(--primary)/0.5)] bg-[#090a0f]/80 text-[#d0d0d0] hover:bg-[#D97736]/15 hover:text-white backdrop-blur" onClick={() => navigate("/lite?source=web")}>
              Try without signing up
            </Button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          BELOW-THE-FOLD CONTENT (z-[60])
          ═══════════════════════════════════════════════════════ */}
      <section className="relative mt-[100vh] mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-16 z-[60] bg-background">
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
              <h3 className="font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </div>

        <section className="mt-32 rounded-3xl border border-border/70 bg-card/75 p-10 sm:p-16">
          <div className="mb-12 flex items-center gap-4">
            <Flame className="h-8 w-8 text-primary" />
            <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">How LampStand creates momentum</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {journey.map((item) => (
              <div key={item.step} className="rounded-2xl border border-border bg-background/70 p-8">
                <p className="text-xs font-semibold tracking-[0.22em] text-primary">STEP {item.step}</p>
                <h4 className="mt-4 font-display text-2xl font-semibold tracking-tight">{item.title}</h4>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-32 border-t border-border/50 pt-10 text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-4">
            <Link to="/legal/privacy" className="hover:text-foreground">Privacy</Link>
            <span>·</span>
            <Link to="/legal/terms" className="hover:text-foreground">Terms</Link>
            <span>·</span>
            <Link to="/legal/disclaimer" className="hover:text-foreground">AI Disclaimer</Link>
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-muted-foreground/70">
            APEX Business Systems Ltd. · Edmonton, AB Canada
          </p>
        </footer>
      </section>
    </div>
  );
}
