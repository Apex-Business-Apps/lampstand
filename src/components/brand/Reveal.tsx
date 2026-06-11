import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useReveal } from '@/hooks/useReveal';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset in milliseconds */
  delay?: number;
}

/** Wrapper that fades-and-rises its children into view on scroll. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={cn('reveal', className)} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}
