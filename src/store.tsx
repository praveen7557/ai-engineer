import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ITEMS, MISSIONS, CHAPTER_BY_ID, chapterForWeek } from "./content";
import {
  ACHIEVEMENTS, isMissionComplete, isTrialPassed, isWeekComplete, itemXp, rankFor, stageFor, bond, xpOf, XP,
} from "./engine/progress";
import { emptyState, isNewer, localDay, type ContinuingEntry, type JournalLinks, type ProgressState } from "./engine/state";
import * as store from "./engine/storage";
import * as gistApi from "./engine/gist";
import { decideSync } from "./engine/sync";

/* ---------------- feedback events (pops, unlocks) ---------------- */
export type FeedEvent =
  | { id: number; type: "xp"; amount: number; label: string; x?: number; y?: number }
  | { id: number; type: "rank"; name: string; description: string }
  | { id: number; type: "stage"; name: string; unlock: string }
  | { id: number; type: "achievement"; name: string; description: string }
  | { id: number; type: "note"; text: string };

type FeedInput = FeedEvent extends infer E ? (E extends FeedEvent ? Omit<E, "id"> : never) : never;

export type SyncMode = "local" | "file" | "file-paused";

export interface GistStatus {
  /** A token is configured. */
  enabled: boolean;
  /** Sync turned off in this browser (local progress is untouched). */
  paused: boolean;
  status: "off" | "idle" | "syncing" | "error" | "conflict";
  gistId: string | null;
  lastSynced: Date | null;
  error: string | null;
  /** Both sides changed since the last sync: nothing is overwritten until the learner chooses. */
  conflict: { local: ProgressState; remote: ProgressState; reason: "first-sync" | "both-changed" } | null;
}

interface Ctx {
  state: ProgressState;
  toggle: (id: string, on: boolean, source?: Element | null) => void;
  /** Resolve a conditional milestone as not applicable (reason required), or clear it with null. */
  setNotApplicable: (id: string, reason: string | null) => void;
  setStartDate: (d: string | null) => void;
  setJournal: (key: string, text: string) => void;
  setJournalLinks: (key: string, links: JournalLinks) => void;
  addContinuing: (e: Omit<ContinuingEntry, "id">) => void;
  removeContinuing: (id: string) => void;
  feed: FeedEvent[];
  dismiss: (id: number) => void;
  notify: (text: string) => void;
  /** Increments whenever the learner makes progress; the companion reacts to it. */
  pulse: number;
  sync: { mode: SyncMode; fileName: string | null; lastSaved: Date | null; fsSupported: boolean };
  linkFile: (mode: "open" | "new") => Promise<void>;
  reconnectFile: () => Promise<void>;
  unlinkFile: () => Promise<void>;
  exportJson: () => void;
  importFile: (f: File) => Promise<void>;
  resetAll: () => void;
  gist: GistStatus;
  syncGistNow: () => Promise<void>;
  createPrivateGist: () => Promise<void>;
  resolveGistConflict: (keep: "local" | "remote") => Promise<void>;
  setGistPaused: (paused: boolean) => void;
  snapshots: store.Snapshot[];
  restoreSnapshot: (id: string) => void;
}

const StoreContext = createContext<Ctx | null>(null);
export const useStore = () => {
  const c = useContext(StoreContext);
  if (!c) throw new Error("useStore outside provider");
  return c;
};

let feedSeq = 1;

