import { useEffect, useRef, useState } from "react";
import { CHAPTERS, chapterForWeek } from "../content";
import { useStore } from "../store";
import { pad2 } from "../ui/bits";
import { Nox } from "../ui/Nox";
import { chapterHref, href, type Route } from "../ui/router";
import { useDerived } from "../ui/derived";

/** Debounced journal textarea bound to a journal key ("w12" or a mission id). */
export function JournalEditor({ journalKey, placeholder, small }: { journalKey: string; placeholder: string; small?: boolean }) {
  const { state, setJournal } = useStore();
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
      <div className="journal-meta">
        <span>{words} words</span>
        <span>{dirty ? "Writing…" : updated ? `Saved ${new Date(updated).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}` : ""}</span>
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
        <JournalEditor journalKey={`w${week}`} placeholder="Notes, lessons learned, mistakes, useful discoveries, questions, reflections…" />
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
