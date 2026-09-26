/**
 * Pure derivations from ProgressState: XP, ranks, companion stage, pace, streaks,
 * achievements, next step and end-state capabilities. No React, no I/O.
 */
import { CHAPTERS, ITEMS, MISSIONS, TOTAL_WEEKS, chapterForWeek, type ItemMeta } from "../content";
import type { Chapter, Skill } from "../content/types";
import { dayOf, localDay, type ProgressState } from "./state";

/* ---------------- XP ---------------- */
export const XP = {
  concept: 20,
  mustRead: 15,
  bonusRead: 5,
  milestone: 100,
  stretch: 50,
  trialCriterion: 50,
  setup: 10,
  missionMajor: 250,
  missionMinor: 100,
  weekComplete: 100,
  trialPassed: 500,
} as const;

export function itemXp(m: ItemMeta): number {
  switch (m.kind) {
    case "concept": return XP.concept;
    case "resource": return m.required ? XP.mustRead : XP.bonusRead;
    case "milestone": return XP.milestone;
    case "stretch": return XP.stretch;
    case "trial": return XP.trialCriterion;
    case "setup": return XP.setup;
  }
}

const isDone = (s: ProgressState, id: string) => !!s.done[id];
const allDone = (s: ProgressState, ids: string[]) => ids.length > 0 && ids.every(id => isDone(s, id));

export const weekConceptIds = (ch: Chapter, week: number) =>
  ch.weeks.find(w => w.number === week)?.groups.flatMap(g => g.concepts.map(c => c.id)) ?? [];
export const trialIds = (ch: Chapter) => ch.trial.map(t => t.id);
export const missionMilestoneIds = (missionId: string) => MISSIONS.get(missionId)?.milestones.map(m => m.id) ?? [];

export const chapterCoreIds = (ch: Chapter) => [...ITEMS.values()].filter(m => m.core && m.chapterId === ch.id).map(m => m.id);
export const ALL_CORE_IDS = [...ITEMS.values()].filter(m => m.core).map(m => m.id);

export const isWeekComplete = (s: ProgressState, week: number) => allDone(s, weekConceptIds(chapterForWeek(week), week));
export const isMissionComplete = (s: ProgressState, missionId: string) => allDone(s, missionMilestoneIds(missionId));
export const isTrialPassed = (s: ProgressState, ch: Chapter) => allDone(s, trialIds(ch));

export interface XpBreakdown {
  total: number;
  items: number;
  bonuses: number;
}

export function xpOf(s: ProgressState): XpBreakdown {
  let items = 0;
  for (const id of Object.keys(s.done)) {
    const m = ITEMS.get(id);
    if (m) items += itemXp(m);
  }
  let bonuses = 0;
  for (let w = 1; w <= TOTAL_WEEKS; w++) if (isWeekComplete(s, w)) bonuses += XP.weekComplete;
  for (const m of MISSIONS.values()) if (isMissionComplete(s, m.id)) bonuses += m.major ? XP.missionMajor : XP.missionMinor;
  for (const ch of CHAPTERS) if (isTrialPassed(s, ch)) bonuses += XP.trialPassed;
  return { total: items + bonuses, items, bonuses };
}

/** Max XP from core items + all bonuses; used to scale rank thresholds. */
export const MAX_CORE_XP = (() => {
  let t = 0;
  for (const m of ITEMS.values()) if (m.core) t += itemXp(m);
  t += TOTAL_WEEKS * XP.weekComplete;
  for (const m of MISSIONS.values()) t += m.major ? XP.missionMajor : XP.missionMinor;
  t += CHAPTERS.length * XP.trialPassed;
  return t;
})();

/* ---------------- Ranks ---------------- */
export interface Rank {
  index: number;
  name: string;
  description: string;
  threshold: number;
}