const LABEL: Record<string, string> = {
  concept: "Concept mastered", resource: "Intel gathered", milestone: "Objective complete",
  stretch: "Stretch objective", trial: "Trial criterion met", setup: "Preparation", course: "Course finished",
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => store.loadLocal() ?? emptyState());
  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const [pulse, setPulse] = useState(0);
  const [sync, setSync] = useState<Ctx["sync"]>({ mode: "local", fileName: null, lastSaved: null, fsSupported: store.fsSupported() });
  const handleRef = useRef<store.FileHandle | null>(null);
  const liveRef = useRef(false);
  const writeTimer = useRef<number | undefined>(undefined);
  const stateRef = useRef(state);
  stateRef.current = state;
  const gistCfg = useRef(gistApi.readGistConfig(import.meta.env, gistApi.loadStoredGistId()));
  const [gist, setGist] = useState<GistStatus>(() => {
    const paused = store.isGistPaused();
    return {
      enabled: !!gistCfg.current, paused, status: gistCfg.current && !paused ? "idle" : "off",
      gistId: gistCfg.current?.gistId ?? null, lastSynced: null, error: null, conflict: null,
    };
  });
  const gistRef = useRef(gist);
  gistRef.current = gist;
  const [snapshots, setSnapshots] = useState<store.Snapshot[]>(() => store.listSnapshots());
  /** Keep a recoverable copy of local progress before anything replaces it. */
  const snapshot = useCallback((reason: string) => {
    if (store.saveSnapshot(stateRef.current, reason)) setSnapshots(store.listSnapshots());
  }, []);
  const gistTimer = useRef<number | undefined>(undefined);
  const lastPull = useRef(0);

  const push = useCallback((events: FeedInput[]) => {
    if (!events.length) return;
    setFeed(f => [...f, ...events.map(e => ({ ...e, id: feedSeq++ }) as FeedEvent)].slice(-8));
  }, []);
  const dismiss = useCallback((id: number) => setFeed(f => f.filter(e => e.id !== id)), []);
  const notify = useCallback((text: string) => push([{ type: "note", text }]), [push]);
  const notifyRef = useRef(notify);
  notifyRef.current = notify;

  /* ---------- persistence ---------- */
  const scheduleFileWrite = useCallback(() => {
    if (!liveRef.current || !handleRef.current) return;
    window.clearTimeout(writeTimer.current);
    writeTimer.current = window.setTimeout(async () => {
      try {
        await store.writeHandle(handleRef.current!, stateRef.current);
        setSync(s => ({ ...s, lastSaved: new Date() }));
      } catch {
        liveRef.current = false;
        setSync(s => ({ ...s, mode: "file-paused" }));
      }
    }, 400);
  }, []);

  const commit = useCallback((next: ProgressState) => {
    next.updatedAt = new Date().toISOString();
    stateRef.current = next;
    setState(next);
    store.saveLocal(next);
    if (liveRef.current) scheduleFileWrite();
    else setSync(s => ({ ...s, lastSaved: new Date() }));
    scheduleGistRef.current();
  }, [scheduleFileWrite]);

  /* ---------- gist sync ---------- */
  const scheduleGistRef = useRef<() => void>(() => {});
  const replaceLocal = useCallback((next: ProgressState) => {
    stateRef.current = next;
    setState(next);
    store.saveLocal(next);
    if (liveRef.current) scheduleFileWrite();
  }, [scheduleFileWrite]);

  const gistActive = () => !!gistCfg.current?.gistId && !gistRef.current.paused;

  /**
   * Safe sync: fast-forward whichever side changed since the last agreed version; if both changed
   * (or this is the first sync and both have data), stop and ask. Local progress is snapshotted before
   * it is ever replaced.
   */
  const syncGist = useCallback(async (reason: "load" | "focus" | "change" | "manual") => {
    const cfg = gistCfg.current;
    if (!cfg?.gistId || gistRef.current.paused || gistRef.current.conflict) return;
    setGist(g => ({ ...g, status: "syncing" }));
    try {
      lastPull.current = Date.now();
      const remote = await gistApi.pullGist(cfg);
      const lastSynced = store.loadLastSynced(cfg.gistId);
      const d = decideSync(stateRef.current, remote, lastSynced);
      if (d.kind === "conflict" && remote) {
        setGist(g => ({ ...g, status: "conflict", conflict: { local: stateRef.current, remote, reason: d.reason } }));
        return;
      }
      if (d.kind === "pull" && remote) {
        snapshot("Before loading your gist's newer version");
        replaceLocal(remote);
        store.saveLastSynced(cfg.gistId, remote.updatedAt);
        if (reason !== "change") notifyRef.current("Loaded newer progress from your gist. The previous version is saved under Snapshots.");
      } else if (d.kind === "push") {
        await gistApi.pushGist(cfg, stateRef.current);
        store.saveLastSynced(cfg.gistId, stateRef.current.updatedAt);
      } else if (d.kind === "noop") {
        store.saveLastSynced(cfg.gistId, d.agreedAt);
      }
      setGist(g => ({ ...g, status: "idle", lastSynced: new Date(), error: null }));
    } catch (e) {
      setGist(g => ({ ...g, status: "error", error: (e as Error).message }));
    }
  }, [replaceLocal, snapshot]);

  scheduleGistRef.current = () => {
    if (!gistActive()) return;
    window.clearTimeout(gistTimer.current);
    gistTimer.current = window.setTimeout(() => { syncGist("change"); }, 2000);
  };

  useEffect(() => {
    if (!gistCfg.current?.gistId || gist.paused) return;
    syncGist("load");
    const onFocus = () => { if (document.visibilityState === "visible" && Date.now() - lastPull.current > 30000) syncGist("focus"); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => { window.removeEventListener("focus", onFocus); document.removeEventListener("visibilitychange", onFocus); };
  }, [syncGist, gist.paused]);

  // Don't let a pending save or sync fire after the provider unmounts.
  useEffect(() => () => { window.clearTimeout(gistTimer.current); window.clearTimeout(writeTimer.current); }, []);

  const resolveGistConflict = useCallback(async (keep: "local" | "remote") => {
    const cfg = gistCfg.current;
    const c = gistRef.current.conflict;
    if (!cfg?.gistId || !c) return;
    setGist(g => ({ ...g, status: "syncing" }));
    try {
      if (keep === "remote") {
        snapshot("Before choosing your gist's version");
        replaceLocal(c.remote);
        store.saveLastSynced(cfg.gistId, c.remote.updatedAt);
      } else {
        // The gist's version is kept as a snapshot too, so choosing this device is also recoverable.
        if (store.saveSnapshot(c.remote, "Gist version replaced by this device's")) setSnapshots(store.listSnapshots());
        const mine = { ...stateRef.current, updatedAt: new Date().toISOString() };
        replaceLocal(mine);
        await gistApi.pushGist(cfg, mine);
        store.saveLastSynced(cfg.gistId, mine.updatedAt);
      }
      setGist(g => ({ ...g, status: "idle", conflict: null, lastSynced: new Date(), error: null }));
      notifyRef.current(keep === "remote" ? "Using your gist's version. This device's version is saved under Snapshots." : "Kept this device's version and updated your gist. The gist's version is saved under Snapshots.");
    } catch (e) {
      setGist(g => ({ ...g, status: "error", error: (e as Error).message }));
    }
  }, [replaceLocal, snapshot]);

  const setGistPausedCb = useCallback((paused: boolean) => {
    store.setGistPaused(paused);
    window.clearTimeout(gistTimer.current);
    setGist(g => ({ ...g, paused, conflict: paused ? null : g.conflict, status: paused ? "off" : "idle", error: null }));
    notifyRef.current(paused ? "Gist sync is off in this browser. Your progress here is unchanged." : "Gist sync is back on.");
  }, []);

  const adopt = useCallback(async (h: store.FileHandle, prompt: boolean, preferFile: boolean) => {
    let perm = await h.queryPermission({ mode: "readwrite" });
    if (perm !== "granted" && prompt) perm = await h.requestPermission({ mode: "readwrite" });
    handleRef.current = h;
    liveRef.current = perm === "granted";
    setSync(s => ({ ...s, fileName: h.name, mode: liveRef.current ? "file" : "file-paused" }));
    if (!liveRef.current) return;
    let fromFile: ProgressState | null = null;
    try { fromFile = await store.readHandle(h); } catch { /* invalid or empty: overwrite */ }
    if (fromFile && (preferFile || isNewer(fromFile, stateRef.current))) {
      if (store.saveSnapshot(stateRef.current, `Before loading ${h.name}`)) setSnapshots(store.listSnapshots());
      stateRef.current = fromFile;
      setState(fromFile);
      store.saveLocal(fromFile);
    } else {
      await store.writeHandle(h, stateRef.current);
    }
    await store.rememberHandle(h);
    setSync(s => ({ ...s, lastSaved: new Date() }));
  }, []);

  useEffect(() => {
    if (!store.fsSupported()) return;
    store.recallHandle().then(h => { if (h) adopt(h, false, false).catch(() => {}); });
  }, [adopt]);

  /* ---------- actions ---------- */
  const toggle = useCallback((id: string, on: boolean, source?: Element | null) => {
    const prev = stateRef.current;
    const next: ProgressState = { ...prev, done: { ...prev.done }, na: { ...prev.na } };
    if (on) { next.done[id] = new Date().toISOString(); delete next.na[id]; } else delete next.done[id];
    const events = progressEvents(prev, next, id, on, source);
    if (events.some(e => e.type === "achievement")) {
      next.seen = { ...next.seen, achievements: [...new Set([...next.seen.achievements, ...ACHIEVEMENTS.filter(a => !a.earned(prev) && a.earned(next)).map(a => a.id)])] };
    }
    if (on) setPulse(p => p + 1);
    commit(next);
    push(events);
  }, [commit, push]);

  const setNotApplicable = useCallback((id: string, reason: string | null) => {
    const prev = stateRef.current;
    const next: ProgressState = { ...prev, done: { ...prev.done }, na: { ...prev.na } };
    const on = !!reason?.trim();
    if (on) { next.na[id] = { reason: reason!.trim(), at: new Date().toISOString() }; delete next.done[id]; } else delete next.na[id];
    const events = progressEvents(prev, next, id, on, null, "Marked not applicable");
    if (on) setPulse(p => p + 1);
    commit(next);
    push(events);
  }, [commit, push]);

  const setStartDate = useCallback((d: string | null) => commit({ ...stateRef.current, startDate: d }), [commit]);

  const setJournal = useCallback((key: string, text: string) => {
    const prev = stateRef.current;
    const today = localDay();
    const journal = { ...prev.journal };
    const links = prev.journal[key]?.links;
    if (text.trim() || links) journal[key] = { text, updatedAt: new Date().toISOString(), ...(links ? { links } : {}) }; else delete journal[key];
    const journalDays = text.trim() && !prev.journalDays.includes(today) ? [...prev.journalDays, today].sort() : prev.journalDays;
    commit({ ...prev, journal, journalDays });
  }, [commit]);

  const setJournalLinks = useCallback((key: string, links: JournalLinks) => {
    const prev = stateRef.current;
    const cur = prev.journal[key];
    const clean: JournalLinks = { repo: links.repo?.trim() || undefined, demo: links.demo?.trim() || undefined, report: links.report?.trim() || undefined };
    const has = !!(clean.repo || clean.demo || clean.report);
    const journal = { ...prev.journal };
    if (cur || has) journal[key] = { text: cur?.text ?? "", updatedAt: new Date().toISOString(), ...(has ? { links: clean } : {}) };
    commit({ ...prev, journal });
  }, [commit]);

  const addContinuing = useCallback((e: Omit<ContinuingEntry, "id">) => {
    const prev = stateRef.current;
    commit({ ...prev, continuing: [{ ...e, id: crypto.randomUUID() }, ...prev.continuing] });
    setPulse(p => p + 1);
  }, [commit]);
  const removeContinuing = useCallback((id: string) => {
    const prev = stateRef.current;
    commit({ ...prev, continuing: prev.continuing.filter(e => e.id !== id) });
  }, [commit]);

  const linkFile = useCallback(async (mode: "open" | "new") => {
    try {
      const h = mode === "open" ? await store.pickExistingFile() : await store.pickNewFile();
      if (!h) return;
      await adopt(h, true, mode === "open");
      if (liveRef.current) notify(`Linked ${h.name}. Progress now saves to it automatically.`);
    } catch (e) {
      if ((e as DOMException)?.name !== "AbortError") notify("Couldn't link that file.");
    }
  }, [adopt, notify]);
  const reconnectFile = useCallback(async () => {
    if (handleRef.current) await adopt(handleRef.current, true, false);
  }, [adopt]);
  const unlinkFile = useCallback(async () => {
    handleRef.current = null; liveRef.current = false;
    await store.forgetHandle();
    setSync(s => ({ ...s, mode: "local", fileName: null }));
    notify("Unlinked. Progress is still kept in this browser.");
  }, [notify]);

  const exportJson = useCallback(() => { store.downloadJson(stateRef.current); notify("Exported progress.json"); }, [notify]);
  const importFile = useCallback(async (f: File) => {
    const s = await store.readUpload(f);
    if (!s) { notify("That file isn't a progress file for The AI Engineer."); return; }
    snapshot(`Before importing ${f.name}`);
    commit(s);
    notify(`Imported ${f.name}`);
  }, [commit, notify, snapshot]);
  const resetAll = useCallback(() => { snapshot("Before reset"); commit(emptyState()); notify("Progress reset. The previous version is saved under Snapshots."); }, [commit, notify, snapshot]);
  const restoreSnapshot = useCallback((id: string) => {
    const snap = store.listSnapshots().find(x => x.id === id);
    if (!snap) return;
    snapshot("Before restoring a snapshot");
    commit({ ...snap.state });
    notify(`Restored the snapshot from ${new Date(snap.at).toLocaleString()}.`);
  }, [commit, notify, snapshot]);

  const syncGistNow = useCallback(() => syncGist("manual"), [syncGist]);
  const createPrivateGist = useCallback(async () => {
    const cfg = gistCfg.current;
    if (!cfg) return;
    setGist(g => ({ ...g, status: "syncing" }));
    try {
      const id = await gistApi.createGist(cfg, stateRef.current);
      gistApi.storeGistId(id);
      gistCfg.current = { ...cfg, gistId: id };
      store.saveLastSynced(id, stateRef.current.updatedAt);
      setGist(g => ({ ...g, status: "idle", gistId: id, lastSynced: new Date(), error: null }));
      notify("Private gist created. Add its id to .env.local as VITE_GIST_ID.");
    } catch (e) {
      setGist(g => ({ ...g, status: "error", error: (e as Error).message }));
    }
  }, [notify]);

  const value = useMemo<Ctx>(() => ({
    state, toggle, setNotApplicable, setStartDate, setJournal, setJournalLinks, addContinuing, removeContinuing, feed, dismiss, notify, pulse,
    sync, linkFile, reconnectFile, unlinkFile, exportJson, importFile, resetAll, gist, syncGistNow, createPrivateGist,
    resolveGistConflict, setGistPaused: setGistPausedCb, snapshots, restoreSnapshot,
  }), [state, toggle, setNotApplicable, setStartDate, setJournal, setJournalLinks, addContinuing, removeContinuing, feed, dismiss, notify, pulse, sync, linkFile, reconnectFile, unlinkFile, exportJson, importFile, resetAll, gist, syncGistNow, createPrivateGist, resolveGistConflict, setGistPausedCb, snapshots, restoreSnapshot]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/** Feedback for a change: XP pop (with week/mission/trial bonuses), rank-up, companion stage, new achievements. */
function progressEvents(prev: ProgressState, next: ProgressState, id: string, on: boolean, source: Element | null | undefined, labelOverride?: string): FeedInput[] {
  const events: FeedInput[] = [];
  if (!on) return events;
  const meta = ITEMS.get(id);
  const rect = source?.getBoundingClientRect();
  const pos = rect ? { x: rect.left + rect.width / 2, y: rect.top } : {};
  if (meta) {
    let amount = itemXp(meta);
    let label = labelOverride ?? LABEL[meta.kind];
    if (meta.week && !isWeekComplete(prev, meta.week) && isWeekComplete(next, meta.week)) {
      amount += XP.weekComplete; label = `Week ${String(meta.week).padStart(2, "0")} complete`;
    }
    if (meta.missionId && !isMissionComplete(prev, meta.missionId) && isMissionComplete(next, meta.missionId)) {
      const m = MISSIONS.get(meta.missionId)!;
      amount += m.major ? XP.missionMajor : XP.missionMinor; label = "Mission complete";
    }
    const ch = meta.chapterId ? CHAPTER_BY_ID.get(meta.chapterId) : undefined;
    if (ch && meta.kind === "trial" && !isTrialPassed(prev, ch) && isTrialPassed(next, ch)) {
      amount += XP.trialPassed; label = `Chapter ${String(ch.number).padStart(2, "0")} trial passed`;
    }
    events.push({ type: "xp", amount, label, ...pos });
  }
  const r0 = rankFor(xpOf(prev).total).rank, r1 = rankFor(xpOf(next).total).rank;
  if (r1.index > r0.index) events.push({ type: "rank", name: r1.name, description: r1.description });
  const s0 = stageFor(bond(prev)).stage, s1 = stageFor(bond(next)).stage;
  if (s1.index > s0.index) events.push({ type: "stage", name: s1.name, unlock: s1.unlock });
  for (const a of ACHIEVEMENTS) {
    if (!a.earned(prev) && a.earned(next) && !prev.seen.achievements.includes(a.id)) events.push({ type: "achievement", name: a.name, description: a.description });
  }
  next.seen = { ...next.seen, rank: Math.max(next.seen.rank, r1.index), stage: Math.max(next.seen.stage, s1.index) };
  return events;
}

/** Helper for components: where an item lives, for links and search results. */
export function locate(id: string) {
  const m = ITEMS.get(id);
  if (!m) return null;
  const ch = m.chapterId ? CHAPTER_BY_ID.get(m.chapterId) : undefined;
  return { meta: m, chapter: ch ?? (m.week ? chapterForWeek(m.week) : undefined) };
}
