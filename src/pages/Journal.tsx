import { useEffect, useRef, useState } from "react";
import { CHAPTERS, chapterForWeek } from "../content";
import { useStore } from "../store";
import { pad2 } from "../ui/bits";
import { Nox } from "../ui/Nox";
import { chapterHref, href, type Route } from "../ui/router";
import { useDerived } from "../ui/derived";

/** Debounced journal textarea bound to a journal key ("w12" or a mission id). */
export function JournalEditor({ journalKey, placeholder, small }: { journalKey: string; placeholder: string; small?: boolean }) {
  const { state, setJournal, sync, gist } = useStore();
  const saved = state.journal[journalKey]?.text ?? "";
  const [text, setText] = useState(saved);
  const [dirty, setDirty] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => { if (!dirty) setText(saved); }, [saved, dirty, journalKey]);
  useEffect(() => { setDirty(false); }, [journalKey]);
  const updated = state.journal[journalKey]?.updatedAt;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <div>
      <textarea
        className={`journal ${small ? "small" : ""}`} value={text} placeholder={placeholder} aria-label={placeholder}
        onChange={e => {
          const v = e.target.value;
          setText(v); setDirty(true);
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => { setJournal(journalKey, v); setDirty(false); }, 600);
        }}
      />
      <div className="journal-meta" aria-live="polite">
        <span>{words} words</span>
        <span>
          {dirty ? "Writing…" : updated ? `Saved in this browser ${new Date(updated).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}` : "Saves in this browser as you type"}
          {sync.mode === "file" ? ` · file: ${sync.fileName}` : sync.mode === "file-paused" ? " · file: reconnect needed" : ""}
          {gist.enabled && !gist.paused && gist.gistId ? ` · gist: ${gist.status === "syncing" ? "syncing…" : gist.status === "error" ? "sync failed" : gist.status === "conflict" ? "conflict, choose a version" : "synced"}` : gist.enabled && gist.paused ? " · gist sync off" : ""}
        </span>
      </div>
    </div>
  );
}

export function JournalPage({ route }: { route: Route }) {
  const { state } = useStore();
  const d = useDerived();
  const planned = d.pace.kind === "tracked" ? d.pace.plan : 1;
  const week = Math.max(1, Math.min(24, Number(route.query.get("week")) || planned));
  const ch = chapterForWeek(week);
  const w = ch.weeks.find(x => x.number === week)!;
  const entries = Object.keys(state.journal).filter(k => /^w\d+$/.test(k)).length;
  return (
    <>
      <section style={{ paddingTop: 56 }}>
        <div className="eyebrow accent">Engineer's Journal</div>
        <h1 className="display h-lg" style={{ marginTop: 12 }}>Week {pad2(week)}</h1>
        <p className="lede" style={{ marginTop: 10 }}>{w.title}: {w.focus}</p>
        <p className="faint mono" style={{ fontSize: 12, marginTop: 10 }}>
          <a href={chapterHref(ch.id, { week })}>Chapter {pad2(ch.number)} · {ch.title}</a> · {entries} weekly entries · {state.journalDays.length} days written
        </p>
      </section>
      <section className="section" style={{ marginTop: 28 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CHAPTERS.flatMap(c => c.weeks).map(x => (
            <a key={x.number} href={href("journal", { week: x.number })} className="chip" aria-pressed={x.number === week}
              style={{ minWidth: 42, justifyContent: "center", borderColor: state.journal[`w${x.number}`] ? "rgba(224,164,88,.45)" : undefined }}>
              {pad2(x.number)}
            </a>
          ))}
        </div>
        <div className="objective quiet" style={{ marginTop: 0 }}><span>ENGINEERING DECISION · CHAPTER {pad2(ch.number)}</span>{ch.decision}</div>
        <p className="faint" style={{ margin: 0, fontSize: 13 }}>
          This week's build: {w.build.deliverable} <a href={chapterHref(ch.id, { week })}>Open the build →</a>
        </p>
        <JournalEditor journalKey={`w${week}`} placeholder="What you built, what you measured, the decision you made and why, what broke, open questions…" />
        <EvidenceLinks journalKey={`w${week}`} />
        {!state.journal[`w${week}`] && (
          <div className="empty" style={{ padding: "8px 0" }}>
            <Nox stage={d.stage.index} mood="calm" size={56} />
            <span className="muted" style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: 18 }}>Write down what surprised you. Future you will want it.</span>
          </div>
        )}
      </section>
    </>
  );
}

/** Optional links to the week's evidence: repo, demo, evaluation report. Saved with the week's journal entry. */
function EvidenceLinks({ journalKey }: { journalKey: string }) {
  const { state, setJournalLinks } = useStore();
  const saved = state.journal[journalKey]?.links ?? {};
  const [v, setV] = useState(saved);
  useEffect(() => { setV(state.journal[journalKey]?.links ?? {}); }, [journalKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const field = (k: "repo" | "demo" | "report", label: string, ph: string) => (
    <div className="field">
      <label htmlFor={`${journalKey}-${k}`}>{label}</label>
      <input id={`${journalKey}-${k}`} className="input" type="url" inputMode="url" placeholder={ph} value={v[k] ?? ""}
        onChange={e => setV({ ...v, [k]: e.target.value })}
        onBlur={() => { if ((v[k] ?? "") !== (saved[k] ?? "")) setJournalLinks(journalKey, v); }} />
    </div>
  );
  return (
    <fieldset className="evidence-links">
      <legend>Evidence links (optional)</legend>
      {field("repo", "Repo", "https://github.com/you/prompt-lab")}
      {field("demo", "Demo", "Recording or deployed URL")}
      {field("report", "Evaluation report", "Link to results, notebook or doc")}
    </fieldset>
  );
}
