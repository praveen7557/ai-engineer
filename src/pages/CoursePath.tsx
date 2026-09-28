import { CHAPTER_BY_ID, COURSE_LINKS, coursePath, coursePathBudget, coursePathHours, RESOURCE_BY_ID } from "../content";
import type { CourseLink } from "../content/coursePath";
import { useStore } from "../store";
import { CheckRow, Meter, pad2 } from "../ui/bits";
import { chapterHref } from "../ui/router";
import { PageHead } from "./Other";

const usd = ([lo, hi]: readonly [number, number]) => (lo === hi ? `$${lo}` : `$${lo}–${hi}`);

function CourseRow({ link, sub }: { link: Pick<CourseLink, "id" | "title" | "url">; sub: string }) {
  return (
    <CheckRow id={link.id} className="res-row" label={link.title} sub={sub}
      title={<a href={link.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>{link.title}</a>} />
  );
}

export function CoursePath() {
  const { state } = useStore();
  const [lo, hi] = coursePathBudget;
  const done = (ids: string[]) => ids.filter(id => state.done[id]).length;
  const finished = done(COURSE_LINKS.map(c => c.id));
  const pct = Math.round((finished / COURSE_LINKS.length) * 100);
  return (
    <>
      <PageHead eyebrow={`${coursePath.phases.length} phases · ~${coursePathHours} hours · researched ${coursePath.researched}`} title="The Course Path" lede={coursePath.intro} />
      <p className="muted" style={{ maxWidth: "70ch", marginTop: 12 }}>{coursePath.principle}</p>

      <section className="section" aria-labelledby="cp-glance">
        <div className="section-head"><h2 className="section-title" id="cp-glance">At a glance</h2></div>
        <div className="panel pad cp-stat">
          <span className="eyebrow accent">Courses and resources</span>
          <b>{finished} / {COURSE_LINKS.length}</b>
          <Meter value={pct} tone={pct === 100 ? "good" : undefined} label="Courses finished" />
          <span className="muted">Tick one when you've finished it. Courses earn XP; they don't change chapter completion or pace.</span>
        </div>
        <div className="grid three">
          <div className="panel pad cp-stat"><span className="eyebrow accent">Total</span><b>~{coursePathHours} h</b><span className="muted">including the builds</span></div>
          <div className="panel pad cp-stat"><span className="eyebrow accent">Spend</span><b>{usd([lo, hi])}</b><span className="muted">of a ${coursePath.budgetCap} yearly budget</span></div>
          <div className="panel pad cp-stat">
            <span className="eyebrow accent">Pace</span>
            <ul className="guide-list compact">
              {coursePath.paces.map(h => <li key={h}><b>{h} h / week</b><span>{Math.ceil(coursePathHours / h)} weeks</span></li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" style={{ gap: 14 }} aria-labelledby="cp-phases">
        <div className="section-head"><h2 className="section-title" id="cp-phases">The path</h2><span className="aside">in order · every phase ends in a build</span></div>
        {coursePath.phases.map(p => (
          <article key={p.number} className="panel pad cp-phase" aria-labelledby={`cp-phase-${p.number}`}>
            <span className="big-n">{pad2(p.number)}</span>
            <div className="cp-body">
              <div className="cp-top">
                <h3 id={`cp-phase-${p.number}`}>{p.title}</h3>
                <span className="cp-meta">
                  <span className="faint mono">~{p.hours} h</span>
                  {p.resources.length > 0 && <span className="faint mono">{done(p.resources.map(r => r.id))}/{p.resources.length} done</span>}
                </span>
              </div>
              <p className="muted" style={{ margin: 0 }}>{p.why}</p>
              {p.resources.length > 0 && (
                <ul className="checks cp-res" aria-label={`${p.title} courses`}>
                  {p.resources.map(r => <CourseRow key={r.id} link={r} sub={`${r.provider} · ${r.cost}`} />)}
                </ul>
              )}
              <p className="cp-build"><span className="eyebrow accent">Build</span>{p.build}</p>
              {p.note && <p className="faint" style={{ margin: 0, fontSize: 13.5 }}>{p.note}</p>}
            </div>
          </article>
        ))}
      </section>

      <section className="section" aria-labelledby="cp-map">
        <div className="section-head"><h2 className="section-title" id="cp-map">How this maps to the chapters</h2><span className="aside">courses → the 24-week roadmap</span></div>
        <p className="muted" style={{ maxWidth: "70ch", margin: 0 }}>{coursePath.chapterMapIntro}</p>
        <div className="panel" style={{ padding: "2px 12px" }}>
          {coursePath.chapterMap.map(m => {
            const ch = CHAPTER_BY_ID.get(m.chapterId)!;
            return (
              <div key={m.chapterId} className="row cp-map-row" style={{ cursor: "default", gridTemplateColumns: "minmax(0,1fr) auto" }}>
                <span>
                  <span className="title"><a href={chapterHref(ch.id)}>{pad2(ch.number)} · {ch.title}</a></span>
                  <span className="sub">{m.courses}</span>
                  {m.gaps && (
                    <span className="sub cp-gap">
                      <span className="eyebrow">Not in any course</span> {m.gaps} Fill it with{" "}
                      {m.gapResourceIds!.map((id, i) => {
                        const r = RESOURCE_BY_ID.get(id)!;
                        return <span key={id}>{i > 0 && ", "}<a href={chapterHref(r.chapterId, { week: r.week, focus: r.id, section: "intel" })}>{r.title}</a></span>;
                      })}.
                    </span>
                  )}
                </span>
                <span className="side"><span className={`tag ${m.coverage === "Full" ? "good" : m.coverage === "Partial" ? "req" : ""}`}>{m.coverage}</span></span>
              </div>
            );
          })}
        </div>
        <p className="muted" style={{ maxWidth: "70ch", margin: 0 }}>{coursePath.pathOnly}</p>
      </section>

      <section className="section" aria-labelledby="cp-budget">
        <div className="section-head"><h2 className="section-title" id="cp-budget">Budget</h2><span className="aside">{usd([lo, hi])} of ${coursePath.budgetCap}</span></div>
        <div className="panel" style={{ padding: "2px 12px" }}>
          {coursePath.budget.map(b => (
            <div key={b.item} className="row" style={{ cursor: "default", gridTemplateColumns: "minmax(0,1fr) auto" }}>
              <span><span className="title">{b.item}</span><span className="sub">{b.note}</span></span>
              <span className="side">{usd(b.usd)}</span>
            </div>
          ))}
        </div>
        <p className="muted" style={{ maxWidth: "70ch", margin: 0 }}>{coursePath.budgetTip}</p>
      </section>

      <section className="section" aria-labelledby="cp-split">
        <div className="section-head"><h2 className="section-title" id="cp-split">Where the time goes</h2></div>
        <div className="panel pad" style={{ display: "grid", gap: 12 }}>
          {coursePath.timeSplit.map(t => (
            <div key={t.area} className="cp-split">
              <span>{t.area}</span>
              <Meter value={t.pct} label={`${t.area}: ${t.pct}% of the path`} />
              <span className="mono faint">{t.pct}%</span>
            </div>
          ))}
          <p className="muted" style={{ margin: "6px 0 0" }}>{coursePath.durable}</p>
        </div>
      </section>

      <section className="section" aria-labelledby="cp-dropped">
        <div className="section-head"><h2 className="section-title" id="cp-dropped">Left out, and why</h2><span className="aside">so you don't re-add them</span></div>
        <div className="panel pad">
          <ul className="guide-list">
            {coursePath.dropped.map(d => <li key={d.title}><b>{d.title}</b><span>{d.why}</span></li>)}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="cp-nice">
        <div className="section-head"><h2 className="section-title" id="cp-nice">Nice to know</h2><span className="aside">optional · not in the hours or budget</span></div>
        <ul className="checks panel" style={{ padding: "2px 12px" }} aria-label="Nice to know">
          {coursePath.niceToKnow.map(a => <CourseRow key={a.id} link={a} sub={`${a.provider} · ${a.cost} · ${a.note}`} />)}
        </ul>
      </section>
    </>
  );
}
