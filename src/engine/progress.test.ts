import { describe, it, expect } from "vitest";
import { CHAPTERS, ITEMS, MISSIONS, chapterForWeek } from "../content";
import { emptyState, type ProgressState } from "./state";
import {
  XP,
  itemXp,
  xpOf,
  RANKS,
  rankFor,
  STAGES,
  stageFor,
  bond,
  streak,
  longestStreak,
  daysSinceActivity,
  xpThisWeek,
  planWeek,
  pace,
  youWeek,
  nextSteps,
  chapterStatus,
  chapterCoreIds,
  ALL_CORE_IDS,
  weekConceptIds,
  weekMilestoneIds,
  weekRequiredIds,
  nextMilestone,
  missionMilestoneIds,
  trialIds,
  ACHIEVEMENTS,
  isEndState,
  skillLevels,
} from "./progress";

const ch1 = CHAPTERS[0];
const ch2 = CHAPTERS[1];

const freshState = (): ProgressState => emptyState();

const markDone = (s: ProgressState, ids: string[], iso = new Date().toISOString()) => {
  for (const id of ids) s.done[id] = iso;
};

/** Noon-local ISO timestamp for a given YYYY-MM-DD day, to dodge timezone boundary flakiness. */
const atDay = (day: string) => new Date(`${day}T12:00:00`).toISOString();

describe("itemXp", () => {
  const base = { id: "x", title: "x", core: true, minutes: 10 } as const;

  it("returns the right constant for every item kind", () => {
    expect(itemXp({ ...base, kind: "concept" })).toBe(XP.concept);
    expect(itemXp({ ...base, kind: "milestone" })).toBe(XP.milestone);
    expect(itemXp({ ...base, kind: "stretch" })).toBe(XP.stretch);
    expect(itemXp({ ...base, kind: "trial" })).toBe(XP.trialCriterion);
    expect(itemXp({ ...base, kind: "setup" })).toBe(XP.setup);
    expect(itemXp({ ...base, kind: "course" })).toBe(XP.course);
  });

  it("distinguishes must-read, reference and bonus resources", () => {
    expect(itemXp({ ...base, kind: "resource", use: "must" })).toBe(XP.mustRead);
    expect(itemXp({ ...base, kind: "resource", use: "reference" })).toBe(XP.reference);
    expect(itemXp({ ...base, kind: "resource", use: "bonus" })).toBe(XP.bonusRead);
  });
});

describe("xpOf", () => {
  it("awards the week-complete bonus only when the week's build milestones and required concepts are done", () => {
    const s = freshState();
    const concepts = weekConceptIds(ch1, 1);
    const build = weekMilestoneIds(ch1, 1);
    expect(concepts.length).toBeGreaterThan(0);
    expect(build.length).toBeGreaterThan(0);
    markDone(s, concepts);
    expect(xpOf(s).bonuses).toBe(0); // concepts alone no longer complete a week
    markDone(s, build);
    const items = [...concepts, ...build].reduce((t, id) => t + itemXp(ITEMS.get(id)!), 0);
    const { total, bonuses } = xpOf(s);
    const missionDone = ch1.missions.filter(m => m.milestones.every(x => s.done[x.id])).reduce((a, m) => a + (m.major ? XP.missionMajor : XP.missionMinor), 0);
    expect(bonuses).toBe(XP.weekComplete + missionDone);
    expect(total).toBe(items + bonuses);
  });

  it("awards the major mission-complete bonus for a major mission", () => {
    const s = freshState();
    const mission = ch1.missions.find(m => m.major)!;
    expect(mission).toBeDefined();
    const milestoneIds = missionMilestoneIds(mission.id);
    markDone(s, milestoneIds);
    const items = milestoneIds.reduce((t, id) => t + itemXp(ITEMS.get(id)!), 0);
    const { total, bonuses } = xpOf(s);
    expect(bonuses).toBe(XP.missionMajor);
    expect(total).toBe(items + XP.missionMajor);
  });

  it("awards the minor mission-complete bonus for a minor mission", () => {
    const s = freshState();
    const mission = [...MISSIONS.values()].find(m => !m.major)!;
    expect(mission).toBeDefined();
    const milestoneIds = missionMilestoneIds(mission.id);
    markDone(s, milestoneIds);
    const { bonuses } = xpOf(s);
    expect(bonuses).toBe(XP.missionMinor);
  });

  it("awards the trial-passed bonus when every trial criterion in a chapter is done", () => {
    const s = freshState();
    const ids = trialIds(ch1);
    markDone(s, ids);
    const items = ids.reduce((t, id) => t + itemXp(ITEMS.get(id)!), 0);
    const { total, bonuses } = xpOf(s);
    expect(bonuses).toBe(XP.trialPassed);
    expect(total).toBe(items + XP.trialPassed);
  });

  it("combines week, mission and trial bonuses without double counting other chapters", () => {
    const s = freshState();
    const week1Ids = weekConceptIds(ch1, 1);
    const majorMission = ch1.missions.find(m => m.major)!;
    const missionIds = missionMilestoneIds(majorMission.id);
    const trial = trialIds(ch1);
    markDone(s, [...week1Ids, ...missionIds, ...trial]);
    const { bonuses } = xpOf(s);
    expect(bonuses).toBe(XP.weekComplete + XP.missionMajor + XP.trialPassed);
  });
});

