import { useState, useEffect, useRef } from 'react';

/**
 * Simulates streaming text output character-by-character.
 * Drop-in for any AI text reveal. WPM ~250 words = ~25 chars/sec.
 */
export function useStreamText(fullText: string, enabled = true, wpm = 300) {
  const [displayed, setDisplayed] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const charsPerMs = (wpm * 5) / (60 * 1000); // avg 5 chars/word

  useEffect(() => {
    if (!enabled || !fullText) {
      setDisplayed(fullText ?? '');
      setIsStreaming(false);
      return;
    }

    setDisplayed('');
    setIsStreaming(true);
    let idx = 0;

    function tick() {
      // Reveal ~2-4 chars per frame for natural feel
      const chunkSize = Math.max(1, Math.round(charsPerMs * 16));
      idx = Math.min(idx + chunkSize, fullText.length);
      setDisplayed(fullText.slice(0, idx));
      if (idx < fullText.length) {
        rafRef.current = setTimeout(tick, 16);
      } else {
        setIsStreaming(false);
      }
    }

    rafRef.current = setTimeout(tick, 80); // initial delay

    return () => {
      if (rafRef.current) clearTimeout(rafRef.current);
    };
  }, [fullText, enabled, charsPerMs]);

  return { text: displayed, isStreaming };
}
