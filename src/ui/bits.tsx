import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ITEMS } from "../content";
import { itemXp } from "../engine/progress";
import { useStore } from "../store";

export const pad2 = (n: number) => String(n).padStart(2, "0");
/** Smooth scrolling unless the user prefers reduced motion (or the tab is hidden, where smooth scrolls don't run). */
export const scrollBehavior = (): ScrollBehavior =>
  typeof window !== "undefined" && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches && document.visibilityState === "visible" ? "smooth" : "auto";
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

/**
 * A checklist row for any tracked item. The same item can render in several places (e.g. a milestone in the
 * weekly build card and in its mission); each instance gets its own DOM ids while sharing one progress state.
 * Flashes when completed; highlights when it's the navigation target. Conditional milestones can also be
 * resolved as "Not applicable" with a written reason.
 */
export function CheckRow({ id, title, sub, side, className = "", target, hint, label }: {
  id: string; title: ReactNode; sub?: ReactNode; side?: ReactNode; className?: string; target?: boolean;
  /** What ticking means, e.g. { off: "I can explain this", on: "Understood" }. */
  hint?: { off: string; on: string };
  /** Plain-text accessible name when `title` contains links or markup. */
  label?: string;
}) {
  const { state, toggle, setNotApplicable } = useStore();
  const uid = useId();
  const done = !!state.done[id];
  const meta = ITEMS.get(id);
  const na = meta?.conditional ? state.na[id] : undefined;
  const [flash, setFlash] = useState(false);
  const [naOpen, setNaOpen] = useState(false);
  const [reason, setReason] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (target && ref.current) ref.current.scrollIntoView({ block: "center", behavior: scrollBehavior() });
  }, [target]);
  const cbId = `cb-${uid}`, titleId = `t-${uid}`, subId = `s-${uid}`, hintId = `h-${uid}`, condId = `c-${uid}`;
  const describedBy = [sub ? subId : "", hint ? hintId : "", meta?.conditional ? condId : ""].filter(Boolean).join(" ") || undefined;
  return (
    <li>
      <div ref={ref} className={`row ${done || na ? "done" : ""} ${na ? "na" : ""} ${flash ? "flash" : ""} ${target && !done && !na ? "target" : ""} ${className}`} data-item={id}>
        <input
          id={cbId} type="checkbox" className="cb" checked={done}
          aria-labelledby={label ? undefined : titleId} aria-label={label}
          aria-describedby={describedBy}
          title={hint ? hint.off : undefined}
          onChange={e => {
            toggle(id, e.target.checked, e.target);
            if (e.target.checked) { setFlash(true); window.setTimeout(() => setFlash(false), 1400); }
          }}
        />
        <span>
          <label htmlFor={cbId} className="title" id={titleId}>{title}</label>
          {sub && <span className="sub" id={subId}>{sub}</span>}
          {meta?.conditional && (
            <span className="cond" id={condId}>
              <span className="cond-k">Conditional</span> {meta.conditional}
              {na && <span className="na-reason"> · Not applicable: “{na.reason}” <button type="button" className="linkish" onClick={() => setNotApplicable(id, null)}>Undo</button></span>}
              {!na && !done && !naOpen && <> · <button type="button" className="linkish" onClick={() => setNaOpen(true)}>Not applicable…</button></>}
            </span>
          )}
          {naOpen && !na && !done && (
            <form className="na-form" onSubmit={e => { e.preventDefault(); if (reason.trim()) { setNotApplicable(id, reason); setNaOpen(false); setReason(""); } }}>
              <input className="input" autoFocus value={reason} onChange={e => setReason(e.target.value)} aria-label={`Why this doesn't apply: ${meta?.title ?? id}`} placeholder="Why it doesn't apply (e.g. single call met the quality bar: 94% field accuracy)" />
              <button className="btn small" type="submit" disabled={!reason.trim()}>Save</button>
              <button className="btn small ghost" type="button" onClick={() => { setNaOpen(false); setReason(""); }}>Cancel</button>
            </form>
          )}
        </span>
        <span className="side">
          {hint && <span id={hintId} className={`hint ${done ? "on" : ""}`}>{done ? hint.on : hint.off}</span>}
          {side}
          {meta && <span className="xp">{done || na ? "✓ " : "+"}{itemXp(meta)} XP</span>}
        </span>
      </div>
    </li>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty panel">{children}</div>;
}
