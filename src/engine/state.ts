/** Persisted progress. This is exactly what progress.json contains. */
export interface JournalEntry {
  text: string;
  updatedAt: string;
}

export type ContinuingCategory = "Release" | "Model" | "Framework" | "Paper" | "Technique" | "Project" | "Experiment";

export interface ContinuingEntry {
  id: string;
  date: string; // YYYY-MM-DD
  category: ContinuingCategory;
  title: string;
  url?: string;
  note: string;
}

export interface ProgressState {
  app: "the-ai-engineer";
  version: 2;
  updatedAt: string | null;
  startDate: string | null; // YYYY-MM-DD
  /** Item id -> ISO timestamp when it was completed. */
  done: Record<string, string>;
  /** Journal keys: "w12" for weekly journals, a mission id (e.g. "ch4.m2") for mission reflections. */
  journal: Record<string, JournalEntry>;
  /** Days (YYYY-MM-DD) on which the journal was written in. */
  journalDays: string[];
  continuing: ContinuingEntry[];
  /** What the learner has already been shown, so unlock moments play once. */
  seen: { rank: number; stage: number; achievements: string[] };
}

export const emptyState = (): ProgressState => ({
  app: "the-ai-engineer",
  version: 2,
  updatedAt: null,
  startDate: null,
  done: {},
  journal: {},
  journalDays: [],
  continuing: [],
  seen: { rank: 0, stage: 0, achievements: [] },
});

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const isDate = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);

/** Accepts anything and returns a valid state, or null if it isn't a progress file for this app. */
export function normalize(raw: unknown): ProgressState | null {
  if (!isObj(raw)) return null;
  if (raw.app !== undefined && raw.app !== "the-ai-engineer") return null;
  const s = emptyState();
  if (typeof raw.updatedAt === "string") s.updatedAt = raw.updatedAt;
  if (isDate(raw.startDate)) s.startDate = raw.startDate;
  if (isObj(raw.done)) {
    for (const [k, v] of Object.entries(raw.done)) {
      if (typeof v === "string" && v) s.done[k] = v;
      else if (v === true) s.done[k] = new Date().toISOString();
    }
  }
  if (isObj(raw.journal)) {
    for (const [k, v] of Object.entries(raw.journal)) {
      if (isObj(v) && typeof v.text === "string") s.journal[k] = { text: v.text, updatedAt: typeof v.updatedAt === "string" ? v.updatedAt : new Date().toISOString() };
    }
  }
  if (Array.isArray(raw.journalDays)) s.journalDays = [...new Set(raw.journalDays.filter(isDate))].sort();
  if (Array.isArray(raw.continuing)) {
    s.continuing = raw.continuing.filter(isObj).filter(e => typeof e.title === "string" && isDate(e.date)).map(e => ({
      id: typeof e.id === "string" ? e.id : crypto.randomUUID(),
      date: e.date as string,
      category: (typeof e.category === "string" ? e.category : "Experiment") as ContinuingCategory,
      title: e.title as string,
      url: typeof e.url === "string" && e.url ? e.url : undefined,
      note: typeof e.note === "string" ? e.note : "",
    }));
  }
  if (isObj(raw.seen)) {
    s.seen.rank = typeof raw.seen.rank === "number" ? raw.seen.rank : 0;
    s.seen.stage = typeof raw.seen.stage === "number" ? raw.seen.stage : 0;
    s.seen.achievements = Array.isArray(raw.seen.achievements) ? raw.seen.achievements.filter((a): a is string => typeof a === "string") : [];
  }
  return s;
}

export const isNewer = (a: ProgressState | null, b: ProgressState | null) => (a?.updatedAt ?? "") > (b?.updatedAt ?? "");
export const serialize = (s: ProgressState) => JSON.stringify(s, null, 2) + "\n";

export const localDay = (d: Date = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};
export const dayOf = (iso: string) => localDay(new Date(iso));
