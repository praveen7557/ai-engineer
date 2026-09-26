import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { CHAPTERS, continuingPrompts, continuingSources, setupItems } from "../content";
import {
  ACHIEVEMENTS, chapterPct, chapterStatus, chapterXpAvailable, isEndState, RANKS, SKILLS, skillLevels, STAGES, XP,
} from "../engine/progress";
import { localDay, type ContinuingCategory } from "../engine/state";
import { useStore } from "../store";
import { CheckRow, fmtXp, Meter, pad2 } from "../ui/bits";
import { useDerived } from "../ui/derived";
import { Sigil } from "../ui/Feed";
import { Nox } from "../ui/Nox";
import { chapterHref } from "../ui/router";

const PageHead = ({ eyebrow, title, lede }: { eyebrow: string; title: string; lede?: string }) => (
  <section style={{ paddingTop: 56 }}>
    <div className="eyebrow accent">{eyebrow}</div>
    <h1 className="display h-lg" style={{ marginTop: 12 }}>{title}</h1>
    {lede && <p className="lede" style={{ marginTop: 12 }}>{lede}</p>}
  </section>
);

/* ---------------- Roadmap ---------------- */
export function Roadmap() {
  const { state } = useStore();
  return (
    <>
      <PageHead eyebrow="24 weeks · 8 chapters" title="The Roadmap" lede="Each chapter is three weeks: training, intel, hands-on missions, and a trial that proves you understood it. Everything is readable at any time; later chapters simply open fully as you reach them." />
      <section className="section" style={{ gap: 14 }}>
        {CHAPTERS.map((ch, i) => {
          const st = chapterStatus(state, ch);
          const pc = chapterPct(state, ch);
          return (
            <motion.a key={ch.id} href={chapterHref(ch.id)} className={`panel lift chapter-card ${st}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.6 }}>
              <span className="big-n">{pad2(ch.number)}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span className="eyebrow">Weeks {ch.weeks[0].number}–{ch.weeks[ch.weeks.length - 1].number}</span>
                <h3>{ch.title}</h3>
                <span className="muted" style={{ fontSize: 14.5 }}>{ch.description}</span>
                <span style={{ fontSize: 13.5 }}><span className="faint mono" style={{ fontSize: 10.5, letterSpacing: ".2em", marginRight: 8 }}>OBJECTIVE</span>{ch.majorObjective}</span>
              </div>
              <div className="info">
                <span className={`status-pill ${st}`}>{st === "complete" ? "Complete" : st === "active" ? "In progress" : st === "sealed" ? "Ahead" : "Open"}</span>
                <Meter value={pc} tone={pc === 100 ? "good" : undefined} label={`${ch.title} completion`} />
                <span>{pc}% · {fmtXp(chapterXpAvailable(ch))} XP available</span>
                <span>{ch.missions.length} missions · {ch.trial.length} trial criteria</span>
              </div>
            </motion.a>
          );
        })}
      </section>
      <section className="section">
        <div className="section-head"><h2 className="section-title">Before you start</h2></div>
        <div className="panel" style={{ padding: "6px 12px" }}>
          <ul className="checks">{setupItems.map(s => <CheckRow key={s.id} id={s.id} title={s.title} sub={s.note} />)}</ul>
        </div>
      </section>
    </>
  );
}

/* ---------------- Companion ---------------- */
export function Companion() {
  const { pulse } = useStore();
  const d = useDerived();
  return (
    <>
      <section style={{ paddingTop: 56, display: "grid", gridTemplateColumns: "minmax(0,1fr)", justifyItems: "center", textAlign: "center", gap: 10 }}>
        <Nox stage={d.stage.index} mood={d.mood} pulse={pulse} size={220} />
        <div className="eyebrow accent">Companion</div>
        <h1 className="display h-lg">Nox</h1>
        <p className="bubble" style={{ margin: "6px auto 0" }}>{d.line}</p>
        <p className="muted" style={{ maxWidth: "58ch", marginTop: 12 }}>
          Nox travels the road with you. Its bond grows with your XP, but also with steady days and honest journal entries, so it isn't
          quite the same as your rank. It's {d.mood === "tired" ? "a little tired right now" : `feeling ${d.mood}`}.
        </p>
        <div style={{ width: "min(520px, 100%)", marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 12, color: "var(--faint)", marginBottom: 8 }}>
            <span>{d.stage.name.toUpperCase()}</span><span>{fmtXp(d.bond)} bond{d.nextStage ? ` · ${fmtXp(d.nextStage.threshold - d.bond)} to ${d.nextStage.name}` : ""}</span>
          </div>
          <Meter value={Math.round(d.stageProgress * 100)} size="thick" label="Bond to next stage" />
        </div>
      </section>
      <section className="section">
        <div className="section-head"><h2 className="section-title">Forms</h2><span className="aside">each stage adds something small</span></div>
        <div className="grid auto">
          {STAGES.map(s => {
            const reached = d.stage.index >= s.index;
            return (
              <div key={s.name} className={`panel pad ${reached ? "" : "sealed"}`} style={{ display: "flex", gap: 16, alignItems: "center", opacity: reached ? 1 : 0.5 }}>
                <Nox stage={reached ? s.index : 0} mood={reached ? "calm" : "tired"} size={72} />
                <div>
                  <div className="eyebrow" style={{ color: reached ? "var(--accent)" : undefined }}>Stage {s.index + 1}</div>
                  <div className="display" style={{ fontSize: 24, letterSpacing: ".08em", textTransform: "uppercase" }}>{s.name}</div>
                  <div className="muted" style={{ fontSize: 13.5 }}>{reached ? s.unlock : `Unlocks at ${fmtXp(s.threshold)} bond`}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="section">
        <div className="section-head"><h2 className="section-title">Expressions</h2></div>
        <div className="panel pad" style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "space-around" }}>
          {(["curious", "calm", "focused", "proud", "tired"] as const).map(m => (
            <div key={m} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <Nox stage={d.stage.index} mood={m} size={84} />
              <span className="mono faint" style={{ fontSize: 11, letterSpacing: ".2em" }}>{m.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ---------------- Record: ranks, capabilities, achievements ---------------- */
export function Record() {
  const { state } = useStore();
  const d = useDerived();
  const skills = skillLevels(state);
  const earned = new Set(d.achievements.map(a => a.id));
  return (
    <>
      <PageHead eyebrow="Record" title="What you've become" lede="Your rank, your capabilities, and the moments that mattered along the way." />
      <section className="section">
        <div className="section-head"><h2 className="section-title">Ranks</h2><span className="aside">{fmtXp(d.xp)} XP</span></div>
        <div className="panel pad ladder">
          {RANKS.map(r => (
            <div key={r.name} className={`rung ${d.xp >= r.threshold ? "reached" : ""} ${d.rank.index === r.index ? "current" : ""}`}>
              <span className="mark" />
              <span className="rn">{r.name}</span>
              <span className="rd">{r.description}</span>
              <span className="rt">{fmtXp(r.threshold)} XP</span>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-head"><h2 className="section-title">Capabilities</h2><span className="aside">weighted by what each chapter builds</span></div>
        <div className="panel pad skills">
          {SKILLS.map(s => <div key={s.key} className="skill"><span>{s.label}</span><Meter value={skills[s.key]} size="thick" label={s.label} /><b>{skills[s.key]}%</b></div>)}
        </div>
      </section>
      <section className="section">
        <div className="section-head"><h2 className="section-title">Achievements</h2><span className="aside">{earned.size} / {ACHIEVEMENTS.length}</span></div>
        <div className="grid auto">
          {ACHIEVEMENTS.map(a => (
            <div key={a.id} className={`panel ach ${earned.has(a.id) ? "lit" : "locked"}`}>
              <Sigil earned={earned.has(a.id)} size={44} />
              <div><h3>{a.name}</h3><p>{a.description}</p></div>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-head"><h2 className="section-title">How XP works</h2></div>
        <div className="panel pad trial-dims" style={{ gridTemplateColumns: "1fr auto", maxWidth: 520 }}>
          <span>Concept</span><span className="xp">+{XP.concept}</span>
          <span>Must-read resource</span><span className="xp">+{XP.mustRead}</span>
          <span>Bonus resource</span><span className="xp">+{XP.bonusRead}</span>
          <span>Mission milestone</span><span className="xp">+{XP.milestone}</span>
          <span>Stretch goal</span><span className="xp">+{XP.stretch}</span>
          <span>Mission complete (major / minor)</span><span className="xp">+{XP.missionMajor} / +{XP.missionMinor}</span>
          <span>Week complete (all concepts)</span><span className="xp">+{XP.weekComplete}</span>
          <span>Trial criterion</span><span className="xp">+{XP.trialCriterion}</span>
          <span>Chapter trial passed</span><span className="xp">+{XP.trialPassed}</span>
        </div>
      </section>
    </>
  );
}

/* ---------------- Continuing ---------------- */
const CATS: ContinuingCategory[] = ["Release", "Model", "Framework", "Paper", "Technique", "Project", "Experiment"];

export function Continuing() {
  const { state, addContinuing, removeContinuing } = useStore();
  const d = useDerived();
  const unlocked = isEndState(state);
  const [form, setForm] = useState({ title: "", url: "", note: "", category: "Release" as ContinuingCategory });
  const [cat, setCat] = useState<ContinuingCategory | "All">("All");
  const [confirm, setConfirm] = useState<string | null>(null);
  const prompt = continuingPrompts[new Date().getDate() % continuingPrompts.length];
  const sourcesByCat = [...new Set(continuingSources.map(s => s.category))];
  return (
    <>
      <PageHead eyebrow={unlocked ? "Unlocked" : "Sealed until the final build"} title="Continuing"
        lede="The 24-week roadmap builds the foundation. This section keeps you current: new releases, models, frameworks, papers, techniques, projects and experiments." />
      {!unlocked && (
        <div className="sealed-note" style={{ marginTop: 24 }}>
          <Nox stage={d.stage.index} mood="calm" size={44} />
          <span>Continuing opens fully once you complete all 24 weeks and the final build. The sources below are yours to read any time.</span>
        </div>
      )}
      {unlocked && (
        <section className="section">
          <div className="section-head"><h2 className="section-title">Log something new</h2><span className="aside">{prompt}</span></div>
          <form className="panel pad" style={{ display: "grid", gap: 14 }} onSubmit={e => {
            e.preventDefault();
            if (!form.title.trim()) return;
            addContinuing({ ...form, title: form.title.trim(), url: form.url.trim() || undefined, date: localDay() });
            setForm({ title: "", url: "", note: "", category: form.category });
          }}>
            <div className="grid" style={{ gridTemplateColumns: "160px minmax(0,1fr) minmax(0,1fr)" }}>
              <div className="field"><label htmlFor="c-cat">Type</label>
                <select id="c-cat" className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as ContinuingCategory })}>{CATS.map(c => <option key={c}>{c}</option>)}</select>
              </div>
              <div className="field"><label htmlFor="c-title">What</label><input id="c-title" className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. New model release: reran my evals" /></div>
              <div className="field"><label htmlFor="c-url">Link (optional)</label><input id="c-url" className="input" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://…" /></div>
            </div>
            <div className="field"><label htmlFor="c-note">Notes</label><textarea id="c-note" className="journal small" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="What changed, what you measured, whether it matters for your work." /></div>
            <div><button className="btn primary" type="submit">Add to log</button></div>
          </form>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(["All", ...CATS] as const).map(c => <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
          </div>
          <div className="panel" style={{ padding: "4px 14px" }}>
            {state.continuing.filter(e => cat === "All" || e.category === cat).map(e => (
              <div key={e.id} className="row" style={{ cursor: "default", gridTemplateColumns: "92px minmax(0,1fr) auto" }}>
                <span className="mono faint" style={{ fontSize: 12 }}>{e.date}</span>
                <span><span className="title">{e.url ? <a href={e.url} target="_blank" rel="noopener noreferrer">{e.title}</a> : e.title}</span>{e.note && <span className="sub">{e.note}</span>}</span>
                <span className="side"><span className="tag steel">{e.category}</span>
                  {confirm === e.id
                    ? <span style={{ display: "flex", gap: 6 }}><button className="btn small danger" onClick={() => { removeContinuing(e.id); setConfirm(null); }}>Delete</button><button className="btn small ghost" onClick={() => setConfirm(null)}>Keep</button></span>
                    : <button className="btn small ghost" onClick={() => setConfirm(e.id)}>Remove</button>}
                </span>
              </div>
            ))}
            {!state.continuing.length && <div className="empty" style={{ border: 0, padding: "18px 4px" }}><Nox stage={d.stage.index} mood="curious" size={52} /><span>Nothing logged yet. The next release is never far away.</span></div>}
          </div>
        </section>
      )}
      <section className="section">
        <div className="section-head"><h2 className="section-title">Sources</h2><span className="aside">a light, steady habit beats occasional binges</span></div>
        {sourcesByCat.map(c => (
          <div key={c}>
            <div className="res-group-title">{c}</div>
            <div className="panel" style={{ padding: "2px 12px" }}>
              {continuingSources.filter(s => s.category === c).map(s => (
                <div key={s.url} className="row res-row" style={{ cursor: "default", gridTemplateColumns: "minmax(0,1fr) auto" }}>
                  <span><span className="title"><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a></span><span className="sub">{s.note}</span></span>
                  <span className="side"><span className="tag">{s.kind}</span></span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

/* ---------------- Data / progress file ---------------- */
export function DataPage() {
  const { state, sync, linkFile, reconnectFile, unlinkFile, exportJson, importFile, resetAll, setStartDate, gist, syncGistNow, createPrivateGist } = useStore();
  const [copied, setCopied] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  return (
    <>
      <PageHead eyebrow="Your data" title="Progress file" lede="Everything stays on your machine. Progress saves in this browser automatically. Link a progress.json to keep a portable copy on disk, or export and import it by hand." />
      <section className="section">
        <div className="grid two">
          <div className="panel pad" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="eyebrow">Status</div>
            <div className="display h-md">
              {sync.mode === "file" ? `Auto-saving to ${sync.fileName}` : sync.mode === "file-paused" ? `${sync.fileName} needs reconnecting` : "Saved in this browser"}
            </div>
            <p className="muted" style={{ margin: 0, fontSize: 14 }}>
              {sync.fsSupported
                ? sync.mode === "file" ? "Every change is written to the file within a second." : "Chrome and Edge can write straight to a file on disk."
                : "This browser can't write files directly. Use Export and Import to move progress between machines."}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {sync.fsSupported && sync.mode === "local" && <>
                <button className="btn primary small" onClick={() => linkFile("open")}>Link existing progress.json</button>
                <button className="btn small" onClick={() => linkFile("new")}>Create new file</button>
              </>}
              {sync.mode === "file-paused" && <button className="btn primary small" onClick={reconnectFile}>Reconnect</button>}
              {sync.mode !== "local" && <button className="btn small ghost" onClick={unlinkFile}>Unlink</button>}
            </div>
          </div>
          <div className="panel pad" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="eyebrow">Move it anywhere</div>
            <div className="display h-md">Export &amp; import</div>
            <p className="muted" style={{ margin: 0, fontSize: 14 }}>Importing replaces the progress in this browser with the file's contents.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn small" onClick={exportJson}>Export progress.json</button>
              <button className="btn small" onClick={() => fileInput.current?.click()}>Import…</button>
              <input ref={fileInput} type="file" accept=".json,application/json" hidden onChange={e => { const f = e.target.files?.[0]; if (f) importFile(f); e.target.value = ""; }} />
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="panel pad" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="eyebrow">Across machines</div>
          <div className="display h-md">Private GitHub Gist</div>
          {!gist.enabled && (
            <>
              <p className="muted" style={{ margin: 0, fontSize: 14, maxWidth: "70ch" }}>
                Sync progress to a private gist so it follows you to any browser or machine. Copy <code>.env.example</code> to <code>.env.local</code>,
                set <code>VITE_GITHUB_TOKEN</code> to a classic token with only the <code>gist</code> scope, and restart <code>npm run dev</code>.
              </p>
              <p className="faint" style={{ margin: 0, fontSize: 13 }}>The token is inlined into the app's JavaScript, so run it locally and don't publish a build made with one.</p>
            </>
          )}
          {gist.enabled && !gist.gistId && (
            <>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>A token is set but no gist yet. Create a private gist with your current progress, or set <code>VITE_GIST_ID</code> to one you already have.</p>
              <div><button className="btn primary small" disabled={gist.status === "syncing"} onClick={createPrivateGist}>Create private gist</button></div>
            </>
          )}
          {gist.enabled && gist.gistId && (
            <>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>
                {gist.status === "syncing" ? "Syncing…" : gist.status === "error" ? gist.error : `Synced${gist.lastSynced ? ` at ${gist.lastSynced.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}.`}
                {" "}Changes push a couple of seconds after you make them; the gist is checked again whenever you come back to this tab. The newer save wins.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <button className="btn small" disabled={gist.status === "syncing"} onClick={syncGistNow}>Sync now</button>
                <a className="btn small ghost" href={`https://gist.github.com/${gist.gistId}`} target="_blank" rel="noopener noreferrer">Open gist ↗</a>
                {!import.meta.env.VITE_GIST_ID && (
                  <button className="btn small ghost" onClick={() => {
                    navigator.clipboard?.writeText(`VITE_GIST_ID=${gist.gistId}`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }).catch(() => {});
                  }}>{copied ? "Copied" : "Copy VITE_GIST_ID line"}</button>
                )}
              </div>
              {!import.meta.env.VITE_GIST_ID && (
                <p className="faint mono" style={{ margin: 0, fontSize: 12 }}>Add <code>VITE_GIST_ID={gist.gistId}</code> to .env.local so other browsers and machines use the same gist.</p>
              )}
            </>
          )}
        </div>
      </section>
      <section className="section">
        <div className="panel pad" style={{ display: "flex", gap: 24, alignItems: "flex-end", flexWrap: "wrap", justifyContent: "space-between" }}>
          <div className="field">
            <label htmlFor="start">Journey start date</label>
            <input id="start" className="input" type="date" value={state.startDate ?? ""} onChange={e => setStartDate(e.target.value || null)} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {confirmReset ? (
              <>
                <span className="muted" style={{ fontSize: 13.5 }}>Erase all progress, journals and logs in this browser{gist.gistId ? " and your gist" : ""}?</span>
                <button className="btn small danger" onClick={() => { resetAll(); setConfirmReset(false); }}>Erase</button>
                <button className="btn small ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
              </>
            ) : <button className="btn small ghost" onClick={() => setConfirmReset(true)}>Reset progress…</button>}
          </div>
        </div>
        <p className="faint mono" style={{ fontSize: 12 }}>
          {Object.keys(state.done).length} completed items · {Object.keys(state.journal).length} journal entries · last change {state.updatedAt ? new Date(state.updatedAt).toLocaleString() : "never"}
        </p>
      </section>
    </>
  );
}
