import { useEffect, useRef, useState, type ReactNode } from "react";
import { CHAPTERS, TOTAL_WEEKS } from "../content";
import { chapterPct, chapterStatus } from "../engine/progress";
import { useStore } from "../store";
import { fmtXp, Meter, pad2 } from "./bits";
import { useDerived } from "./derived";
import { Nox } from "./Nox";
import { href, type Route } from "./router";
import { Search } from "./Search";

const I = {
  hq: <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  map: <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14" />,
  journal: <path d="M6 3h11a2 2 0 0 1 2 2v16l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2zM9 8h6M9 12h6" />,
  record: <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" />,
  nox: <path d="M7 10C5 6 5 4 6 3c2 2 3 4 4 5M17 10c2-4 2-6 1-7-2 2-3 4-4 5M5 14a7 7 0 0 0 14 0c0-3.5-3-6-7-6s-7 2.5-7 6zM9.5 13h.01M14.5 13h.01" />,
  cont: <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" />,
  data: <path d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />,
  search: <path d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm9 16-4.3-4.3" />,
};
export const Icon = ({ name, className = "ico" }: { name: keyof typeof I; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{I[name]}</svg>
);

export function Mark({ size = 30 }: { size?: number }) {
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="#E0A458" strokeOpacity=".35" />
      <path d="M16 5 L18.2 13.8 L27 16 L18.2 18.2 L16 27 L13.8 18.2 L5 16 L13.8 13.8 Z" fill="#E0A458" />
      <circle cx="16" cy="16" r="2.2" fill="#FFF1DC" />
    </svg>
  );
}

export function Shell({ route, children }: { route: Route; children: ReactNode }) {
  const { state, pulse } = useStore();
  const d = useDerived();
  const [searching, setSearching] = useState(false);
  const top = route.path[0] ?? "";
  const cur = (p: string) => (top === p ? "page" : undefined);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && tag !== "input" && tag !== "textarea")) {
        e.preventDefault(); setSearching(true);
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);

  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [route.path.join("/")]);

  const weekLabel = d.pace.kind === "tracked" ? `Week ${pad2(d.pace.plan)} / ${TOTAL_WEEKS}` : d.pace.kind === "upcoming" ? "Starts soon" : "Not started";

  return (
    <div className="shell">
      <aside className="rail" aria-label="Main navigation">
        <a className="brand" href={href("")}>
          <Mark />
          <span className="brand-name">The AI Engineer<small>24 week progression</small></span>
        </a>
        <button className="search-btn" onClick={() => setSearching(true)}>
          <Icon name="search" /> Search <kbd>/</kbd>
        </button>
        <nav className="nav">
          <a href={href("")} aria-current={top === "" ? "page" : undefined}><Icon name="hq" /><span>Headquarters</span><span /></a>
          <a href={href("roadmap")} aria-current={cur("roadmap")}><Icon name="map" /><span>Roadmap</span><span /></a>
          <div className="nav-label">Chapters</div>
          {CHAPTERS.map(ch => {
            const st = chapterStatus(state, ch);
            const pc = chapterPct(state, ch);
            const on = top === "chapter" && route.path[1] === ch.id;
            return (
              <a key={ch.id} href={href(`chapter/${ch.id}`)} aria-current={on ? "page" : undefined} className={`${st === "sealed" ? "sealed" : ""} ${st === "active" ? "active-ch" : ""}`}>
                <span className="num">{pad2(ch.number)}</span>
                <span>{ch.title}</span>
                <span className={`pc ${pc === 100 ? "full" : ""}`}>{pc}%</span>
              </a>
            );
          })}
          <div className="nav-label">Journey</div>
          <a href={href("journal")} aria-current={cur("journal")}><Icon name="journal" /><span>Engineer's Journal</span><span /></a>
          <a href={href("companion")} aria-current={cur("companion")}><Icon name="nox" /><span>Nox</span><span className="pc">{d.stage.name}</span></a>
          <a href={href("record")} aria-current={cur("record")}><Icon name="record" /><span>Record</span><span className="pc">{d.achievements.length}</span></a>
          <a href={href("continuing")} aria-current={cur("continuing")} className={d.endState ? "" : "sealed"}><Icon name="cont" /><span>Continuing</span><span /></a>
          <a href={href("data")} aria-current={cur("data")}><Icon name="data" /><span>Progress file</span><span /></a>
        </nav>
        <div className="rail-foot">
          <SyncBadge />
        </div>
      </aside>

      <main className="page" ref={mainRef} id="main">
        <header className="phead" aria-label="Your progression">
          <span className="rankname">{d.rank.name}</span>
          <div className="xpbar"><Meter value={Math.round(d.rankProgress * 100)} size="thin" label="Progress to next rank" /></div>
          <div className="meta">
            <span><b>{fmtXp(d.xp)}</b> XP</span>
            <span className="hide-sm">{weekLabel}</span>
            <span className="hide-sm"><b>{d.overall}%</b></span>
          </div>
          <a href={href("companion")} className="nox-mini" aria-label={`Nox is ${d.mood}`}>
            <Nox stage={d.stage.index} mood={d.mood} pulse={pulse} size={38} />
          </a>
        </header>
        <div className="page-inner">{children}</div>
      </main>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        <a href={href("")} aria-current={top === "" ? "page" : undefined}><Icon name="hq" />Home</a>
        <a href={href("roadmap")} aria-current={cur("roadmap") ?? (top === "chapter" ? "page" : undefined)}><Icon name="map" />Roadmap</a>
        <button onClick={() => setSearching(true)}><Icon name="search" />Search</button>
        <a href={href("journal")} aria-current={cur("journal")}><Icon name="journal" />Journal</a>
        <a href={href("companion")} aria-current={cur("companion") ?? cur("record")}><Icon name="nox" />Nox</a>
      </nav>

      {searching && <Search onClose={() => setSearching(false)} />}
    </div>
  );
}

function SyncBadge() {
  const { sync } = useStore();
  const time = sync.lastSaved?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <a className="sync" href={href("data")} style={{ textDecoration: "none" }}>
      <span className="st">
        <span className={`dot ${sync.mode === "file" ? "file" : sync.mode === "file-paused" ? "paused" : ""}`} />
        {sync.mode === "file" ? `Saving to ${sync.fileName}` : sync.mode === "file-paused" ? `Reconnect ${sync.fileName}` : "Saved in this browser"}
      </span>
      {time && <span className="faint mono" style={{ fontSize: 11 }}>Last saved {time}</span>}
    </a>
  );
}
