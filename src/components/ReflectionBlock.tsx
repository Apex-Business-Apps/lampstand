interface ReflectionBlockProps {
  label: string;
  content: string;
  variant?: 'reflection' | 'prayer' | 'relevance';
  className?: string;
}

const variantStyles = {
  reflection: 'reflection-text',
  prayer: 'prayer-text',
  relevance: 'reflection-text',
};

const labelColors = {
  reflection: 'text-sacred-gold',
  prayer: 'text-ember',
  relevance: 'text-sage',
};

export function ReflectionBlock({ label, content, variant = 'reflection', className = '' }: ReflectionBlockProps) {
  return (
    <div className={`rounded-lg bg-secondary/50 p-5 animate-slide-up ${className}`}>
      <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${labelColors[variant]}`}>{label}</p>
      <div className={variantStyles[variant]}>
        {content.split('\n\n').map((para, i) => (
          <p key={i} className={i > 0 ? 'mt-3' : ''}>{para}</p>
        ))}
      </div>
    </div>
  );
}
