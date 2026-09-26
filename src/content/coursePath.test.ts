import { describe, expect, it } from "vitest";
import { coursePath, coursePathBudget, coursePathHours } from "./coursePath";

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

  it("gives every phase a build", () => {
    for (const p of coursePath.phases) expect(p.build.trim()).not.toBe("");
  });
});
