// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { coursePath } from "../content";
import { CoursePath } from "./CoursePath";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(async () => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => { root.render(<CoursePath />); });
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe("CoursePath page", () => {
  it("renders every phase as a labelled article in order", () => {
    const articles = [...container.querySelectorAll("article")];
    expect(articles.map(a => document.getElementById(a.getAttribute("aria-labelledby")!)?.textContent))
      .toEqual(coursePath.phases.map(p => p.title));
  });

  it("shows weeks needed at each pace, rounded up", () => {
    const text = container.textContent ?? "";
    expect(text).toContain("29 weeks");
    expect(text).toContain("19 weeks");
    expect(text).toContain("15 weeks");
  });

  it("shows the spend range against the cap", () => {
    expect(container.textContent).toContain("$353–468");
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
});
