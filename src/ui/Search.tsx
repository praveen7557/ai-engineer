import { useEffect, useMemo, useRef, useState } from "react";
import { CHAPTERS } from "../content";
import { useStore } from "../store";
import { pad2 } from "./bits";
import { chapterHref, href } from "./router";

interface Hit { group: string; crumb: string; title: string; kind: string; to: string }

/** Top-level pages, findable by name and by what you'd go there to do. */
const PAGES: { title: string; path: string; crumb: string; keywords: string[] }[] = [
  { title: "Headquarters", path: "", crumb: "Home", keywords: ["home", "dashboard", "next step", "overview"] },
  { title: "Roadmap", path: "roadmap", crumb: "All chapters", keywords: ["chapters", "plan", "workload", "prerequisites", "getting started", "budget"] },
  { title: "Engineer's Journal", path: "journal", crumb: "Weekly notes", keywords: ["journal", "notes", "reflection", "decision"] },
  { title: "Nox", path: "companion", crumb: "Companion", keywords: ["companion", "bond", "mood", "stage"] },
  { title: "Record", path: "record", crumb: "Ranks & achievements", keywords: ["ranks", "achievements", "xp", "capabilities"] },
  { title: "Continuing", path: "continuing", crumb: "After week 24", keywords: ["sources", "specialization", "releases", "log"] },
  { title: "Progress file", path: "data", crumb: "Save, sync, restore", keywords: ["export", "import", "sync", "gist", "backup", "snapshot", "restore", "data", "privacy"] },
];

/** Command-palette style search across chapters, weeks, concepts, resources, missions, trials and journal notes. */
export function Search({ onClose }: { onClose: () => void }) {
  const { state } = useStore();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus(); }, []);

  const hits = useMemo<Hit[]>(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return [];
    const has = (...s: (string | undefined)[]) => s.some(x => x?.toLowerCase().includes(t));
    const out: Hit[] = [];
    for (const p of PAGES) {
      if (has(p.title, ...p.keywords)) out.push({ group: "Pages", crumb: p.crumb, title: p.title, kind: "Page", to: href(p.path) });
    }
    for (const ch of CHAPTERS) {
      if (has(`chapter ${ch.number}`, `chapter ${pad2(ch.number)}`, `ch${ch.number}`)) out.push({ group: "Pages", crumb: `Chapter ${pad2(ch.number)}`, title: ch.title, kind: "Page", to: chapterHref(ch.id) });
    }
    for (const ch of CHAPTERS) {
      const cn = `Chapter ${pad2(ch.number)} · ${ch.title}`;
      if (has(ch.title, ch.tagline, ch.description)) out.push({ group: "Chapters", crumb: `Weeks ${ch.weeks[0].number}–${ch.weeks[ch.weeks.length - 1].number}`, title: ch.title, kind: "Chapter", to: chapterHref(ch.id) });
      for (const w of ch.weeks) {
        if (has(w.title, w.focus, `week ${w.number}`, `week ${pad2(w.number)}`)) out.push({ group: "Weeks", crumb: cn, title: `Week ${pad2(w.number)} · ${w.title}`, kind: "Week", to: chapterHref(ch.id, { week: w.number }) });
        for (const g of w.groups) for (const c of g.concepts) {
          if (has(c.title, c.summary, g.title)) out.push({ group: "Concepts", crumb: `${ch.title} · Week ${pad2(w.number)}`, title: c.title, kind: "Concept", to: chapterHref(ch.id, { week: w.number, focus: c.id }) });
        }
        const j = state.journal[`w${w.number}`];
        if (j && has(j.text)) out.push({ group: "Your notes", crumb: `${ch.title} · Week ${pad2(w.number)} journal`, title: snippet(j.text, t), kind: "Journal", to: href("journal", { week: w.number }) });
      }
      for (const r of ch.resources) {
        if (has(r.title, r.note, r.kind)) out.push({ group: "Resources", crumb: `${ch.title} · Week ${pad2(r.week)} · ${r.use === "must" ? "Must read" : r.use === "reference" ? "Reference" : "Bonus"}`, title: r.title, kind: r.kind, to: chapterHref(ch.id, { week: r.week, focus: r.id, section: "intel" }) });
      }
      for (const m of ch.missions) {
        const hitM = has(m.title, m.objective, m.deliverable, ...m.requirements);
        const hitMs = m.milestones.find(s => has(s.title));
        if (hitM || hitMs) out.push({ group: "Missions", crumb: `${ch.title} · Mission ${pad2(m.number)}`, title: hitMs && !hitM ? `${m.title}: ${hitMs.title}` : m.title, kind: m.track, to: chapterHref(ch.id, { focus: hitMs?.id ?? m.id, section: "missions" }) });
        const refl = state.journal[m.id];
        if (refl && has(refl.text)) out.push({ group: "Your notes", crumb: `Mission ${pad2(m.number)} reflection`, title: snippet(refl.text, t), kind: "Reflection", to: chapterHref(ch.id, { focus: m.id, section: "missions" }) });
      }
      for (const tr of ch.trial) {
        if (has(tr.statement, tr.dimension)) out.push({ group: "Trials", crumb: `Chapter ${pad2(ch.number)} trial · ${tr.dimension}`, title: tr.statement, kind: "Trial", to: chapterHref(ch.id, { focus: tr.id, section: "trial" }) });
      }
    }
    return out.slice(0, 60);
  }, [q, state.journal]);

  useEffect(() => setSel(0), [q]);
  const groups = [...new Set(hits.map(h => h.group))];
  const ordered = groups.flatMap(g => hits.filter(h => h.group === g));

  const open = (h: Hit) => { window.location.hash = h.to; onClose(); };

  return (
    <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="searchbox panel" role="dialog" aria-label="Search the roadmap">
        <input
          ref={input} value={q} onChange={e => setQ(e.target.value)} placeholder="Search concepts, resources, missions, weeks, your notes…"
          aria-label="Search"
          onKeyDown={e => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(s + 1, ordered.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
            if (e.key === "Enter" && ordered[sel]) open(ordered[sel]);
          }}
        />
        <div className="results">
          {q.trim().length >= 2 && <div className="sr-group">{hits.length} result{hits.length === 1 ? "" : "s"}{hits.length === 60 ? "+" : ""}</div>}
          {q.trim().length < 2 && <div className="sr-group">Try “embeddings”, “MCP”, “week 11”, “evals”, “export”, “record”</div>}
          {groups.map(g => (
            <div key={g}>
              <div className="sr-group">{g}</div>
              {hits.filter(h => h.group === g).map(h => {
                const i = ordered.indexOf(h);
                return (
                  <a key={h.to + h.title} href={h.to} className={`sr ${i === sel ? "sel" : ""}`} onClick={e => { e.preventDefault(); open(h); }} onMouseEnter={() => setSel(i)}>
                    <span><span className="crumb">{h.crumb}</span><br /><span className="st"><Mark text={h.title} q={q.trim()} /></span></span>
                    <span className="kind">{h.kind}</span>
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function snippet(text: string, t: string) {
  const i = text.toLowerCase().indexOf(t);
  const start = Math.max(0, i - 40);
  return (start ? "…" : "") + text.slice(start, start + 110).replace(/\s+/g, " ") + (start + 110 < text.length ? "…" : "");
}

function Mark({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
}

