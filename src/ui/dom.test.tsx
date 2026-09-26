// @vitest-environment jsdom
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CHAPTERS } from "../content";
import { emptyState, serialize, type ProgressState } from "../engine/state";
import { StoreProvider, useStore } from "../store";
import { CheckRow } from "./bits";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
let ctx: ReturnType<typeof useStore>;
function Grab() { ctx = useStore(); return null; }

async function mount(ui: ReactNode) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => { root.render(<StoreProvider><Grab />{ui}</StoreProvider>); });
}
const flush = async (ms = 0) => { await act(async () => { await new Promise(r => setTimeout(r, ms)); }); };
const nameOf = (el: Element) => {
  const by = el.getAttribute("aria-labelledby");
  return by ? by.split(" ").map(id => document.getElementById(id)?.textContent ?? "").join(" ").trim() : el.getAttribute("aria-label") ?? "";
};

beforeEach(() => { localStorage.clear(); });
afterEach(async () => {
  await act(async () => root?.unmount());
  container?.remove();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const milestone = CHAPTERS[0].missions[0].milestones[0];
const conditional = CHAPTERS.flatMap(c => c.missions.flatMap(m => m.milestones)).find(s => s.conditional)!;

describe("CheckRow: repeated controls", () => {
  it("gives each rendered instance unique DOM ids and an accessible name from the item title", async () => {
    await mount(<ul><CheckRow id={milestone.id} title={milestone.title} /><CheckRow id={milestone.id} title={milestone.title} /></ul>);
    const boxes = [...container.querySelectorAll("input[type=checkbox]")];
    expect(boxes).toHaveLength(2);
    expect(new Set(boxes.map(b => b.id)).size).toBe(2);
    const ids = [...container.querySelectorAll("[id]")].map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const b of boxes) {
      expect(nameOf(b)).toBe(milestone.title);
      expect(container.querySelector(`label[for="${b.id}"]`)?.textContent).toBe(milestone.title);
    }
  });

  it("keeps both instances in sync through the shared progress state", async () => {
    await mount(<ul><CheckRow id={milestone.id} title={milestone.title} /><CheckRow id={milestone.id} title={milestone.title} /></ul>);
    const [a, b] = [...container.querySelectorAll<HTMLInputElement>("input[type=checkbox]")];
    await act(async () => { a.click(); });
    expect(a.checked).toBe(true);
    expect(b.checked).toBe(true);
    expect(ctx.state.done[milestone.id]).toBeTruthy();
    const label = container.querySelector<HTMLLabelElement>(`label[for="${b.id}"]`)!;
    await act(async () => { label.click(); });
    expect(a.checked).toBe(false);
    expect(ctx.state.done[milestone.id]).toBeUndefined();
  });

  it("uses a plain-text accessible name when the title contains a link", async () => {
    await mount(<ul><CheckRow id={milestone.id} title={<a href="https://example.com">Linked title</a>} label="Linked title (must read)" /></ul>);
    expect(nameOf(container.querySelector("input[type=checkbox]")!)).toBe("Linked title (must read)");
  });
});

describe("CheckRow: conditional milestones", () => {
  it("offers Not applicable, requires a reason, and resolves the item in every instance", async () => {
    await mount(<ul><CheckRow id={conditional.id} title={conditional.title} /><CheckRow id={conditional.id} title={conditional.title} /></ul>);
    expect(container.textContent).toContain(conditional.conditional!);
    const open = [...container.querySelectorAll("button")].find(b => b.textContent === "Not applicable…")!;
    await act(async () => { open.click(); });
    const save = [...container.querySelectorAll("button")].find(b => b.textContent === "Save")! as HTMLButtonElement;
    expect(save.disabled).toBe(true);
    const input = container.querySelector<HTMLInputElement>(".na-form input")!;
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      setter.call(input, "A single call met the bar on held-out data");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => { container.querySelector<HTMLFormElement>(".na-form")!.requestSubmit(); });
    expect(ctx.state.na[conditional.id]?.reason).toBe("A single call met the bar on held-out data");
    expect(container.querySelectorAll(".row.na")).toHaveLength(2);
    const undo = [...container.querySelectorAll("button")].find(b => b.textContent === "Undo")!;
    await act(async () => { undo.click(); });
    expect(ctx.state.na[conditional.id]).toBeUndefined();
  });

  it("does not offer Not applicable on ordinary milestones", async () => {
    await mount(<ul><CheckRow id={milestone.id} title={milestone.title} /></ul>);
    expect([...container.querySelectorAll("button")].some(b => b.textContent === "Not applicable…")).toBe(false);
  });
});

