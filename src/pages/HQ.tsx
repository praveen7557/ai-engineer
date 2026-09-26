import { motion } from "framer-motion";
import { CHAPTERS, MISSIONS, TOTAL_WEEKS } from "../content";
import {
  activityByDay, chapterPct, chapterStatus, RANKS, SKILLS, skillLevels, weeksComplete,
} from "../engine/progress";
import { localDay } from "../engine/state";
import { useStore } from "../store";
import { fmtMinutes, fmtXp, Meter, pad2 } from "../ui/bits";
import { useDerived } from "../ui/derived";
import { Sigil } from "../ui/Feed";
import { Nox } from "../ui/Nox";
import { chapterHref, href } from "../ui/router";

const fade = (i: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.06 * i, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const } });

export function HQ() {
  const d = useDerived();
  if (d.endState) return <EndState />;
  return (
    <>
      <Hero />
      <motion.section className="section" style={{ marginTop: 48 }} {...fade(1)} aria-label="Your next step"><NextStep /></motion.section>
      <motion.section className="section" style={{ marginTop: 20 }} {...fade(2)}><Stats /></motion.section>
      <motion.section className="section" {...fade(3)}><Pace /></motion.section>
      <motion.section className="section" {...fade(4)}><Flow /></motion.section>
      <motion.section className="section" {...fade(5)}><Activity /></motion.section>
      <motion.section className="section" {...fade(6)}><RecentRecord /></motion.section>
    </>
  );
}

