import { ArrowRight, Flame, HeartHandshake, PlayCircle, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: Sparkles,
    title: "Daily Light",
    description: "Fresh scripture reflection in minutes, designed for real schedules and real emotions.",
  },
  {
    icon: HeartHandshake,
    title: "Pastoral Guidance",
    description: "Warm, grounded responses when you need direction, comfort, or a prayerful next step.",
  },
  {
    icon: PlayCircle,
    title: "Sermon Mode",
    description: "Turn passages into structured teaching moments for study groups, devotionals, or personal growth.",
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
        <header className="mb-12 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">APEX Business Apps</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">LampStand</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/lite?source=web")}>Lite Preview</Button>
            <Button onClick={() => navigate("/entry?entry=onboarding&source=web")}>
              Start
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 p-8 shadow-[0_20px_80px_-32px_hsl(var(--warm-glow)/0.35)] sm:p-12">
          <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-[hsl(var(--warm-glow)/0.18)] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-[hsl(var(--sage)/0.18)] blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-6 animate-fade-in">
              <p className="text-sm uppercase tracking-[0.2em] text-primary">Scripture Companion Platform</p>
              <h2 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
                A calm, intelligent spiritual companion that meets people where they actually are.
              </h2>
              <p className="max-w-xl text-lg text-muted-foreground">
                LampStand blends daily reflection, guided conversation, and structured teaching tools into one local-first experience built for consistency, trust, and growth.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate("/entry?entry=onboarding&source=web")}>Create your path</Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/lite?source=web")}>Explore lite mode</Button>
              </div>
            </div>

            <aside className="space-y-3 rounded-2xl border border-border/80 bg-background/80 p-6 backdrop-blur animate-slide-up">
              {stats.map((item) => (
                <div key={item.label} className="rounded-xl border border-border/70 bg-card px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-3">
          {highlights.map((item, index) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <item.icon className="mb-4 h-6 w-6 text-primary" />
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-16 rounded-3xl border border-border/70 bg-card/75 p-8 sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <Flame className="h-5 w-5 text-primary" />
            <h3 className="text-3xl font-semibold">How LampStand creates momentum</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {journey.map((item) => (
              <div key={item.step} className="rounded-xl border border-border bg-background/70 p-5">
                <p className="text-xs font-semibold tracking-[0.2em] text-primary">STEP {item.step}</p>
                <h4 className="mt-2 text-xl font-semibold">{item.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 mb-4 rounded-3xl border border-border/70 bg-gradient-to-br from-card to-accent/30 p-8 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Launch now</p>
              <h3 className="mt-2 text-3xl font-semibold">Start onboarding in under a minute.</h3>
              <p className="mt-3 text-muted-foreground">
                Keep the first step light, then let LampStand personalize everything that follows.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate("/entry?entry=onboarding&source=web")}>Start onboarding</Button>
              <Button variant="outline" onClick={() => navigate("/app")}>I already use LampStand</Button>
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
        </footer>
      </div>
    </div>
  );
}