describe("Gist sync (mocked GitHub API, isolated storage)", () => {
  const T0 = "2026-09-20T10:00:00.000Z", T1 = "2026-09-21T10:00:00.000Z", T2 = "2026-09-22T10:00:00.000Z";
  const local: ProgressState = { ...emptyState(), updatedAt: T2, done: { [milestone.id]: T2 }, journal: { w1: { text: "local notes", updatedAt: T2 } } };
  const remote: ProgressState = { ...emptyState(), updatedAt: T1, done: { "ch1.m1.s2": T1 } };

  function mockGist(remoteState: ProgressState | null) {
    const calls: { method: string; url: string }[] = [];
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ method: init?.method ?? "GET", url });
      if ((init?.method ?? "GET") === "GET") {
        return new Response(JSON.stringify({ files: remoteState ? { "progress.json": { content: serialize(remoteState) } } : {} }), { status: 200 });
      }
      return new Response("{}", { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("VITE_GITHUB_TOKEN", "test-token");
    vi.stubEnv("VITE_GIST_ID", "testgist");
    return calls;
  }

  it("stops at a conflict on first sync: nothing is pushed or overwritten until the learner chooses", async () => {
    localStorage.setItem("the-ai-engineer/progress", JSON.stringify(local));
    const calls = mockGist(remote);
    await mount(null);
    await flush(20);
    expect(ctx.gist.status).toBe("conflict");
    expect(ctx.state.done).toEqual(local.done);
    expect(ctx.state.journal.w1.text).toBe("local notes");
    expect(calls.filter(c => c.method === "PATCH")).toHaveLength(0);
  });

  it("choosing the gist's version snapshots local progress first, so it can be restored", async () => {
    localStorage.setItem("the-ai-engineer/progress", JSON.stringify(local));
    mockGist(remote);
    await mount(null);
    await flush(20);
    await act(async () => { await ctx.resolveGistConflict("remote"); });
    expect(ctx.state.done).toEqual(remote.done);
    expect(ctx.snapshots[0].state.journal.w1.text).toBe("local notes");
    await act(async () => { ctx.restoreSnapshot(ctx.snapshots[0].id); });
    expect(ctx.state.journal.w1.text).toBe("local notes");
  });

  it("choosing this browser's version pushes it and keeps the gist's version as a snapshot", async () => {
    localStorage.setItem("the-ai-engineer/progress", JSON.stringify(local));
    const calls = mockGist(remote);
    await mount(null);
    await flush(20);
    await act(async () => { await ctx.resolveGistConflict("local"); });
    expect(calls.filter(c => c.method === "PATCH")).toHaveLength(1);
    expect(ctx.state.done).toEqual(local.done);
    expect(ctx.snapshots.some(sn => sn.state.done["ch1.m1.s2"])).toBe(true);
  });

  it("fast-forwards without asking when only the gist changed since the last sync", async () => {
    const base: ProgressState = { ...emptyState(), updatedAt: T0, done: { [milestone.id]: T0 } };
    const newer: ProgressState = { ...base, updatedAt: T1, done: { ...base.done, "ch1.m1.s2": T1 } };
    localStorage.setItem("the-ai-engineer/progress", JSON.stringify(base));
    localStorage.setItem("the-ai-engineer/gist-last-synced/testgist", T0);
    mockGist(newer);
    await mount(null);
    await flush(20);
    expect(ctx.gist.status).toBe("idle");
    expect(ctx.state.done).toEqual(newer.done);
    expect(ctx.snapshots[0]?.state.done).toEqual(base.done); // previous local kept as a snapshot
  });

  it("disconnecting stops all sync traffic and keeps local progress", async () => {
    localStorage.setItem("the-ai-engineer/progress", JSON.stringify(local));
    const calls = mockGist(remote);
    await mount(null);
    await flush(20);
    await act(async () => { ctx.setGistPaused(true); });
    const before = calls.length;
    await act(async () => { await ctx.syncGistNow(); });
    await act(async () => { ctx.toggle("ch1.m1.s3", true); });
    await flush(2100);
    expect(calls.slice(before)).toEqual([]);
    expect(ctx.gist.paused).toBe(true);
    expect(ctx.state.done[milestone.id]).toBe(T2);
    expect(localStorage.getItem("the-ai-engineer/gist-paused")).toBe("1");
  });
});
