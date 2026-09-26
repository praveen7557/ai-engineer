import { describe, expect, it } from "vitest";
import { emptyState, sameProgress, type ProgressState } from "./state";
import { decideSync } from "./sync";

const st = (updatedAt: string | null, done: Record<string, string> = {}, extra: Partial<ProgressState> = {}): ProgressState =>
  ({ ...emptyState(), updatedAt, done, ...extra });

const T0 = "2026-09-20T10:00:00.000Z", T1 = "2026-09-21T10:00:00.000Z", T2 = "2026-09-22T10:00:00.000Z";

describe("decideSync", () => {
  it("pushes local progress when the gist is empty or missing", () => {
    expect(decideSync(st(T1, { a: T1 }), null, null).kind).toBe("push");
    expect(decideSync(st(T1, { a: T1 }), st(null), null).kind).toBe("push");
  });

  it("does nothing when neither side has progress", () => {
    expect(decideSync(st(null), null, null).kind).toBe("noop");
  });

  it("pulls into an empty browser without asking", () => {
    expect(decideSync(st(null), st(T1, { a: T1 }), null).kind).toBe("pull");
  });

  it("is a no-op when both sides hold the same data, recording the newest timestamp as agreed", () => {
    const d = decideSync(st(T1, { a: T0 }), st(T2, { a: T0 }), null);
    expect(d).toEqual({ kind: "noop", agreedAt: T2 });
  });

  it("asks on first sync when both sides have different progress (never silently overwrites)", () => {
    expect(decideSync(st(T2, { a: T2 }), st(T1, { b: T1 }), null)).toEqual({ kind: "conflict", reason: "first-sync" });
  });

  it("fast-forwards whichever side changed since the last agreed version", () => {
    expect(decideSync(st(T2, { a: T0, b: T2 }), st(T0, { a: T0 }), T0).kind).toBe("push");
    expect(decideSync(st(T0, { a: T0 }), st(T2, { a: T0, c: T2 }), T0).kind).toBe("pull");
  });

  it("asks when both sides changed since the last sync, regardless of which is newer", () => {
    expect(decideSync(st(T2, { a: T0, b: T2 }), st(T1, { a: T0, c: T1 }), T0)).toEqual({ kind: "conflict", reason: "both-changed" });
    expect(decideSync(st(T1, { a: T0, b: T1 }), st(T2, { a: T0, c: T2 }), T0)).toEqual({ kind: "conflict", reason: "both-changed" });
  });

  it("treats journal and not-applicable changes as progress", () => {
    const base = st(T0, { a: T0 });
    const withJournal = st(T1, { a: T0 }, { journal: { w1: { text: "notes", updatedAt: T1 } } });
    const withNa = st(T1, { a: T0 }, { na: { "ch2.m1.s7": { reason: "single call met the bar", at: T1 } } });
    expect(decideSync(withJournal, base, T0).kind).toBe("push");
    expect(decideSync(base, withNa, T0).kind).toBe("pull");
  });
});

describe("sameProgress", () => {
  it("ignores key order, updatedAt and presentation-only fields", () => {
    const a = st(T0, { x: T0, y: T1 }, { seen: { rank: 1, stage: 0, achievements: [] } });
    const b = st(T2, { y: T1, x: T0 });
    expect(sameProgress(a, b)).toBe(true);
    expect(sameProgress(a, st(T0, { x: T0 }))).toBe(false);
  });
});
