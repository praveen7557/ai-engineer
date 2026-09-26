import { describe, expect, it } from "vitest";
import { CHAPTERS, continuingSources, guide, ITEMS, MISSIONS, RESOURCE_BY_ID, setupItems, TOTAL_WEEKS } from "./index";

const allIds = () => {
  const ids: string[] = setupItems.map(s => s.id);
  for (const ch of CHAPTERS) {
    ch.weeks.forEach(w => w.groups.forEach(g => g.concepts.forEach(c => ids.push(c.id))));
    ch.resources.forEach(r => ids.push(r.id));
    ch.missions.forEach(m => { ids.push(m.id); m.milestones.forEach(s => ids.push(s.id)); m.stretch.forEach(s => ids.push(s.id)); });
    ch.trial.forEach(t => ids.push(t.id));
  }
  return ids;
};

describe("roadmap content", () => {
  it("has 8 chapters numbered 1..8 with ids ch1..ch8", () => {
    expect(CHAPTERS.map(c => c.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(CHAPTERS.map(c => c.id)).toEqual(CHAPTERS.map(c => `ch${c.number}`));
  });

  it("covers weeks 1..24 contiguously, 2–4 weeks per chapter", () => {
    const weeks = CHAPTERS.flatMap(c => c.weeks.map(w => w.number));
    expect(weeks).toEqual(Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1));
    for (const c of CHAPTERS) {
      expect(c.weeks.length).toBeGreaterThanOrEqual(2);
      expect(c.weeks.length).toBeLessThanOrEqual(4);
    }
  });

  it("has unique ids that follow the conventions", () => {
    const ids = allIds();
    expect(new Set(ids).size).toBe(ids.length);
    for (const ch of CHAPTERS) {
      ch.weeks.forEach(w => w.groups.forEach(g => g.concepts.forEach(c => expect(c.id).toMatch(new RegExp(`^${ch.id}\\.c\\.[a-z0-9-]+$`)))));
      ch.resources.forEach(r => expect(r.id).toMatch(new RegExp(`^${ch.id}\\.r\\.[a-z0-9-]+$`)));
      ch.missions.forEach((m, i) => {
        expect(m.id).toBe(`${ch.id}.m${i + 1}`);
        m.milestones.forEach(s => expect(s.id).toMatch(new RegExp(`^${m.id.replace(".", "\\.")}\\.s\\d+$`)));
        m.stretch.forEach(s => expect(s.id).toMatch(new RegExp(`^${m.id.replace(".", "\\.")}\\.x\\d+$`)));
      });
      ch.trial.forEach(t => expect(t.id).toMatch(new RegExp(`^${ch.id}\\.t\\.[a-z0-9-]+$`)));
    }
    setupItems.forEach(s => expect(s.id).toMatch(/^setup\.[a-z0-9-]+$/));
  });

  it("numbers missions 1..N across the roadmap", () => {
    const nums = CHAPTERS.flatMap(c => c.missions.map(m => m.number));
    expect(nums).toEqual(Array.from({ length: nums.length }, (_, i) => i + 1));
  });

  it("gives every week a build and at least one concept", () => {
    for (const ch of CHAPTERS) for (const w of ch.weeks) {
      expect(w.build.deliverable.length).toBeGreaterThan(10);
      expect(w.build.evidence.length).toBeGreaterThan(10);
      expect(w.groups.flatMap(g => g.concepts).length).toBeGreaterThan(0);
    }
  });

  it("assigns milestones and resources to weeks inside their chapter", () => {
    for (const ch of CHAPTERS) {
      const weeks = new Set(ch.weeks.map(w => w.number));
      ch.missions.forEach(m => [...m.milestones, ...m.stretch].forEach(s => expect(weeks.has(s.week), `${s.id} week ${s.week}`).toBe(true)));
      ch.resources.forEach(r => {
        expect(weeks.has(r.week), `${r.id} week ${r.week}`).toBe(true);
        if (r.weekEnd !== undefined) {
          expect(weeks.has(r.weekEnd), `${r.id} weekEnd`).toBe(true);
          expect(r.weekEnd).toBeGreaterThanOrEqual(r.week);
        }
      });
    }
  });

  it("gives every week at least one milestone to build", () => {
    for (const ch of CHAPTERS) for (const w of ch.weeks) {
      const n = ch.missions.flatMap(m => m.milestones).filter(s => s.week === w.number).length;
      expect(n, `week ${w.number}`).toBeGreaterThan(0);
    }
  });

  it("uses https links everywhere", () => {
    const urls = [
      ...CHAPTERS.flatMap(c => c.resources.map(r => r.url)),
      ...continuingSources.map(s => s.url),
      ...guide.shelf.map(s => s.url),
    ];
    urls.forEach(u => expect(u).toMatch(/^https:\/\/[^\s]+$/));
  });

  it("links concepts only to their own chapter's resources or its revisit list, with most concepts linked", () => {
    for (const ch of CHAPTERS) {
      const own = new Set([...ch.resources.map(r => r.id), ...(ch.revisit ?? [])]);
      const concepts = ch.weeks.flatMap(w => w.groups.flatMap(g => g.concepts));
      for (const c of concepts) {
        const ids = c.resources ?? [];
        expect(new Set(ids).size, `${c.id} duplicate links`).toBe(ids.length);
        ids.forEach(id => expect(own.has(id), `${c.id} -> ${id}`).toBe(true));
      }
      if (own.size >= 5) {
        const linked = concepts.filter(c => (c.resources ?? []).length > 0).length;
        expect(linked / concepts.length, `${ch.id} coverage`).toBeGreaterThanOrEqual(0.6);
      }
    }
  });

  it("resolves every revisit id to an earlier chapter's resource", () => {
    for (const ch of CHAPTERS) for (const id of ch.revisit ?? []) {
      const r = RESOURCE_BY_ID.get(id);
      expect(r, `${ch.id} revisit ${id}`).toBeDefined();
      expect(Number(r!.chapterId.slice(2))).toBeLessThan(ch.number);
    }
  });

  it("has chapter text, a trial, and at least one must-read before the capstone", () => {
    for (const ch of CHAPTERS) {
      expect(ch.doneWhen.length).toBeGreaterThan(20);
      expect(ch.decision.length).toBeGreaterThan(20);
      expect(ch.trial.length).toBeGreaterThanOrEqual(4);
      expect(ch.resources.some(r => r.use === "must")).toBe(true);
    }
  });

  it("names only org-approved platforms in deployment guidance", () => {
    const text = [guide.deployment, ...CHAPTERS.flatMap(c => (c.notes ?? []).filter(n => n.label === "Deployment").map(n => n.text))].join(" ");
    expect(text).toMatch(/Cloudflare/);
    expect(text).toMatch(/Google Cloud/);
  });

  it("indexes every tracked item and mission", () => {
    expect(ITEMS.size).toBe(allIds().length - CHAPTERS.reduce((a, c) => a + c.missions.length, 0));
    expect(MISSIONS.size).toBe(CHAPTERS.reduce((a, c) => a + c.missions.length, 0));
  });
});
