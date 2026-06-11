import { useId } from 'react';
import { cn } from '@/lib/utils';
import { LampFlame } from './LampFlame';

interface LampStandAssetProps {
  className?: string;
}

/**
 * The brand made literal: a calm flame burning on a golden lampstand —
 * "on a candlestick; and it giveth light unto all that are in the house."
 */
export function LampStandAsset({ className }: LampStandAssetProps) {
  const id = useId();
  return (
    <div className={cn('relative flex flex-col items-center', className)} aria-hidden="true">
      {/* flame overlapping the dish */}
      <LampFlame className="z-10 -mb-7 h-36 w-36 sm:h-44 sm:w-44" withBase={false} />

      {/* the stand */}
      <svg viewBox="0 0 160 190" className="relative w-40 sm:w-48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`${id}-gold`} x1="80" y1="0" x2="80" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#eec368" />
            <stop offset="0.45" stopColor="#bf8132" />
            <stop offset="1" stopColor="#7c4e1c" />
          </linearGradient>
          <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#8a5420" />
            <stop offset="0.5" stopColor="#f3d27e" />
            <stop offset="1" stopColor="#8a5420" />
          </linearGradient>
        </defs>

        {/* dish */}
        <path d="M36 10 C36 22 56 30 80 30 C104 30 124 22 124 10 L116 10 C116 17 100 23 80 23 C60 23 44 17 44 10 Z" fill={`url(#${id}-rim)`} />
        <ellipse cx="80" cy="10" rx="44" ry="7" fill="#5d3a14" />
        <ellipse cx="80" cy="8.6" rx="38" ry="5.4" fill="#9c6428" />

        {/* stem with knops */}
        <path d="M74 29 L72 52 L88 52 L86 29 Z" fill={`url(#${id}-gold)`} />
        <ellipse cx="80" cy="56" rx="14" ry="6.5" fill={`url(#${id}-rim)`} />
        <path d="M73 61 L70 96 L90 96 L87 61 Z" fill={`url(#${id}-gold)`} />
        <ellipse cx="80" cy="100" rx="17" ry="7.5" fill={`url(#${id}-rim)`} />
        <path d="M71 106 L67 140 L93 140 L89 106 Z" fill={`url(#${id}-gold)`} />

        {/* flared base */}
        <path d="M67 138 C40 142 24 152 20 164 L140 164 C136 152 120 142 93 138 Z" fill={`url(#${id}-gold)`} />
        <ellipse cx="80" cy="166" rx="62" ry="9" fill="#5d3a14" />
        <ellipse cx="80" cy="163.5" rx="56" ry="7" fill="#9c6428" />

        {/* central highlight */}
        <path d="M78 30 L77 138" stroke="#f3d27e" strokeWidth="2.4" strokeLinecap="round" opacity="0.5" />
      </svg>

      {/* pool of light on the ground */}
      <div className="pointer-events-none absolute -bottom-9 h-16 w-72 rounded-full bg-[radial-gradient(ellipse,hsl(var(--warm-glow)/0.3),transparent_70%)] blur-md" />
    </div>
  );
}