const round50 = (n: number) => Math.round(n / 50) * 50;
const RANK_DEFS: [string, number, string][] = [
  ["Developer", 0, "You write software. You haven't yet made a model part of it."],
  ["Apprentice", 0.03, "You understand how models behave and can call them with intent."],
  ["Practitioner", 0.1, "You can shape model output reliably and wire it into real code."],
  ["Specialist", 0.22, "You build complete AI features, end to end, that people can use."],
  ["Engineer", 0.36, "You can independently design and build non-trivial AI-powered systems."],
  ["Advanced Engineer", 0.52, "Agents, tools and retrieval are parts you compose without a tutorial."],
  ["AI Engineer", 0.7, "You measure, harden and ship AI systems that others depend on."],
  ["Master Engineer", 0.9, "You combine everything, and you know which parts a problem doesn't need."],
];
export const RANKS: Rank[] = RANK_DEFS.map(([name, f, description], index) => ({ index, name, description, threshold: round50(f * MAX_CORE_XP) }));

export function rankFor(xp: number) {
  let r = RANKS[0];
  for (const k of RANKS) if (xp >= k.threshold) r = k;
  const next = RANKS[r.index + 1] ?? null;
  const span = next ? next.threshold - r.threshold : 1;
  const into = next ? (xp - r.threshold) / span : 1;
  return { rank: r, next, progress: Math.max(0, Math.min(1, into)) };
}

/* ---------------- Activity, streaks ---------------- */
export interface DayActivity {
  xp: number;
  concepts: number;
  resources: number;
  milestones: number;
  journal: boolean;
}

export function activityByDay(s: ProgressState): Map<string, DayActivity> {
  const map = new Map<string, DayActivity>();
  const get = (d: string) => {
    let a = map.get(d);
    if (!a) { a = { xp: 0, concepts: 0, resources: 0, milestones: 0, journal: false }; map.set(d, a); }
    return a;
  };
  for (const [id, iso] of Object.entries(s.done)) {
    const m = ITEMS.get(id);
    if (!m) continue;
    const a = get(dayOf(iso));
    a.xp += itemXp(m);
    if (m.kind === "concept") a.concepts++;
    else if (m.kind === "resource") a.resources++;
    else if (m.kind === "milestone" || m.kind === "stretch") a.milestones++;
  }
  for (const d of s.journalDays) get(d).journal = true;
  return map;
}

const addDays = (day: string, n: number) => {
  const d = new Date(day + "T12:00:00");
  d.setDate(d.getDate() + n);
  return localDay(d);
};

export function streak(s: ProgressState, today = localDay()): number {
  const act = activityByDay(s);
  let day = act.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (act.has(day)) { n++; day = addDays(day, -1); }
  return n;
}

export function daysSinceActivity(s: ProgressState, today = localDay()): number | null {
  const days = [...activityByDay(s).keys()].sort();
  if (!days.length) return null;
  const last = new Date(days[days.length - 1] + "T12:00:00").getTime();
  return Math.round((new Date(today + "T12:00:00").getTime() - last) / 86400000);
}

export function xpThisWeek(s: ProgressState, today = localDay()): number {
  const act = activityByDay(s);
  let t = 0;
  for (let i = 0; i < 7; i++) t += act.get(addDays(today, -i))?.xp ?? 0;
  return t;
}

/* ---------------- Pace ---------------- */
/** Planned core load per week: that week's concepts, plus the chapter's other core items spread over its weeks. */
const WEEK_LOAD: number[] = (() => {
  const load = new Array(TOTAL_WEEKS + 1).fill(0);
  for (const ch of CHAPTERS) {
    const other = chapterCoreIds(ch).filter(id => ITEMS.get(id)!.kind !== "concept").length;
    for (const w of ch.weeks) load[w.number] += weekConceptIds(ch, w.number).length + other / ch.weeks.length;
  }
  return load;
})();

export function planWeek(s: ProgressState, now = new Date()): number | null {
  if (!s.startDate) return null;
  const start = new Date(s.startDate + "T00:00:00").getTime();
  return Math.floor((now.getTime() - start) / (7 * 86400000)) + 1;
}

