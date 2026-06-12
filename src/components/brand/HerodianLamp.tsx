import { useId } from 'react';
import { cn } from '@/lib/utils';

interface HerodianLampProps {
  className?: string;
}

const BODY_PATH =
  'M22 102 C28 86 50 78 76 75 C94 58 128 49 160 51 C200 54 230 71 234 94 C237 117 212 136 174 140 C132 145 86 135 58 121 C40 113 26 110 22 102 Z';
const NOZZLE_TOP_PATH =
  'M24 100 C32 88 52 81 74 80 C88 80 96 87 94 96 C92 106 76 112 56 112 C40 112 28 108 24 100 Z';

/**
 * A first-century terracotta oil lamp, painted from a museum reference:
 * pear-shaped reservoir, open oil-filled hole ringed by a raised collar,
 * loop handle, volute scrolls, soot-blackened nozzle with a charred wick.
 * Rendered with true surface relief (turbulence-driven diffuse lighting),
 * clay grain, ambient occlusion, and firelight that breathes with the flame.
 */
export function HerodianLamp({ className }: HerodianLampProps) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 260 170"
      className={cn('w-full', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* weathered terracotta body */}
        <linearGradient id={`${id}-body`} x1="130" y1="48" x2="150" y2="142" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d59a6a" />
          <stop offset="0.5" stopColor="#b5754a" />
          <stop offset="1" stopColor="#6e3c20" />
        </linearGradient>
        {/* top plane, catching the most light */}
        <linearGradient id={`${id}-top`} x1="100" y1="56" x2="190" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#dda673" />
          <stop offset="0.6" stopColor="#c98a58" />
          <stop offset="1" stopColor="#a4602f" />
        </linearGradient>
        <linearGradient id={`${id}-handle`} x1="210" y1="30" x2="245" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d59a6a" />
          <stop offset="1" stopColor="#8a4f28" />
        </linearGradient>
        {/* the dark interior of the filling hole */}
        <radialGradient id={`${id}-hole`} cx="0.5" cy="0.35" r="0.85">
          <stop offset="0" stopColor="#33180a" />
          <stop offset="0.7" stopColor="#1b0d04" />
          <stop offset="1" stopColor="#0e0602" />
        </radialGradient>
        {/* olive oil pooled inside — dark amber, barely catching the flame */}
        <radialGradient id={`${id}-oil`} cx="0.42" cy="0.3" r="0.95">
          <stop offset="0" stopColor="#6a4f1e" />
          <stop offset="0.45" stopColor="#4a3613" />
          <stop offset="1" stopColor="#241a08" />
        </radialGradient>
        {/* soot around the nozzle */}
        <radialGradient id={`${id}-soot`} cx="0.45" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#150c07" stopOpacity="0.96" />
          <stop offset="0.55" stopColor="#1d1108" stopOpacity="0.7" />
          <stop offset="1" stopColor="#241409" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-shadow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-firelight`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffb45e" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffb45e" stopOpacity="0" />
        </radialGradient>
        {/* reflected warm bounce on the underside */}
        <radialGradient id={`${id}-bounce`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#b3744a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#b3744a" stopOpacity="0" />
        </radialGradient>

        {/* everything painted on the clay stays on the clay */}
        <clipPath id={`${id}-clay`}>
          <path d={BODY_PATH} />
          <path d={NOZZLE_TOP_PATH} />
        </clipPath>

        {/* fired-clay relief: noise as a bump map under a raking light,
            converted to a pure shadow ink (dark where the surface dips) */}
        <filter id={`${id}-relief`} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55 0.4" numOctaves="3" seed="11" result="bump" />
          <feDiffuseLighting in="bump" lightingColor="#ffffff" surfaceScale="1.6" diffuseConstant="1.1" result="lit">
            <feDistantLight azimuth="225" elevation="55" />
          </feDiffuseLighting>
          <feColorMatrix in="lit" type="luminanceToAlpha" result="la" />
          <feComponentTransfer in="la" result="inv">
            <feFuncA type="table" tableValues="0.85 0" />
          </feComponentTransfer>
          <feFlood floodColor="#2a1409" result="ink" />
          <feComposite in="ink" in2="inv" operator="in" />
        </filter>
        {/* fine pore grain */}
        <filter id={`${id}-grain`} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0.93  0 0 0 0 0.84  0 0 0 0 0.68  0 0 0 0.5 0"
          />
        </filter>
        <filter id={`${id}-soft3`}><feGaussianBlur stdDeviation="3" /></filter>
        <filter id={`${id}-soft6`}><feGaussianBlur stdDeviation="6" /></filter>
      </defs>

      {/* ground shadow — wide ambient + tight contact */}
      <ellipse cx="132" cy="148" rx="100" ry="14" fill={`url(#${id}-shadow)`} />
      <ellipse cx="130" cy="143" rx="64" ry="6.5" fill="#000000" opacity="0.4" filter={`url(#${id}-soft3)`} />

      {/* loop handle (behind the body) */}
      <path
        d="M214 74
           C206 48 218 28 236 30
           C254 32 258 56 244 76
           L232 70
           C242 56 240 42 232 41
           C224 40 218 52 226 72 Z"
        fill={`url(#${id}-handle)`}
      />
      <path d="M236 33 C248 36 252 50 245 64" stroke="#e8b988" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
      {/* occlusion where the handle roots into the body */}
      <ellipse cx="224" cy="74" rx="12" ry="6" fill="#3f2210" opacity="0.5" filter={`url(#${id}-soft3)`} />

      {/* body — fat reservoir tapering to the nozzle, left */}
      <path d={BODY_PATH} fill={`url(#${id}-body)`} />

      <g clipPath={`url(#${id}-clay)`}>
        {/* sculpted relief and grain over the whole clay */}
        <rect x="10" y="40" width="240" height="115" filter={`url(#${id}-relief)`} opacity="0.5" />
        <rect x="10" y="40" width="240" height="115" filter={`url(#${id}-grain)`} opacity="0.08" />

        {/* hue drift of hand-fired clay — cooler umber in shade, sienna near fire */}
        <ellipse cx="206" cy="120" rx="48" ry="26" fill="#5d3a26" opacity="0.4" filter={`url(#${id}-soft6)`} />
        <ellipse cx="92" cy="70" rx="40" ry="20" fill="#e2a368" opacity="0.35" filter={`url(#${id}-soft6)`} />

        {/* core shadow along the lower belly */}
        <path d="M40 116 C80 138 150 148 210 136 L210 160 L40 160 Z" fill="#33190b" opacity="0.55" filter={`url(#${id}-soft6)`} />
        {/* reflected bounce light just above the base */}
        <ellipse cx="138" cy="132" rx="70" ry="10" fill={`url(#${id}-bounce)`} filter={`url(#${id}-soft3)`} />

        {/* firelight pooling on the clay near the flame — breathes with it */}
        <ellipse cx="62" cy="92" rx="44" ry="26" fill={`url(#${id}-firelight)`} className="animate-glow-pulse" />
      </g>

      {/* top plane of the shoulder */}
      <ellipse cx="156" cy="82" rx="58" ry="27" fill={`url(#${id}-top)`} />
      <g clipPath={`url(#${id}-clay)`}>
        <ellipse cx="156" cy="82" rx="58" ry="27" filter={`url(#${id}-grain)`} opacity="0.08" />
      </g>

      {/* raised collar ring around the filling hole */}
      <ellipse cx="154" cy="82" rx="44" ry="21" stroke="#8a4f28" strokeWidth="2.2" opacity="0.7" />
      <ellipse cx="154" cy="80.4" rx="44" ry="21" stroke="#e8b988" strokeWidth="1.3" opacity="0.5" />
      {/* occlusion in the channel just inside the collar */}
      <ellipse cx="154" cy="83" rx="39" ry="18" stroke="#4a2812" strokeWidth="4" opacity="0.35" filter={`url(#${id}-soft3)`} />

      {/* the open filling hole, oil inside */}
      <ellipse cx="154" cy="83" rx="35" ry="16.5" fill={`url(#${id}-hole)`} />
      {/* inner clay wall catching light at the back of the hole */}
      <path d="M121 79 a35 16.5 0 0 1 66 -2.5 c-8 -5.5 -22 -9 -34 -9 c-12 0 -24 4.5 -32 11.5 Z" fill="#7a4424" opacity="0.85" />
      {/* the oil surface */}
      <ellipse cx="155" cy="86" rx="29" ry="12" fill={`url(#${id}-oil)`} />
      {/* faint sheen on the oil */}
      <ellipse cx="146" cy="82.5" rx="11" ry="3.2" fill="#d9c178" opacity="0.18" />
      <ellipse cx="168" cy="89" rx="5" ry="1.6" fill="#e9d795" opacity="0.12" />
      {/* rim highlight on the collar, flame side */}
      <path d="M113 86 a44 21 0 0 1 14 -14" stroke="#f3c98c" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />

      {/* volute scrolls on the shoulder by the nozzle */}
      <path d="M84 92 c-7 -1 -10 5 -5 8 c4 2 8 -1 6 -5 c-1 -2.5 -4 -3 -5 -1" stroke="#6e3c20" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
      <path d="M96 79 c-6 -3 -11 2 -7 6 c3 3 8 0 6 -3.5" stroke="#6e3c20" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* nozzle top surface */}
      <path d={NOZZLE_TOP_PATH} fill={`url(#${id}-top)`} opacity="0.9" />

      {/* heavy soot blackening the nozzle — kept on the clay */}
      <g clipPath={`url(#${id}-clay)`}>
        <ellipse cx="50" cy="99" rx="38" ry="20" fill={`url(#${id}-soot)`} />
      </g>

      {/* wick hole */}
      <ellipse cx="47" cy="99" rx="16" ry="9.5" fill={`url(#${id}-hole)`} />
      <path d="M32.5 96.5 a16 9.5 0 0 1 28 -3" stroke="#5e4a2a" strokeWidth="1" opacity="0.6" />

      {/* charred wick leaning out of the hole */}
      <path d="M50 99 C52 92 56 87 61 84 L66 88 C61 91 57 95 56 101 Z" fill="#3a2410" />
      <path d="M60 84.5 C63 82.5 66 82.5 67.5 84.5 C69 86.5 67 89.5 64.5 89.5 Z" fill="#191007" />

      {/* weathering — faint lime encrustation and old scratches */}
      <g clipPath={`url(#${id}-clay)`}>
        <ellipse cx="196" cy="118" rx="13" ry="6" fill="#e9cfa4" opacity="0.07" filter={`url(#${id}-soft3)`} />
        <ellipse cx="120" cy="126" rx="16" ry="5" fill="#e9cfa4" opacity="0.06" filter={`url(#${id}-soft3)`} />
        <path d="M108 112 c14 4 30 6 44 5" stroke="#e9cfa4" strokeWidth="1" strokeLinecap="round" opacity="0.14" />
        <path d="M150 122 c10 1 22 0 32 -3" stroke="#5e3018" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
        <ellipse cx="176" cy="132" rx="2.4" ry="1.2" fill="#4a2812" opacity="0.45" />
        <ellipse cx="98" cy="118" rx="1.8" ry="1" fill="#4a2812" opacity="0.4" />
      </g>

      {/* rim light along the upper body contour */}
      <path d="M100 60 C120 53 148 50 172 53" stroke="#eebd8a" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      {/* hot specular kiss where the flame faces the shoulder */}
      <path d="M90 84 C96 80 104 77 112 76" stroke="#ffd9a0" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
      {/* deep base shadow line */}
      <path d="M70 126 C96 136 140 142 176 139" stroke="#3f2210" strokeWidth="2.6" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}
