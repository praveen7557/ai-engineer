import { describe, expect, it } from "vitest";
import { ALL_CORE_IDS } from "../engine/progress";
import { normalize } from "../engine/state";
import { CHAPTERS, ITEMS, RESOURCE_BY_ID } from "./index";
import { COURSE_LINKS, coursePath, coursePathBudget, coursePathHours } from "./coursePath";

const RETIRED_IDS = [
  "course.p0.uv", "course.p0.fastapi", "course.p0.pydantic", "course.p0.pytest", "course.p1.agentic-ai",
  "course.p5.mcp-intro", "course.p6.vllm", "course.p6.llama-cpp", "course.after.cs336",
];

describe("course path content", () => {
  it("numbers phases 1..n in order", () => {
    expect(coursePath.phases.map(p => p.number)).toEqual(coursePath.phases.map((_, i) => i + 1));
  });

  it("totals phase hours and the budget range", () => {
    expect(coursePathHours).toBe(18 + 25 + 25 + 15 + 30 + 30 + 50);
    expect(coursePathBudget).toEqual([39 + 0 + 50 + 200, 78 + 0 + 60 + 300]);
  });

  it("keeps the worst-case spend inside the yearly budget", () => {
    expect(coursePathBudget[1]).toBeLessThanOrEqual(coursePath.budgetCap);
    for (const b of coursePath.budget) expect(b.usd[0]).toBeLessThanOrEqual(b.usd[1]);
  });

  it("splits time into shares that add up to 100%", () => {
    expect(coursePath.timeSplit.reduce((s, t) => s + t.pct, 0)).toBe(100);
  });

  it("links every course over https, each only once", () => {
    const urls = COURSE_LINKS.map(c => c.url);
    for (const u of urls) expect(new URL(u).protocol).toBe("https:");
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("uses phase-independent ids and never reuses a retired one", () => {
    const ids = COURSE_LINKS.map(c => c.id);
    for (const id of ids) expect(id).toMatch(/^course\.[a-z0-9-]+$/);
    expect(new Set(ids).size).toBe(ids.length);
    for (const old of RETIRED_IDS) expect(ids).not.toContain(old);
  });

  it("carries a course ticked under its old phase-numbered id to the new id", () => {
    const st = normalize({ app: "the-ai-engineer", done: { "course.p4.core-track": "2026-09-27T09:00:00.000Z" } })!;
    expect(st.done["course.core-track"]).toBe("2026-09-27T09:00:00.000Z");
  });

  it("tracks every course as a non-core item, so ticking one never changes chapter completion or pace", () => {
    for (const c of COURSE_LINKS) {
      expect(ITEMS.get(c.id)).toMatchObject({ kind: "course", core: false, title: c.title });
      expect(ALL_CORE_IDS).not.toContain(c.id);
    }
  });

  it("maps every chapter exactly once, in order", () => {
    expect(coursePath.chapterMap.map(m => m.chapterId)).toEqual(CHAPTERS.map(c => c.id));
  });

  it("backs every gap with real resources from that chapter, and only partial or mostly covered chapters have gaps", () => {
    for (const m of coursePath.chapterMap) {
      if (m.coverage === "Full") { expect(m.gaps).toBeUndefined(); continue; }
      expect(m.gaps?.trim()).toBeTruthy();
      expect(m.gapResourceIds?.length).toBeGreaterThan(0);
      for (const id of m.gapResourceIds!) expect(RESOURCE_BY_ID.get(id)?.chapterId).toBe(m.chapterId);
    }
  });

  it("gives every phase a build", () => {
    for (const p of coursePath.phases) expect(p.build.trim()).not.toBe("");
  });
});