/** The week your completed work corresponds to (1-based; the week you're working in). */
export function youWeek(s: ProgressState): number {
  const done = ALL_CORE_IDS.filter(id => isDone(s, id)).length;
  let cum = 0;
  for (let w = 1; w <= TOTAL_WEEKS; w++) {
    cum += WEEK_LOAD[w];
    if (done < cum - 0.5) return w;
  }
  return TOTAL_WEEKS;
}

export type PaceStatus = { kind: "unset" } | { kind: "upcoming"; plan: number } | { kind: "tracked"; plan: number; you: number; delta: number };

export function pace(s: ProgressState, now = new Date()): PaceStatus {
  const plan = planWeek(s, now);
  if (plan == null) return { kind: "unset" };
  if (plan < 1) return { kind: "upcoming", plan };
  const you = youWeek(s);
  return { kind: "tracked", plan: Math.min(plan, TOTAL_WEEKS), you, delta: you - Math.min(plan, TOTAL_WEEKS) };
}

/* ---------------- Completion ---------------- */
export const pct = (s: ProgressState, ids: string[]) => (ids.length ? Math.round((100 * ids.filter(id => isDone(s, id)).length) / ids.length) : 0);
export const chapterPct = (s: ProgressState, ch: Chapter) => pct(s, chapterCoreIds(ch));
export const overallPct = (s: ProgressState) => pct(s, ALL_CORE_IDS);

export function chapterXpAvailable(ch: Chapter): number {
  let t = 0;
  for (const m of ITEMS.values()) if (m.chapterId === ch.id && m.core) t += itemXp(m);
  t += ch.weeks.length * XP.weekComplete + XP.trialPassed;
  for (const m of ch.missions) t += m.major ? XP.missionMajor : XP.missionMinor;
  return t;
}

export type ChapterStatus = "complete" | "active" | "open" | "sealed";

export function chapterStatus(s: ProgressState, ch: Chapter): ChapterStatus {
  if (chapterPct(s, ch) === 100) return "complete";
  const focus = focusChapter(s);
  if (focus.id === ch.id) return "active";
  if (ch.number < focus.number) return "open";
  // One chapter of lookahead is open; further ones are sealed (still readable, just veiled).
  return ch.number === focus.number + 1 ? "open" : "sealed";
}

/** The chapter you should be working in: the first incomplete chapter at or before your planned week. */
export function focusChapter(s: ProgressState): Chapter {
  const firstIncomplete = CHAPTERS.find(c => chapterPct(s, c) < 100) ?? CHAPTERS[CHAPTERS.length - 1];
  return firstIncomplete;
}

/* ---------------- Next step ---------------- */
export interface NextStep {
  item: ItemMeta;
  chapter: Chapter;
  xp: number;
  label: string;
}

const KIND_LABEL: Record<ItemMeta["kind"], string> = {
  concept: "Study", resource: "Read", milestone: "Build", stretch: "Stretch", trial: "Prove", setup: "Prepare",
};

/** Ordered core sequence for a chapter: per week concepts → must-reads → that week's mission; then remaining missions; then the trial. */
export function chapterSequence(ch: Chapter): ItemMeta[] {
  const seq: ItemMeta[] = [];
  const push = (id: string) => { const m = ITEMS.get(id); if (m && m.core) seq.push(m); };
  ch.weeks.forEach((w, i) => {
    weekConceptIds(ch, w.number).forEach(push);
    ch.resources.filter(r => r.required && r.week === w.number).forEach(r => push(r.id));
    const mission = ch.missions[i];
    if (mission && i < ch.weeks.length - 1) mission.milestones.forEach(m => push(m.id));
  });
  ch.missions.slice(ch.weeks.length - 1).forEach(m => m.milestones.forEach(s => push(s.id)));
  ch.resources.filter(r => r.required && !ch.weeks.some(w => w.number === r.week)).forEach(r => push(r.id));
  ch.trial.forEach(t => push(t.id));
  return seq;
}

