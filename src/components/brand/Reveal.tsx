import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset in milliseconds */
  delay?: number;
}

/** Candlelight easing — a slow warm settle, no bounce. */
export const settle = [0.16, 1, 0.3, 1] as const;

/**
 * Scroll-reveal: children rise out of the dark and settle, once,
 * when they enter the viewport.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.9, delay: delay / 1000, ease: settle }}
    >
      {children}
    </motion.div>
  );
}
