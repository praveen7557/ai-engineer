import { useEffect, useState } from "react";

/** Hash routes: #/, #/roadmap, #/courses, #/chapter/ch4?week=11&focus=<itemId>, #/journal, #/companion, #/record, #/continuing, #/data */
export interface Route {
  path: string[];
  query: URLSearchParams;
}

const parse = (): Route => {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [p, q = ""] = raw.split("?");
  return { path: p.split("/").filter(Boolean), query: new URLSearchParams(q) };
};

export function useRoute(): Route {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => setRoute(parse());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

export const href = (path: string, query?: Record<string, string | number | undefined>) => {
  const q = query ? Object.entries(query).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&") : "";
  return `#/${path}${q ? "?" + q : ""}`;
};

export const go = (path: string, query?: Record<string, string | number | undefined>) => {
  window.location.hash = href(path, query);
};

export const chapterHref = (chapterId: string, opts: { week?: number; focus?: string; section?: string } = {}) =>
  href(`chapter/${chapterId}`, { week: opts.week, focus: opts.focus, s: opts.section });