describe("RANKS / rankFor", () => {
  it("has strictly increasing thresholds starting at 0", () => {
    expect(RANKS[0].threshold).toBe(0);
    for (let i = 1; i < RANKS.length; i++) {
      expect(RANKS[i].threshold).toBeGreaterThan(RANKS[i - 1].threshold);
    }
  });

  it("resolves the first rank at xp 0", () => {
    const { rank, progress } = rankFor(0);
    expect(rank.index).toBe(0);
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(1);
  });

  it("resolves exactly the rank whose threshold is met, not the previous one", () => {
    const target = RANKS[3];
    const { rank, progress } = rankFor(target.threshold);
    expect(rank.index).toBe(target.index);
    expect(progress).toBe(0);
  });

  it("resolves the previous rank just below a threshold", () => {
    const target = RANKS[3];
    const { rank } = rankFor(target.threshold - 1);
    expect(rank.index).toBe(target.index - 1);
  });

  it("keeps progress within [0, 1] across the range, including past the last rank", () => {
    const last = RANKS[RANKS.length - 1];
    for (const xp of [0, last.threshold, last.threshold + 1_000_000]) {
      const { progress } = rankFor(xp);
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(1);
    }
  });
});

describe("STAGES / stageFor", () => {
  it("has strictly increasing thresholds starting at 0", () => {
    expect(STAGES[0].threshold).toBe(0);
    for (let i = 1; i < STAGES.length; i++) {
      expect(STAGES[i].threshold).toBeGreaterThan(STAGES[i - 1].threshold);
    }
  });

  it("resolves stages and keeps progress within [0, 1]", () => {
    const target = STAGES[2];
    expect(stageFor(target.threshold).stage.index).toBe(target.index);
    expect(stageFor(target.threshold - 1).stage.index).toBe(target.index - 1);
    const last = STAGES[STAGES.length - 1];
    for (const b of [0, target.threshold, last.threshold + 1_000_000]) {
      const { progress } = stageFor(b);
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(1);
    }
  });
});

describe("bond", () => {
  it("is 0 for a totally empty state", () => {
    expect(bond(freshState())).toBe(0);
  });

  it("is greater than 0 once there is any activity", () => {
    const s = freshState();
    s.done[weekConceptIds(ch1, 1)[0]] = new Date().toISOString();
    expect(bond(s)).toBeGreaterThan(0);
  });
});

