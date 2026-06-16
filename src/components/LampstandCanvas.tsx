import { useRef, useEffect } from "react";

/*
 * Single-canvas luma key — no synthetic stone.
 * The video (lampstand_anim_v2.mp4) already contains the lamp + stone pedestal.
 * We just strip the black background via luminance key.
 *
 * Key:  luma < 8 → transparent
 *       8–28     → linear ramp
 *       ≥ 28     → opaque
 */

const LUMA_THRESH  =  8;
const LUMA_FEATHER = 20;

export default function LampstandCanvas({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video  = videoRef.current!;
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d", { willReadFrequently: true })!;

    let raf = 0, lastTime = -1;
    video.play().catch(() => {});

    function tick() {
      if (video.readyState >= 2 && video.currentTime !== lastTime) {
        lastTime = video.currentTime;
        const W = canvas.width, H = canvas.height;
        ctx.drawImage(video, 0, 0, W, H);
        const img = ctx.getImageData(0, 0, W, H);
        const d   = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const luma = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          if (luma <= LUMA_THRESH) {
            d[i + 3] = 0;
          } else if (luma < LUMA_THRESH + LUMA_FEATHER) {
            d[i + 3] = Math.round(((luma - LUMA_THRESH) / LUMA_FEATHER) * 255);
          }
        }
        ctx.putImageData(img, 0, 0);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay muted loop playsInline
        src="/videos/lampstand_anim_v2.mp4"
        style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
      />
      <canvas
        ref={canvasRef}
        width={960}
        height={960}
        className={className}
        style={{ ...style, display: "block" }}
      />
    </>
  );
}