function Hero() {
  const { pulse } = useStore();
  const d = useDerived();
  const week = d.pace.kind === "tracked" ? d.pace.plan : null;
  return (
    <section className="hero">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
        <div className="eyebrow accent">The AI Engineer · 24 week progression</div>
        <div className="week">{week ? <>WEEK <b>{pad2(week)}</b> / {TOTAL_WEEKS}</> : "NOT YET BEGUN"}</div>
        <h1 className="rank-title">{d.rank.name}</h1>
        <p className="rank-desc">{d.rank.description}</p>
        <div className="overall">
          <Meter value={d.overall} size="thick" label="Overall completion" />
          <b>{d.overall}%</b>
        </div>
        <p className="faint mono" style={{ fontSize: 12, marginTop: 10 }}>
          {fmtXp(d.xp)} XP{d.nextRank ? ` · ${fmtXp(d.nextRank.threshold - d.xp)} to ${d.nextRank.name}` : " · highest rank"}
        </p>
      </motion.div>
      <div className="hero-nox">
        <div className="companion">
          <Nox stage={d.stage.index} mood={d.mood} pulse={pulse} size={150} />
          <div>
            <motion.p key={d.line} className="bubble" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>{d.line}</motion.p>
            <div className="companion-meta">Nox · <b>{d.stage.name}</b></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NextStep() {
  const { state, setStartDate } = useStore();
  const d = useDerived();
  const ms = d.nextMilestone;
  const study = d.next.filter(n => n.item.kind !== "milestone" && n.chapter.id === (ms?.chapter.id ?? n.chapter.id)).slice(0, 2);
  const firstBuild = CHAPTERS[0].missions[0];
  if (!Object.keys(state.done).length && !Object.keys(state.na).length && firstBuild) {
    const first = firstBuild.milestones[0];
    return (
      <div className="panel next lit">
        <div>
          <div className="eyebrow accent">Your first step</div>
          <div className="what">Start the Prompt Lab</div>
          <div className="where">Mission {pad2(firstBuild.number)} · {firstBuild.title}. First milestone: {first.title} (~{fmtMinutes(first.minutes)}).</div>
          <p className="muted" style={{ margin: "10px 0 0", fontSize: 14, maxWidth: "60ch" }}>
            Build first: make one real model call today, then study the concepts it raises. A start date is optional; it only powers the plan-vs-you comparison.
          </p>
          <div className="facts">
            <label className="fact" style={{ gap: 6 }}>
              <span>Optional start date</span>
              <input className="input" type="date" value={state.startDate ?? ""} aria-label="Optional start date" onChange={e => setStartDate(e.target.value || null)} />
            </label>
            {!state.startDate && <button type="button" className="btn small ghost" style={{ alignSelf: "end" }} onClick={() => setStartDate(localDay())}>Start the clock today</button>}
          </div>
        </div>
        <a className="btn primary" href={chapterHref(CHAPTERS[0].id, { week: first.week, focus: first.id })} style={{ padding: "14px 26px", fontSize: 14 }}>Start the Prompt Lab <span className="arrow">→</span></a>
      </div>
    );
  }
  const step = ms ?? d.next[0];
  if (!step) return null;
  const mission = step.item.missionId ? MISSIONS.get(step.item.missionId) : undefined;
  const to = chapterHref(step.chapter.id, { week: step.item.week, focus: step.item.id, section: step.item.kind === "trial" ? "trial" : undefined });
  const behind = d.pace.kind === "tracked" && d.pace.delta < 0;
  return (
    <div className="panel next lit">
      <div>
        <div className="eyebrow accent">{behind ? "The roadmap has moved ahead · your next build step" : "Your next build step"}</div>
        <div className="what">{step.item.title}</div>
        <div className="where">
          {mission ? `Mission ${pad2(mission.number)} · ${mission.title} · ` : ""}Chapter {pad2(step.chapter.number)}{step.item.week ? ` · Week ${pad2(step.item.week)}` : ""}
          {step.item.conditional ? " · conditional: complete it or mark it not applicable with a reason" : ""}
        </div>
        <div className="facts">
          <div className="fact"><span>Focused slice</span><b>{fmtMinutes(step.item.minutes)}</b></div>
          <div className="fact"><span>Reward</span><b className="acc">+{step.xp} XP</b></div>
        </div>
        {study.length > 0 && (
          <div className="then">
            <span className="eyebrow">Study alongside</span>
            {study.map(t => (
              <a key={t.item.id} href={chapterHref(t.chapter.id, { week: t.item.week, focus: t.item.id, section: t.item.kind === "resource" ? "intel" : undefined })}>→ {t.label}: {t.item.title} <span className="faint">· {fmtMinutes(t.item.minutes)}</span></a>
            ))}
          </div>
        )}
        {!state.startDate && (
          <p className="faint" style={{ margin: "14px 0 0", fontSize: 13 }}>
            No start date set, so there's no plan-vs-you comparison. <button type="button" className="linkish" onClick={() => setStartDate(localDay())}>Start the clock today</button>
          </p>
        )}
      </div>
      <a className="btn primary" href={to} style={{ padding: "14px 26px", fontSize: 14 }}>Continue <span className="arrow">→</span></a>
    </div>
  );
}

function Stats() {
  const d = useDerived();
  const focusWeek = d.pace.kind === "tracked" ? d.pace.plan : d.focus.weeks[0].number;
  const status = d.pace.kind !== "tracked" ? "Not started" : d.pace.delta === 0 ? "On track" : d.pace.delta > 0 ? `${d.pace.delta} wk ahead` : `${-d.pace.delta} wk behind`;
  return (
    <div className="stats">
      <div className="stat"><span className="k">Current focus</span><span className="v text">{d.focus.title}</span></div>
      <div className="stat"><span className="k">XP this week</span><span className="v">+{fmtXp(d.xpWeek)}</span></div>
      <div className="stat"><span className="k">Tasks completed</span><span className="v">{d.tasksDone}</span></div>
      <div className="stat"><span className="k">Streak</span><span className="v">{d.streak} <span className="faint" style={{ fontSize: 14 }}>day{d.streak === 1 ? "" : "s"}</span></span></div>
      <div className="stat"><span className="k">Status · wk {pad2(Math.max(1, Math.min(TOTAL_WEEKS, focusWeek)))}</span><span className="v text">{status}</span></div>
    </div>
  );
}

function Pace() {
  const d = useDerived();
  const p = d.pace;
  return (
    <div className="panel pad">
      <div className="section-head" style={{ marginBottom: 18 }}>
        <h2 className="section-title">Position</h2>
        <span className="aside">plan vs. your completed work</span>
      </div>
      {p.kind === "unset" && <p className="muted" style={{ margin: 0 }}>Set a start date above and your position on the roadmap will appear here.</p>}
      {p.kind === "upcoming" && <p className="muted" style={{ margin: 0 }}>Your journey begins in {1 - p.plan === 0 ? "a few days" : `${Math.abs(p.plan - 1)} week(s)`}. You can start early; progress counts either way.</p>}
      {p.kind === "tracked" && (
        <div className="pace">
          <div className="col"><span>PLAN</span><b>Week {pad2(p.plan)}</b></div>
          <div className="col"><span>YOU</span><b>Week {pad2(p.you)}</b></div>
          <div className="col"><span>STATUS</span>
            <b className={p.delta > 0 ? "status-ahead" : p.delta < 0 ? "status-behind" : ""}>
              {p.delta === 0 ? "On track" : p.delta > 0 ? `+${p.delta} week${p.delta > 1 ? "s" : ""} ahead` : `${-p.delta} week${p.delta < -1 ? "s" : ""} behind`}
            </b>
          </div>
          <p className="msg">
            {p.delta < 0
              ? `The roadmap has moved ahead. That's fine: your next step is still "${d.next[0]?.item.title ?? "the next item"}".`
              : p.delta > 0 ? "You're ahead of the plan. Use the time to go deeper on missions and trials." : "Right where the plan expects you."}
          </p>
        </div>
      )}
    </div>
  );
}

function Flow() {
  const { state } = useStore();
  const d = useDerived();
  const doneCount = CHAPTERS.filter(c => chapterPct(state, c) === 100).length;
  const trail = Math.min(100, ((doneCount + chapterPct(state, d.focus) / 100) / CHAPTERS.length) * 100);
  return (
    <>
      <div className="section-head">
        <h2 className="section-title">The road</h2>
        <a className="aside" href={href("roadmap")}>Full roadmap →</a>
      </div>
      <div className="panel pad" style={{ paddingBottom: 26 }}>
        <div className="flow">
          <div className="trail" style={{ width: `${trail * 0.88}%` }} />
          {CHAPTERS.map(ch => {
            const st = chapterStatus(state, ch);
            return (
              <a key={ch.id} className={`node ${st}`} href={chapterHref(ch.id)}>
                <span className="dot" />
                <span className="n">CH {pad2(ch.number)}</span>
                <span className="t">{ch.title}</span>
                <span className="p">{chapterPct(state, ch)}%</span>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}

function Activity() {
  const { state } = useStore();
  const act = activityByDay(state);
  const today = localDay();
  const days: string[] = [];
  const end = new Date(today + "T12:00:00");
  end.setDate(end.getDate() + (6 - end.getDay())); // end on Saturday so columns are weeks
  for (let i = 7 * 18 - 1; i >= 0; i--) {
    const x = new Date(end); x.setDate(end.getDate() - i);
    days.push(localDay(x));
  }
  const level = (xp: number) => (xp <= 0 ? 0 : xp < 40 ? 1 : xp < 120 ? 2 : xp < 250 ? 3 : 4);
  let wk = { xp: 0, concepts: 0, resources: 0, milestones: 0, journal: 0 };
  for (let i = 0; i < 7; i++) {
    const x = new Date(today + "T12:00:00"); x.setDate(x.getDate() - i);
    const a = act.get(localDay(x));
    if (a) wk = { xp: wk.xp + a.xp, concepts: wk.concepts + a.concepts, resources: wk.resources + a.resources, milestones: wk.milestones + a.milestones, journal: wk.journal + (a.journal ? 1 : 0) };
  }
  return (
    <>
      <div className="section-head">
        <h2 className="section-title">Activity</h2>
        <span className="aside">last 18 weeks</span>
      </div>
      <div className="panel pad" style={{ display: "grid", gap: 18 }}>
        <div className="heat" role="img" aria-label="Daily activity over the last 18 weeks">
          {days.map(day => {
            const a = act.get(day);
            return <i key={day} className={`l${level(a?.xp ?? 0)} ${day === today ? "today" : ""} ${a?.journal ? "j" : ""}`} title={`${day}: ${a?.xp ?? 0} XP${a?.journal ? " · journal" : ""}`} />;
          })}
        </div>
        <div className="legend">
          <span>Past 7 days:</span>
          <span><b style={{ color: "var(--accent-hi)", fontWeight: 500 }}>+{wk.xp}</b> XP</span>
          <span>{wk.concepts} concepts</span>
          <span>{wk.resources} resources</span>
          <span>{wk.milestones} milestones</span>
          <span><span className="sw" style={{ background: "var(--steel)" }} />{wk.journal} journal days</span>
        </div>
      </div>
    </>
  );
}

function RecentRecord() {
  const d = useDerived();
  const next = RANKS[d.rank.index + 1];
  return (
    <div className="grid two">
      <a className="panel pad lift" href={href("record")} style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="eyebrow">Record</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {d.achievements.length === 0 && <span className="muted">No achievements yet. The first one comes with your first completed task.</span>}
          {d.achievements.slice(-4).map(a => <span key={a.id} className="tag req" style={{ gap: 6 }}><Sigil size={14} /> {a.name}</span>)}
        </div>
        <span className="faint mono" style={{ fontSize: 12 }}>{d.achievements.length} of 12 achievements</span>
      </a>
      <a className="panel pad lift" href={href("record")} style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="eyebrow">Next rank</div>
        {next ? (
          <>
            <div className="display h-md caps">{next.name}</div>
            <span className="muted" style={{ fontSize: 14 }}>{next.description}</span>
            <Meter value={Math.round(d.rankProgress * 100)} label="Progress to next rank" />
          </>
        ) : <span className="muted">You've reached the highest rank.</span>}
      </a>
    </div>
  );
}

/* ---------------- after the journey ---------------- */
function EndState() {
  const { state, pulse } = useStore();
  const d = useDerived();
  const skills = skillLevels(state);
  return (
    <>
      <section style={{ paddingTop: 64, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4 }}>
          <Nox stage={6} mood="proud" pulse={pulse} size={190} />
        </motion.div>
        <div className="eyebrow accent">The journey</div>
        <h1 className="rank-title hero" style={{ padding: 0, display: "block", fontFamily: "var(--display)", fontSize: "clamp(56px, 9vw, 120px)", letterSpacing: ".06em", textTransform: "uppercase", margin: 0,
          background: "linear-gradient(180deg,#FFF1DC,var(--accent-hi) 55%,var(--accent))", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
          {d.rank.name}
        </h1>
        <div className="mono" style={{ letterSpacing: ".3em", color: "var(--muted)" }}>{weeksComplete(state)} / {TOTAL_WEEKS} WEEKS COMPLETE</div>
        <p className="bubble" style={{ marginTop: 18 }}>{d.line}</p>
      </section>
      <section className="section">
        <div className="panel pad skills">
          {SKILLS.map(s => (
            <div key={s.key} className="skill"><span>{s.label}</span><Meter value={skills[s.key]} size="thick" label={s.label} /><b>{skills[s.key]}%</b></div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="panel pad" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div className="eyebrow accent">Unlocked · Continuing</div>
            <h2 className="section-title" style={{ marginTop: 6 }}>The 24 weeks were the foundation. This keeps you current.</h2>
          </div>
          <a className="btn primary" href={href("continuing")}>Open Continuing <span className="arrow">→</span></a>
        </div>
      </section>
      <section className="section"><Activity /></section>
    </>
  );
}
