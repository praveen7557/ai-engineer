import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useStore, type FeedEvent } from "../store";
import { useDerived } from "./derived";
import { Nox } from "./Nox";

/** Renders progress feedback: floating XP pops, toasts for achievements/companion, and the rank-up moment. */
export function Feed() {
  const { feed, dismiss } = useStore();
  const pops = feed.filter((e): e is Extract<FeedEvent, { type: "xp" }> => e.type === "xp");
  const rank = feed.find((e): e is Extract<FeedEvent, { type: "rank" }> => e.type === "rank");
  const toasts = feed.filter(e => e.type === "achievement" || e.type === "stage" || e.type === "note" || (e.type === "xp" && e.x === undefined));

  return (
    <>
      {pops.filter(p => p.x !== undefined).map(p => <Pop key={p.id} e={p} onDone={() => dismiss(p.id)} />)}
      <div className="toasts" aria-live="polite">
        <AnimatePresence>
          {toasts.map(t => <Toast key={t.id} e={t} onDone={() => dismiss(t.id)} />)}
        </AnimatePresence>
      </div>
      <AnimatePresence>{rank && <Ascend key={rank.id} e={rank} onDone={() => dismiss(rank.id)} />}</AnimatePresence>
    </>
  );
}

function Pop({ e, onDone }: { e: Extract<FeedEvent, { type: "xp" }>; onDone: () => void }) {
  useEffect(() => { const t = window.setTimeout(onDone, 1700); return () => window.clearTimeout(t); }, [onDone]);
  return (
    <div className="pop" style={{ left: e.x, top: e.y }} aria-hidden="true">
      <b>+{e.amount} XP</b>
      <span>{e.label}</span>
    </div>
  );
}

function Toast({ e, onDone }: { e: FeedEvent; onDone: () => void }) {
  const d = useDerived();
  useEffect(() => { const t = window.setTimeout(onDone, e.type === "note" ? 2600 : 5200); return () => window.clearTimeout(t); }, [onDone, e.type]);
  return (
    <motion.div
      className={`toast panel ${e.type === "note" ? "note" : ""}`}
      initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
      onClick={onDone}
    >
      {e.type === "achievement" && (
        <>
          <Sigil />
          <div><div className="t1">Achievement</div><div className="t2">{e.name}</div><div className="t3">{e.description}</div></div>
        </>
      )}
      {e.type === "stage" && (
        <>
          <Nox stage={d.stage.index} mood="proud" size={52} />
          <div><div className="t1">Nox has grown · {e.name}</div><div className="t3">{e.unlock}</div></div>
        </>
      )}
      {e.type === "note" && <span>{e.text}</span>}
      {e.type === "xp" && <div><div className="t1">{e.label}</div><div className="t2">+{e.amount} XP</div></div>}
    </motion.div>
  );
}

function Ascend({ e, onDone }: { e: Extract<FeedEvent, { type: "rank" }>; onDone: () => void }) {
  const d = useDerived();
  useEffect(() => { const t = window.setTimeout(onDone, 5200); return () => window.clearTimeout(t); }, [onDone]);
  return (
    <motion.div className="ascend" role="dialog" aria-label={`New rank: ${e.name}`} onClick={onDone}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <div className="inner">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
          <Nox stage={d.stage.index} mood="proud" size={96} pulse={1} />
        </motion.div>
        <motion.div className="k" initial={{ opacity: 0, letterSpacing: "1.2em" }} animate={{ opacity: 1, letterSpacing: "0.5em" }} transition={{ delay: 0.3, duration: 1.2 }}>NEW RANK</motion.div>
        <motion.div className="name" initial={{ opacity: 0, filter: "blur(12px)", scale: 1.04 }} animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }} transition={{ delay: 0.5, duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}>
          {e.name}
        </motion.div>
        <motion.p className="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}>{e.description}</motion.p>
        <motion.p className="d" style={{ fontFamily: "var(--display)", fontStyle: "italic", marginTop: 18 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 1 }}>
          “You've changed.”
        </motion.p>
        <div className="line" />
      </div>
    </motion.div>
  );
}

export function Sigil({ earned = true, size = 40 }: { earned?: boolean; size?: number }) {
  const c = earned ? "#E0A458" : "#6E6961";
  return (
    <svg className="sigil" width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
      <circle cx="22" cy="22" r="20" fill="none" stroke={c} strokeOpacity=".4" />
      <circle cx="22" cy="22" r="14" fill="none" stroke={c} strokeOpacity=".7" strokeDasharray="2 3" />
      <path d="M22 9 L25 19 L35 22 L25 25 L22 35 L19 25 L9 22 L19 19 Z" fill={c} opacity={earned ? 0.95 : 0.5} />
    </svg>
  );
}
