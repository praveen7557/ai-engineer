import { describe, it, expect } from "vitest";
import { normalize, isNewer, serialize, emptyState, type ProgressState } from "./state";

describe("normalize", () => {
  it("rejects non-objects", () => {
    expect(normalize(null)).toBeNull();
    expect(normalize(undefined)).toBeNull();
    expect(normalize(42)).toBeNull();
    expect(normalize("hello")).toBeNull();
    expect(normalize([1, 2, 3])).toBeNull();
  });

  it("rejects files whose app field is another app", () => {
    expect(normalize({ app: "some-other-app" })).toBeNull();
  });

  it("accepts a file with no app field", () => {
    const out = normalize({});
    expect(out).not.toBeNull();
    expect(out?.app).toBe("the-ai-engineer");
  });

  it("accepts a file with the matching app field", () => {
    const out = normalize({ app: "the-ai-engineer" });
    expect(out).not.toBeNull();
  });

  it("coerces done: true values to an ISO timestamp", () => {
    const before = Date.now();
    const out = normalize({ done: { "ch1.c.foo": true } });
    const after = Date.now();
    expect(out).not.toBeNull();
    const ts = out!.done["ch1.c.foo"];
    expect(typeof ts).toBe("string");
    const t = new Date(ts).getTime();
    expect(t).toBeGreaterThanOrEqual(before);
    expect(t).toBeLessThanOrEqual(after);
  });

  it("keeps string timestamps for done items and drops falsy/invalid ones", () => {
    const out = normalize({
      done: {
        "a": "2024-01-01T00:00:00.000Z",
        "b": false,
        "c": "",
        "d": 123,
      },
    });
    expect(out!.done).toEqual({ a: "2024-01-01T00:00:00.000Z" });
  });

  it("filters invalid journalDays and dedupes/sorts the valid ones", () => {
    const out = normalize({
      journalDays: ["2024-01-05", "not-a-date", "2024-01-01", "2024-01-05", "2024/01/02", null, 5, "2024-01-03"],
    });
    expect(out!.journalDays).toEqual(["2024-01-01", "2024-01-03", "2024-01-05"]);
  });

  it("tolerates missing fields and returns a fully populated empty-ish state", () => {
    const out = normalize({});
    expect(out).toEqual(emptyState());
  });

  it("normalizes journal entries, filling in a timestamp when missing", () => {
    const before = Date.now();
    const out = normalize({
      journal: {
        w1: { text: "hello" },
        w2: { text: "world", updatedAt: "2024-02-02T00:00:00.000Z" },
        bad: { text: 5 },
        alsoBad: "not an object",
      },
    });
    expect(out!.journal.w2).toEqual({ text: "world", updatedAt: "2024-02-02T00:00:00.000Z" });
    expect(out!.journal.w1.text).toBe("hello");
    expect(new Date(out!.journal.w1.updatedAt).getTime()).toBeGreaterThanOrEqual(before);
    expect(out!.journal.bad).toBeUndefined();
    expect(out!.journal.alsoBad).toBeUndefined();
  });

  it("normalizes startDate only when it matches YYYY-MM-DD, and updatedAt when a string", () => {
    expect(normalize({ startDate: "2024-01-01" })!.startDate).toBe("2024-01-01");
    expect(normalize({ startDate: "01/01/2024" })!.startDate).toBeNull();
    expect(normalize({ startDate: 5 })!.startDate).toBeNull();
    expect(normalize({ updatedAt: "2024-01-01T00:00:00.000Z" })!.updatedAt).toBe("2024-01-01T00:00:00.000Z");
    expect(normalize({ updatedAt: 5 })!.updatedAt).toBeNull();
  });

  it("normalizes continuing entries, generating an id when missing and defaulting category/note", () => {
    const out = normalize({
      continuing: [
        { title: "Real entry", date: "2024-01-01" },
        { title: "With id", date: "2024-01-02", id: "fixed-id", category: "Paper", url: "https://example.com", note: "n" },
        { date: "2024-01-03" }, // missing title -> dropped
        { title: "No date" }, // missing/invalid date -> dropped
        "not an object",
      ],
    });
    expect(out!.continuing).toHaveLength(2);
    const [first, second] = out!.continuing;
    expect(typeof first.id).toBe("string");
    expect(first.id.length).toBeGreaterThan(0);
    expect(first.category).toBe("Experiment");
    expect(first.note).toBe("");
    expect(first.url).toBeUndefined();
    expect(second).toEqual({ id: "fixed-id", date: "2024-01-02", category: "Paper", title: "With id", url: "https://example.com", note: "n" });
  });

  it("normalizes seen, defaulting missing/invalid fields", () => {
    expect(normalize({ seen: { rank: 3, stage: 2, achievements: ["a", "b", 5] } })!.seen).toEqual({
      rank: 3,
      stage: 2,
      achievements: ["a", "b"],
    });
    expect(normalize({ seen: {} })!.seen).toEqual({ rank: 0, stage: 0, achievements: [] });
    expect(normalize({})!.seen).toEqual({ rank: 0, stage: 0, achievements: [] });
  });
});

describe("isNewer", () => {
  const withUpdatedAt = (updatedAt: string | null): ProgressState => ({ ...emptyState(), updatedAt });

  it("is true when a has a later updatedAt than b", () => {
    expect(isNewer(withUpdatedAt("2024-01-02T00:00:00.000Z"), withUpdatedAt("2024-01-01T00:00:00.000Z"))).toBe(true);
  });

  it("is false when a is older than or equal to b", () => {
    expect(isNewer(withUpdatedAt("2024-01-01T00:00:00.000Z"), withUpdatedAt("2024-01-02T00:00:00.000Z"))).toBe(false);
    expect(isNewer(withUpdatedAt("2024-01-01T00:00:00.000Z"), withUpdatedAt("2024-01-01T00:00:00.000Z"))).toBe(false);
  });

  it("treats null states/updatedAt as the empty string, so anything with a timestamp beats them", () => {
    expect(isNewer(withUpdatedAt("2024-01-01T00:00:00.000Z"), null)).toBe(true);
    expect(isNewer(null, withUpdatedAt("2024-01-01T00:00:00.000Z"))).toBe(false);
    expect(isNewer(null, null)).toBe(false);
  });
});

describe("serialize round-trip", () => {
  it("serializes and re-parses back to an equivalent state via normalize", () => {
    const s = emptyState();
    s.updatedAt = "2024-01-01T00:00:00.000Z";
    s.startDate = "2024-01-01";
    s.done["ch1.c.next-token-prediction"] = "2024-01-01T12:00:00.000Z";
    s.journal.w1 = { text: "hi", updatedAt: "2024-01-01T00:00:00.000Z" };
    s.journalDays = ["2024-01-01"];
    s.continuing = [{ id: "x", date: "2024-01-01", category: "Paper", title: "T", note: "" }];
    s.seen = { rank: 1, stage: 1, achievements: ["first-step"] };

    const text = serialize(s);
    expect(text.endsWith("\n")).toBe(true);
    const parsed = JSON.parse(text);
    const restored = normalize(parsed);
    expect(restored).toEqual(s);
  });
});
