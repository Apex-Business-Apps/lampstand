import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

import iconExamen from "@/assets/icon_examen.png";
import iconPastoral from "@/assets/icon_pastoral.png";
import iconLectio from "@/assets/icon_lectio.png";
import heroBg from "@/assets/hero_bg.png";
import { SacredFlame } from "@/components/ui/SacredFlame";

// Dense, realistic Bible text generator
const BIBLE_CHAPTER = `
1 In the beginning was the Word, and the Word was with God, and the Word was God. 2 He was in the beginning with God. 3 All things were made through him, and without him was not any thing made that was made. 4 In him was life, and the life was the light of men. 5 The light shines in the darkness, and the darkness has not overcome it. 6 There was a man sent from God, whose name was John. 7 He came as a witness, to bear witness about the light, that all might believe through him. 8 He was not the light, but came to bear witness about the light. 9 The true light, which gives light to everyone, was coming into the world. 10 He was in the world, and the world was made through him, yet the world did not know him. 11 He came to his own, and his own people did not receive him. 12 But to all who did receive him, who believed in his name, he gave the right to become children of God, 13 who were born, not of blood nor of the will of the flesh nor of the will of man, but of God. 14 And the Word became flesh and dwelt among us, and we have seen his glory, glory as of the only Son from the Father, full of grace and truth. 15 (John bore witness about him, and cried out, “This was he of whom I said, ‘He who comes after me ranks before me, because he was before me.’”) 16 For from his fullness we have all received, grace upon grace. 17 For the law was given through Moses; grace and truth came through Jesus Christ. 18 No one has ever seen God; the only God, who is at the Father’s side, he has made him known.
`;

