import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { CHAPTERS, continuingPrompts, continuingSources, continuingTracks, guide, setupItems } from "../content";
import {
  ACHIEVEMENTS, chapterPct, chapterStatus, chapterStatusLabel, chapterXpAvailable, isEndState, nextMilestone, RANKS, SKILLS, skillLevels, STAGES, weeksComplete, XP,
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
  const budget = guide.howToUse.find(h => /budget/i.test(h.label));
  const rest = guide.howToUse.filter(h => h !== budget);
  return (
    <>
      <PageHead eyebrow="24 weeks · 8 chapters" title="The Roadmap" lede={guide.intro} />
      <p className="muted" style={{ maxWidth: "70ch", marginTop: 12 }}>{guide.audience}</p>

      <section className="section" aria-labelledby="getting-started">
        <div className="section-head"><h2 className="section-title" id="getting-started">Before you start</h2><span className="aside">workload, prerequisites, setup</span></div>
        <div className="grid two">
          <div className="panel pad" style={{ display: "grid", gap: 12 }}>
            <div className="eyebrow accent">Workload</div>
            {budget && <p style={{ margin: 0 }}>{budget.text}</p>}
            <ul className="guide-list compact">
              {guide.timeEstimates.map(t => <li key={t.label}><b>{t.label}</b><span>{t.text}</span></li>)}
            </ul>
          </div>
          <div className="panel pad" style={{ display: "grid", gap: 12, alignContent: "start" }}>
            <div className="eyebrow accent">Prerequisites</div>
            <p style={{ margin: 0 }}>{guide.prerequisites.replace(/^Prerequisite checkpoint:\s*/i, "")}</p>
            <div className="eyebrow accent" style={{ marginTop: 8 }}>Set up once</div>
            <ul className="checks">{setupItems.map(it => <CheckRow key={it.id} id={it.id} title={it.title} sub={it.note} />)}</ul>
            <a className="btn primary small" style={{ justifySelf: "start" }} href={chapterHref(CHAPTERS[0].id, { week: CHAPTERS[0].weeks[0].number })}>Start Chapter 01 <span className="arrow">→</span></a>
          </div>
        </div>
      </section>

      <section className="section" style={{ gap: 14 }} aria-label="Chapters">
        <div className="section-head"><h2 className="section-title">Chapters</h2></div>
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
                <span className={`status-pill ${st}`}>{chapterStatusLabel(state, ch)}</span>
                <Meter value={pc} tone={pc === 100 ? "good" : undefined} label={`${ch.title} completion`} />
                <span>{pc}% · {fmtXp(chapterXpAvailable(ch))} XP available</span>
                <span>{ch.weeks.length} weeks · {ch.missions.length} mission{ch.missions.length === 1 ? "" : "s"} · {ch.trial.length} trial criteria</span>
              </div>
            </motion.a>
          );
        })}
      </section>

      <section className="section">
        <div className="section-head"><h2 className="section-title">How to use this roadmap</h2></div>
        <div className="panel pad" style={{ display: "grid", gap: 18 }}>
          <ul className="guide-list">
            {rest.map(h => <li key={h.label}><b>{h.label}</b><span>{h.text}</span></li>)}
            <li><b>Resource allowance</b><span>{guide.resourceAllowance}</span></li>
            <li><b>Deployment</b><span>{guide.deployment}</span></li>
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="section-head"><h2 className="section-title">Shared reference shelf</h2><span className="aside">consult when a build raises a question</span></div>
        <div className="panel" style={{ padding: "2px 12px" }}>
          {guide.shelf.map(it => (
            <div key={it.url} className="row res-row" style={{ cursor: "default", gridTemplateColumns: "minmax(0,1fr) auto" }}>
              <span><span className="title"><a href={it.url} target="_blank" rel="noopener noreferrer">{it.title}</a></span><span className="sub">{it.note}</span></span>
              <span className="side"><span className="tag">{it.kind}</span></span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ---------------- Companion ---------------- */
const MOOD_WHY: Record<string, string> = {
  curious: "Nothing completed yet.",
  calm: "You've made progress, just not today.",
  focused: "You made progress today.",
  proud: "You're ahead of your planned week.",
  tired: "No progress for four or more days, or two or more weeks behind plan. It recovers as soon as you build again.",
};

export function Companion() {
  const { pulse, state } = useStore();
  const d = useDerived();
  return (
    <>
      <section style={{ paddingTop: 56, display: "grid", gridTemplateColumns: "minmax(0,1fr)", justifyItems: "center", textAlign: "center", gap: 10 }}>
        <Nox stage={d.stage.index} mood={d.mood} pulse={pulse} size={220} />
        <div className="eyebrow accent">Companion</div>
        <h1 className="display h-lg">Nox</h1>
        <p className="bubble" style={{ margin: "6px auto 0" }}>{d.line}</p>
        <div className="nox-explain">
          <div><span>MOOD · {d.mood.toUpperCase()}</span>How Nox feels right now. It follows your recent activity and pace, and changes day to day. {MOOD_WHY[d.mood]}</div>
          <div><span>STAGE · {d.stage.name.toUpperCase()}</span>How far your bond has grown. Stages only move forward and each adds a small visual detail.</div>
          <div><span>BOND · {fmtXp(d.bond)}</span>85% of your XP, plus a little for each day you make progress and each day you write in your journal. It rewards steadiness and reflection, so it isn't the same as your rank.</div>
        </div>
        {(() => {
          const nm = nextMilestone(state);
          return nm ? (
            <a className="btn primary small" style={{ marginTop: 10 }} href={chapterHref(nm.chapter.id, { week: nm.item.week, focus: nm.item.id })}>
              Back to your build: {nm.item.title.length > 60 ? nm.item.title.slice(0, 57) + "…" : nm.item.title} <span className="arrow">→</span>
            </a>
          ) : null;
        })()}
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
      <PageHead eyebrow="Record" title="Your learning progress" lede="Ranks, capability bars and achievements track what you've completed and reflected on in this roadmap. They're self-reported learning-progress markers, not verified credentials or a skills assessment." />
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
          <span>Reference resource</span><span className="xp">+{XP.reference}</span>
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
      <PageHead eyebrow={unlocked ? "Unlocked" : "Open to read · log unlocks later"} title="Continuing"
        lede={`The 24-week roadmap builds the foundation. This section keeps you current. ${guide.continuingIntro}`} />
      {!unlocked && (
        <div className="sealed-note" style={{ marginTop: 24 }}>
          <Nox stage={d.stage.index} mood="calm" size={44} />
          <span>
            <b>Available now:</b> every source and specialization track below. <b>Unlocks later:</b> the Continuing log (a dated record of releases,
            papers and experiments you've tried). It opens when all 24 weeks are complete (each week's build milestones and required concepts) and the
            final build mission is done. {weeksComplete(state)} of 24 weeks complete so far.
          </span>
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
        <div className="section-head"><h2 className="section-title">Next steps by specialization</h2><span className="aside">optional · pick one at a time</span></div>
        <div className="grid two">
          {continuingTracks.map(t => (
            <div key={t.name} className="panel pad" style={{ display: "grid", gap: 8, alignContent: "start" }}>
              <h3 style={{ fontFamily: "var(--display)", fontWeight: 500, fontSize: 22 }}>{t.name}</h3>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>{t.summary}</p>
              <ul className="plain-links">
                {t.items.map(it => <li key={it.url}><a href={it.url} target="_blank" rel="noopener noreferrer">{it.title}</a> <span className="faint">· {it.kind}</span></li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
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
  const {
    state, sync, linkFile, reconnectFile, unlinkFile, exportJson, importFile, resetAll, setStartDate,
    gist, syncGistNow, createPrivateGist, resolveGistConflict, setGistPaused, snapshots, restoreSnapshot,
  } = useStore();
  const [copied, setCopied] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState<string | null>(null);
  const gistOn = gist.enabled && !!gist.gistId && !gist.paused;
  const summary = (s: typeof state) => `${Object.keys(s.done).length} completed · ${Object.keys(s.na).length} not applicable · ${Object.keys(s.journal).length} journal entries · saved ${s.updatedAt ? new Date(s.updatedAt).toLocaleString() : "never"}`;
  return (
    <>
      <PageHead eyebrow="Your data" title="Progress file" lede="Progress saves in this browser automatically. You can also keep a copy in a file on disk, move it with export and import, or sync it through a GitHub Gist you configure." />

      <section className="section">
        <div className="panel pad" style={{ display: "grid", gap: 10 }}>
          <div className="eyebrow accent">Where your data goes</div>
          <ul className="guide-list compact">
            <li><b>Always</b><span>This browser's local storage on this device. Clearing site data removes it; other browsers and devices don't see it.</span></li>
            <li><b>If you link a file</b><span>A progress.json on your disk (Chrome/Edge). Nothing leaves your machine.</span></li>
            <li><b>If you export</b><span>A progress.json download that you control.</span></li>
            <li><b>If Gist sync is set up</b><span>
              The whole progress file (completed items with timestamps, not-applicable reasons, journal text and evidence links, your Continuing log and start date)
              is sent to GitHub and stored in the gist. {gist.enabled ? "Sync is configured in this build." : "Sync isn't configured in this build, so nothing is sent."}
            </span></li>
            <li><b>Gist privacy</b><span>
              A "secret" gist is unlisted, not access-controlled: anyone who has its URL can read it. The token used for sync is embedded in the app's
              JavaScript, so anyone who can load a build made with it can read the token too. Keep builds with a token private and local.
            </span></li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="grid two">
          <div className="panel pad" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="eyebrow">This device</div>
            <div className="display h-md">
              {sync.mode === "file" ? `Auto-saving to ${sync.fileName}` : sync.mode === "file-paused" ? `${sync.fileName} needs reconnecting` : "Saved in this browser"}
            </div>
            <p className="muted" style={{ margin: 0, fontSize: 14 }}>
              {sync.fsSupported
                ? sync.mode === "file" ? "Every change is written to the file within a second." : "Chrome and Edge can also write straight to a file on disk."
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
            <p className="muted" style={{ margin: 0, fontSize: 14 }}>Importing replaces the progress in this browser. The current version is saved as a snapshot first, so you can undo it.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn small" onClick={exportJson}>Export progress.json</button>
              <button className="btn small" onClick={() => fileInput.current?.click()}>Import…</button>
              <input ref={fileInput} type="file" accept=".json,application/json" hidden aria-label="Import progress.json" onChange={e => { const f = e.target.files?.[0]; if (f) importFile(f); e.target.value = ""; }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="gist">
        <div className="panel pad" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="eyebrow">Across machines</div>
          <div className="display h-md">GitHub Gist sync</div>
          {!gist.enabled && (
            <p className="muted" style={{ margin: 0, fontSize: 14, maxWidth: "70ch" }}>
              Not configured. To sync, copy <code>.env.example</code> to <code>.env.local</code>, set <code>VITE_GITHUB_TOKEN</code> to a classic token with only the
              <code> gist</code> scope, and restart <code>npm run dev</code>. Read "Gist privacy" above first.
            </p>
          )}
          {gist.enabled && gist.paused && (
            <>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>Sync is off in this browser. Your local progress is unchanged and nothing is sent to GitHub.</p>
              <div><button className="btn small primary" onClick={() => setGistPaused(false)}>Turn sync back on</button></div>
            </>
          )}
          {gist.enabled && !gist.paused && !gist.gistId && (
            <>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>A token is set but no gist yet. Create a secret gist with your current progress, or set <code>VITE_GIST_ID</code> to one you already have.</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn primary small" disabled={gist.status === "syncing"} onClick={createPrivateGist}>Create secret gist</button>
                <button className="btn small ghost" onClick={() => setGistPaused(true)}>Keep sync off</button>
              </div>
            </>
          )}
          {gistOn && gist.conflict && (
            <div className="conflict" role="group" aria-label="Choose which version to keep">
              <p style={{ margin: 0 }}>
                {gist.conflict.reason === "first-sync"
                  ? "This browser and your gist both hold progress and they differ. Choose which one to keep."
                  : "Both this browser and your gist changed since the last sync. Choose which one to keep."}
                {" "}The other version is saved as a snapshot either way, so nothing is lost.
              </p>
              <div className="grid two">
                <div className="panel pad"><div className="eyebrow">This browser</div><p className="muted" style={{ margin: "6px 0 10px", fontSize: 13.5 }}>{summary(gist.conflict.local)}</p>
                  <button className="btn small primary" onClick={() => resolveGistConflict("local")}>Keep this browser's</button></div>
                <div className="panel pad"><div className="eyebrow">Gist</div><p className="muted" style={{ margin: "6px 0 10px", fontSize: 13.5 }}>{summary(gist.conflict.remote)}</p>
                  <button className="btn small" onClick={() => resolveGistConflict("remote")}>Use the gist's</button></div>
              </div>
            </div>
          )}
          {gistOn && !gist.conflict && (
            <>
              <p className="muted" style={{ margin: 0, fontSize: 14 }} aria-live="polite">
                {gist.status === "syncing" ? "Syncing…" : gist.status === "error" ? gist.error : `Synced${gist.lastSynced ? ` at ${gist.lastSynced.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}.`}
                {" "}Changes push about 2 seconds after you make them, and the gist is checked when you return to this tab. If only one side changed since the last sync, it's copied to the other.
                If both changed, sync stops and asks you. Local progress is snapshotted before it's ever replaced.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <button className="btn small" disabled={gist.status === "syncing"} onClick={syncGistNow}>Sync now</button>
                <a className="btn small ghost" href={`https://gist.github.com/${gist.gistId}`} target="_blank" rel="noopener noreferrer">Open gist ↗</a>
                <button className="btn small ghost" onClick={() => setGistPaused(true)}>Disconnect sync in this browser</button>
                {!import.meta.env.VITE_GIST_ID && (
                  <button className="btn small ghost" onClick={() => {
                    navigator.clipboard?.writeText(`VITE_GIST_ID=${gist.gistId}`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }).catch(() => {});
                  }}>{copied ? "Copied" : "Copy VITE_GIST_ID line"}</button>
                )}
              </div>
              <p className="faint" style={{ margin: 0, fontSize: 12.5 }}>Disconnecting stops syncing in this browser only. It doesn't delete local progress or the gist.</p>
            </>
          )}
        </div>
      </section>

      <section className="section" id="snapshots">
        <div className="section-head"><h2 className="section-title">Snapshots</h2><span className="aside">kept in this browser · last 5</span></div>
        <div className="panel" style={{ padding: "4px 14px" }}>
          {snapshots.length === 0 && <p className="muted" style={{ margin: 0, padding: "14px 0", fontSize: 14 }}>No snapshots yet. One is saved automatically before anything replaces your local progress (gist pull, conflict choice, linking a file, import, reset, restore).</p>}
          {snapshots.map(sn => (
            <div key={sn.id} className="row" style={{ cursor: "default", gridTemplateColumns: "minmax(0,1fr) auto" }}>
              <span><span className="title" style={{ cursor: "default" }}>{sn.reason}</span><span className="sub">{new Date(sn.at).toLocaleString()} · {summary(sn.state)}</span></span>
              <span className="side">
                {confirmRestore === sn.id
                  ? <span style={{ display: "flex", gap: 6 }}><button className="btn small primary" onClick={() => { restoreSnapshot(sn.id); setConfirmRestore(null); }}>Restore</button><button className="btn small ghost" onClick={() => setConfirmRestore(null)}>Cancel</button></span>
                  : <button className="btn small ghost" onClick={() => setConfirmRestore(sn.id)}>Restore…</button>}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="panel pad" style={{ display: "flex", gap: 24, alignItems: "flex-end", flexWrap: "wrap", justifyContent: "space-between" }}>
          <div className="field">
            <label htmlFor="start">Journey start date (optional)</label>
            <input id="start" className="input" type="date" value={state.startDate ?? ""} onChange={e => setStartDate(e.target.value || null)} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {confirmReset ? (
              <>
                <span className="muted" style={{ fontSize: 13.5 }}>Erase all progress, journals and logs in this browser{gistOn ? " (the empty state then syncs to your gist)" : ""}? A snapshot is kept.</span>
                <button className="btn small danger" onClick={() => { resetAll(); setConfirmReset(false); }}>Erase</button>
                <button className="btn small ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
              </>
            ) : <button className="btn small ghost" onClick={() => setConfirmReset(true)}>Reset progress…</button>}
          </div>
        </div>
        <p className="faint mono" style={{ fontSize: 12 }}>{summary(state)}</p>
      </section>
    </>
  );
}
