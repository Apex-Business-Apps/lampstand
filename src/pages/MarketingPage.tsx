import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrandWordmark } from "@/components/brand/BrandWordmark";
import { LampFlame } from "@/components/brand/LampFlame";
import { LampScene3D } from "@/components/brand/LampScene3D";
import { CrossSilhouette } from "@/components/brand/CrossSilhouette";
import { ScriptureVeil } from "@/components/brand/ScriptureVeil";
import { Reveal } from "@/components/brand/Reveal";
import { getProfile } from "@/lib/storage";
import {
  OilLampIcon,
  DoveIcon,
  ScrollIcon,
  OpenBookIcon,
  CandleMoonIcon,
  DoorLightIcon,
} from "@/components/brand/SacredIcons";

const highlights = [
  {
    icon: OilLampIcon,
    title: "Daily Light",
    description:
      "A fresh passage and a short, grounded reflection — ready every morning in under three minutes.",
  },
  {
    icon: DoveIcon,
    title: "Pastoral Guidance",
    description:
      "Ask anything — doubt, grief, decisions, joy. Receive scripture-first answers in a warm, non-judgmental voice.",
  },
  {
    icon: ScrollIcon,
    title: "Sermon Mode",
    description:
      "Turn any passage into a structured, spoken teaching for study groups, devotionals, or the drive to work.",
  },
];

const practices = [
  {
    icon: OpenBookIcon,
    title: "Lectio Divina",
    description: "Read, reflect, pray, rest — the ancient four-movement practice, gently guided.",
  },
  {
    icon: CandleMoonIcon,
    title: "The Daily Examen",
    description: "A quiet Ignatian review of the day, ready every evening when you are.",
  },
  {
    icon: DoorLightIcon,
    title: "The Return",
    description: "Been away a while? A graceful path back — no guilt, no streak-shaming.",
  },
];

