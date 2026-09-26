import { useEffect, useState } from "react";
import type { Mood } from "../engine/progress";

/**
 * Nox — the companion. An original small creature: a floating graphite body with two swept
 * fin-ears, a curled tail and luminous eyes. Features accrue by stage (0–6):
 *   1 ember core · 2 etched markings · 3 woven scarf · 4 orbiting motes · 5 crest · 6 halo + light wings
 */
interface Props {
  stage: number;
  mood: Mood;
  /** Changing this number triggers a brief reaction. */
  pulse?: number;
  size?: number;
  className?: string;
  title?: string;
}

export function Nox({ stage, mood, pulse = 0, size = 120, className = "", title = "Nox" }: Props) {
  const [react, setReact] = useState(false);
  useEffect(() => {
    if (!pulse) return;
    setReact(true);
    const t = window.setTimeout(() => setReact(false), 1400);
    return () => window.clearTimeout(t);
  }, [pulse]);

  const face: Mood | "joy" = react ? "joy" : mood;
  const eyeGlow = mood === "tired" ? 0.55 : 1;
  const bodyTop = mood === "tired" ? "#2A2D33" : "#33373E";
  const uid = `nx${size}${stage}`;

  return (
    <svg
      className={`nox ${mood} ${react ? "react" : ""} ${className}`}
      width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={`${title}, ${mood}`}
    >
      <defs>
        <radialGradient id={`${uid}-body`} cx="45%" cy="30%" r="75%">
          <stop offset="0" stopColor={bodyTop} />
          <stop offset="0.6" stopColor="#1C1F24" />
          <stop offset="1" stopColor="#111316" />
        </radialGradient>
        <radialGradient id={`${uid}-eye`} cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#FFF4DD" />
          <stop offset="0.45" stopColor="#F4C987" />
          <stop offset="1" stopColor="#C8853E" />
        </radialGradient>
        <radialGradient id={`${uid}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFE9C2" />
          <stop offset="0.5" stopColor="#E0A458" stopOpacity="0.9" />
          <stop offset="1" stopColor="#E0A458" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-wing`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4C987" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F4C987" stopOpacity="0" />
        </linearGradient>
        <filter id={`${uid}-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      {/* ground shadow */}
      <ellipse cx="60" cy="110" rx={mood === "tired" ? 24 : 20} ry="3.5" fill="#000" opacity="0.45" />

      <g className="float">
        {/* halo + wings (Guardian) */}
        {stage >= 6 && (
          <>
            <path className="wing" d="M34 62 C14 50, 8 30, 12 18 C22 34, 30 44, 40 52 Z" fill={`url(#${uid}-wing)`} />
            <path className="wing" d="M86 62 C106 50, 112 30, 108 18 C98 34, 90 44, 80 52 Z" fill={`url(#${uid}-wing)`} />
            <ellipse cx="60" cy="16" rx="17" ry="4" fill="none" stroke="#F4C987" strokeWidth="1.6" opacity="0.9" />
            <ellipse cx="60" cy="16" rx="17" ry="4" fill="none" stroke="#F4C987" strokeWidth="4" opacity="0.25" filter={`url(#${uid}-soft)`} />
          </>
        )}

        {/* tail */}
        <path className="tail" d="M78 92 C92 96, 100 86, 96 76 C94 70, 88 70, 88 76 C88 80, 92 80, 92 78" fill="none" stroke="#23262C" strokeWidth="6" strokeLinecap="round" />
        {stage >= 2 && <path className="tail" d="M80 93 C92 96, 98 87, 95 78" fill="none" stroke="#E0A458" strokeOpacity="0.35" strokeWidth="1" />}

        {/* ears */}
        <path d="M40 46 C32 30, 30 18, 36 10 C42 22, 48 32, 52 40 Z" fill="#1E2126" stroke="rgba(255,232,200,.12)" strokeWidth="1" />
        <path d="M80 46 C88 30, 90 18, 84 10 C78 22, 72 32, 68 40 Z" fill="#1E2126" stroke="rgba(255,232,200,.12)" strokeWidth="1" />
        <path d="M40 40 C36 30, 35 22, 37 16" fill="none" stroke="#E0A458" strokeOpacity={stage >= 1 ? 0.5 : 0.18} strokeWidth="1.2" />
        <path d="M80 40 C84 30, 85 22, 83 16" fill="none" stroke="#E0A458" strokeOpacity={stage >= 1 ? 0.5 : 0.18} strokeWidth="1.2" />

        {/* body */}
        <path d="M60 36 C82 36, 92 54, 90 72 C88 90, 76 100, 60 100 C44 100, 32 90, 30 72 C28 54, 38 36, 60 36 Z" fill={`url(#${uid}-body)`} stroke="rgba(255,232,200,.14)" strokeWidth="1" />
        {/* rim light */}
        <path d="M40 50 C46 42, 54 39, 62 39" fill="none" stroke="#F4C987" strokeOpacity="0.28" strokeWidth="1.4" strokeLinecap="round" />

        {/* etched markings (Capable) */}
        {stage >= 2 && (
          <g stroke="#E0A458" strokeOpacity="0.45" strokeWidth="0.9" fill="none" strokeLinecap="round">
            <path d="M36 74 h6 l3 -3 h5" />
            <path d="M84 74 h-6 l-3 -3 h-5" />
            <circle cx="50" cy="71" r="0.9" fill="#E0A458" />
            <circle cx="70" cy="71" r="0.9" fill="#E0A458" />
          </g>
        )}

        {/* ember core (Curious) */}
        {stage >= 1 && (
          <g>
            <circle className="core" cx="60" cy="80" r={stage >= 4 ? 9 : 7} fill={`url(#${uid}-core)`} />
            <circle cx="60" cy="80" r="2.2" fill="#FFE9C2" opacity={mood === "tired" ? 0.6 : 0.95} />
          </g>
        )}

        {/* scarf (Skilled) */}
        {stage >= 3 && (
          <g>
            <path d="M38 62 C46 68, 74 68, 82 62 L83 67 C74 73, 46 73, 37 67 Z" fill="#7A4A26" stroke="#C8853E" strokeOpacity="0.6" strokeWidth="0.8" />
            <path d="M40 64.5 C48 69.5, 72 69.5, 80 64.5" fill="none" stroke="#E0A458" strokeOpacity="0.45" strokeWidth="0.7" strokeDasharray="2 2" />
            <path className="scarf-end" d="M46 70 C44 78, 40 84, 36 88 L42 89 C45 84, 48 78, 50 71 Z" fill="#6A3F20" stroke="#C8853E" strokeOpacity="0.5" strokeWidth="0.8" />
          </g>
        )}

        {/* crest (Veteran) */}
        {stage >= 5 && (
          <g>
            <path d="M60 38 L64 44 L60 48 L56 44 Z" fill="#F4C987" opacity="0.95" />
            <path d="M60 38 L64 44 L60 48 L56 44 Z" fill="#F4C987" opacity="0.5" filter={`url(#${uid}-soft)`} />
          </g>
        )}

        {/* eyes */}
        <Eyes face={face} glow={eyeGlow} uid={uid} />
      </g>

      {/* orbiting motes (Trusted) */}
      {stage >= 4 && (
        <g className="motes">
          <circle cx="60" cy="22" r="1.6" fill="#F4C987" />
          <circle cx="102" cy="64" r="1.2" fill="#F4C987" opacity="0.8" />
          <circle cx="24" cy="80" r="1.4" fill="#F4C987" opacity="0.7" />
        </g>
      )}
    </svg>
  );
}

function Eyes({ face, glow, uid }: { face: Mood | "joy"; glow: number; uid: string }) {
  const L = { x: 49, y: 60 }, R = { x: 71, y: 60 };
  if (face === "joy" || face === "proud") {
    const d = (c: { x: number; y: number }) => `M${c.x - 6} ${c.y + 2} Q${c.x} ${c.y - 6} ${c.x + 6} ${c.y + 2}`;
    return (
      <g stroke={`url(#${uid}-eye)`} strokeWidth="3" strokeLinecap="round" fill="none">
        <path d={d(L)} />
        <path d={d(R)} />
        {face === "joy" && <g fill="#F4C987" stroke="none"><circle cx="38" cy="50" r="1.2" /><circle cx="84" cy="48" r="1" /><circle cx="90" cy="56" r="0.8" /></g>}
      </g>
    );
  }
  const ry = face === "tired" ? 3 : face === "focused" ? 5 : 6.5;
  const rx = face === "curious" ? 6 : 5.5;
  return (
    <g opacity={glow}>
      <ellipse cx={L.x} cy={L.y} rx={rx} ry={ry} fill={`url(#${uid}-eye)`} />
      <ellipse cx={R.x} cy={R.y} rx={face === "curious" ? 5 : rx} ry={face === "curious" ? ry - 1 : ry} fill={`url(#${uid}-eye)`} />
      <circle cx={L.x + 1.6} cy={L.y - 2} r="1.4" fill="#fff" opacity="0.9" />
      <circle cx={R.x + 1.6} cy={R.y - 2} r="1.4" fill="#fff" opacity="0.9" />
      {face === "tired" && <path d={`M${L.x - 7} ${L.y - 3} h14 M${R.x - 7} ${R.y - 3} h14`} stroke="#1C1F24" strokeWidth="3" />}
      {/* blink lids */}
      <rect className="lid" x={L.x - 7} y={L.y - 8} width="14" height="16" fill="#1E2126" />
      <rect className="lid" x={R.x - 7} y={R.y - 8} width="14" height="16" fill="#1E2126" />
    </g>
  );
}
