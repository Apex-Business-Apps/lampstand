import {
  ArrowRight,
  Flame,
  HeartHandshake,
  PlayCircle,
  Sun,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const highlights = [
  {
    icon: Sun,
    title: "Daily Light",
    description:
      "A fresh scripture passage and a short, grounded reflection - ready every morning in under three minutes.",
  },
  {
    icon: HeartHandshake,
    title: "Pastoral Guidance",
    description:
      "Ask anything - doubt, grief, decisions, joy. Get scripture-first answers in a warm, non-judgmental voice.",
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

  const maskRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (maskRef.current) {
      const rect = maskRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      maskRef.current.style.setProperty("--x", `${x}px`);
      maskRef.current.style.setProperty("--y", `${y}px`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/*
        PHASE 2: CROSS INJECTION (LAYER 10)
      */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-48 z-[10] opacity-80 pointer-events-none flex flex-col items-center justify-center">
        <div className="absolute w-8 h-48 bg-[#111]"></div>
        <div className="absolute w-32 h-8 bg-[#111] top-12"></div>
      </div>

      {/* 
        SPLIT HERO SECTION 
      */}
      <section className="relative flex min-h-screen flex-col lg:flex-row">
        {/* Left Pane - UI & Copy */}
        <div className="relative z-[60] flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-20 xl:px-24">
          <header className="absolute left-8 top-8 flex items-center gap-3 lg:left-20 lg:top-12">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--primary))] shadow-[0_0_24px_hsl(var(--primary)/0.45)]">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              LampStand
            </span>
          </header>

          <div className="mt-20 lg:mt-0 animate-fade-in space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--primary)/0.35)] bg-background/60 px-4 py-1.5 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--primary))] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/80">
                A Catholic-friendly scripture companion
              </p>
            </div>

            <h1 className="font-display max-w-2xl text-5xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-7xl">
              Walk into the{" "}
              <span className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent italic">
                Light.
              </span>
            </h1>

            <p className="max-w-xl font-body text-xl leading-relaxed text-foreground/75 sm:text-2xl">
              LampStand is a quiet, intelligent companion for daily scripture
              and warm pastoral conversation. No noise. Just the word, and a
              steady voice beside you.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="h-14 px-8 text-base font-semibold shadow-[0_12px_40px_-12px_hsl(var(--primary)/0.7)]"
                onClick={() => navigate("/entry?entry=onboarding&source=web")}
              >
                Light your lamp
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-7 text-base border-[hsl(var(--primary)/0.5)] hover:bg-[hsl(var(--primary)/0.1)]"
                onClick={() => navigate("/lite?source=web")}
              >
                Try without signing up
              </Button>
            </div>
          </div>
        </div>

        {/* Right Pane - The Interactive 3D Canvas */}
        <div
          className="relative hidden w-full overflow-hidden bg-[#0A0A0A] lg:flex lg:w-1/2"
          onMouseMove={handleMouseMove}
        >
          {/* The parent container MUST have 'isolate' to create a new stacking context */}
          <div
            className="relative w-full h-full overflow-hidden isolate"
            ref={heroRef}
          >
            {/* LAYER 20: SCRIPTURE & ORGANIC MASK (SIBLING 1) */}
            <div
              ref={maskRef}
              className="absolute inset-0 z-[20] pointer-events-none"
              style={{
                WebkitMaskImage:
                  "radial-gradient(ellipse 250px 180px at calc(var(--x, 50%) - 20px) calc(var(--y, 50%) + 10px), black 30%, transparent 80%), radial-gradient(circle 180px at calc(var(--x, 50%) + 40px) calc(var(--y, 50%) - 30px), black 20%, transparent 70%)",
                WebkitMaskComposite: "source-over",
                maskComposite: "add",
                transition: "none",
              }}
            >
              {/* WARM TINT OVERLAY */}
              <div className="absolute inset-0 bg-amber-600/30 mix-blend-overlay"></div>

              {/* FLATTENED SCRIPTURE ASSET */}
              <img
                src="/regular_bible_texture.png"
                alt="Scripture Background"
                className="w-full h-full object-cover opacity-100"
                style={{
                  transform: "none !important",
                  perspective: "none !important",
                  borderRadius: "0 !important",
                  filter: "none !important",
                }}
              />
            </div>

            {/* LAYER 50: LAMPSTAND & ISOLATED FLAME (SIBLING 2) */}
            <div className="absolute inset-0 z-[50] flex items-center justify-center pointer-events-none">
              <div className="relative pointer-events-auto">
                {/* HARD CROP OF BAKED-IN ARTIFACT */}
                <img
                  src="/lampstand.png"
                  alt="Lamp Stand"
                  className="relative z-[50]"
                  style={{ clipPath: "polygon(0 0, 80% 0, 80% 100%, 0 100%)" }}
                />
                {/* SINGLE FLAME NODE */}
                <div className="absolute top-[34.5%] left-[72%] w-4 h-6 z-[60] bg-orange-400 blur-[2px] rounded-full mix-blend-screen animate-flame-flicker"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-16 relative z-20 bg-background">
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
