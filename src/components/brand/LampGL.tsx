import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { createFlamePainter } from './RealFlame';
import { HerodianLamp } from './HerodianLamp';

interface LampGLProps {
  className?: string;
}

/**
 * The hero's centerpiece: a circa-30AD terracotta oil lamp modeled and lit
 * in real time — lathe-turned reservoir with an open, oil-filled mouth,
 * spatulated soot-stained nozzle, loop handle. Matte clay under a living
 * flickering flame light, ACES tone-mapped. The flame itself is the canvas
 * painter rendered as a live texture sprite, so fire and light move as one.
 * three.js is lazy-loaded; an SVG rendition stands in while it arrives (and
 * stays for reduced-motion or no-WebGL visitors).
 */
export function LampGL({ className }: LampGLProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import('three');
      if (disposed || !hostRef.current) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        return; // keep SVG fallback
      }

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      renderer.setPixelRatio(dpr);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
      camera.position.set(0.3, 1.5, 10.4);
      camera.lookAt(0, 0.35, 0);

      /* ---------- aged bronze: mottled patina skin + hammered bump ---------- */
      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = bumpCanvas.height = 256;
      {
        const c = bumpCanvas.getContext('2d')!;
        c.fillStyle = '#808080';
        c.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 5200; i++) {
          const v = 128 + (Math.random() - 0.5) * 64;
          c.fillStyle = `rgba(${v},${v},${v},0.35)`;
          const r = 0.6 + Math.random() * 1.8;
          c.beginPath();
          c.arc(Math.random() * 256, Math.random() * 256, r, 0, Math.PI * 2);
          c.fill();
        }
        for (let i = 0; i < 26; i++) {
          const v = 128 + (Math.random() - 0.5) * 36;
          c.fillStyle = `rgba(${v},${v},${v},0.25)`;
          c.beginPath();
          c.arc(Math.random() * 256, Math.random() * 256, 6 + Math.random() * 16, 0, Math.PI * 2);
          c.fill();
        }
      }
      const bumpTex = new THREE.CanvasTexture(bumpCanvas);
      bumpTex.wrapS = bumpTex.wrapT = THREE.RepeatWrapping;
      bumpTex.repeat.set(4, 3);

      const skinCanvas = document.createElement('canvas');
      skinCanvas.width = skinCanvas.height = 256;
      {
        const c = skinCanvas.getContext('2d')!;
        c.fillStyle = '#57422a';
        c.fillRect(0, 0, 256, 256);
        const tints = ['#3a2c1c', '#6b5434', '#404c3d', '#2c2316', '#7a5e36'];
        for (let i = 0; i < 64; i++) {
          const x = Math.random() * 256;
          const y = Math.random() * 256;
          const r = 10 + Math.random() * 34;
          const g = c.createRadialGradient(x, y, 0, x, y, r);
          const tint = tints[Math.floor(Math.random() * tints.length)];
          g.addColorStop(0, tint + 'cc');
          g.addColorStop(1, tint + '00');
          c.fillStyle = g;
          c.fillRect(x - r, y - r, r * 2, r * 2);
        }
      }
      const skinTex = new THREE.CanvasTexture(skinCanvas);
      skinTex.wrapS = skinTex.wrapT = THREE.RepeatWrapping;
      skinTex.repeat.set(2, 1.5);
      skinTex.colorSpace = THREE.SRGBColorSpace;

      const bronze = new THREE.MeshStandardMaterial({
        map: skinTex,
        color: 0xcfb48a,
        metalness: 0.62,
        roughness: 0.5,
        bumpMap: bumpTex,
        bumpScale: 1.2,
        roughnessMap: bumpTex,
      });
      const clay = bronze;

      /* ---------- geometry ---------- */
      const lamp = new THREE.Group();

      // reservoir — lathe profile down the outer wall, over the collar,
      // and back inside the mouth so the opening has a real inner wall
      const profile: Array<[number, number]> = [
        [0.55, 0.0],
        [1.35, 0.06],
        [1.85, 0.28],
        [2.04, 0.62],
        [1.92, 0.95],
        [1.5, 1.18],
        [1.12, 1.26],
        [1.02, 1.34],
        [0.92, 1.3],
        [0.86, 1.18],
        [0.8, 0.98],
      ];
      const body = new THREE.Mesh(
        new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), 64),
        clay,
      );
      lamp.add(body);

      // oil surface inside the mouth — near-still, faintly glossy
      const oil = new THREE.Mesh(
        new THREE.CircleGeometry(0.82, 40),
        new THREE.MeshStandardMaterial({ color: 0x271b08, roughness: 0.18, metalness: 0.05 }),
      );
      oil.rotation.x = -Math.PI / 2;
      oil.position.y = 1.0;
      lamp.add(oil);

      // nozzle — squashed, tapering toward the wick, sunk into the body
      // so the join hides inside the bowl curve instead of creasing it
      const nozzle = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), clay);
      nozzle.scale.set(1.7, 0.52, 0.78);
      nozzle.position.set(-1.75, 0.56, 0);
      lamp.add(nozzle);

      // soot shell over the nozzle tip — swallowing stray glints
      const soot = new THREE.Mesh(
        new THREE.SphereGeometry(1, 28, 20),
        new THREE.MeshStandardMaterial({ color: 0x0a0604, roughness: 1, transparent: true, opacity: 0.95 }),
      );
      soot.scale.set(0.68, 0.3, 0.5);
      soot.position.set(-3.05, 0.84, 0);
      lamp.add(soot);

      // wick hole + charred wick
      const wickHole = new THREE.Mesh(
        new THREE.CircleGeometry(0.26, 24),
        new THREE.MeshBasicMaterial({ color: 0x0a0503 }),
      );
      wickHole.rotation.x = -Math.PI / 2;
      wickHole.position.set(-2.95, 1.13, 0);
      lamp.add(wickHole);
      const wick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.09, 0.34, 10),
        new THREE.MeshStandardMaterial({ color: 0x1c1208, roughness: 1 }),
      );
      wick.position.set(-2.93, 1.27, 0);
      wick.rotation.z = 0.28;
      lamp.add(wick);

      // loop handle — a vertical ring rooted at the rim, tilted gently back
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.17, 18, 44), clay);
      handle.position.set(2.18, 1.0, 0);
      handle.rotation.x = 0.16;
      lamp.add(handle);

      /* ---------- the stand the lamp burns upon ---------- */
      // cradle cup beneath the body, snug so it hides under the bowl
      const cup = new THREE.Mesh(
        new THREE.LatheGeometry(
          [new THREE.Vector2(0.5, 0.3), new THREE.Vector2(0.95, 0.12), new THREE.Vector2(1.0, 0)].map((v) => v),
          48,
        ),
        clay,
      );
      cup.position.y = -0.28;
      lamp.add(cup);
      // slender stem with a knop at its waist
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 1.5, 24), clay);
      stem.position.y = -1.05;
      lamp.add(stem);
      const knop = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 18), clay);
      knop.scale.set(1, 0.6, 1);
      knop.position.y = -1.0;
      lamp.add(knop);
      // round base on three small feet
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.96, 0.2, 48), clay);
      base.position.y = -1.9;
      lamp.add(base);
      for (let i = 0; i < 3; i++) {
        const foot = new THREE.Mesh(new THREE.SphereGeometry(0.19, 18, 14), clay);
        foot.scale.set(1, 0.65, 1);
        const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
        foot.position.set(Math.cos(a) * 0.78, -2.04, Math.sin(a) * 0.78);
        lamp.add(foot);
      }

      /* ---------- flame: live canvas texture on a sprite ---------- */
      const flameCanvas = document.createElement('canvas');
      flameCanvas.width = 192;
      flameCanvas.height = 288;
      const painter = createFlamePainter(flameCanvas, { halo: false });
      const flameTex = new THREE.CanvasTexture(flameCanvas);
      flameTex.colorSpace = THREE.SRGBColorSpace;
      const flame = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: flameTex, transparent: true, depthWrite: false }),
      );
      flame.scale.set(1.3, 2.9, 1);
      flame.position.set(-2.95, 2.38, 0.05);
      lamp.add(flame);

      // soft round glow around the flame, additive so it melts into the dark.
      // the gradient dies to true zero well inside the texture so its rect
      // edge can never print a box under additive blending
      const glowCanvas = document.createElement('canvas');
      glowCanvas.width = glowCanvas.height = 128;
      {
        const c = glowCanvas.getContext('2d')!;
        const g = c.createRadialGradient(64, 64, 0, 64, 64, 50);
        g.addColorStop(0, 'rgba(255, 158, 44, 0.5)');
        g.addColorStop(0.45, 'rgba(255, 130, 30, 0.14)');
        g.addColorStop(0.82, 'rgba(255, 120, 20, 0)');
        g.addColorStop(1, 'rgba(255, 120, 20, 0)');
        c.fillStyle = g;
        c.beginPath();
        c.arc(64, 64, 50, 0, Math.PI * 2);
        c.fill();
      }
      const glowTex = new THREE.CanvasTexture(glowCanvas);
      const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTex,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0.8,
        }),
      );
      glow.scale.set(5.6, 5.6, 1);
      glow.position.set(-2.93, 2.2, 0.04);
      lamp.add(glow);

      /* ---------- lights ---------- */
      // the flame is nearly the only light in the room — as in the photograph
      const flameLight = new THREE.PointLight(0xffa14e, 24, 18, 2);
      flameLight.position.set(-2.8, 2.6, 0.7);
      lamp.add(flameLight);
      scene.add(new THREE.AmbientLight(0x221911, 3.2));
      const fill = new THREE.DirectionalLight(0x6a7390, 0.45);
      fill.position.set(4, 6, 3);
      scene.add(fill);

      // low warm bounce so the shadow side keeps a breath of form
      const bounce = new THREE.PointLight(0xb06a3a, 4, 12, 2);
      bounce.position.set(1.5, -1.8, 3.2);
      scene.add(bounce);

      lamp.scale.setScalar(0.7);
      lamp.position.set(0.85, 0.35, 0);
      scene.add(lamp);

      /* ---------- mount & loop ---------- */
      host.appendChild(renderer.domElement);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';

      const resize = () => {
        const w = host.clientWidth || 1;
        const h = host.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      // pointer parallax — the lamp turns toward the keeper of the light
      const surface = host.closest('section') ?? host.parentElement ?? host;
      let tY = 0;
      let tX = 0;
      const onMove = (e: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        tY = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width * 0.9))) * 0.22;
        tX = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height * 0.9))) * 0.1;
      };
      const onLeave = () => {
        tY = 0;
        tX = 0;
      };
      surface.addEventListener('pointermove', onMove as EventListener);
      surface.addEventListener('pointerleave', onLeave);

      let raf = 0;
      let last = performance.now();
      let t = 0;
      const loop = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        t += dt;

        painter.draw(dt);
        flameTex.needsUpdate = true;

        // calm idle drift + eased pointer tilt
        const idleY = Math.sin(t * 0.42) * 0.12;
        const idleX = Math.sin(t * 0.3 + 1.7) * 0.035;
        lamp.rotation.y += (idleY + tY - lamp.rotation.y) * 0.05;
        lamp.rotation.x += (idleX + tX - lamp.rotation.x) * 0.05;
        lamp.position.y = 0.25 + Math.sin(t * 0.55) * 0.045;

        // firelight breathing with the flame
        const fl = Math.sin(t * 2.1) * 0.18 + Math.sin(t * 5.3) * 0.1;
        flameLight.intensity = 24 * (1 + fl * 0.1);

        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        surface.removeEventListener('pointermove', onMove as EventListener);
        surface.removeEventListener('pointerleave', onLeave);
        scene.traverse((obj) => {
          const mesh = obj as { geometry?: { dispose: () => void }; material?: { dispose: () => void } };
          mesh.geometry?.dispose?.();
          mesh.material?.dispose?.();
        });
        bumpTex.dispose();
        flameTex.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className={cn('relative', className)}>
      <div ref={hostRef} className="absolute inset-0" aria-hidden="true" />
      {/* SVG rendition while WebGL loads, and for reduced-motion / no-GL */}
      {!ready && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6">
          <HerodianLamp />
        </div>
      )}
    </div>
  );
}
