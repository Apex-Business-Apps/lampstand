import lampstandPresence from '@/assets/lampstand-presence.png';

interface GlowOrbProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showImage?: boolean;
}

const sizes = {
  sm: 'w-16 h-16',
  md: 'w-28 h-28',
  lg: 'w-40 h-40',
};

export function GlowOrb({ size = 'md', className = '', showImage = true }: GlowOrbProps) {
  return (
    <div className={`relative flex items-center justify-center ${sizes[size]} ${className}`}>
      <div className="absolute inset-0 glow-orb animate-glow-pulse rounded-full" />
      {showImage && (
        <img
          src={lampstandPresence}
          alt="Lampstand — a warm, sacred presence"
          className={`relative z-10 ${sizes[size]} object-contain opacity-90`}
        />
      )}
    </div>
  );
}