describe("streak / longestStreak / daysSinceActivity / xpThisWeek", () => {
  const ids = weekConceptIds(ch1, 1); // at least 5 concept ids available

  it("streak counts consecutive days of activity ending today (or yesterday)", () => {
    const s = freshState();
    s.done[ids[0]] = atDay("2024-03-13");
    s.done[ids[1]] = atDay("2024-03-14");
    s.done[ids[2]] = atDay("2024-03-15");
    expect(streak(s, "2024-03-15")).toBe(3);
  });

  it("streak is 0 when there was no activity today or yesterday", () => {
    const s = freshState();
    s.done[ids[0]] = atDay("2024-03-01");
    expect(streak(s, "2024-03-15")).toBe(0);
  });

  it("streak still counts yesterday's run when nothing happened today", () => {
    const s = freshState();
    s.done[ids[0]] = atDay("2024-03-13");
    s.done[ids[1]] = atDay("2024-03-14");
    expect(streak(s, "2024-03-15")).toBe(2);
  });

  it("longestStreak finds the longest run, not just the most recent one", () => {
    const s = freshState();
    s.done[ids[0]] = atDay("2024-03-01");
    s.done[ids[1]] = atDay("2024-03-02");
    s.done[ids[2]] = atDay("2024-03-03");
    s.done[ids[3]] = atDay("2024-03-10");
    s.done[ids[4]] = atDay("2024-03-11");
    const sixth = weekConceptIds(ch1, 2)[0];
    const seventh = weekConceptIds(ch1, 2)[1];
    s.done[sixth] = atDay("2024-03-12");
    s.done[seventh] = atDay("2024-03-13");
    expect(longestStreak(s)).toBe(4);
  });

  it("daysSinceActivity is null with no activity, and counts days back to the last active day", () => {
    const empty = freshState();
    expect(daysSinceActivity(empty, "2024-03-15")).toBeNull();

    const s = freshState();
    s.done[ids[0]] = atDay("2024-03-10");
    expect(daysSinceActivity(s, "2024-03-15")).toBe(5);
  });

  it("xpThisWeek sums xp for the trailing 7 days including today", () => {
    const s = freshState();
    s.done[ids[0]] = atDay("2024-03-09"); // this is 6 days before today - inside window
    s.done[ids[1]] = atDay("2024-03-08"); // 7 days before today - outside the 7-day window (i=0..6 -> 03-09..03-15)
    s.done[ids[2]] = atDay("2024-03-15"); // today
    const m0 = ITEMS.get(ids[0])!;
    const m2 = ITEMS.get(ids[2])!;
    expect(xpThisWeek(s, "2024-03-15")).toBe(itemXp(m0) + itemXp(m2));
  });
});

describe("planWeek / pace", () => {
  it("is unset when there is no startDate", () => {
    expect(planWeek(freshState())).toBeNull();
    expect(pace(freshState())).toEqual({ kind: "unset" });
  });

  it("is upcoming when the start date is in the future", () => {
    const s = freshState();
    s.startDate = "2024-04-01";
    const now = new Date("2024-03-15T00:00:00");
    const p = pace(s, now);
    expect(p.kind).toBe("upcoming");
    if (p.kind === "upcoming") expect(p.plan).toBeLessThan(1);
  });

  it("computes the correct plan week for a start date 7*k days earlier", () => {
    const now = new Date("2024-03-29T00:00:00");
    const k = 4;
    const start = new Date(now.getTime() - k * 7 * 86400000);
    const s = freshState();
    s.startDate = start.toISOString().slice(0, 10);
    expect(planWeek(s, now)).toBe(k + 1);
  });

  it("is tracked with a negative delta when nothing is done at plan week 5", () => {
    const now = new Date("2024-03-29T00:00:00");
    const start = new Date(now.getTime() - 4 * 7 * 86400000);
    const s = freshState();
    s.startDate = start.toISOString().slice(0, 10);
    const p = pace(s, now);
    expect(p.kind).toBe("tracked");
    if (p.kind === "tracked") {
      expect(p.plan).toBe(5);
      expect(p.you).toBe(1);
      expect(p.delta).toBeLessThan(0);
    }
  });
});

describe("youWeek", () => {
  it("is 1 for an empty state", () => {
    expect(youWeek(freshState())).toBe(1);
  });

  it("increases monotonically as more core items are completed in order", () => {
    const s = freshState();
    let prev = youWeek(s);
    let sawIncrease = false;
    // Mark core ids in order, checking youWeek never decreases and eventually increases.
    for (let i = 0; i < ALL_CORE_IDS.length; i += 7) {
      s.done[ALL_CORE_IDS[i]] = new Date().toISOString();
      const now = youWeek(s);
      expect(now).toBeGreaterThanOrEqual(prev);
      if (now > prev) sawIncrease = true;
      prev = now;
    }
    expect(sawIncrease).toBe(true);
  });
});

