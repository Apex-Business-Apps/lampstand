import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { FullscreenAgent } from "@/components/FullscreenAgent";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, HeartHandshake, Scroll } from "lucide-react";
import React from "react";

type LiteView = "landing" | "agent";

const PREVIEW_FEATURES = [
  {
    icon: BookOpen,
    title: "Scripture First",
    desc: "Every response anchored in God's Word, with the passage that speaks to your moment.",
  },
  {
    icon: HeartHandshake,
    title: "Pastoral Warmth",
    desc: "Honest guidance in a warm, non-judgmental voice — whatever is on your heart.",
  },
  {
    icon: Scroll,
    title: "Prayer & Reflection",
    desc: "Questions and a closing prayer to carry with you through your day.",
  },
] as const;

// /lite — Unauthenticated burning-bush preview.
// - "landing" view: a proper intro page matching MarketingPage visual identity.
// - "agent"   view: fullscreen Burning Bush Agent; minimize returns to landing.
// FloatingAgent is suppressed on /lite (HIDDEN_PATHS) — no UI overlap.
export default function LiteLandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [view, setView] = useState<LiteView>("landing");

  // Authenticated users get the full app, not the lite preview.
  React.useEffect(() => {
    if (!loading && user) {
      navigate("/app", { replace: true });
    }
  }, [user, loading, navigate]);

  if (view === "agent") {
    return <FullscreenAgent onMinimize={() => setView("landing")} />;
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-foreground flex flex-col selection:bg-[#F2A649]/30">
      {/* ── Header — matches MarketingPage header style ── */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16 shrink-0">
        <img
          src="/images/wordmark-logo.png"
          alt="The Lamp Stand"
          className="h-[3.24rem] w-auto sm:h-[3.78rem]"
          draggable={false}
        />
        <Button
          onClick={() => navigate("/auth")}
          className="h-9 border border-[#D97736]/60 bg-gradient-to-br from-[#F2A649] to-[#D97736] px-5 text-sm font-semibold text-[#0a0a0a] shadow-[0_2px_12px_-2px_rgba(242,166,73,0.45)] hover:from-[#F5B560] hover:to-[#E08840]"
        >
          Log In
        </Button>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-12 sm:py-20">
        {/* Preview badge */}
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#D97736]/30 bg-[#0a0a0a]/80 px-4 py-1.5 mb-8 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F2A649] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F2A649]" />
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e0e0e0]">
            Free Preview — No account needed
          </p>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white drop-shadow-xl sm:text-5xl xl:text-6xl mb-6 max-w-2xl">
          Come, and I will{" "}
          <span className="bg-gradient-to-br from-[#F2A649] to-[#D97736] bg-clip-text italic text-transparent">
            walk with you.
          </span>
        </h1>

        {/* Subhead */}
        <p className="font-body text-base sm:text-[17px] leading-relaxed text-[#a0a0a0] max-w-sm mb-10">
          Share what is on your heart. Receive scripture, reflection, and
          prayer — right now, without signing up.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center mb-16">
          <Button
            size="lg"
            className="h-14 border-none bg-[#D97736] px-8 text-base font-semibold text-white shadow-[0_4px_20px_-4px_rgba(217,119,54,0.5)] hover:bg-[#c2682d]"
            onClick={() => setView("agent")}
          >
            Begin
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 border-[#D97736]/40 bg-[#0a0a0a]/80 px-7 text-base text-[#d0d0d0] backdrop-blur hover:bg-[#D97736]/15 hover:text-white"
            onClick={() => navigate("/onboarding")}
          >
            Create a free account
          </Button>
        </div>

        {/* Feature preview cards */}
        <div className="grid gap-4 sm:grid-cols-3 max-w-2xl w-full">
          {PREVIEW_FEATURES.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-[#D97736]/20 bg-[#0a0a0a]/80 p-5 text-left"
            >
              <item.icon className="h-5 w-5 text-[#F2A649] mb-3" />
              <p className="font-display text-sm font-semibold text-white mb-1.5">
                {item.title}
              </p>
              <p className="font-body text-xs leading-relaxed text-[#7a7a7a]">
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="text-center py-6 text-[11px] uppercase tracking-[0.12em] text-[#6a6a6a] shrink-0">
        <div className="flex items-center justify-center gap-4 mb-1">
          <button
            onClick={() => navigate("/legal/privacy")}
            className="hover:text-[#a0a0a0] transition-colors"
          >
            Privacy
          </button>
          <span>·</span>
          <button
            onClick={() => navigate("/legal/terms")}
            className="hover:text-[#a0a0a0] transition-colors"
          >
            Terms
          </button>
        </div>
        <p>APEX Business Systems Ltd. · Edmonton, AB Canada</p>
      </footer>
    </div>
  );
}
