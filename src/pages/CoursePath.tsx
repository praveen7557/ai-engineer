import { coursePath, coursePathBudget, coursePathHours } from "../content";
import { Meter, pad2 } from "../ui/bits";
import { PageHead } from "./Other";

const usd = ([lo, hi]: readonly [number, number]) => (lo === hi ? `$${lo}` : `$${lo}–${hi}`);

export function CoursePath() {
  const [lo, hi] = coursePathBudget;
  return (
    <>
      <PageHead eyebrow={`${coursePath.phases.length} phases · ~${coursePathHours} hours · researched ${coursePath.researched}`} title="The Course Path" lede={coursePath.intro} />
      <p className="muted" style={{ maxWidth: "70ch", marginTop: 12 }}>{coursePath.principle}</p>

      <section className="section" aria-labelledby="cp-glance">
        <div className="section-head"><h2 className="section-title" id="cp-glance">At a glance</h2></div>
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
                <span className="cp-meta"><span className={`tag ${p.tier === "must" ? "req" : ""}`}>{p.tier === "must" ? "Must learn" : "Nice to know"}</span><span className="faint mono">~{p.hours} h</span></span>
              </div>
              <p className="muted" style={{ margin: 0 }}>{p.why}</p>
              {p.resources.length > 0 && (
                <div className="cp-res">
                  {p.resources.map(r => (
                    <div key={r.url} className="row res-row" style={{ cursor: "default", gridTemplateColumns: "minmax(0,1fr) auto" }}>
                      <span><span className="title"><a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a></span><span className="sub">{r.provider}</span></span>
                      <span className="side"><span className={`tag ${r.cost === "Free" ? "good" : ""}`}>{r.cost}</span></span>
                    </div>
                  ))}
                </div>
              )}
              <p className="cp-build"><span className="eyebrow accent">Build</span>{p.build}</p>
              {p.note && <p className="faint" style={{ margin: 0, fontSize: 13.5 }}>{p.note}</p>}
            </div>
          </article>
        ))}
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

      <section className="section" aria-labelledby="cp-after">
        <div className="section-head"><h2 className="section-title" id="cp-after">After the path</h2><span className="aside">nice to know</span></div>
        <div className="panel" style={{ padding: "2px 12px" }}>
          {coursePath.afterwards.map(a => (
            <div key={a.url} className="row res-row" style={{ cursor: "default", gridTemplateColumns: "minmax(0,1fr)" }}>
              <span><span className="title"><a href={a.url} target="_blank" rel="noopener noreferrer">{a.title}</a></span><span className="sub">{a.note}</span></span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
