// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CHAPTERS, coursePath, RESOURCE_BY_ID } from "../content";
import { XP, xpOf } from "../engine/progress";
import { StoreProvider, useStore } from "../store";
import { CoursePath } from "./CoursePath";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
let ctx: ReturnType<typeof useStore>;
function Grab() { ctx = useStore(); return null; }

beforeEach(async () => {
  localStorage.clear();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => { root.render(<StoreProvider><Grab /><CoursePath /></StoreProvider>); });
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

const boxFor = (title: string) => {
  const box = [...container.querySelectorAll<HTMLInputElement>("input[type=checkbox]")].find(b => b.getAttribute("aria-label") === title);
  if (!box) throw new Error(`no checkbox for ${title}`);
  return box;
};

describe("CoursePath page", () => {
  it("renders every phase as a labelled article in order", () => {
    const articles = [...container.querySelectorAll("article")];
    expect(articles.map(a => document.getElementById(a.getAttribute("aria-labelledby")!)?.textContent))
      .toEqual(coursePath.phases.map(p => p.title));
  });

  it("shows weeks needed at each pace, rounded up", () => {
    const text = container.textContent ?? "";
    expect(text).toContain("20 weeks");
    expect(text).toContain("13 weeks");
    expect(text).toContain("10 weeks");
  });

  it("shows the spend range against the cap", () => {
    expect(container.textContent).toContain("$289–438");
    expect(container.textContent).toContain("of a $1000 yearly budget");
  });

  it("opens external links in a new tab without an opener", () => {
    const links = [...container.querySelectorAll<HTMLAnchorElement>("a[href^='https://']")];
    expect(links.length).toBeGreaterThan(0);
    for (const a of links) {
      expect(a.target).toBe("_blank");
      expect(a.rel).toContain("noopener");
    }
  });

  it("gives every course and resource a checkbox", () => {
    const titles = [...coursePath.phases.flatMap(p => p.resources), ...coursePath.niceToKnow].map(r => r.title);
    for (const t of titles) expect(boxFor(t)).toBeTruthy();
    expect(container.textContent).toContain(`0 / ${titles.length}`);
  });

  it("ticking a course saves it, earns course XP and updates both counters", async () => {
    const course = coursePath.phases[4].resources[0];
    await act(async () => { boxFor(course.title).click(); });
    expect(ctx.state.done[course.id]).toBeTruthy();
    expect(xpOf(ctx.state).total).toBe(XP.course);
    expect(container.textContent).toContain("1 / 13");
    const phase = [...container.querySelectorAll("article")][4];
    expect(phase.textContent).toContain("1/2 done");

    await act(async () => { boxFor(course.title).click(); });
    expect(ctx.state.done[course.id]).toBeFalsy();
    expect(container.textContent).toContain("0 / 13");
  });

  it("links each chapter in the mapping and deep-links its gap resources into the chapter", () => {
    const section = container.querySelector("[aria-labelledby=cp-map]")!;
    for (const ch of CHAPTERS) expect(section.querySelector(`a[href="#/chapter/${ch.id}"]`)).not.toBeNull();
    const r = RESOURCE_BY_ID.get("ch7.r.handling-overload")!;
    const link = [...section.querySelectorAll<HTMLAnchorElement>("a")].find(a => a.textContent === r.title)!;
    expect(link.getAttribute("href")).toBe(`#/chapter/ch7?week=${r.week}&focus=ch7.r.handling-overload&s=intel`);
  });
});
