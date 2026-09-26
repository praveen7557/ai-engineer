import type { Chapter, Mission } from "./types";
import { ch1 } from "./ch1";
import { ch2 } from "./ch2";
import { ch3 } from "./ch3";
import { ch4 } from "./ch4";
import { ch5 } from "./ch5";
import { ch6 } from "./ch6";
import { ch7 } from "./ch7";
import { ch8 } from "./ch8";
import { setupItems } from "./setup";

export { continuingSources, continuingPrompts } from "./continuing";
export { guide } from "./guide";
export { setupItems };
export type * from "./types";

export const CHAPTERS: Chapter[] = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8];
export const TOTAL_WEEKS = 24;

export type ItemKind = "concept" | "resource" | "milestone" | "stretch" | "trial" | "setup";

export interface ItemMeta {
  id: string;
  kind: ItemKind;
  title: string;
  /** Counts toward completion %, pace and rank thresholds. */
  core: boolean;
  /** Resources only: must / reference / bonus. */
  use?: "must" | "reference" | "bonus";
  chapterId?: string;
  week?: number;
  missionId?: string;
  minutes: number;
}

export const ITEMS = new Map<string, ItemMeta>();
export const MISSIONS = new Map<string, Mission & { chapterId: string }>();
export const CHAPTER_BY_ID = new Map<string, Chapter>();

for (const s of setupItems) ITEMS.set(s.id, { id: s.id, kind: "setup", title: s.title, core: false, minutes: 15 });

for (const ch of CHAPTERS) {
  CHAPTER_BY_ID.set(ch.id, ch);
  for (const w of ch.weeks) {
    for (const g of w.groups) {
      for (const c of g.concepts) {
        ITEMS.set(c.id, { id: c.id, kind: "concept", title: c.title, core: true, chapterId: ch.id, week: w.number, minutes: c.minutes });
      }
    }
  }
  for (const r of ch.resources) {
    ITEMS.set(r.id, {
      id: r.id, kind: "resource", title: r.title, core: r.use === "must", use: r.use,
      chapterId: ch.id, week: r.week, minutes: Math.round(r.hours * 60),
    });
  }
  for (const m of ch.missions) {
    MISSIONS.set(m.id, { ...m, chapterId: ch.id });
    for (const s of m.milestones) {
      ITEMS.set(s.id, { id: s.id, kind: "milestone", title: s.title, core: true, chapterId: ch.id, week: s.week, missionId: m.id, minutes: s.minutes });
    }
    for (const s of m.stretch) {
      ITEMS.set(s.id, { id: s.id, kind: "stretch", title: s.title, core: false, chapterId: ch.id, week: s.week, missionId: m.id, minutes: s.minutes });
    }
  }
  const lastWeek = ch.weeks[ch.weeks.length - 1].number;
  for (const t of ch.trial) {
    ITEMS.set(t.id, { id: t.id, kind: "trial", title: t.statement, core: true, chapterId: ch.id, week: lastWeek, minutes: 30 });
  }
}

/** Every resource by id, including earlier chapters' resources referenced from `revisit`. */
export const RESOURCE_BY_ID = new Map(CHAPTERS.flatMap(ch => ch.resources.map(r => [r.id, { ...r, chapterId: ch.id }] as const)));

export const chapterForWeek = (week: number): Chapter =>
  CHAPTERS.find(c => c.weeks.some(w => w.number === week)) ?? CHAPTERS[CHAPTERS.length - 1];
