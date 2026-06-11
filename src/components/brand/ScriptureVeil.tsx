import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Light-in-darkness passages, KJV (public domain), set as a true Bible
 * page: book heading, chapter drop cap, run-on verses with verse numbers.
 */
const PASSAGES: Array<{
  book: string;
  chapter: string;
  verses: Array<{ n: number; t: string }>;
}> = [
  {
    book: 'The Gospel According to St. John',
    chapter: '1',
    verses: [
      { n: 1, t: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
      { n: 2, t: 'The same was in the beginning with God.' },
      { n: 3, t: 'All things were made by him; and without him was not any thing made that was made.' },
      { n: 4, t: 'In him was life; and the life was the light of men.' },
      { n: 5, t: 'And the light shineth in darkness; and the darkness comprehended it not.' },
      { n: 6, t: 'There was a man sent from God, whose name was John.' },
      { n: 7, t: 'The same came for a witness, to bear witness of the Light, that all men through him might believe.' },
      { n: 8, t: 'He was not that Light, but was sent to bear witness of that Light.' },
      { n: 9, t: 'That was the true Light, which lighteth every man that cometh into the world.' },
    ],
  },
  {
    book: 'The Psalms',
    chapter: '119',
    verses: [
      { n: 105, t: 'Thy word is a lamp unto my feet, and a light unto my path.' },
      { n: 106, t: 'I have sworn, and I will perform it, that I will keep thy righteous judgments.' },
      { n: 107, t: 'I am afflicted very much: quicken me, O LORD, according unto thy word.' },
      { n: 109, t: 'My soul is continually in my hand: yet do I not forget thy law.' },
      { n: 111, t: 'Thy testimonies have I taken as an heritage for ever: for they are the rejoicing of my heart.' },
    ],
  },
  {
    book: 'The Psalms',
    chapter: '23',
    verses: [
      { n: 1, t: 'The LORD is my shepherd; I shall not want.' },
      { n: 2, t: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.' },
      { n: 3, t: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name’s sake.' },
      { n: 4, t: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.' },
      { n: 5, t: 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.' },
      { n: 6, t: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.' },
    ],
  },
  {
    book: 'The Book of the Prophet Isaiah',
    chapter: '9',
    verses: [
      { n: 2, t: 'The people that walked in darkness have seen a great light: they that dwell in the land of the shadow of death, upon them hath the light shined.' },
    ],
  },
  {
    book: 'The Gospel According to St. Matthew',
    chapter: '5',
    verses: [
      { n: 14, t: 'Ye are the light of the world. A city that is set on an hill cannot be hid.' },
      { n: 15, t: 'Neither do men light a candle, and put it under a bushel, but on a candlestick; and it giveth light unto all that are in the house.' },
      { n: 16, t: 'Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.' },
    ],
  },
  {
    book: 'The Book of the Prophet Isaiah',
    chapter: '60',
    verses: [
      { n: 1, t: 'Arise, shine; for thy light is come, and the glory of the LORD is risen upon thee.' },
      { n: 2, t: 'For, behold, the darkness shall cover the earth, and gross darkness the people: but the LORD shall arise upon thee, and his glory shall be seen upon thee.' },
    ],
  },
];

interface ScriptureVeilProps {
  className?: string;
}

/**
 * A page of scripture hidden in the dark, set in real Bible format. The
 * pointer becomes the lamp: a soft radial mask follows it, letting the
 * verses surface — washed out, half-remembered, waiting.
 * Listeners attach to the parent section; the veil itself ignores events.
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
        {Array.from({ length: 2 }, (_, pass) =>
          PASSAGES.map((p) => (
            <section key={`${pass}-${p.book}-${p.chapter}`} className="scripture-veil__passage">
              <h3 className="scripture-veil__book">{p.book}</h3>
              <p>
                <span className="scripture-veil__chapter">{p.chapter}</span>
                {p.verses.map((v) => (
                  <span key={v.n}>
                    <sup className="scripture-veil__vn">{v.n}</sup>
                    {v.t}{' '}
                  </span>
                ))}
              </p>
            </section>
          )),
        )}
      </div>
      <div className="scripture-veil__glow" />
    </div>
  );
}
