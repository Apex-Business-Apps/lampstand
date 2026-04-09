import { BookHeart, Compass, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const moments = [
  {
    icon: Compass,
    title: "When you need direction",
    text: "Ask one honest question and receive scripture-rooted guidance in plain language.",
  },
  {
    icon: BookHeart,
    title: "When you need peace",
    text: "Move through a short reflection with a calm rhythm built for stressed minds.",
  },
  {
    icon: Sparkles,
    title: "When you need consistency",
    text: "Save passages and return with momentum instead of starting from zero.",
  },
];

export default function LiteLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 sm:px-10">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Lite Experience</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">LampStand</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/welcome")}>Back</Button>
        </header>

        <main className="grid flex-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-border bg-card p-8 shadow-[0_18px_60px_-34px_hsl(var(--warm-glow)/0.35)]">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Preview flow</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight">A lighter entry that still converts with intention.</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Use this mode for PWA and low-friction sessions. It keeps the promise clear, then moves people into onboarding when they are ready.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate("/entry?entry=onboarding&source=pwa")}>Continue to onboarding</Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/app")}>Open my app</Button>
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Sample Daily Light</p>
              <p className="mt-3 scripture-text text-xl leading-relaxed">
                “Your word is a lamp to my feet and a light to my path.”
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Psalm 119:105</p>
            </div>
          </section>

          <aside className="space-y-4">
            {moments.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-card/80 p-5">
                <item.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-3 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </article>
            ))}
          </aside>
        </main>

        <footer className="pt-8 text-center text-xs text-muted-foreground">
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
