import { useEffect, useRef, useState, type ReactNode } from "react";
import { ITEMS } from "../content";
import { itemXp } from "../engine/progress";
import { useStore } from "../store";

export const pad2 = (n: number) => String(n).padStart(2, "0");
export const fmtXp = (n: number) => n.toLocaleString("en-US");
export const fmtMinutes = (m: number) => {
  if (m < 60) return `${m} min`;
  const h = m / 60;
  return `${Number.isInteger(h) ? h : h.toFixed(1)} h`;
};

export function Meter({ value, tone, size, label }: { value: number; tone?: "good"; size?: "thick" | "thin"; label?: string }) {
  // Animate from 0 on first paint so progress visibly fills.
  const [w, setW] = useState(0);
  useEffect(() => { const r = requestAnimationFrame(() => setW(value)); return () => cancelAnimationFrame(r); }, [value]);
  return (
    <div className={`meter ${tone ?? ""} ${size ?? ""}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <i style={{ width: `${Math.max(0, Math.min(100, w))}%` }} />
    </div>
  );
}

export function Ring({ value, size = 64 }: { value: number; size?: number }) {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <svg className="ring" width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={`${value}%`}>
      <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,232,200,.08)" strokeWidth="4" />
      <circle cx="32" cy="32" r={r} fill="none" stroke={value === 100 ? "#8DBF9F" : "#E0A458"} strokeWidth="4" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} transform="rotate(-90 32 32)" style={{ transition: "stroke-dashoffset 1s cubic-bezier(.2,.7,.2,1)" }} />
      <text x="32" y="36" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="13" fill="#ECE6DC">{value}%</text>
    </svg>
  );
}

/** A checklist row for any tracked item. Flashes when completed; highlights when it's the navigation target. */
export function CheckRow({ id, title, sub, side, className = "", target }: {
  id: string; title: ReactNode; sub?: ReactNode; side?: ReactNode; className?: string; target?: boolean;
}) {
  const { state, toggle } = useStore();
  const done = !!state.done[id];
  const [flash, setFlash] = useState(false);
  const ref = useRef<HTMLLabelElement>(null);
  const meta = ITEMS.get(id);
  useEffect(() => {
    if (target && ref.current) ref.current.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [target]);
  return (
    <li>
      <label ref={ref} className={`row ${done ? "done" : ""} ${flash ? "flash" : ""} ${target && !done ? "target" : ""} ${className}`} htmlFor={`cb-${id}`}>
        <input
          id={`cb-${id}`} type="checkbox" className="cb" checked={done}
          onChange={e => {
            toggle(id, e.target.checked, e.target);
            if (e.target.checked) { setFlash(true); window.setTimeout(() => setFlash(false), 1400); }
          }}
        />
        <span>
          <span className="title">{title}</span>
          {sub && <span className="sub">{sub}</span>}
        </span>
        <span className="side">
          {side}
          {meta && <span className="xp">{done ? "✓ " : "+"}{itemXp(meta)} XP</span>}
        </span>
      </label>
    </li>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty panel">{children}</div>;
}
