import { describe, expect, it } from "vitest";
import { ALL_CORE_IDS } from "../engine/progress";
import { CHAPTERS, ITEMS, RESOURCE_BY_ID } from "./index";
import { COURSE_LINKS, coursePath, coursePathBudget, coursePathHours } from "./coursePath";

describe("course path content", () => {
  it("numbers phases 0..n in order", () => {
    expect(coursePath.phases.map(p => p.number)).toEqual(coursePath.phases.map((_, i) => i));
  });

  it("totals phase hours and the budget range", () => {
    expect(coursePathHours).toBe(20 + 30 + 25 + 25 + 50 + 60 + 25 + 50);
    expect(coursePathBudget).toEqual([49 + 39 + 15 + 50 + 200, 49 + 39 + 20 + 60 + 300]);
  });

  it("keeps the worst-case spend inside the yearly budget", () => {
    expect(coursePathBudget[1]).toBeLessThanOrEqual(coursePath.budgetCap);
    for (const b of coursePath.budget) expect(b.usd[0]).toBeLessThanOrEqual(b.usd[1]);
  });

  it("splits time into shares that add up to 100%", () => {
    expect(coursePath.timeSplit.reduce((s, t) => s + t.pct, 0)).toBe(100);
  });

  it("links every resource over https, each only once", () => {
    const urls = [...coursePath.phases.flatMap(p => p.resources.map(r => r.url)), ...coursePath.afterwards.map(a => a.url)];
    for (const u of urls) expect(new URL(u).protocol).toBe("https:");
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("puts each course id under its own phase", () => {
    for (const p of coursePath.phases) for (const r of p.resources) expect(r.id.startsWith(`course.p${p.number}.`)).toBe(true);
    for (const a of coursePath.afterwards) expect(a.id.startsWith("course.after.")).toBe(true);
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