export function nextSteps(s: ProgressState, count = 3): NextStep[] {
  const out: NextStep[] = [];
  for (const ch of CHAPTERS) {
    for (const item of chapterSequence(ch)) {
      if (isDone(s, item.id)) continue;
      out.push({ item, chapter: ch, xp: itemXp(item), label: KIND_LABEL[item.kind] });
      if (out.length >= count) return out;
    }
  }
  return out;
}

/* ---------------- Companion ---------------- */
export const COMPANION_NAME = "Nox";
export interface Stage { index: number; name: string; unlock: string; threshold: number }
const STAGE_DEFS: [string, number, string][] = [
  ["Awakened", 0, "Nox opens its eyes."],
  ["Curious", 0.04, "A faint ember core begins to glow."],
  ["Capable", 0.12, "Etched circuit markings appear."],
  ["Skilled", 0.26, "A woven scarf, for the long road."],
  ["Trusted", 0.42, "Small motes of light orbit Nox while it rests."],
  ["Veteran", 0.62, "A crest forms. Your workspace gains a lantern."],
  ["Guardian", 0.85, "Final form: a halo and wings of light."],
];
export const STAGES: Stage[] = STAGE_DEFS.map(([name, f, unlock], index) => ({ index, name, unlock, threshold: round50(f * MAX_CORE_XP) }));

/** Companion bond grows with XP, but also with consistency and reflection, so it's related to rank but not identical. */
export function bond(s: ProgressState): number {
  const act = activityByDay(s);
  return Math.round(xpOf(s).total * 0.85 + act.size * 60 + s.journalDays.length * 90);
}
export function stageFor(b: number) {
  let st = STAGES[0];
  for (const k of STAGES) if (b >= k.threshold) st = k;
  const next = STAGES[st.index + 1] ?? null;
  return { stage: st, next, progress: next ? Math.max(0, Math.min(1, (b - st.threshold) / (next.threshold - st.threshold))) : 1 };
}

export type Mood = "calm" | "curious" | "tired" | "proud" | "focused";

export function moodFor(s: ProgressState, now = new Date()): Mood {
  const idle = daysSinceActivity(s, localDay(now));
  const p = pace(s, now);
  if (idle != null && idle >= 4) return "tired";
  if (p.kind === "tracked" && p.delta <= -2) return "tired";
  if (p.kind === "tracked" && p.delta >= 1) return "proud";
  if (idle === 0) return "focused";
  return Object.keys(s.done).length ? "calm" : "curious";
}

export function companionLine(s: ProgressState, now = new Date()): string {
  const idle = daysSinceActivity(s, localDay(now));
  const p = pace(s, now);
  if (isEndState(s)) return "The road continues. It always does.";
  if (!Object.keys(s.done).length) return s.startDate ? "One step is enough to begin." : "A long road. Choose a day to begin.";
  if (idle != null && idle >= 4) return "The path is still here when you're ready.";
  if (p.kind === "tracked" && p.delta <= -2) return "The roadmap has moved ahead. We only need the next step.";
  if (p.kind === "tracked" && p.delta >= 2) return "Ahead of the plan. Don't rush the trials.";
  const focus = focusChapter(s);
  if (focus.number === 8) return "Everything before this was preparation.";
  const lines = ["Steady. That's how this works.", "Each piece connects to the next.", "You'll use this later. Probably soon.", "Quiet progress is still progress."];
  return lines[(new Date(now).getDate() + Object.keys(s.done).length) % lines.length];
}

/* ---------------- Achievements ---------------- */
export interface Achievement { id: string; name: string; description: string; earned: (s: ProgressState) => boolean }

