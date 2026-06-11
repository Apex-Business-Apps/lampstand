import { useId } from 'react';
import { cn } from '@/lib/utils';

/**
 * Bespoke sacred iconography for The Lamp Stand — hand-drawn gradient SVGs.
 * Sized with width/height classes via `className` (defaults to 1em square).
 */

interface IconProps {
  className?: string;
}

function Svg({ className, children, label }: IconProps & { children: React.ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={label}
      className={cn('h-[1em] w-[1em]', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

/** Ancient clay oil lamp, lit — Daily Light. */
export function OilLampIcon({ className }: IconProps) {
  const id = useId();
  return (
    <Svg className={className} label="Oil lamp">
      <defs>
        <linearGradient id={`${id}-body`} x1="12" y1="27" x2="52" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e9b85b" />
          <stop offset="0.55" stopColor="#bf8132" />
          <stop offset="1" stopColor="#8a5420" />
        </linearGradient>
        <radialGradient id={`${id}-flame`} cx="0.5" cy="0.72" r="0.75">
          <stop offset="0" stopColor="#fff8d2" />
          <stop offset="0.45" stopColor="#ffd76a" />
          <stop offset="1" stopColor="#ef8c1d" />
        </radialGradient>
      </defs>
      {/* glow */}
      <circle cx="51" cy="17" r="12" fill="#f8b53c" opacity="0.22" />
      {/* flame at the spout */}
      <path d="M51 6 C54.4 11 56.8 14.6 56.8 18 a5.8 5.8 0 0 1 -11.6 0 C45.2 14.6 47.6 11 51 6 Z" fill={`url(#${id}-flame)`} />
      {/* wick */}
      <path d="M51 24 v3.5" stroke="#5d3a14" strokeWidth="1.8" strokeLinecap="round" />
      {/* body with spout reaching right */}
      <path
        d="M12 36 C12 31 19 28 27.5 27.5 L40 27 C45 27 49.5 28 52.5 30.5 L60 28.5 C59 31.5 56.5 34.5 52.5 36 C50 42.5 42 46.5 32 46.5 C20.5 46.5 12 42 12 36 Z"
        fill={`url(#${id}-body)`}
      />
      {/* lid */}
      <ellipse cx="30" cy="27.8" rx="9.5" ry="2.7" fill="#8a5420" />
      <circle cx="30" cy="25.4" r="2.3" fill="#e9b85b" />
      {/* handle */}
      <path d="M12.5 32 C5.5 31 3.5 37.5 8.8 40.8" stroke="#8a5420" strokeWidth="2.8" strokeLinecap="round" />
      {/* foot */}
      <path d="M25 46.5 L39 46.5 L36.5 51 L27.5 51 Z" fill="#8a5420" />
      <ellipse cx="32" cy="52.2" rx="9.5" ry="2.3" fill="#6e421a" />
      {/* highlight */}
      <path d="M17.5 32.5 C19.8 30.6 24 29.4 28.5 29.1" stroke="#ffe09a" strokeWidth="1.7" strokeLinecap="round" opacity="0.85" />
    </Svg>
  );
}

/** Dove bearing an olive branch — Pastoral Guidance, the Spirit's gentleness. */
export function DoveIcon({ className }: IconProps) {
  const id = useId();
  return (
    <Svg className={className} label="Dove with olive branch">
      <defs>
        <linearGradient id={`${id}-body`} x1="32" y1="22" x2="32" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fffdf4" />
          <stop offset="1" stopColor="#e8d2a0" />
        </linearGradient>
      </defs>
      {/* rays of light above */}
      <g stroke="#f0b840" strokeWidth="1.7" strokeLinecap="round" opacity="0.55">
        <path d="M30 5 v6" />
        <path d="M18 8 l2.8 5" />
        <path d="M42 8 l-2.8 5" />
      </g>
      {/* far wing */}
      <path d="M30 28 C25 19 17 14.5 8.5 15.5 C12 22 18 26.5 26 28.5 Z" fill="#d2b176" />
      {/* body, head right */}
      <path
        d="M13 39 C19 32.5 27.5 30.5 35.5 31.5 C41.5 32 46 29.5 48 25.5 C49.8 27.5 49.6 30.5 48 32.8 L56.5 34 L47.5 38.5 C42.5 45.5 33.5 48.8 24.5 47 C19.3 46 15.2 42.8 13 39 Z"
        fill={`url(#${id}-body)`}
      />
      {/* near wing */}
      <path d="M31 33 C29.5 24 23 17.5 13.5 16.5 C15.5 25 22 31.5 30 33.6 Z" fill="#fffdf4" />
      {/* tail */}
      <path d="M15.5 38 C9.5 39 5.5 42 3.5 46.5 C9 47 14.5 45 17.5 41.5 Z" fill="#d2b176" />
      {/* eye + beak */}
      <circle cx="46.6" cy="28.6" r="1" fill="#6b4d20" />
      <path d="M50.5 28.2 l4.4 1.7 -4.8 1 Z" fill="#e89b2e" />
      {/* olive branch */}
      <path d="M53.5 30.5 C57.5 32.5 59.5 36.5 58.8 40.5" stroke="#7d9b5a" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="57.2" cy="33.6" rx="2.7" ry="1.1" transform="rotate(38 57.2 33.6)" fill="#8fae6a" />
      <ellipse cx="58.9" cy="37.8" rx="2.5" ry="1" transform="rotate(72 58.9 37.8)" fill="#7d9b5a" />
    </Svg>
  );
}

/** Open scroll — Sermon Mode. */
export function ScrollIcon({ className }: IconProps) {
  const id = useId();
  return (
    <Svg className={className} label="Open scroll">
      <defs>
        <linearGradient id={`${id}-sheet`} x1="32" y1="16" x2="32" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f8ecd2" />
          <stop offset="1" stopColor="#e2cb9f" />
        </linearGradient>
        <linearGradient id={`${id}-rod`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d09a47" />
          <stop offset="0.5" stopColor="#9a6526" />
          <stop offset="1" stopColor="#7c4e1c" />
        </linearGradient>
      </defs>
      {/* sheet */}
      <path d="M14 17.5 C26 15.5 38 19.5 50 17.5 L50 46.5 C38 48.5 26 44.5 14 46.5 Z" fill={`url(#${id}-sheet)`} />
      {/* rollers */}
      <rect x="8.5" y="13" width="7.5" height="38" rx="3.75" fill={`url(#${id}-rod)`} />
      <rect x="48" y="13" width="7.5" height="38" rx="3.75" fill={`url(#${id}-rod)`} />
      {/* roller knobs */}
      <circle cx="12.25" cy="11.5" r="2.4" fill="#b97a2e" />
      <circle cx="51.75" cy="11.5" r="2.4" fill="#b97a2e" />
      <circle cx="12.25" cy="52.5" r="2.4" fill="#b97a2e" />
      <circle cx="51.75" cy="52.5" r="2.4" fill="#b97a2e" />
      {/* text */}
      <g stroke="#a8814b" strokeWidth="1.7" strokeLinecap="round" opacity="0.75">
        <path d="M21 25 h22" />
        <path d="M21 30.5 h22" />
        <path d="M21 36 h15" />
        <path d="M21 41.5 h22" />
      </g>
    </Svg>
  );
}

/** Open Bible — reading; pass `rays` for Lectio Divina (light descending on the Word). */
export function OpenBookIcon({ className, rays = false }: IconProps & { rays?: boolean }) {
  const id = useId();
  return (
    <Svg className={className} label={rays ? 'Open Bible with light' : 'Open Bible'}>
      <defs>
        <linearGradient id={`${id}-page`} x1="32" y1="18" x2="32" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fdf6e2" />
          <stop offset="1" stopColor="#e9d4a8" />
        </linearGradient>
      </defs>
      {rays && (
        <g stroke="#f0b840" strokeWidth="1.8" strokeLinecap="round" opacity="0.6">
          <path d="M32 5 v9" />
          <path d="M19 8 l4.5 8" />
          <path d="M45 8 l-4.5 8" />
        </g>
      )}
      {/* cover */}
      <path
        d="M32 23 C25 17 14 15 6 17.5 L6 48 C14 45.5 25 47 32 52 C39 47 50 45.5 58 48 L58 17.5 C50 15 39 17 32 23 Z"
        fill="#8a5420"
      />
      {/* pages */}
      <path d="M32 25 C26.5 20.5 17.5 19 10 20.8 L10 44.6 C17.5 43.2 26.5 44.5 32 48.6 Z" fill={`url(#${id}-page)`} />
      <path d="M32 25 C37.5 20.5 46.5 19 54 20.8 L54 44.6 C46.5 43.2 37.5 44.5 32 48.6 Z" fill={`url(#${id}-page)`} />
      {/* spine shadow */}
      <path d="M32 25 V48.6" stroke="#c9a05f" strokeWidth="1.6" />
      {/* verse lines */}
      <g stroke="#b3925e" strokeWidth="1.3" strokeLinecap="round" opacity="0.8">
        <path d="M14.5 26.5 c4.5 -0.9 9 -0.4 13.5 1.4" />
        <path d="M14.5 31.5 c4.5 -0.9 9 -0.4 13.5 1.4" />
        <path d="M14.5 36.5 c3.4 -0.7 6.7 -0.5 10 0.6" />
        <path d="M36 27.9 c4.5 -1.8 9 -2.3 13.5 -1.4" />
        <path d="M36 32.9 c4.5 -1.8 9 -2.3 13.5 -1.4" />
        <path d="M36 37.1 c3.3 -1.1 6.6 -1.4 10 -0.8" />
      </g>
      {/* ribbon marker */}
      <path d="M30.6 50 L32 56.5 L33.4 50" fill="#b3402f" />
    </Svg>
  );
}

/** Candle under a crescent moon — The Daily Examen. */
export function CandleMoonIcon({ className }: IconProps) {
  const id = useId();
  return (
    <Svg className={className} label="Evening candle">
      <defs>
        <radialGradient id={`${id}-flame`} cx="0.5" cy="0.72" r="0.75">
          <stop offset="0" stopColor="#fff8d2" />
          <stop offset="0.45" stopColor="#ffd76a" />
          <stop offset="1" stopColor="#ef8c1d" />
        </radialGradient>
        <linearGradient id={`${id}-wax`} x1="24" y1="28" x2="24" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f9efd9" />
          <stop offset="1" stopColor="#e4d0a6" />
        </linearGradient>
      </defs>
      {/* moon */}
      <path d="M49 8 a9 9 0 1 0 8.5 12.5 A10.5 10.5 0 0 1 49 8 Z" fill="#e8c76a" opacity="0.9" />
      {/* glow */}
      <circle cx="24" cy="19" r="10.5" fill="#f8b53c" opacity="0.22" />
      {/* flame */}
      <path d="M24 10.5 C26.8 14.5 29 17.6 29 20.4 a5 5 0 0 1 -10 0 C19 17.6 21.2 14.5 24 10.5 Z" fill={`url(#${id}-flame)`} />
      {/* wick */}
      <path d="M24 23.5 v4" stroke="#7a5a30" strokeWidth="1.7" strokeLinecap="round" />
      {/* candle with melted lip */}
      <path d="M16 30 C18.5 27.6 21 30.8 24 29 C27 27.2 29.5 30.4 32 29.2 L32 51 L16 51 Z" fill={`url(#${id}-wax)`} />
      {/* drip */}
      <path d="M18.5 30.5 C18.5 33.5 17 34.5 17 36.5 a1.6 1.6 0 0 0 3.2 0 C20.2 34.5 19.5 33.5 18.5 30.5 Z" fill="#f9efd9" />
      {/* brass holder */}
      <ellipse cx="24" cy="52.5" rx="13.5" ry="3.4" fill="#b97a2e" />
      <ellipse cx="24" cy="51.4" rx="10.5" ry="2.4" fill="#d09a47" />
      {/* finger ring */}
      <circle cx="42.5" cy="50.5" r="3.6" stroke="#b97a2e" strokeWidth="2.6" />
    </Svg>
  );
}

/** Door ajar, light spilling out — The Return. */
export function DoorLightIcon({ className }: IconProps) {
  const id = useId();
  return (
    <Svg className={className} label="Open door with light">
      <defs>
        <radialGradient id={`${id}-light`} cx="0.5" cy="0.85" r="1">
          <stop offset="0" stopColor="#ffe9ad" />
          <stop offset="0.55" stopColor="#f8c95e" />
          <stop offset="1" stopColor="#e9962b" />
        </radialGradient>
      </defs>
      {/* light on the floor */}
      <path d="M21 54 L12 61 L52 61 L44 54 Z" fill="#f8d27a" opacity="0.45" />
      {/* arched frame */}
      <path d="M17 54 V26 C17 15.5 24 9 32 9 C40 9 47 15.5 47 26 V54 Z" fill="#6e4a23" />
      {/* glowing doorway */}
      <path d="M21 54 V27 C21 19 26 13.5 32 13.5 C38 13.5 43 19 43 27 V54 Z" fill={`url(#${id}-light)`} />
      {/* door swung open */}
      <path d="M43 54 V13.5 L53.5 19.5 V59 Z" fill="#8a5420" />
      <path d="M45.5 17.5 L51 21.5 V55.5 L45.5 51.5 Z" fill="#9c6428" opacity="0.55" />
      <circle cx="45.8" cy="36" r="1.3" fill="#e9b85b" />
      {/* threshold */}
      <path d="M15 54 H49" stroke="#5d3a14" strokeWidth="2.4" strokeLinecap="round" />
    </Svg>
  );
}

/* ===== Mini silhouettes for compact chrome (inherit currentColor) ===== */

function MiniSvg({ className, children, label }: IconProps & { children: React.ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={label}
      className={cn('h-5 w-5', className)}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

/** Little chapel — Home. */
export function ChapelMini({ className }: IconProps) {
  return (
    <MiniSvg className={className} label="Home">
      <path d="M11.25 2.5 h1.5 v1.25 H14 v1.5 h-1.25 V6.6 L19 11.4 V21 h-4.6 v-4.2 a2.4 2.4 0 0 0 -4.8 0 V21 H5 v-9.6 l6.25 -4.8 V5.25 H10 v-1.5 h1.25 Z" />
    </MiniSvg>
  );
}

/** Little oil lamp — Daily Light. */
export function LampMini({ className }: IconProps) {
  return (
    <MiniSvg className={className} label="Daily Light">
      <path d="M17.6 4.2 c1.1 1.6 1.9 2.9 1.9 4 a1.95 1.95 0 0 1 -3.9 0 c0 -1.1 0.9 -2.4 2 -4 Z" />
      <path d="M3.5 14.2 c0 -1.9 2.6 -3.1 5.8 -3.3 l4.6 -0.2 c1.8 0 3.4 0.4 4.5 1.3 l3 -0.8 c-0.4 1.2 -1.3 2.3 -2.7 2.9 -0.9 2.4 -3.9 3.9 -7.6 3.9 -4.3 0 -7.6 -1.7 -7.6 -3.8 Z" />
      <path d="M9 18.6 h6 l-1 1.9 h-4 Z" />
    </MiniSvg>
  );
}

/** Little dove — Guidance. */
export function DoveMini({ className }: IconProps) {
  return (
    <MiniSvg className={className} label="Guidance">
      <path d="M11.5 10.2 C10.6 7.2 8.3 5.2 5 4.9 c0.8 3 3 5.2 6 6 Z" opacity="0.55" />
      <path d="M4.5 14.6 c2.2 -2.4 5.3 -3.2 8.3 -2.8 2.2 0.2 3.9 -0.7 4.6 -2.2 0.7 0.8 0.7 1.9 0.1 2.8 l3.1 0.5 -3.3 1.6 c-1.9 2.6 -5.2 3.8 -8.5 3.1 -1.9 -0.4 -3.4 -1.6 -4.3 -3 Z" />
    </MiniSvg>
  );
}

/** Little open book — Saved. */
export function BookMini({ className }: IconProps) {
  return (
    <MiniSvg className={className} label="Saved">
      <path d="M12 6.8 C9.6 4.8 6 4.2 3 5 V18 c3 -0.8 6.6 -0.3 9 1.7 2.4 -2 6 -2.5 9 -1.7 V5 c-3 -0.8 -6.6 -0.2 -9 1.8 Z M11.2 8.3 v9.2 c-1.9 -1.1 -4.3 -1.5 -6.6 -1.3 V6.7 c2.4 -0.3 4.8 0.3 6.6 1.6 Z m1.6 0 c1.8 -1.3 4.2 -1.9 6.6 -1.6 v9.5 c-2.3 -0.2 -4.7 0.2 -6.6 1.3 Z" />
    </MiniSvg>
  );
}

/** Robed figure — Settings/profile. */
export function SoulMini({ className }: IconProps) {
  return (
    <MiniSvg className={className} label="Settings">
      <circle cx="12" cy="7" r="3.4" />
      <path d="M12 12 c-3.8 0 -6.5 2.6 -7 7 l-0.2 2 h14.4 L19 19 c-0.5 -4.4 -3.2 -7 -7 -7 Z" />
    </MiniSvg>
  );
}
