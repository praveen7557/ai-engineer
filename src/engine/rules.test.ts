import { describe, expect, it } from "vitest";
import { CHAPTER_BY_ID, CHAPTERS, ITEMS } from "../content";
import { ID_MIGRATIONS } from "../content/migrations";
import {
  ALL_CORE_IDS, isMissionComplete, isResolved, isWeekComplete, weekConceptIds, weekMilestoneIds, weekRequiredIds, xpOf, XP, itemXp,
} from "./progress";
import { applyIdMigrations, emptyState, normalize } from "./state";

const now = () => new Date().toISOString();
const allMilestones = () => CHAPTERS.flatMap(c => c.missions.flatMap(m => m.milestones.map(s => ({ ch: c, m, s }))));
const conditional = () => allMilestones().filter(x => x.s.conditional);

describe("conditional milestones", () => {
  it("exist for the chain (ch2), context work (ch5) and the LLM judge (ch7)", () => {
    const byCh = new Set(conditional().map(x => x.ch.id));
    expect(byCh.has("ch2")).toBe(true);
    expect(byCh.has("ch5")).toBe(true);
    expect(byCh.has("ch7")).toBe(true);
    expect(conditional().find(x => x.ch.id === "ch2")!.s.title.toLowerCase()).toMatch(/chain/);
    expect(conditional().find(x => x.ch.id === "ch7")!.s.title.toLowerCase()).toMatch(/judge/);
  });

  it("count as resolved when marked not applicable with a reason, and earn the same XP", () => {
    const { s: ms, m } = conditional()[0];
    const st = emptyState();
    expect(isResolved(st, ms.id)).toBe(false);
    st.na[ms.id] = { reason: "Single call met the bar: 94% field accuracy on held-out", at: now() };
    expect(isResolved(st, ms.id)).toBe(true);
    expect(xpOf(st).items).toBe(itemXp(ITEMS.get(ms.id)!));
    // Resolving every other milestone completes the mission even though one was N/A.
    for (const x of m.milestones) if (x.id !== ms.id) st.done[x.id] = now();
    expect(isMissionComplete(st, m.id)).toBe(true);
  });

  it("can't be marked N/A without a reason, and non-conditional items ignore N/A entirely", () => {
    const ms = conditional()[0].s;
    const plain = allMilestones().find(x => !x.s.conditional)!.s;
    const st = normalize({ app: "the-ai-engineer", na: { [ms.id]: { reason: "   " }, [plain.id]: { reason: "skip it" } } })!;
    expect(isResolved(st, ms.id)).toBe(false);
    expect(isResolved(st, plain.id)).toBe(false);
    expect(xpOf(st).total).toBe(0);
  });

  it("does not let a justified simpler implementation block week completion", () => {
    const { ch, s: ms } = conditional()[0];
    const st = emptyState();
    for (const id of weekRequiredIds(ch, ms.week)) if (id !== ms.id) st.done[id] = now();
    expect(isWeekComplete(st, ms.week)).toBe(false);
    st.na[ms.id] = { reason: "Error analysis showed no multi-step failures", at: now() };
    expect(isWeekComplete(st, ms.week)).toBe(true);
  });
});

