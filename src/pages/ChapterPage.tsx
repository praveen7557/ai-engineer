import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { CHAPTER_BY_ID, CHAPTERS, ITEMS, RESOURCE_BY_ID, type Chapter, type Mission, type Resource } from "../content";
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
          <span className="aside">build first, then the concepts that build needs</span>
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
        {ch.notes && ch.notes.length > 0 && (
          <div className="notes">
            {ch.notes.map(n => <div key={n.label} className="note"><span>{n.label.toUpperCase()}</span>{n.text}</div>)}
          </div>
        )}
      </section>

      <Intel ch={ch} focus={focus} />
      {ch.revisit && ch.revisit.length > 0 && <Revisit ids={ch.revisit} />}

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
        <div className="objective quiet" style={{ marginTop: 0 }}><span>ENGINEERING DECISION</span>{ch.decision}</div>
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
        <div className="objective quiet"><span>DONE WHEN</span>{ch.doneWhen}</div>
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
      <WeekBuildCard ch={ch} week={w.number} focus={focus} />
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
        <span>~{fmtMinutes(minutes)} of concepts · finishing them adds +{XP.weekComplete} XP</span>
        <span className="xp">{isWeekComplete(state, w.number) ? "Week complete" : `+${remaining} XP available`}</span>
      </div>
    </motion.div>
  );
}

