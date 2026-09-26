import { ID_MIGRATIONS } from "../content/migrations";

/** Persisted progress. This is exactly what progress.json contains. */
export interface JournalLinks {
  repo?: string;
  demo?: string;
  report?: string;
}

export interface JournalEntry {
  text: string;
  updatedAt: string;
  /** Optional evidence links (weekly journals). */
  links?: JournalLinks;
}

/** A conditional milestone the learner judged not applicable, with their reason. */
export interface NotApplicable {
  reason: string;
  at: string; // ISO timestamp
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

export const STATE_VERSION = 3;

export interface ProgressState {
  app: "the-ai-engineer";
  /** 2 → 3 added `na` and journal `links`, and applies ID_MIGRATIONS (see normalize). */
  version: 3;
  updatedAt: string | null;
  startDate: string | null; // YYYY-MM-DD
  /** Item id -> ISO timestamp when it was completed. */
  done: Record<string, string>;
  /** Conditional milestone id -> why it doesn't apply. Counts as resolved. */
  na: Record<string, NotApplicable>;
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
  version: STATE_VERSION,
  updatedAt: null,
  startDate: null,
  done: {},
  na: {},
  journal: {},
  journalDays: [],
  continuing: [],
  seen: { rank: 0, stage: 0, achievements: [] },
});

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const isDate = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

/**
 * Carries completion from split/replaced ids to their successors. Never removes the old id, so a
 * file read by an older build keeps working. Idempotent.
 */
export function applyIdMigrations(s: ProgressState, migrations: Record<string, string[]> = ID_MIGRATIONS): ProgressState {
  for (const [from, to] of Object.entries(migrations)) {
    const at = s.done[from];
    if (at) for (const id of to) if (!s.done[id]) s.done[id] = at;
    const na = s.na[from];
    if (na) for (const id of to) if (!s.na[id] && !s.done[id]) s.na[id] = na;
  }
  return s;
}

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
  if (isObj(raw.na)) {
    for (const [k, v] of Object.entries(raw.na)) {
      if (isObj(v) && str(v.reason) && !s.done[k]) s.na[k] = { reason: str(v.reason)!, at: typeof v.at === "string" ? v.at : new Date().toISOString() };
    }
  }
  if (isObj(raw.journal)) {
    for (const [k, v] of Object.entries(raw.journal)) {
      if (!isObj(v) || typeof v.text !== "string") continue;
      const entry: JournalEntry = { text: v.text, updatedAt: typeof v.updatedAt === "string" ? v.updatedAt : new Date().toISOString() };
      if (isObj(v.links)) {
        const links: JournalLinks = { repo: str(v.links.repo), demo: str(v.links.demo), report: str(v.links.report) };
        if (links.repo || links.demo || links.report) entry.links = links;
      }
      s.journal[k] = entry;
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
  return applyIdMigrations(s);
}

export const isNewer = (a: ProgressState | null, b: ProgressState | null) => (a?.updatedAt ?? "") > (b?.updatedAt ?? "");
export const serialize = (s: ProgressState) => JSON.stringify(s, null, 2) + "\n";

/** True when two states hold the same learner data (ignores updatedAt and presentation-only `seen`). */
export function sameProgress(a: ProgressState, b: ProgressState): boolean {
  const pick = (s: ProgressState) => stable([s.startDate, s.done, s.na, s.journal, s.journalDays, s.continuing]);
  return pick(a) === pick(b);
}

/** JSON with object keys sorted, so equal data compares equal regardless of insertion order. */
function stable(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stable).join(",")}]`;
  if (isObj(v)) return `{${Object.keys(v).sort().filter(k => v[k] !== undefined).map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}`;
  return JSON.stringify(v ?? null);
}

/** Nothing worth keeping yet (fresh browser). */
export const isEmptyProgress = (s: ProgressState) =>
  !s.startDate && !Object.keys(s.done).length && !Object.keys(s.na).length && !Object.keys(s.journal).length && !s.continuing.length;

export const localDay = (d: Date = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};
export const dayOf = (iso: string) => localDay(new Date(iso));