describe("optional content", () => {
  it("marks SDK and subagent concepts optional, outside week completion and core progress", () => {
    const ch5 = CHAPTER_BY_ID.get("ch5")!;
    const optional = ch5.weeks.flatMap(w => w.groups.flatMap(g => g.concepts.filter(c => c.optional)));
    expect(optional.map(c => c.id).join(" ")).toMatch(/sdk/);
    expect(optional.map(c => c.id).join(" ")).toMatch(/subagent/);
    for (const c of optional) {
      expect(ITEMS.get(c.id)!.core).toBe(false);
      expect(ALL_CORE_IDS).not.toContain(c.id);
      const week = ch5.weeks.find(w => w.groups.some(g => g.concepts.includes(c)))!.number;
      expect(weekConceptIds(ch5, week)).not.toContain(c.id);
    }
  });

  it("keeps stretch goals out of required week completion", () => {
    for (const ch of CHAPTERS) for (const w of ch.weeks) {
      const stretch = ch.missions.flatMap(m => m.stretch.map(s => s.id));
      for (const id of stretch) expect(weekRequiredIds(ch, w.number)).not.toContain(id);
    }
  });

  it("no longer lists required work again as a stretch goal (ch4 migration, ch6 remote deploy)", () => {
    const ch4 = CHAPTER_BY_ID.get("ch4")!, ch6 = CHAPTER_BY_ID.get("ch6")!;
    expect(ch4.missions.flatMap(m => m.stretch).some(s => /migration/i.test(s.title))).toBe(false);
    expect(ch4.missions.flatMap(m => m.milestones).some(s => /migration/i.test(s.title))).toBe(true);
    expect(ch6.missions.flatMap(m => m.stretch).some(s => /deploy/i.test(s.title) && !/second/i.test(s.title))).toBe(false);
  });

  it("gives every week both build milestones and required concepts", () => {
    for (const ch of CHAPTERS) for (const w of ch.weeks) {
      expect(weekMilestoneIds(ch, w.number).length, `week ${w.number} build`).toBeGreaterThan(0);
      expect(weekConceptIds(ch, w.number).length, `week ${w.number} concepts`).toBeGreaterThan(0);
    }
  });
});

describe("progress migration (v2 → v3)", () => {
  it("every migration target exists in the current curriculum", () => {
    for (const [from, to] of Object.entries(ID_MIGRATIONS)) {
      for (const id of to) expect(ITEMS.has(id), `${from} -> ${id}`).toBe(true);
    }
  });

  it("carries a split milestone's completion to all of its parts, keeping the original timestamp", () => {
    const v2 = { app: "the-ai-engineer", version: 2, updatedAt: "2026-09-26T10:00:00.000Z", done: { "ch4.m1.s8": "2026-09-20T09:00:00.000Z" } };
    const st = normalize(v2)!;
    expect(st.version).toBe(3);
    for (const id of ID_MIGRATIONS["ch4.m1.s8"]) expect(st.done[id]).toBe("2026-09-20T09:00:00.000Z");
    expect(st.updatedAt).toBe(v2.updatedAt);
    expect(st.na).toEqual({});
  });

  it("credits stretch goals that became required work", () => {
    const st = normalize({ app: "the-ai-engineer", done: { "ch4.m1.x2": "2026-09-21T09:00:00.000Z", "ch6.m2.x1": "2026-09-22T09:00:00.000Z" } })!;
    expect(st.done["ch4.m1.s12"]).toBe("2026-09-21T09:00:00.000Z");
    expect(st.done["ch6.m2.s1"]).toBe("2026-09-22T09:00:00.000Z");
  });

  it("preserves journals, unknown ids and existing completions, and is idempotent", () => {
    const raw = {
      app: "the-ai-engineer", version: 2, done: { "ch1.m1.s1": "2026-09-01T00:00:00.000Z", "ch4.m1.s8": "2026-09-02T00:00:00.000Z", "ch4.m1.s9": "2026-09-03T00:00:00.000Z", "legacy.item": "2026-09-04T00:00:00.000Z" },
      journal: { w1: { text: "first week", updatedAt: "2026-09-01T00:00:00.000Z" } },
    };
    const once = normalize(raw)!;
    expect(once.done["ch4.m1.s9"]).toBe("2026-09-03T00:00:00.000Z"); // an existing completion wins
    expect(once.done["legacy.item"]).toBeDefined();
    expect(once.journal.w1.text).toBe("first week");
    const twice = applyIdMigrations(structuredClone(once));
    expect(twice.done).toEqual(once.done);
  });

  it("keeps week-complete XP honest: concept-only weeks from v2 no longer earn the week bonus", () => {
    const ch1 = CHAPTERS[0];
    const done = Object.fromEntries(weekConceptIds(ch1, 1).map(id => [id, now()]));
    const st = normalize({ app: "the-ai-engineer", version: 2, done })!;
    expect(xpOf(st).bonuses).toBe(0);
    expect(Object.keys(st.done).length).toBe(Object.keys(done).length); // the items themselves are preserved
    expect(XP.weekComplete).toBeGreaterThan(0);
  });
});