const journey = [
  {
    step: "01",
    title: "Choose your tone",
    description: "Set your spiritual voice once, and every reflection stays consistent with it.",
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

const stats = [
  { label: "Time to first insight", value: "< 3 min" },
  { label: "Core paths", value: "Daily · Guidance · Sermon" },
  { label: "Default posture", value: "Privacy-first" },
];

export default function MarketingPage() {
  const navigate = useNavigate();
  // Returning souls get a doorway home, not another pitch
  const isReturning = useMemo(() => Boolean(getProfile()?.onboardingComplete), []);

  // Stable random ember placement for the hero
  const embers = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        left: `${8 + ((i * 37) % 84)}%`,
        delay: `${(i * 0.9) % 7}s`,
        duration: `${5.5 + ((i * 1.3) % 4)}s`,
      })),
    [],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ===== Sticky nav ===== */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
          <BrandWordmark tone="light" size="sm" />
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex" style={{ fontFamily: "var(--font-ui)" }}>
            <a href="#paths" className="transition-colors hover:text-foreground">Paths</a>
            <a href="#practices" className="transition-colors hover:text-foreground">Practices</a>
            <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="hidden text-muted-foreground hover:bg-white/5 hover:text-foreground sm:inline-flex"
              onClick={() => navigate("/lite?source=web")}
            >
              Preview
            </Button>
            <Button
              className="bg-gradient-to-b from-[hsl(42_85%_58%)] to-[hsl(30_80%_46%)] font-semibold text-[hsl(26_40%_10%)] shadow-[0_6px_24px_-6px_hsl(var(--warm-glow)/0.7)] transition-all hover:brightness-110"
              onClick={() => navigate("/entry?entry=onboarding&source=web")}
            >
              Begin
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* ===== Split hero — the pointer is your lamp ===== */}
      <section className="relative overflow-hidden bg-[hsl(26_36%_5.5%)]">
        {/* the Word, hidden in the dark until light passes over it */}
        <ScriptureVeil />

        {/* a quiet cross at the center of everything */}
        <CrossSilhouette className="absolute left-1/2 top-1/2 h-[26rem] -translate-x-1/2 -translate-y-[54%] opacity-90 max-lg:hidden" />

        {/* vignette so the page falls away into the dark */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_40%,transparent_55%,hsl(26_36%_4%/0.75)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30rem] bg-[radial-gradient(ellipse_55%_60%_at_62%_100%,hsl(var(--warm-glow)/0.14),transparent_70%)]" />
        {embers.map((e, i) => (
          <span
            key={i}
            className="ember-mote"
            style={{ left: e.left, animationDelay: e.delay, animationDuration: e.duration }}
          />
        ))}

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-14 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-20">
          {/* Left — the invitation */}
          <div className="relative text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[hsl(var(--sacred-gold)/0.35)] bg-white/[0.04] px-4 py-1.5 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--sacred-gold))] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--sacred-gold))]" />
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground" style={{ fontFamily: "var(--font-ui)" }}>
                A Catholic-friendly scripture companion · Free forever
              </p>
            </div>

            <h1 className="mt-8 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Come — I will walk with you
              <br />
              <em className="text-gold-shimmer not-italic">through the dark.</em>
            </h1>

            <p className="mx-auto mt-7 max-w-xl font-body text-xl leading-relaxed text-muted-foreground lg:mx-0">
              The Lamp Stand is a quiet, intelligent companion for daily scripture, Lectio Divina,
              the Ignatian Examen, and warm pastoral conversation. No guilt. No noise. Just the Word —
              and a steady flame beside you.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Button
                size="lg"
                className="h-14 bg-gradient-to-b from-[hsl(42_85%_58%)] to-[hsl(30_80%_46%)] px-8 text-base font-semibold text-[hsl(26_40%_10%)] shadow-[0_14px_44px_-10px_hsl(var(--warm-glow)/0.8)] transition-all hover:-translate-y-0.5 hover:brightness-110"
                onClick={() => navigate(isReturning ? "/app" : "/entry?entry=onboarding&source=web")}
              >
                {isReturning ? "Return to your lamp" : "Light your lamp"}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 border-border bg-white/[0.04] px-7 text-base hover:bg-white/[0.09]"
                onClick={() => navigate("/lite?source=web")}
              >
                Try it without signing up
              </Button>
            </div>

            <p className="mt-10 font-display text-lg italic leading-relaxed text-[hsl(var(--sacred-gold)/0.85)]">
              “Your word is a lamp to my feet, and a light to my path.”
              <span className="mt-1.5 block text-sm not-italic tracking-[0.18em] text-muted-foreground" style={{ fontFamily: "var(--font-ui)" }}>
                PSALM 119:105
              </span>
            </p>

            <p className="mt-8 hidden items-center justify-center gap-2 text-xs text-muted-foreground/80 lg:flex lg:justify-start" style={{ fontFamily: "var(--font-ui)" }}>
              <span className="inline-block h-1.5 w-1.5 animate-glow-pulse rounded-full bg-[hsl(var(--sacred-gold))]" />
              Move your light across the page — the Word is already written in the dark.
            </p>
          </div>

          {/* Right — a lamp from His own days, still burning */}
          <div className="relative flex flex-col items-center justify-center pt-4 lg:pt-0">
            <LampScene3D className="w-full max-w-md animate-fade-in" />
            <p className="mt-10 max-w-xs text-center font-display text-base italic leading-relaxed text-muted-foreground/90">
              “Neither do men light a candle and put it under a bushel, but on a candlestick.”
              <span className="mt-1 block text-xs not-italic tracking-[0.18em] text-muted-foreground/70" style={{ fontFamily: "var(--font-ui)" }}>
                MATTHEW 5:15
              </span>
            </p>
          </div>
        </div>

        {/* stats strip */}
        <div className="relative mx-auto grid max-w-6xl gap-3 px-6 pb-20 sm:grid-cols-3 sm:px-10">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border/70 bg-white/[0.03] px-5 py-4 backdrop-blur"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground" style={{ fontFamily: "var(--font-ui)" }}>
                {item.label}
              </p>
              <p className="mt-1.5 font-display text-xl font-semibold text-[hsl(var(--sacred-gold))]">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Three paths ===== */}
      <section id="paths" className="relative border-t border-border/50 py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal className="mb-12 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[hsl(var(--sacred-gold))]" style={{ fontFamily: "var(--font-ui)" }}>
              Three paths
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              One companion, wherever you are.
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {highlights.map((item, index) => (
              <Reveal key={item.title} delay={index * 120}>
                <article className="group h-full rounded-2xl border border-border/70 bg-card p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[hsl(var(--sacred-gold)/0.5)] hover:shadow-[0_24px_70px_-28px_hsl(var(--warm-glow)/0.55)]">
                  <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-[hsl(var(--sacred-gold)/0.28)] transition-transform duration-300 group-hover:scale-110">
                    <item.icon className="h-11 w-11" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Ancient practices ===== */}
      <section id="practices" className="relative py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--sacred-gold)/0.4)] to-transparent" />
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal className="mb-12 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[hsl(var(--sacred-gold))]" style={{ fontFamily: "var(--font-ui)" }}>
              Ancient practices, gently kept
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Rhythms the Church has prayed for centuries.
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {practices.map((item, index) => (
              <Reveal key={item.title} delay={index * 120}>
                <article className="flex h-full items-start gap-4 rounded-2xl border border-border/70 bg-white/[0.03] p-6 transition-colors hover:border-[hsl(var(--sacred-gold)/0.45)]">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-[hsl(var(--sacred-gold)/0.25)]">
                    <item.icon className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section id="how" className="relative border-t border-border/50 py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal className="mb-12 flex items-center gap-4">
            <LampFlame className="h-14 w-14" withBase={false} />
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              How The Lamp Stand creates momentum
            </h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {journey.map((item, index) => (
              <Reveal key={item.step} delay={index * 120}>
                <div className="relative h-full overflow-hidden rounded-2xl border border-border/70 bg-card p-7">
                  <span className="pointer-events-none absolute -right-3 -top-7 font-display text-[7rem] font-semibold leading-none text-[hsl(var(--sacred-gold)/0.08)]">
                    {item.step}
                  </span>
                  <p className="text-xs font-semibold tracking-[0.24em] text-[hsl(var(--sacred-gold))]" style={{ fontFamily: "var(--font-ui)" }}>
                    STEP {item.step}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="mt-10">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-border/60 bg-white/[0.03] px-6 py-5 text-sm text-muted-foreground" style={{ fontFamily: "var(--font-ui)" }}>
              <span className="inline-flex items-center gap-2.5">
                <CandleMoonIcon className="h-6 w-6" /> Privacy-first by default
              </span>
              <span className="inline-flex items-center gap-2.5">
                <OpenBookIcon className="h-6 w-6" /> Scripture-grounded answers
              </span>
              <span className="inline-flex items-center gap-2.5">
                <DoveIcon className="h-6 w-6" /> Free forever — a labor of love
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Final call ===== */}
      <section className="relative overflow-hidden py-28">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[26rem] bg-[radial-gradient(ellipse_60%_70%_at_50%_100%,hsl(var(--warm-glow)/0.16),transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <LampFlame className="mx-auto mb-8 h-24 w-24" />
            <h2 className="font-display text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Your lamp is ready.
              <br />
              <span className="text-gold-shimmer">Step into the light.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              One minute of setup. A lifetime companion in the Word.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="h-14 bg-gradient-to-b from-[hsl(42_85%_58%)] to-[hsl(30_80%_46%)] px-8 text-base font-semibold text-[hsl(26_40%_10%)] shadow-[0_14px_44px_-10px_hsl(var(--warm-glow)/0.8)] transition-all hover:-translate-y-0.5 hover:brightness-110"
                onClick={() => navigate("/entry?entry=onboarding&source=web")}
              >
                Begin onboarding
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 border-border bg-white/[0.04] px-7 text-base hover:bg-white/[0.09]"
                onClick={() => navigate("/app")}
              >
                I&rsquo;m already here
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-border/50 py-10 text-center text-xs text-muted-foreground" style={{ fontFamily: "var(--font-ui)" }}>
        <BrandWordmark tone="light" size="sm" className="justify-center" />
        <div className="mt-5 flex items-center justify-center gap-3">
          <Link to="/legal/privacy" className="transition-colors hover:text-foreground">Privacy</Link>
          <span>·</span>
          <Link to="/legal/terms" className="transition-colors hover:text-foreground">Terms</Link>
          <span>·</span>
          <Link to="/legal/disclaimer" className="transition-colors hover:text-foreground">AI Disclaimer</Link>
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-[0.12em] opacity-80">
          APEX Business Systems Ltd. · Edmonton, AB Canada
        </p>
      </footer>
    </div>
  );
}
