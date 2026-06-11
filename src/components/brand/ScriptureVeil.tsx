import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/** Light-in-darkness scripture, KJV (public domain). No filler — the real Word. */
const VERSES: Array<{ ref: string; text: string }> = [
  {
    ref: 'Psalm 119:105',
    text: 'Thy word is a lamp unto my feet, and a light unto my path.',
  },
  {
    ref: 'John 1:4–5',
    text: 'In him was life; and the life was the light of men. And the light shineth in darkness; and the darkness comprehended it not.',
  },
  {
    ref: 'Isaiah 42:16',
    text: 'And I will bring the blind by a way that they knew not; I will lead them in paths that they have not known: I will make darkness light before them, and crooked things straight.',
  },
  {
    ref: 'Psalm 23:4',
    text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
  },
  {
    ref: 'John 8:12',
    text: 'I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life.',
  },
  {
    ref: 'Isaiah 9:2',
    text: 'The people that walked in darkness have seen a great light: they that dwell in the land of the shadow of death, upon them hath the light shined.',
  },
  {
    ref: 'Micah 7:8',
    text: 'Rejoice not against me, O mine enemy: when I fall, I shall arise; when I sit in darkness, the LORD shall be a light unto me.',
  },
  {
    ref: '2 Samuel 22:29',
    text: 'For thou art my lamp, O LORD: and the LORD will lighten my darkness.',
  },
  {
    ref: 'Matthew 5:14–16',
    text: 'Ye are the light of the world. A city that is set on an hill cannot be hid. Neither do men light a candle, and put it under a bushel, but on a candlestick; and it giveth light unto all that are in the house.',
  },
  {
    ref: 'Psalm 27:1',
    text: 'The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?',
  },
  {
    ref: 'Psalm 18:28',
    text: 'For thou wilt light my candle: the LORD my God will enlighten my darkness.',
  },
  {
    ref: '1 John 1:5',
    text: 'This then is the message which we have heard of him, and declare unto you, that God is light, and in him is no darkness at all.',
  },
];

interface ScriptureVeilProps {
  className?: string;
}

/**
 * A page of real scripture hidden in the dark. The pointer becomes the
 * lamp: a radial mask follows it, illuminating the verses beneath.
 * Attach listeners to the parent section (the veil itself ignores events).
 */
export function ScriptureVeil({ className }: ScriptureVeilProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const surface = el.parentElement ?? el;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--veil-x', `${x}px`);
        el.style.setProperty('--veil-y', `${y}px`);
        el.classList.add('veil-active');
      });
    };
    const onLeave = () => el.classList.remove('veil-active');

    surface.addEventListener('pointermove', onMove);
    surface.addEventListener('pointerleave', onLeave);
    return () => {
      surface.removeEventListener('pointermove', onMove);
      surface.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={cn('scripture-veil', className)} aria-hidden="true">
      <div className="scripture-veil__page">
        {/* tiled so the lamp finds the Word wherever it wanders */}
        {Array.from({ length: 4 }, (_, pass) =>
          VERSES.map((v) => (
            <p key={`${pass}-${v.ref}`} className="scripture-veil__verse">
              <span className="scripture-veil__ref">{v.ref}</span>
              {v.text}
            </p>
          )),
        )}
      </div>
      <div className="scripture-veil__glow" />
    </div>
  );
}