const doneAt = (s: ProgressState, id: string) => s.done[id] ?? "";
const majorMissions = [...MISSIONS.values()].filter(m => m.major);

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-step", name: "First Step", description: "Complete your first task.", earned: s => Object.keys(s.done).some(id => ITEMS.get(id)?.kind !== "setup") },
  { id: "builder", name: "Builder", description: "Complete your first mission.", earned: s => [...MISSIONS.keys()].some(id => isMissionComplete(s, id)) },
  { id: "field-tested", name: "Field Tested", description: "Finish your first major mission: a real, independent implementation.", earned: s => majorMissions.some(m => isMissionComplete(s, m.id)) },
  { id: "deep-dive", name: "Deep Dive", description: "Complete an entire chapter.", earned: s => CHAPTERS.some(c => chapterPct(s, c) === 100) },
  { id: "system-thinker", name: "System Thinker", description: "Pass a chapter trial: prove you understand it, not just that you read it.", earned: s => CHAPTERS.some(c => isTrialPassed(s, c)) },
  {
    id: "no-shortcuts", name: "No Shortcuts", description: "Finish every must-read in a chapter before passing its trial.",
    earned: s => CHAPTERS.some(c => {
      if (!isTrialPassed(s, c)) return false;
      const reqs = c.resources.filter(r => r.required).map(r => r.id);
      if (!allDone(s, reqs)) return false;
      const lastRead = reqs.map(id => doneAt(s, id)).sort().pop() ?? "";
      const passed = trialIds(c).map(id => doneAt(s, id)).sort().pop() ?? "";
      return lastRead <= passed;
    }),
  },
  { id: "steady-hand", name: "Steady Hand", description: "Keep a seven-day streak.", earned: s => longestStreak(s) >= 7 },
  { id: "reflective", name: "Reflective", description: "Write in your journal on ten different days.", earned: s => s.journalDays.length >= 10 },
  { id: "tool-maker", name: "Tool Maker", description: "Complete every major mission in MCP & Tool Integration.", earned: s => { const c = CHAPTERS[5]; return !!c && c.missions.filter(m => m.major).every(m => isMissionComplete(s, m.id)); } },
  { id: "measured", name: "Measured", description: "Ship your first eval suite.", earned: s => { const c = CHAPTERS[6]; return !!c && !!c.missions[0] && isMissionComplete(s, c.missions[0].id); } },
  { id: "turning-point", name: "The Turning Point", description: "Reach the AI Engineer rank.", earned: s => rankFor(xpOf(s).total).rank.index >= 6 },
  { id: "final-build", name: "Final Build", description: "Complete the capstone.", earned: s => { const c = CHAPTERS[7]; return !!c && !!c.missions[0] && isMissionComplete(s, c.missions[0].id); } },
];

export function longestStreak(s: ProgressState): number {
  const days = [...activityByDay(s).keys()].sort();
  let best = 0, run = 0, prev = "";
  for (const d of days) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

export const earnedAchievements = (s: ProgressState) => ACHIEVEMENTS.filter(a => a.earned(s));

/* ---------------- End state ---------------- */
export function isEndState(s: ProgressState): boolean {
  const capstone = CHAPTERS[7]?.missions[0];
  if (!capstone || !isMissionComplete(s, capstone.id)) return false;
  for (let w = 1; w <= TOTAL_WEEKS; w++) if (!isWeekComplete(s, w)) return false;
  return true;
}
export const weeksComplete = (s: ProgressState) => Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).filter(w => isWeekComplete(s, w)).length;

export const SKILLS: { key: Skill; label: string }[] = [
  { key: "knowledge", label: "Knowledge" },
  { key: "building", label: "Building" },
  { key: "systemDesign", label: "System design" },
  { key: "evaluation", label: "Evaluation" },
  { key: "production", label: "Production" },
];

export function skillLevels(s: ProgressState): Record<Skill, number> {
  const out = {} as Record<Skill, number>;
  for (const { key } of SKILLS) {
    let num = 0, den = 0;
    for (const ch of CHAPTERS) {
      const w = ch.skills[key] ?? 0;
      if (!w) continue;
      num += w * chapterPct(s, ch);
      den += w;
    }
    out[key] = den ? Math.round(num / den) : 0;
  }
  return out;
}
