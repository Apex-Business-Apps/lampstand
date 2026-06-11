import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandWordmarkProps {
  className?: string;
  /** 'light' for dark backgrounds, 'dark' for light backgrounds */
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

const textSizes = {
  sm: 'text-xl',
  md: 'text-2xl sm:text-3xl',
  lg: 'text-3xl sm:text-4xl',
};

const markSizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const flameSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

/** "The Lamp Stand" wordmark with the gold flame mark. */
export function BrandWordmark({ className, tone = 'dark', size = 'md' }: BrandWordmarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span
        className={cn(
          'relative flex items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--sacred-gold))] to-[hsl(var(--ember))] shadow-[0_0_24px_hsl(var(--warm-glow)/0.5)]',
          markSizes[size],
        )}
      >
        <Flame className={cn('text-[hsl(40_40%_98%)]', flameSizes[size])} />
      </span>
      <span
        className={cn(
          'font-display font-semibold leading-none tracking-tight',
          textSizes[size],
          tone === 'light' ? 'text-[hsl(var(--night-foreground))]' : 'text-foreground',
        )}
      >
        The <span className="text-gold-shimmer">Lamp</span> Stand
      </span>
    </span>
  );
}
