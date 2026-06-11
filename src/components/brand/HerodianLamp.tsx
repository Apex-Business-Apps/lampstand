import { useId } from 'react';
import { cn } from '@/lib/utils';

interface HerodianLampProps {
  className?: string;
}

/**
 * A first-century (circa 30 AD) Herodian oil lamp — wheel-thrown terracotta,
 * recessed discus with central filling hole, spatulated nozzle, soot-darkened
 * wick hole. Shaded as if lit by its own flame (warm key light from the right).
 */
export function HerodianLamp({ className }: HerodianLampProps) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 240 160"
      className={cn('w-full', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* clay body — lit warm from the flame side */}
        <linearGradient id={`${id}-body`} x1="30" y1="60" x2="200" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6b3a1c" />
          <stop offset="0.42" stopColor="#9c5a2c" />
          <stop offset="0.78" stopColor="#c97f44" />
          <stop offset="1" stopColor="#e3a166" />
        </linearGradient>
        {/* top surface */}
        <linearGradient id={`${id}-top`} x1="40" y1="70" x2="180" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a4622f" />
          <stop offset="0.6" stopColor="#cd8a4d" />
          <stop offset="1" stopColor="#eab277" />
        </linearGradient>
        {/* recessed discus — shadowed bowl */}
        <radialGradient id={`${id}-discus`} cx="0.42" cy="0.34" r="0.95">
          <stop offset="0" stopColor="#8a4f25" />
          <stop offset="0.65" stopColor="#6e3b1a" />
          <stop offset="1" stopColor="#4f2811" />
        </radialGradient>
        {/* filling hole — darkness with oil sheen */}
        <radialGradient id={`${id}-hole`} cx="0.5" cy="0.38" r="0.8">
          <stop offset="0" stopColor="#2a1306" />
          <stop offset="0.75" stopColor="#160a03" />
          <stop offset="1" stopColor="#0b0502" />
        </radialGradient>
        {/* nozzle top */}
        <linearGradient id={`${id}-nozzle`} x1="150" y1="78" x2="218" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b06c36" />
          <stop offset="0.62" stopColor="#d28f51" />
          <stop offset="1" stopColor="#a05c2c" />
        </linearGradient>
        {/* soot around the wick */}
        <radialGradient id={`${id}-soot`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#1c100a" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#241409" stopOpacity="0.45" />
          <stop offset="1" stopColor="#241409" stopOpacity="0" />
        </radialGradient>
        {/* ground shadow */}
        <radialGradient id={`${id}-shadow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000000" stopOpacity="0.5" />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        {/* warm light pooling on the clay from the flame */}
        <radialGradient id={`${id}-firelight`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffb45e" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffb45e" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* shadow beneath */}
      <ellipse cx="116" cy="138" rx="86" ry="14" fill={`url(#${id}-shadow)`} />

      {/* body side wall */}
      <path
        d="M34 92
           C34 114 64 130 104 130
           C138 130 162 120 172 106
           L208 96
           C212 94.6 213 91 210 88.5
           L172 76
           C162 64 138 56 104 56
           C64 56 34 70 34 92 Z"
        fill={`url(#${id}-body)`}
      />

      {/* top surface */}
      <ellipse cx="104" cy="78" rx="62" ry="24" fill={`url(#${id}-top)`} />

      {/* wheel-turning ridges on the shoulder */}
      <ellipse cx="104" cy="78" rx="52" ry="19.5" stroke="#7c451f" strokeWidth="1.1" opacity="0.55" />
      <ellipse cx="104" cy="78" rx="44" ry="16" stroke="#7c451f" strokeWidth="1" opacity="0.4" />

      {/* recessed discus */}
      <ellipse cx="102" cy="79" rx="36" ry="13.5" fill={`url(#${id}-discus)`} />
      <ellipse cx="102" cy="77.2" rx="36" ry="13.5" stroke="#e7b277" strokeWidth="1" opacity="0.35" />

      {/* central filling hole */}
      <ellipse cx="102" cy="80" rx="10.5" ry="4.6" fill={`url(#${id}-hole)`} />
      <path d="M93 78.6 a10.5 4.6 0 0 1 18.5 -1" stroke="#f3c98c" strokeWidth="0.9" opacity="0.5" />

      {/* nozzle — spatulated, reaching right */}
      <path
        d="M158 70
           C176 68 196 73 210 84
           C214 87 214 92 209 94
           C195 99 176 100 160 96
           C166 88 166 78 158 70 Z"
        fill={`url(#${id}-nozzle)`}
      />
      {/* nozzle underside */}
      <path d="M160 96 C176 100 195 99 209 94 C204 102 188 107 172 105 C165 103 161 100 160 96 Z" fill="#6b3a1c" />

      {/* wick hole with soot stain */}
      <ellipse cx="193" cy="86" rx="14" ry="8" fill={`url(#${id}-soot)`} />
      <ellipse cx="192" cy="85.5" rx="6.2" ry="3.4" fill={`url(#${id}-hole)`} />
      <path d="M186.6 84.4 a6.2 3.4 0 0 1 10.8 -0.6" stroke="#ffd9a0" strokeWidth="0.8" opacity="0.6" />

      {/* burnt rim of the nozzle tip */}
      <path d="M205 82 C210 85 211 90 207 92.5" stroke="#241409" strokeWidth="3" strokeLinecap="round" opacity="0.5" />

      {/* warm firelight licking the clay near the flame */}
      <ellipse cx="182" cy="80" rx="34" ry="20" fill={`url(#${id}-firelight)`} />

      {/* rim highlight from the flame, upper right of the body */}
      <path d="M150 62 C160 65 168 70 171.5 76" stroke="#ffce8f" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
      <path d="M58 67 C72 60 88 57 102 56.6" stroke="#e8aa6d" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />

      {/* base ring catching light */}
      <path d="M58 118 C74 126 96 129.5 116 129" stroke="#3f2210" strokeWidth="2.4" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