describe("nextSteps", () => {
  it("is build-first: starts with the first Prompt Lab milestone on an empty state", () => {
    const steps = nextSteps(freshState());
    expect(steps[0].item.id).toBe(weekMilestoneIds(ch1, 1)[0]);
    expect(steps[0].item.kind).toBe("milestone");
    expect(nextMilestone(freshState())?.item.id).toBe(steps[0].item.id);
  });

  it("moves on to the next item once the first is done", () => {
    const s = freshState();
    const first = nextSteps(s)[0].item.id;
    s.done[first] = new Date().toISOString();
    const steps = nextSteps(s);
    expect(steps[0].item.id).not.toBe(first);
    expect(steps.some(step => step.item.id === first)).toBe(false);
  });

  it("never returns more than the requested count", () => {
    expect(nextSteps(freshState(), 3)).toHaveLength(3);
    expect(nextSteps(freshState(), 1)).toHaveLength(1);
    expect(nextSteps(freshState(), 10).length).toBeLessThanOrEqual(10);
  });
});

describe("chapterStatus", () => {
  it("chapter 1 is active on an empty state", () => {
    expect(chapterStatus(freshState(), ch1)).toBe("active");
  });

  it("chapter 2 is open (one chapter of lookahead) on an empty state", () => {
    expect(chapterStatus(freshState(), ch2)).toBe("open");
  });

  it("chapter 3 and beyond are sealed on an empty state", () => {
    for (const ch of CHAPTERS.filter(c => c.number >= 3)) {
      expect(chapterStatus(freshState(), ch)).toBe("sealed");
    }
  });

  it("is complete once every core item in the chapter is done", () => {
    const s = freshState();
    markDone(s, chapterCoreIds(ch1));
    expect(chapterStatus(s, ch1)).toBe("complete");
  });
});

describe("ACHIEVEMENTS", () => {
  const byId = (id: string) => ACHIEVEMENTS.find(a => a.id === id)!;

  it("first-step is earned after completing one non-setup concept", () => {
    const s = freshState();
    expect(byId("first-step").earned(s)).toBe(false);
    s.done[weekConceptIds(ch1, 1)[0]] = new Date().toISOString();
    expect(byId("first-step").earned(s)).toBe(true);
  });

  it("builder is earned after completing any mission", () => {
    const s = freshState();
    expect(byId("builder").earned(s)).toBe(false);
    const mission = [...MISSIONS.values()][0];
    markDone(s, missionMilestoneIds(mission.id));
    expect(byId("builder").earned(s)).toBe(true);
  });

  it("show-your-work needs a finished major mission plus a written reflection (evidence, not reading order)", () => {
    const mission = [...MISSIONS.values()].find(m => m.major)!;
    const s = freshState();
    markDone(s, missionMilestoneIds(mission.id));
    expect(byId("show-your-work").earned(s)).toBe(false);
    s.journal[mission.id] = { text: "short", updatedAt: new Date().toISOString() };
    expect(byId("show-your-work").earned(s)).toBe(false);
    s.journal[mission.id] = { text: Array.from({ length: 45 }, (_, i) => `word${i}`).join(" "), updatedAt: new Date().toISOString() };
    expect(byId("show-your-work").earned(s)).toBe(true);
    expect(ACHIEVEMENTS.some(a => a.id === "no-shortcuts")).toBe(false);
  });
});

describe("isEndState", () => {
  it("is false for an empty state", () => {
    expect(isEndState(freshState())).toBe(false);
  });

  it("is true once every week's required build + concepts and the capstone are done", () => {
    const s = freshState();
    for (const ch of CHAPTERS) {
      for (const w of ch.weeks) markDone(s, weekRequiredIds(ch, w.number));
    }
    const capstone = CHAPTERS[7].missions[0];
    markDone(s, missionMilestoneIds(capstone.id));
    expect(isEndState(s)).toBe(true);
  });
});

describe("skillLevels", () => {
  it("is all 0 on an empty state", () => {
    const levels = skillLevels(freshState());
    for (const v of Object.values(levels)) expect(v).toBe(0);
  });

  it("is all 100 when every core item is done", () => {
    const s = freshState();
    markDone(s, ALL_CORE_IDS);
    const levels = skillLevels(s);
    for (const v of Object.values(levels)) expect(v).toBe(100);
  });
});

// Sanity check that chapterForWeek lines up with the fixtures used above.
describe("fixtures sanity", () => {
  it("chapterForWeek(1) is chapter 1", () => {
    expect(chapterForWeek(1).id).toBe("ch1");
  });
});
