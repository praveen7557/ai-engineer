import { useEffect, useRef } from "react";

/** Slow drifting embers behind everything. Density and warmth rise with rank; static under reduced motion. */
export function Atmosphere({ level }: { level: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.documentElement.style.setProperty("--glow", String(0.45 + level * 0.09));
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0;
    const count = 16 + level * 5;
    const motes = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 0.00005, vy: -(0.00003 + Math.random() * 0.00009),
      a: 0.15 + Math.random() * 0.45, p: Math.random() * Math.PI * 2,
    }));
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        if (!reduce) {
          m.x += m.vx * 16; m.y += m.vy * 16;
          if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); }
          if (m.x < -0.02) m.x = 1.02; if (m.x > 1.02) m.x = -0.02;
        }
        const tw = reduce ? 1 : 0.65 + 0.35 * Math.sin(t / 1400 + m.p);
        ctx.beginPath();
        ctx.fillStyle = `rgba(244, 201, 135, ${m.a * tw})`;
        ctx.shadowColor = "rgba(224, 164, 88, .8)";
        ctx.shadowBlur = 6;
        ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [level]);

  return (
    <div className="atmos" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
