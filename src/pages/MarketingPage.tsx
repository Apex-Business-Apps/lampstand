import { ArrowRight, Flame, HeartHandshake, PlayCircle, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

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

  // Spotlight mouse tracking with fluid spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 25 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      
      {/* 
        SPLIT HERO SECTION 
      */}
      <section className="relative flex min-h-screen flex-col lg:flex-row">
        
        {/* Left Pane - UI & Copy */}
        <div className="relative z-10 flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-20 xl:px-24">
          <header className="absolute left-8 top-8 flex items-center gap-3 lg:left-20 lg:top-12">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--primary))] shadow-[0_0_24px_hsl(var(--primary)/0.45)]">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">LampStand</span>
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
              Walk into the <span className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent italic">Light.</span>
            </h1>

            <p className="max-w-xl font-body text-xl leading-relaxed text-foreground/75 sm:text-2xl">
              LampStand is a quiet, intelligent companion for daily scripture and warm pastoral conversation. No noise. Just the word, and a steady voice beside you.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="h-14 px-8 text-base font-semibold shadow-[0_12px_40px_-12px_hsl(var(--primary)/0.7)]" onClick={() => navigate("/entry?entry=onboarding&source=web")}>
                Light your lamp
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-7 text-base border-[hsl(var(--primary)/0.5)] hover:bg-[hsl(var(--primary)/0.1)]" onClick={() => navigate("/lite?source=web")}>
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
          {/* Base ambient layer: Bible text barely visible in the absolute dark */}
          <div 
            className="absolute inset-0 bg-[url('/images/bible_page_texture_1781232668928.png')] bg-cover bg-center opacity-10 mix-blend-overlay"
          />

          {/* Spotlight Reveal Layer */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              WebkitMaskImage: useMotionTemplate`radial-gradient(180px circle at ${springX}px ${springY}px, black 0%, transparent 100%)`,
              maskImage: useMotionTemplate`radial-gradient(180px circle at ${springX}px ${springY}px, black 0%, transparent 100%)`,
            }}
          >
            <div className="absolute inset-0 bg-[url('/images/bible_page_texture_1781232668928.png')] bg-cover bg-center opacity-60 mix-blend-screen" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#D97736]/30 to-transparent mix-blend-overlay" />
          </motion.div>

          {/* Central 3D Elements */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center z-20">
            {/* Cross Silhouette */}
            <div className="relative flex flex-col items-center">
              <img 
                src="/images/cross_silhouette_1781232694424.png" 
                alt="Ancient Cross" 
                className="w-72 h-auto opacity-90 drop-shadow-2xl mix-blend-multiply"
                style={{ filter: "brightness(0.2) contrast(1.5)" }}
              />
              
              {/* Lampstand Base */}
              <div className="absolute -bottom-16">
                <img 
                  src="/images/lampstand_30ad_1781232660605.png" 
                  alt="30AD Lampstand" 
                  className="w-48 h-auto drop-shadow-2xl"
                />
                {/* The Flame (Holy Spirit) */}
                <motion.div 
                  className="absolute left-1/2 top-[20%] h-8 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F2A649] blur-[6px]"
                  animate={{
                    scale: [1, 1.15, 0.95, 1.1, 1],
                    opacity: [0.8, 1, 0.7, 0.9, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="absolute left-1/2 top-[20%] h-4 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffffff] blur-[2px]"
                  animate={{
                    scale: [1, 1.2, 0.9, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Edge Vignette */}
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_150px_100px_#0A0A0A] z-30" />
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
