import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { CHAPTER_BY_ID, CHAPTERS, ITEMS, type Chapter, type Mission } from "../content";
import {
  chapterPct, chapterStatus, chapterXpAvailable, isMissionComplete, isTrialPassed, isWeekComplete, itemXp, missionMilestoneIds, pct, weekConceptIds, XP,
} from "../engine/progress";
import { useStore } from "../store";
import { CheckRow, fmtMinutes, fmtXp, Meter, pad2, Ring } from "../ui/bits";
import { Nox } from "../ui/Nox";
import { chapterHref, type Route } from "../ui/router";
import { useDerived } from "../ui/derived";
import { JournalEditor } from "./Journal";

const SECTIONS = [
  ["training", "Training"], ["intel", "Intel"], ["missions", "Missions"], ["trial", "Trial"], ["journal", "Journal"],
] as const;

export function ChapterPage({ route }: { route: Route }) {
  const ch = CHAPTER_BY_ID.get(route.path[1] ?? "") ?? CHAPTERS[0];
  const { state } = useStore();
  const focus = route.query.get("focus") ?? undefined;
  const focusWeek = focus ? ITEMS.get(focus)?.week : undefined;
  const qWeek = Number(route.query.get("week")) || focusWeek;
  const defaultWeek = useMemo(() => {
    if (qWeek && ch.weeks.some(w => w.number === qWeek)) return qWeek;
    return ch.weeks.find(w => !isWeekComplete(state, w.number))?.number ?? ch.weeks[0].number;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ch.id, qWeek]);
  const [week, setWeek] = useState(defaultWeek);
  useEffect(() => setWeek(defaultWeek), [defaultWeek]);

  const section = route.query.get("s");
  useEffect(() => {
    if (section && !focus) document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [section, focus, ch.id]);

  const status = chapterStatus(state, ch);
  const isFinal = ch.number === CHAPTERS.length;

  return (
    <motion.div key={ch.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <Header ch={ch} />
      {status === "sealed" && (
        <div className="sealed-note" style={{ marginTop: 28 }}>
          <Nox stage={0} mood="curious" size={44} />
          <span>This chapter opens fully as you progress. Everything is readable now; reading ahead is never wasted.</span>
        </div>
      )}
      <nav className="subnav" aria-label="Chapter sections">
        {SECTIONS.map(([id, label]) => <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{label}</a>)}
      </nav>

      {isFinal && <FinalBuild />}

      <section className="section" id="training" style={{ scrollMarginTop: 120 }}>
        <div className="section-head">
          <h2 className="section-title">Training</h2>
          <span className="aside">concepts to understand, week by week</span>
        </div>
        <div className="weeks-tabs" role="tablist">
          {ch.weeks.map(w => {
            const ids = weekConceptIds(ch, w.number);
            return (
              <button key={w.number} role="tab" className="week-tab" aria-selected={week === w.number} onClick={() => setWeek(w.number)}>
                <span className="wn">WEEK {pad2(w.number)}{isWeekComplete(state, w.number) ? " · ✓" : ""}</span>
                <span className="wt">{w.title}</span>
                <span className="wp">{pct(state, ids)}%</span>
              </button>
            );
          })}
        </div>
        <WeekTraining ch={ch} week={week} focus={focus} />
      </section>

      <Intel ch={ch} focus={focus} />

      <section className="section" id="missions" style={{ scrollMarginTop: 120 }}>
        <div className="section-head">
          <h2 className="section-title">Missions</h2>
          <span className="aside">practical engineering: build it, then reflect</span>
        </div>
        {ch.missions.map(m => <MissionCard key={m.id} m={m} focus={focus} />)}
      </section>

      <Trial ch={ch} focus={focus} />

      <section className="section" id="journal" style={{ scrollMarginTop: 120 }}>
        <div className="section-head">
          <h2 className="section-title">Engineer's Journal · Week {pad2(week)}</h2>
          <span className="aside">notes, mistakes, discoveries, questions</span>
        </div>
        <JournalEditor journalKey={`w${week}`} placeholder={`Week ${week}: what did you learn, what broke, what surprised you?`} />
      </section>

      <Pager ch={ch} />
    </motion.div>
  );
}

function Header({ ch }: { ch: Chapter }) {
  const { state } = useStore();
  const pc = chapterPct(state, ch);
  const avail = chapterXpAvailable(ch);
  const status = chapterStatus(state, ch);
  const earned = [...ITEMS.values()].filter(m => m.chapterId === ch.id && m.core && state.done[m.id]).reduce((a, m) => a + itemXp(m), 0);
  return (
    <section className="ch-hero">
      <div>
        <div className="eyebrow accent">Chapter {pad2(ch.number)} · Weeks {ch.weeks[0].number}–{ch.weeks[ch.weeks.length - 1].number}</div>
        <h1 className="display h-lg" style={{ marginTop: 14 }}>{ch.title}</h1>
        <p className="tagline">{ch.tagline}</p>
        <p className="lede" style={{ marginTop: 16 }}>{ch.description}</p>
        <p className="muted" style={{ marginTop: 10, maxWidth: "64ch" }}>{ch.why}</p>
        <div className="objective"><span>MAJOR OBJECTIVE</span>{ch.majorObjective}</div>
      </div>
      <div className="panel pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className={`status-pill ${status}`}>{status === "complete" ? "Complete" : status === "active" ? "In progress" : status === "sealed" ? "Ahead" : "Open"}</span>
          <Ring value={pc} size={58} />
        </div>
        <Meter value={pc} label="Chapter completion" />
        <div className="trial-dims">
          <span>XP earned</span><span className="num">{fmtXp(earned)}</span>
          <span>XP available</span><span className="num">{fmtXp(avail)}</span>
          <span>Missions</span><span className="num">{ch.missions.filter(m => isMissionComplete(state, m.id)).length} / {ch.missions.length}</span>
          <span>Trial</span><span className={isTrialPassed(state, ch) ? "ok" : ""}>{isTrialPassed(state, ch) ? "Passed" : "Not yet"}</span>
        </div>
      </div>
    </section>
  );
}

function WeekTraining({ ch, week, focus }: { ch: Chapter; week: number; focus?: string }) {
  const { state } = useStore();
  const w = ch.weeks.find(x => x.number === week) ?? ch.weeks[0];
  const ids = weekConceptIds(ch, w.number);
  const remaining = ids.filter(id => !state.done[id]).length * XP.concept + (isWeekComplete(state, w.number) ? 0 : XP.weekComplete);
  const minutes = w.groups.flatMap(g => g.concepts).reduce((a, c) => a + c.minutes, 0);
  return (
    <motion.div key={w.number} className="panel" style={{ padding: "8px 12px 12px" }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div style={{ padding: "16px 12px 4px" }}>
        <div className="eyebrow">Week {pad2(w.number)}</div>
        <div className="display h-md" style={{ marginTop: 4 }}>{w.title}</div>
        <p className="muted" style={{ margin: "6px 0 0" }}>{w.focus}</p>
      </div>
      {w.groups.map(g => (
        <div key={g.title}>
          <div className="group-title">{g.title}</div>
          <ul className="checks">
            {g.concepts.map(c => (
              <CheckRow key={c.id} id={c.id} title={c.title} sub={c.summary} side={<span>{fmtMinutes(c.minutes)}</span>} target={focus === c.id} />
            ))}
          </ul>
        </div>
      ))}
      <div className="week-foot">
        <span>~{fmtMinutes(minutes)} of study · completing every concept adds +{XP.weekComplete} XP</span>
        <span className="xp">{isWeekComplete(state, w.number) ? "Week complete" : `+${remaining} XP available`}</span>
      </div>
    </motion.div>
  );
}

function Intel({ ch, focus }: { ch: Chapter; focus?: string }) {
  const { state } = useStore();
  const [filter, setFilter] = useState<"all" | "todo">("all");
  const list = ch.resources.filter(r => filter === "all" || !state.done[r.id]);
  const req = list.filter(r => r.required), bonus = list.filter(r => !r.required);
  const reqHours = ch.resources.filter(r => r.required).reduce((a, r) => a + r.hours, 0);
  return (
    <section className="section" id="intel" style={{ scrollMarginTop: 120 }}>
      <div className="section-head">
        <h2 className="section-title">Intel</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="aside">~{Math.round(reqHours * 10) / 10} h must-read</span>
          <button className="chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All</button>
          <button className="chip" aria-pressed={filter === "todo"} onClick={() => setFilter("todo")}>Not done</button>
        </div>
      </div>
      <div className="panel" style={{ padding: "4px 12px 10px" }}>
        {req.length > 0 && <div className="res-group-title req">Must read · {ch.resources.filter(r => r.required && state.done[r.id]).length}/{ch.resources.filter(r => r.required).length}</div>}
        <ul className="checks">
          {req.map(r => (
            <CheckRow key={r.id} id={r.id} className="res-row" target={focus === r.id}
              title={<a href={r.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>{r.title}</a>}
              sub={r.note}
              side={<><span className="tag req">{r.kind}</span><span>{r.hours ? `~${r.hours} h` : "ongoing"} · wk {pad2(r.week)}</span></>} />
          ))}
        </ul>
        {bonus.length > 0 && <div className="res-group-title">Bonus · {ch.resources.filter(r => !r.required && state.done[r.id]).length}/{ch.resources.filter(r => !r.required).length}</div>}
        <ul className="checks">
          {bonus.map(r => (
            <CheckRow key={r.id} id={r.id} className="res-row bonus" target={focus === r.id}
              title={<a href={r.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>{r.title}</a>}
              sub={r.note}
              side={<><span className="tag">{r.kind}</span><span>{r.hours ? `~${r.hours} h` : "ongoing"} · wk {pad2(r.week)}</span></>} />
          ))}
        </ul>
        {!list.length && <p className="muted" style={{ padding: "16px 12px", margin: 0 }}>Everything here is done.</p>}
      </div>
    </section>
  );
}

function MissionCard({ m, focus }: { m: Mission; focus?: string }) {
  const { state } = useStore();
  const ids = missionMilestoneIds(m.id);
  const pc = pct(state, ids);
  const complete = isMissionComplete(state, m.id);
  const xp = ids.length * XP.milestone + (m.major ? XP.missionMajor : XP.missionMinor);
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (focus === m.id) document.getElementById(`mission-${m.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focus, m.id]);
  return (
    <article id={`mission-${m.id}`} className={`panel mission ${complete ? "complete" : ""} ${focus === m.id ? "lit" : ""}`} style={{ scrollMarginTop: 120 }}>
      <div className="mission-head">
        <div>
          <div className="mn">MISSION {pad2(m.number)} · {m.track.toUpperCase()}{m.major ? " · MAJOR" : ""}</div>
          <h3>{m.title}</h3>
          <p className="muted" style={{ margin: "10px 0 0", maxWidth: "70ch" }}><span className="mlabel" style={{ display: "inline", marginRight: 8 }}>Objective</span>{m.objective}</p>
        </div>
        <Ring value={pc} />
      </div>
      {open && (
        <div className="mission-body">
          <div>
            <p className="mlabel">Requirements</p>
            <ul className="plain">{m.requirements.map(r => <li key={r}>{r}</li>)}</ul>
            <p className="mlabel">Deliverable</p>
            <p className="deliverable" style={{ margin: 0 }}>{m.deliverable}</p>
            <p className="mlabel">Reflection</p>
            <ul className="plain" style={{ marginBottom: 10 }}>{m.reflection.map(r => <li key={r}>{r}</li>)}</ul>
            <JournalEditor journalKey={m.id} small placeholder="Your reflection, once you've built it." />
          </div>
          <div>
            <p className="mlabel">Milestones · {ids.filter(id => state.done[id]).length}/{ids.length}</p>
            <ul className="checks">
              {m.milestones.map(s => <CheckRow key={s.id} id={s.id} title={s.title} side={<span>{fmtMinutes(s.minutes)}</span>} target={focus === s.id} />)}
            </ul>
            {m.stretch.length > 0 && (
              <>
                <p className="mlabel">Stretch · bonus</p>
                <ul className="checks">
                  {m.stretch.map(s => <CheckRow key={s.id} id={s.id} title={s.title} side={<span>{fmtMinutes(s.minutes)}</span>} target={focus === s.id} />)}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
      <div className="mission-foot">
        <span>~{m.hours} h · {complete ? "Mission complete" : `${pc}% complete`}</span>
        <span style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span className="xp">+{fmtXp(xp)} XP{m.major ? ` (incl. +${XP.missionMajor} completion)` : ""}</span>
          <button className="btn small ghost" onClick={() => setOpen(o => !o)}>{open ? "Collapse" : "Expand"}</button>
        </span>
      </div>
    </article>
  );
}

function Trial({ ch, focus }: { ch: Chapter; focus?: string }) {
  const { state } = useStore();
  const passed = isTrialPassed(state, ch);
  const count = ch.trial.filter(t => state.done[t.id]).length;
  return (
    <section className="section" id="trial" style={{ scrollMarginTop: 120 }}>
      <div className="section-head">
        <h2 className="section-title">Chapter {pad2(ch.number)} Trial</h2>
        <span className="aside">before moving forward, you should be able to…</span>
      </div>
      <div className={`panel trial ${passed ? "lit" : ""}`}>
        <div className="trial-list">
          <ul className="checks">
            {ch.trial.map(t => (
              <CheckRow key={t.id} id={t.id} className="trial-row" target={focus === t.id}
                title={<><span className="dim">{t.dimension}</span>{t.statement}</>} />
            ))}
          </ul>
        </div>
        <div className="trial-status">
          <div className="trial-dims">
            {ch.trial.map(t => <FragmentRow key={t.id} label={t.dimension} ok={!!state.done[t.id]} />)}
          </div>
          <div>
            <div className="eyebrow">Status</div>
            <div className={`verdict ${passed ? "ready" : ""}`}>{passed ? "Ready" : "Not ready"}</div>
          </div>
          <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>
            {passed ? `Trial passed. +${XP.trialPassed} XP.` : `${count} of ${ch.trial.length} met. Tick a criterion only when it's honestly true; if you're unsure, revisit the mission first.`}
          </p>
        </div>
      </div>
    </section>
  );
}
const FragmentRow = ({ label, ok }: { label: string; ok: boolean }) => (<><span>{label.toUpperCase()}</span><span className={ok ? "ok" : ""}>{ok ? "✓" : "□"}</span></>);

function FinalBuild() {
  const { state } = useStore();
  const d = useDerived();
  const capstone = CHAPTERS[CHAPTERS.length - 1].missions[0];
  const pillars: [string, string[]][] = [
    ["LLMs", ["ch1"]], ["Prompting", ["ch2"]], ["Applications", ["ch3"]], ["RAG", ["ch4"]], ["Tool calling", ["ch5"]], ["Agents", ["ch5"]],
    ["MCP", ["ch6"]], ["Evaluation", ["ch7"]], ["Observability", ["ch7"]], ["Production architecture", ["ch7", "ch8"]],
  ];
  return (
    <section className="section">
      <div className="panel final">
        <div style={{ position: "relative" }}>
          <Nox stage={d.stage.index} mood="focused" size={84} />
          <div className="eyebrow accent" style={{ marginTop: 8 }}>Weeks 22–24 · Mission {capstone ? pad2(capstone.number) : ""}</div>
          <h2 className="display" style={{ marginTop: 10 }}>The Final Build</h2>
          <p className="lede">Everything before this was preparation. Combine every capability you've built into one system you'd put your name on.</p>
          <div className="pillars">
            {pillars.map(([name, chs]) => {
              const on = chs.every(id => { const c = CHAPTER_BY_ID.get(id); return !!c && chapterPct(state, c) >= 80; });
              return <span key={name} className={`pillar ${on ? "on" : ""}`}><i />{name}</span>;
            })}
          </div>
          {capstone && (
            <p className="faint mono" style={{ marginTop: 22, fontSize: 12 }}>
              {pct(state, missionMilestoneIds(capstone.id))}% of the final build complete · a pillar lights up once its chapter is 80% done
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function Pager({ ch }: { ch: Chapter }) {
  const prev = CHAPTERS[ch.number - 2], next = CHAPTERS[ch.number];
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 64, flexWrap: "wrap" }}>
      {prev ? <a className="btn ghost" href={chapterHref(prev.id)}>← {prev.title}</a> : <span />}
      {next && <a className="btn" href={chapterHref(next.id)}>{next.title} <span className="arrow">→</span></a>}
    </div>
  );
}


