import React from "react";
import { ArrowRight, Flame, HeartHandshake, PlayCircle, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import CandleRevealCanvas from "@/components/CandleRevealCanvas";
import LampstandCanvas from "@/components/LampstandCanvas";

/* ════════════════════════════════════════════════════════════════════════════
 * MARKETING PAGE — LAYER STACK  (bottom → top)
 *
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │  z-0    Bible page texture    BELOW THE VEIL — hidden, cursor-only  │
 *  │  z-10   Cross silhouette      BELOW THE VEIL — hidden, cursor-only  │
 *  │  ─────────────────────────────────────────────────────────────────  │
 *  │  z-100  CandleRevealCanvas ◄── THE VEIL (obsidian mask + glow)      │
 *  │  ─────────────────────────────────────────────────────────────────  │
 *  │  z-150  LampstandCanvas       ABOVE THE VEIL — always visible       │
 *  │  z-200  Hero text / CTAs      ABOVE THE VEIL — always visible       │
 *  │  z-200  Header (wordmark)     ABOVE THE VEIL — always visible       │
 *  │  z-200  Below-fold sections   ABOVE THE VEIL — always visible       │
 *  │  z-310  Consent modal         ABOVE EVERYTHING                      │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  ⚠️  INVARIANTS — never break these:
 *
 *  1. ONLY z-0 (bible page) and z-10 (cross) may live BELOW z-100.
 *     Every other UI component MUST be z-150 or higher.
 *
 *  2. CandleRevealCanvas is a SINGLETON fixed canvas at z-100.
 *     Do NOT add a second canvas, do NOT change its z-index.
 *     It draws the obsidian mask + cursor-tracked amber reveal every frame.
 *
 *  3. LampstandCanvas (z-150) has a dark radial contrast anchor behind it
 *     (position:absolute, inset:-15%, rgba(10,10,10,0.90) gradient, z:0).
 *     This prevents luma-key optical washout when the cursor reveal blob
 *     punches through the obsidian behind the lamp. Do NOT remove it.
 *
 *  4. The lamp wrapper uses style={{ top: "calc(42% - 38px)" }} (≈ 1 cm
 *     above viewport center) and marginLeft: "-4vw" to close the gap
 *     between hero text and lamp. Do NOT revert to top-1/2.
 *
 *  5. LampstandCanvas size is clamp(280px, 35vw, 500px) — width-relative,
 *     not height-relative. Do NOT switch back to vh-based sizing.
 *
 *  6. Below-the-fold <section> must stay at z-[200]. Lowering it below
 *     z-100 will hide the cards behind the obsidian mask permanently.
 *
 *  See /docs/LAYER_STACK.md for the authoritative z-index reference and layer invariants.
 * ════════════════════════════════════════════════════════════════════════════ */

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

  // Authenticated users bypass the marketing page and go straight to the app
  const { user, loading } = useAuth();
  React.useEffect(() => {
    if (!loading && user) {
      navigate("/app", { replace: true });
    }
  }, [user, loading, navigate]);

  const [heroVisible, setHeroVisible] = React.useState(true);
  React.useEffect(() => {
    const onScroll = () => setHeroVisible(window.scrollY < window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-foreground selection:bg-[#F2A649]/30">

      {/* ── z-0: Bible page — BELOW THE VEIL, cursor-revealed only ── */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <img
          src="/images/bible_page.png"
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/35" />
      </div>

      {/* ── z-10: Cross silhouette — BELOW THE VEIL, cursor-revealed only ── */}
      <div
        className="fixed left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="/images/cross_alpha.png"
          alt=""
          className="h-auto w-[560px] max-w-[80vw] object-contain opacity-90"
          draggable={false}
        />
      </div>

      {/* ── z-100: CandleRevealCanvas — THE VEIL (singleton, do not duplicate) ── */}
      <CandleRevealCanvas />

      {/* ── z-150: Lamp hero — ABOVE THE VEIL, always visible ──
          Wrapper: top calc(42% - 38px) ≈ 1 cm above center, marginLeft -4vw closes gap.
          Inner contrast anchor (z:0) prevents luma-key washout on hover. */}
      <div
        style={{ top: "calc(42% - 38px)" }}
        className={`pointer-events-none fixed right-0 z-[150] hidden h-screen w-1/2 -translate-y-1/2 items-center justify-center transition-opacity duration-500 lg:flex ${
          heroVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div style={{ position: "relative", marginLeft: "-4vw" }}>
          {/* Contrast anchor — keeps luma-key solid when candle blob reveals behind lamp */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "-15%",
              background:
                "radial-gradient(circle, rgba(10,10,10,0.90) 25%, rgba(10,10,10,0) 70%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <LampstandCanvas
            style={{
              height: "clamp(280px, 35vw, 500px)",
              width: "clamp(280px, 35vw, 500px)",
              display: "block",
              position: "relative",
              zIndex: 1,
            }}
          />
        </div>
      </div>

      {/* ── z-200: Header — ABOVE THE VEIL, always visible ── */}
      <header className="pointer-events-auto fixed left-8 right-8 top-8 z-[200] flex items-center justify-between lg:left-16 lg:right-16 lg:top-12">
        <img
          src="/images/wordmark-logo.png"
          alt="The Lamp Stand"
          className="h-12 w-auto sm:h-14"
          draggable={false}
        />
        <Button
          onClick={() => navigate("/auth")}
          className="h-9 border border-[#D97736]/60 bg-gradient-to-br from-[#F2A649] to-[#D97736] px-5 text-sm font-semibold text-[#0a0a0a] shadow-[0_2px_12px_-2px_rgba(242,166,73,0.45)] hover:from-[#F5B560] hover:to-[#E08840]"
        >
          Log In
        </Button>
      </header>

      {/* ── z-200: Hero typography — ABOVE THE VEIL, always visible ── */}
      <div
        className={`fixed left-0 top-1/2 z-[200] flex w-full -translate-y-1/2 items-center justify-center transition-opacity duration-500 lg:w-1/2 ${
          heroVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex w-full max-w-[420px] flex-col gap-5 px-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#D97736]/30 bg-[#0a0a0a]/80 px-4 py-1.5 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F2A649] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F2A649]" />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e0e0e0]">
              A Catholic-friendly scripture companion
            </p>
          </div>

          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white drop-shadow-xl sm:text-6xl xl:text-7xl">
            Walk with <br />
            <span className="bg-gradient-to-br from-[#F2A649] to-[#D97736] bg-clip-text pr-4 italic text-transparent">
              the Light.
            </span>
          </h1>

          <p className="mx-auto max-w-[300px] font-body text-base font-medium leading-relaxed text-[#a0a0a0] drop-shadow-md sm:text-[17px]">
            A quiet companion for daily scripture and warm pastoral conversation. No noise. Just the word.
          </p>

          <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="h-14 border-none bg-[#D97736] px-8 text-base font-semibold text-white shadow-[0_4px_20px_-4px_rgba(217,119,54,0.5)] hover:bg-[#c2682d]"
              onClick={() => navigate("/onboarding")}
            >
              Light your lamp
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 border-[hsl(var(--primary)/0.5)] bg-[#0a0a0a]/80 px-7 text-base text-[#d0d0d0] backdrop-blur hover:bg-[#D97736]/15 hover:text-white"
              onClick={() => navigate("/lite?source=web")}
            >
              Try without signing up
            </Button>
          </div>

          <p className="pt-2 text-center text-xs uppercase tracking-[0.18em] text-[#6a6a6a]">
            Move your cursor — let the lamp light the page
          </p>
        </div>
      </div>

      {/* ── z-200: Below-the-fold — ABOVE THE VEIL, always visible ──
          ⚠️  MUST stay at z-[200] or higher. Lowering below z-100 hides
          these sections permanently behind the obsidian mask. */}
      <section className="relative z-[200] mx-auto mt-[100vh] max-w-6xl px-6 py-24 sm:px-10 lg:px-16">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item, index) => (
            <article
              key={item.title}
              className="group animate-slide-up rounded-2xl border border-border/70 bg-card/80 p-8 transition-all hover:-translate-y-1 hover:border-[hsl(var(--primary)/0.5)] hover:shadow-[0_20px_60px_-24px_hsl(var(--primary)/0.4)]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.1)] text-primary transition-transform group-hover:scale-110">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
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
              <div key={item.step} className="rounded-2xl border border-border bg-background/70 p-8">
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
      </section>
    </div>
  );
}