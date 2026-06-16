import { ArrowRight, Flame, HeartHandshake, PlayCircle, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: Sun,
    title: "Daily Light",
    description: "A fresh scripture passage and a short, grounded reflection — ready every morning in under three minutes.",
  },
  {
    icon: HeartHandshake,
    title: "Pastoral Guidance",
    description: "Ask anything — doubt, grief, decisions, joy. Get scripture-first answers in a warm, non-judgmental voice.",
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

const stats = [
  { label: "Time to first insight", value: "< 3 min" },
  { label: "Core paths", value: "Daily · Guidance · Sermon" },
  { label: "Default posture", value: "Privacy-first" },
];

export default function MarketingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen text-foreground"
      style={{
        background:
          "radial-gradient(circle at 10% 10%, hsl(var(--warm-glow-soft)) 0%, transparent 40%), radial-gradient(circle at 90% 0%, hsl(var(--sage-soft)) 0%, transparent 38%), linear-gradient(180deg, hsl(var(--ivory)) 0%, hsl(var(--cream)) 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-16">
        <header className="mb-10 flex items-center justify-between sm:mb-14">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--sacred-gold))] to-[hsl(var(--ember))] shadow-[0_0_24px_hsl(var(--warm-glow)/0.45)]">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">LampStand</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => navigate("/lite?source=web")}>Preview</Button>
            <Button onClick={() => navigate("/entry?entry=onboarding&source=web")}>
              Begin
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-card/90 via-card/70 to-accent/40 p-8 shadow-[0_30px_120px_-40px_hsl(var(--warm-glow)/0.55)] sm:p-14 lg:p-20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-[hsl(var(--warm-glow)/0.28)] blur-3xl animate-glow-pulse" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-[26rem] w-[26rem] rounded-full bg-[hsl(var(--sacred-gold)/0.22)] blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--sacred-gold)/0.5)] to-transparent" />

          <div className="relative space-y-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--sacred-gold)/0.35)] bg-background/60 px-4 py-1.5 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--sacred-gold))] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--sacred-gold))]" />
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/80">
                A Catholic-friendly scripture companion · Free forever
              </p>
            </div>

            <h2 className="font-display max-w-5xl text-5xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-7xl lg:text-[5.5rem]">
              Scripture, prayer, and pastoral guidance — <span className="bg-gradient-to-br from-[hsl(var(--ember))] via-[hsl(var(--sacred-gold))] to-[hsl(var(--warm-glow))] bg-clip-text text-transparent italic">that meet you where you are.</span>
            </h2>

            <p className="max-w-3xl font-body text-xl leading-relaxed text-foreground/75 sm:text-2xl">
              LampStand is a quiet, intelligent companion for daily scripture, Lectio Divina, the Ignatian Examen, and warm pastoral conversation. No guilt. No noise. Just the word, and a steady voice beside you.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="h-14 px-8 text-base font-semibold shadow-[0_12px_40px_-12px_hsl(var(--warm-glow)/0.7)]" onClick={() => navigate("/entry?entry=onboarding&source=web")}>
                Light your lamp
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-7 text-base" onClick={() => navigate("/lite?source=web")}>
                Try without signing up
              </Button>
            </div>

            <div className="grid gap-3 pt-6 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border/60 bg-background/70 px-5 py-4 backdrop-blur">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                  <p className="mt-1.5 font-display text-xl font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-5 md:grid-cols-3">
          {highlights.map((item, index) => (
            <article
              key={item.title}
              className="group rounded-2xl border border-border/70 bg-card/80 p-7 backdrop-blur transition-all hover:-translate-y-1 hover:border-[hsl(var(--sacred-gold)/0.5)] hover:shadow-[0_20px_60px_-24px_hsl(var(--warm-glow)/0.4)] animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--sacred-gold-soft))] to-[hsl(var(--warm-glow-soft))] text-primary transition-transform group-hover:scale-110">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-20 rounded-3xl border border-border/70 bg-card/75 p-8 sm:p-12">
          <div className="mb-10 flex items-center gap-3">
            <Flame className="h-6 w-6 text-primary" />
            <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">How LampStand creates momentum</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {journey.map((item) => (
              <div key={item.step} className="rounded-2xl border border-border bg-background/70 p-6">
                <p className="text-xs font-semibold tracking-[0.22em] text-primary">STEP {item.step}</p>
                <h4 className="mt-3 font-display text-2xl font-semibold tracking-tight">{item.title}</h4>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 mb-6 overflow-hidden rounded-3xl border border-[hsl(var(--sacred-gold)/0.3)] bg-gradient-to-br from-card via-accent/30 to-[hsl(var(--warm-glow-soft))] p-8 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Begin tonight</p>
              <h3 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Your lamp is ready. Step into the light.</h3>
              <p className="mt-4 text-lg text-muted-foreground">
                One minute of setup. A lifetime companion in the word. Free, forever — a labor of love.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="h-13 px-7 text-base font-semibold" onClick={() => navigate("/entry?entry=onboarding&source=web")}>Begin onboarding</Button>
              <Button size="lg" variant="outline" className="h-13 px-6 text-base" onClick={() => navigate("/app")}>I&rsquo;m already here</Button>
            </div>
          </div>
        </section>

        <footer className="pb-8 text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-3">
            <Link to="/legal/privacy" className="hover:text-foreground">Privacy</Link>
            <span>·</span>
            <Link to="/legal/terms" className="hover:text-foreground">Terms</Link>
            <span>·</span>
            <Link to="/legal/disclaimer" className="hover:text-foreground">AI Disclaimer</Link>
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground/90">
            APEX Business Systems Ltd. · Edmonton, AB Canada
          </p>
        </footer>
      </div>
    </div>
  );
}
