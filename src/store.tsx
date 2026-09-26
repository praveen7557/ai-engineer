import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ITEMS, MISSIONS, CHAPTER_BY_ID, chapterForWeek } from "./content";
import {
  ACHIEVEMENTS, isMissionComplete, isTrialPassed, isWeekComplete, itemXp, rankFor, stageFor, bond, xpOf, XP,
} from "./engine/progress";
import { emptyState, isNewer, localDay, type ContinuingEntry, type ProgressState } from "./engine/state";
import * as store from "./engine/storage";
import * as gistApi from "./engine/gist";

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
  status: "off" | "idle" | "syncing" | "error";
  gistId: string | null;
  lastSynced: Date | null;
  error: string | null;
}

interface Ctx {
  state: ProgressState;
  toggle: (id: string, on: boolean, source?: Element | null) => void;
  setStartDate: (d: string | null) => void;
  setJournal: (key: string, text: string) => void;
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
  stretch: "Stretch objective", trial: "Trial criterion met", setup: "Preparation",
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
  const [gist, setGist] = useState<GistStatus>(() => ({
    enabled: !!gistCfg.current, status: gistCfg.current ? "idle" : "off", gistId: gistCfg.current?.gistId ?? null, lastSynced: null, error: null,
  }));
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
  const adoptRemote = useCallback((remote: ProgressState) => {
    stateRef.current = remote;
    setState(remote);
    store.saveLocal(remote);
    if (liveRef.current) scheduleFileWrite();
  }, [scheduleFileWrite]);

  /** Newer save wins: pull the gist; adopt it if it's newer, otherwise push ours. */
  const syncGist = useCallback(async (reason: "load" | "focus" | "change" | "manual") => {
    const cfg = gistCfg.current;
    if (!cfg?.gistId) return;
    setGist(g => ({ ...g, status: "syncing" }));
    try {
      lastPull.current = Date.now();
      const remote = await gistApi.pullGist(cfg);
      if (remote && gistNewer(remote, stateRef.current)) {
        adoptRemote(remote);
        if (reason !== "change") notifyRef.current("Loaded newer progress from your gist.");
      } else if (!remote || gistNewer(stateRef.current, remote)) {
        if (stateRef.current.updatedAt || remote) await gistApi.pushGist(cfg, stateRef.current);
      }
      setGist(g => ({ ...g, status: "idle", lastSynced: new Date(), error: null }));
    } catch (e) {
      setGist(g => ({ ...g, status: "error", error: (e as Error).message }));
    }
  }, [adoptRemote]);

  scheduleGistRef.current = () => {
    if (!gistCfg.current?.gistId) return;
    window.clearTimeout(gistTimer.current);
    gistTimer.current = window.setTimeout(() => { syncGist("change"); }, 2000);
  };

  useEffect(() => {
    if (!gistCfg.current?.gistId) return;
    syncGist("load");
    const onFocus = () => { if (document.visibilityState === "visible" && Date.now() - lastPull.current > 30000) syncGist("focus"); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => { window.removeEventListener("focus", onFocus); document.removeEventListener("visibilitychange", onFocus); };
  }, [syncGist]);

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
    const next: ProgressState = { ...prev, done: { ...prev.done } };
    if (on) next.done[id] = new Date().toISOString(); else delete next.done[id];

    const events: FeedInput[] = [];
    if (on) {
      const meta = ITEMS.get(id);
      const rect = source?.getBoundingClientRect();
      const pos = rect ? { x: rect.left + rect.width / 2, y: rect.top } : {};
      if (meta) {
        let amount = itemXp(meta);
        let label = LABEL[meta.kind];
        if (meta.week && meta.kind === "concept" && !isWeekComplete(prev, meta.week) && isWeekComplete(next, meta.week)) {
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
        if (!a.earned(prev) && a.earned(next) && !prev.seen.achievements.includes(a.id)) {
          events.push({ type: "achievement", name: a.name, description: a.description });
          next.seen = { ...next.seen, achievements: [...next.seen.achievements, a.id] };
        }
      }
      next.seen = { ...next.seen, rank: Math.max(next.seen.rank, r1.index), stage: Math.max(next.seen.stage, s1.index) };
      setPulse(p => p + 1);
    }
    commit(next);
    push(events);
  }, [commit, push]);

  const setStartDate = useCallback((d: string | null) => commit({ ...stateRef.current, startDate: d }), [commit]);

  const setJournal = useCallback((key: string, text: string) => {
    const prev = stateRef.current;
    const today = localDay();
    const journal = { ...prev.journal };
    if (text.trim()) journal[key] = { text, updatedAt: new Date().toISOString() }; else delete journal[key];
    const journalDays = text.trim() && !prev.journalDays.includes(today) ? [...prev.journalDays, today].sort() : prev.journalDays;
    commit({ ...prev, journal, journalDays });
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
    commit(s);
    notify(`Imported ${f.name}`);
  }, [commit, notify]);
  const resetAll = useCallback(() => { commit(emptyState()); notify("Progress reset."); }, [commit, notify]);

  const syncGistNow = useCallback(() => syncGist("manual"), [syncGist]);
  const createPrivateGist = useCallback(async () => {
    const cfg = gistCfg.current;
    if (!cfg) return;
    setGist(g => ({ ...g, status: "syncing" }));
    try {
      const id = await gistApi.createGist(cfg, stateRef.current);
      gistApi.storeGistId(id);
      gistCfg.current = { ...cfg, gistId: id };
      setGist(g => ({ ...g, status: "idle", gistId: id, lastSynced: new Date(), error: null }));
      notify("Private gist created. Add its id to .env.local as VITE_GIST_ID.");
    } catch (e) {
      setGist(g => ({ ...g, status: "error", error: (e as Error).message }));
    }
  }, [notify]);

  const value = useMemo<Ctx>(() => ({
    state, toggle, setStartDate, setJournal, addContinuing, removeContinuing, feed, dismiss, notify, pulse,
    sync, linkFile, reconnectFile, unlinkFile, exportJson, importFile, resetAll, gist, syncGistNow, createPrivateGist,
  }), [state, toggle, setStartDate, setJournal, addContinuing, removeContinuing, feed, dismiss, notify, pulse, sync, linkFile, reconnectFile, unlinkFile, exportJson, importFile, resetAll, gist, syncGistNow, createPrivateGist]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

const gistNewer = (a: ProgressState, b: ProgressState) => isNewer(a, b);

/** Helper for components: where an item lives, for links and search results. */
export function locate(id: string) {
  const m = ITEMS.get(id);
  if (!m) return null;
  const ch = m.chapterId ? CHAPTER_BY_ID.get(m.chapterId) : undefined;
  return { meta: m, chapter: ch ?? (m.week ? chapterForWeek(m.week) : undefined) };
}
