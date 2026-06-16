import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FullscreenAgent } from "@/components/FullscreenAgent";

// /lite: unauthenticated burning-bush preview.
// Shows a landing hero first — user opts in before the agent opens.
// Minimize returns to this hero (not to the marketing page).
// FloatingAgent is hidden on /lite (HIDDEN_PATHS in FloatingAgent.tsx).
export default function LiteLandingPage() {
  const [agentOpen, setAgentOpen] = useState(false);

  if (agentOpen) {
    return <FullscreenAgent onMinimize={() => setAgentOpen(false)} />;
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center selection:bg-[#F2A649]/30">
      {/* Ambient amber glow — matches marketing page radial */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(217,119,54,0.09) 0%, transparent 62%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-[480px]">
        <img
          src="/images/wordmark-logo.png"
          alt="The Lamp Stand"
          className="h-12 w-auto"
          draggable={false}
        />

        <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-[1.08] tracking-tight text-white">
          A quiet companion
          <br />
          <span className="bg-gradient-to-br from-[#F2A649] to-[#D97736] bg-clip-text italic text-transparent">
            for your heart.
          </span>
        </h1>

        <p className="font-body text-base leading-relaxed text-[#a0a0a0] max-w-[340px]">
          Share what's on your heart and receive scripture-first guidance — no
          account needed.
        </p>

        <Button
          onClick={() => setAgentOpen(true)}
          className="h-14 px-8 text-base font-semibold border-none bg-[#D97736] text-white shadow-[0_4px_20px_-4px_rgba(217,119,54,0.5)] hover:bg-[#c2682d]"
        >
          Begin
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <p className="text-xs uppercase tracking-[0.18em] text-[#6a6a6a]">
          No account · No commitment · Just the word.
        </p>
      </div>
    </div>
  );
}