const formatBibleText = (text: string) => {
  return text.split(/(?=\d+\s)/).map((verse, i) => {
    const match = verse.match(/^(\d+)\s(.*)/);
    if (match) {
      return (
        <span key={i} className="mb-2 block">
          <sup className="text-[10px] font-bold mr-1 opacity-70">{match[1]}</sup>
          {match[2]}
        </span>
      );
    }
    return <span key={i}>{verse}</span>;
  });
};

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function DustMotes() {
  const [motes] = useState(() => Array.from({ length: 40 }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * -20,
  })));

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden mix-blend-screen opacity-50">
      {motes.map((mote, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#ffddaa] blur-[1px]"
          style={{
            width: mote.size,
            height: mote.size,
            left: `${mote.x}%`,
            top: `${mote.y}%`,
          }}
          animate={{
            y: ["0%", "-100%"],
            x: ["0%", `${Math.random() * 20 - 10}%`],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: mote.duration,
            delay: mote.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export default function MarketingPage() {
  const navigate = useNavigate();

  const [flicker, setFlicker] = useState(0);
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = Date.now();
    
    const animateFlicker = () => {
      const now = Date.now();
      if (now - lastTime > 80) {
        setFlicker(Math.random() * 30 - 15);
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(animateFlicker);
    };
    
    animateFlicker();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Anchored, Volumetric Architectural Diffusion (2700K-3000K thermal profile)
  // Emanating permanently from the Lamp Stand at 50% 45%
  const maskImage = useMotionTemplate`
    radial-gradient(${800 + flicker * 2}px ${600 + flicker}px at 50% 45%, black 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 65%, transparent 100%)
  `;

  return (
    <div className="min-h-screen bg-black text-foreground font-sans overflow-x-hidden relative selection:bg-primary/30">
      
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img src={heroBg} alt="Sanctuary" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/70 to-black" />
      </div>

      {/* 2. Interactive Scripture Layer (Permanently illuminated by the Lamp Stand) */}
      <motion.div 
        className="pointer-events-none fixed inset-0 z-10 overflow-hidden bg-[#b89668] shadow-[inset_0_0_150px_rgba(30,15,0,0.9)]"
        style={{ WebkitMaskImage: maskImage, maskImage }}
      >
        <DustMotes />
        
        {/* Subtle Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]" />
        
        {/* Warm Lantern Light Overlay inside the mask */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,180,80,0.2)_0%,rgba(50,20,0,0.6)_100%)] mix-blend-overlay" />
        
        <div className="absolute inset-0 p-12 md:p-16 text-[#1c1208] font-serif text-[12.5px] leading-[1.35] text-justify columns-2 gap-10 max-h-screen overflow-hidden opacity-90">
          {Array(20).fill(BIBLE_CHAPTER).map((chapter, i) => (
            <div key={i} className="mb-2 break-inside-avoid">
              {i === 0 && (
                <div className="text-center mb-4 border-b border-[#1c1208]/20 pb-2">
                  <h2 className="text-lg font-bold font-serif uppercase tracking-widest">The Gospel According to John</h2>
                  <p className="text-[10px] italic mt-1">Chapter 1</p>
                </div>
              )}
              <div className="indent-6">
                {formatBibleText(chapter)}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 3. The Animated Sacred Flame (Positioned precisely over the physical lamp wick in the background) */}
      <div className="fixed top-[45%] left-1/2 -translate-x-1/2 w-64 h-64 z-20 pointer-events-none opacity-100 flex items-center justify-center">
        <SacredFlame />
      </div>

      {/* 4. Cinematic Ambient Ember Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden mix-blend-screen">
        {/* Core Warmth */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,140,40,0.1)_0%,rgba(200,50,20,0.02)_50%,transparent_70%)] rounded-full blur-[50px] animate-pulse" style={{ animationDuration: '5s' }} />
      </div>

      {/* NAV */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto mix-blend-lighten">
        <div className="flex items-center gap-3">
          {/* Removed the generic 'L' logo per user feedback */}
          <span className="font-serif text-2xl font-medium tracking-widest text-white drop-shadow-md uppercase">The Lamp Stand</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/app" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Sign In
          </Link>
          <Button onClick={() => navigate('/app')} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 shadow-[0_0_20px_rgba(250,180,80,0.4)] transition-all font-serif italic text-lg tracking-wide">
            Enter the Light <ArrowRight className="ml-3 w-4 h-4 not-italic" />
          </Button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-[90svh] flex flex-col justify-center px-6 sm:px-10 lg:px-16 mx-auto max-w-7xl">
        <div className="max-w-5xl mt-[-10vh]">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-primary/20 bg-black/60 backdrop-blur-md mb-10 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(250,180,80,0.8)]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-primary/90">A Spiritual Companion</span>
            </div>
          </Reveal>

          {/* Cinematic Typography */}
          <h1 className="text-6xl sm:text-7xl lg:text-[7.5rem] leading-[1.0] font-serif text-foreground tracking-tight mb-8">
            <Reveal delay={0.3}><span className="block drop-shadow-2xl text-white">Come, and I will</span></Reveal>
            <Reveal delay={0.6}><span className="block drop-shadow-2xl text-white/90">walk with you</span></Reveal>
            <Reveal delay={0.9}>
              <span className="block italic text-primary font-light" style={{ textShadow: "0 0 50px rgba(250, 180, 80, 0.5), 0 0 100px rgba(250, 180, 80, 0.3)" }}>
                through the dark.
              </span>
            </Reveal>
          </h1>

          <Reveal delay={1.2}>
            <p className="text-lg md:text-2xl text-white/70 max-w-2xl leading-relaxed font-serif italic mb-12 border-l-2 border-primary/50 pl-6 drop-shadow-xl backdrop-blur-[2px]">
              The Lamp Stand is a quiet, intelligent sanctuary. Experience daily scripture, Lectio Divina, and deeply pastoral conversation. No noise. Just the word, and a steady voice beside you.
            </p>
          </Reveal>

          <Reveal delay={1.4}>
            <div className="flex flex-col sm:flex-row gap-5">
              <Button size="lg" className="rounded-full h-16 px-10 text-xl font-serif italic bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_40px_rgba(250,180,80,0.6)] transition-all" onClick={() => navigate('/app')}>
                Begin Your Journey
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-16 px-10 text-xl font-serif italic border-white/20 bg-black/60 backdrop-blur-xl hover:border-primary/50 hover:bg-white/10 transition-all text-white">
                <PlayCircle className="mr-3 w-5 h-5 text-primary not-italic" /> Hear the Voice
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="relative z-10 py-32 px-6 sm:px-10 lg:px-16 mx-auto max-w-7xl">
        <Reveal>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-white drop-shadow-lg">Designed for peace.</h2>
            <p className="text-white/50 text-base md:text-lg font-serif italic max-w-xl mx-auto">A sanctuary built entirely to keep the noise of the world out, and the light of the Word in.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="col-span-1">
            <Reveal delay={0.1}>
              <div className="glow-card h-full rounded-2xl p-8 flex flex-col items-start group relative border border-white/10 bg-black/80 backdrop-blur-xl shadow-lg hover:border-primary/30 transition-all duration-500">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-primary/20 mb-6 shadow-[0_0_15px_rgba(250,180,80,0.1)] group-hover:shadow-[0_0_20px_rgba(250,180,80,0.3)] transition-all">
                  <img src={iconExamen} alt="Examen Icon" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="text-xl font-serif mb-3 text-white tracking-wide">Daily Light & Examen</h3>
                <p className="text-white/60 text-sm leading-relaxed font-serif italic">
                  Begin the morning with curated scripture and close the night with the Daily Examen. A rhythmic cycle of spiritual rest.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Card 2 */}
          <div className="col-span-1">
            <Reveal delay={0.3}>
              <div className="glow-card h-full rounded-2xl p-8 flex flex-col items-start group relative border border-white/10 bg-black/80 backdrop-blur-xl shadow-lg hover:border-primary/30 transition-all duration-500">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-primary/20 mb-6 shadow-[0_0_15px_rgba(250,180,80,0.1)] group-hover:shadow-[0_0_20px_rgba(250,180,80,0.3)] transition-all">
                  <img src={iconPastoral} alt="Pastoral Icon" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="text-xl font-serif mb-3 text-white tracking-wide">Pastoral Guidance</h3>
                <p className="text-white/60 text-sm leading-relaxed font-serif italic">
                  Speak to a deeply trained, compassionate AI that understands context, scripture, and emotional weight.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Card 3 */}
          <div className="col-span-1">
            <Reveal delay={0.5}>
               <div className="glow-card h-full rounded-2xl p-8 flex flex-col items-start group relative border border-white/10 bg-black/80 backdrop-blur-xl shadow-lg hover:border-primary/30 transition-all duration-500">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-primary/20 mb-6 shadow-[0_0_15px_rgba(250,180,80,0.1)] group-hover:shadow-[0_0_20px_rgba(250,180,80,0.3)] transition-all">
                  <img src={iconLectio} alt="Lectio Icon" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="text-xl font-serif mb-3 text-white tracking-wide">Lectio Divina</h3>
                <p className="text-white/60 text-sm leading-relaxed font-serif italic">
                  Engage in the ancient practice of divine reading. Read, meditate, pray, and contemplate the Word in a beautifully guided experience.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 mt-20 bg-black/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <span className="font-serif font-medium text-xl text-white uppercase tracking-widest">The Lamp Stand</span>
          </div>
          <p className="text-sm text-white/50 text-center font-serif italic">
            &copy; {new Date().getFullYear()} APEX Sovereign Design. A sanctuary for the soul.
          </p>
        </div>
      </footer>
    </div>
  );
}