function Intel({ ch, focus }: { ch: Chapter; focus?: string }) {
  const { state } = useStore();
  const [filter, setFilter] = useState<"all" | "todo">("all");
  const list = ch.resources.filter(r => filter === "all" || !state.done[r.id]);
  const reqHours = ch.resources.filter(r => r.use === "must").reduce((a, r) => a + r.hours, 0);
  const refHours = ch.resources.filter(r => r.use === "reference").reduce((a, r) => a + r.hours, 0);
  const tiers: [Resource["use"], string, string][] = [["must", "Must read", "needed for the build"], ["reference", "Reference", "consult while implementing"], ["bonus", "Bonus", "optional depth"]];
  return (
    <section className="section" id="intel" style={{ scrollMarginTop: 120 }}>
      <div className="section-head">
        <h2 className="section-title">Intel</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="aside">~{Math.round(reqHours * 10) / 10} h must-read · ~{Math.round(refHours * 10) / 10} h reference</span>
          <button className="chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All</button>
          <button className="chip" aria-pressed={filter === "todo"} onClick={() => setFilter("todo")}>Not done</button>
        </div>
      </div>
      <div className="panel" style={{ padding: "4px 12px 10px" }}>
        {tiers.map(([use, label, hint]) => {
          const rows = list.filter(r => r.use === use);
          if (!rows.length) return null;
          const all = ch.resources.filter(r => r.use === use);
          return (
            <div key={use}>
              <div className={`res-group-title ${use === "must" ? "req" : ""}`}>{label} · {all.filter(r => state.done[r.id]).length}/{all.length} <span className="faint" style={{ letterSpacing: ".1em", textTransform: "none" }}>· {hint}</span></div>
              <ul className="checks">
                {rows.map(r => <ResourceRow key={r.id} r={r} target={focus === r.id} />)}
              </ul>
            </div>
          );
        })}
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
              {m.milestones.map(s => <CheckRow key={s.id} id={s.id} title={s.title} side={<span>{fmtMinutes(s.minutes)} · wk {pad2(s.week)}</span>} target={focus === s.id} />)}
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

const weekLabel = (r: Resource) => (r.weekEnd && r.weekEnd !== r.week ? `wk ${pad2(r.week)}–${pad2(r.weekEnd)}` : `wk ${pad2(r.week)}`);

function ResourceRow({ r, target }: { r: Resource; target?: boolean }) {
  return (
    <CheckRow id={r.id} className={`res-row ${r.use === "bonus" ? "bonus" : ""}`} target={target}
      title={<><a href={r.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>{r.title}</a>{r.suggested && <span className="tag steel" style={{ marginLeft: 8 }}>Suggested</span>}</>}
      sub={r.note}
      side={<><span className={`tag ${r.use === "must" ? "req" : r.use === "reference" ? "steel" : ""}`}>{r.kind}</span><span>{r.hours ? `~${r.hours} h` : "ongoing"} · {weekLabel(r)}</span></>} />
  );
}

function WeekBuildCard({ ch, week, focus }: { ch: Chapter; week: number; focus?: string }) {
  const { state } = useStore();
  const w = ch.weeks.find(x => x.number === week);
  if (!w) return null;
  const ms = ch.missions.flatMap(m => m.milestones.filter(s => s.week === week).map(s => ({ s, m })));
  const done = ms.filter(({ s }) => state.done[s.id]).length;
  return (
    <div className="build-card">
      <div className="build-head">
        <span className="eyebrow accent">This week's build</span>
        {ms.length > 0 && <span className="faint mono" style={{ fontSize: 11 }}>{done}/{ms.length} milestones</span>}
      </div>
      <p className="build-what">{w.build.deliverable}</p>
      <p className="build-evidence"><span>EVIDENCE TO KEEP</span>{w.build.evidence}</p>
      {ms.length > 0 && (
        <ul className="checks">
          {ms.map(({ s, m }) => (
            <CheckRow key={s.id} id={s.id} title={s.title} target={focus === s.id}
              side={<><span>{fmtMinutes(s.minutes)}</span><a className="faint" href={`#mission-${m.id}`} onClick={e => { e.preventDefault(); e.stopPropagation(); document.getElementById(`mission-${m.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>M{pad2(m.number)}</a></>} />
          ))}
        </ul>
      )}
    </div>
  );
}

function Revisit({ ids }: { ids: string[] }) {
  const items = ids.map(id => RESOURCE_BY_ID.get(id)).filter((r): r is NonNullable<typeof r> => !!r);
  if (!items.length) return null;
  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Revisit</h2>
        <span className="aside">apply earlier resources; don't restart the reading list</span>
      </div>
      <div className="panel" style={{ padding: "4px 14px" }}>
        {items.map(r => {
          const c = CHAPTER_BY_ID.get(r.chapterId)!;
          return (
            <div key={r.id} className="row res-row" style={{ cursor: "default", gridTemplateColumns: "minmax(0,1fr) auto" }}>
              <span><span className="title"><a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a></span><span className="sub">{r.note}</span></span>
              <span className="side"><a className="faint" href={chapterHref(c.id, { focus: r.id, section: "intel" })}>Ch {pad2(c.number)}</a></span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FinalBuild() {
  const { state } = useStore();
  const d = useDerived();
  const last = CHAPTERS[CHAPTERS.length - 1];
  const capstone = last.missions[0];
  const pillars: [string, string[]][] = [
    ["LLMs", ["ch1"]], ["Prompting", ["ch2"]], ["Applications", ["ch3"]], ["RAG", ["ch4"]], ["Tool calling", ["ch5"]], ["Agents", ["ch5"]],
    ["MCP", ["ch6"]], ["Evaluation", ["ch7"]], ["Observability", ["ch7"]], ["Production architecture", ["ch7", "ch8"]],
  ];
  return (
    <section className="section">
      <div className="panel final">
        <div style={{ position: "relative" }}>
          <Nox stage={d.stage.index} mood="focused" size={84} />
          <div className="eyebrow accent" style={{ marginTop: 8 }}>Weeks {last.weeks[0].number}–{last.weeks[last.weeks.length - 1].number} · Mission {capstone ? pad2(capstone.number) : ""}</div>
          <h2 className="display" style={{ marginTop: 10 }}>The Final Build</h2>
          <p className="lede">Everything before this was preparation. Ship one useful product to a real audience, using only the techniques that earn their complexity.</p>
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


