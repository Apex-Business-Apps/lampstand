import type { ScripturePassage } from '@/types';
import { Bookmark, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScriptureCardProps {
  passage: ScripturePassage;
  onSave?: () => void;
  onShare?: () => void;
  saved?: boolean;
  className?: string;
}

export function ScriptureCard({ passage, onSave, onShare, saved, className = '' }: ScriptureCardProps) {
  return (
    <div className={`glow-card rounded-xl p-6 animate-fade-in ${className}`}>
      <p className="scripture-text mb-4">{passage.text}</p>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          - {passage.reference} <span className="text-xs opacity-60">({passage.translation})</span>
        </p>
        <div className="flex gap-1">
          {onSave && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSave}
              className="h-8 w-8"
              aria-label={saved ? 'Unsave passage' : 'Save passage'}
              title={saved ? 'Unsave passage' : 'Save passage'}
            >
              <Bookmark className={`h-4 w-4 ${saved ? 'fill-primary text-primary' : ''}`} />
            </Button>
          )}
          {onShare && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onShare}
              className="h-8 w-8"
              aria-label="Share passage"
              title="Share passage"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
