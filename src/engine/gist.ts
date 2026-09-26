/**
 * Optional sync of progress.json to a private GitHub Gist, configured through env vars:
 *   VITE_GITHUB_TOKEN   classic personal access token with only the `gist` scope
 *   VITE_GIST_ID        the gist to sync with (optional: the app can create one)
 *   VITE_GIST_FILENAME  file inside the gist (default "progress.json")
 *
 * Vite inlines VITE_* values into the built JavaScript, so the token is visible to anyone who
 * can load the built files. Keep it in .env.local, run the app locally, and never publish a build
 * that was made with a token.
 */
import { normalize, serialize, type ProgressState } from "./state";

export interface GistConfig {
  token: string;
  gistId: string | null;
  filename: string;
}

const API = "https://api.github.com";
const ID_KEY = "the-ai-engineer/gist-id";

export function readGistConfig(env: Record<string, string | undefined>, storedId?: string | null): GistConfig | null {
  const token = env.VITE_GITHUB_TOKEN?.trim();
  if (!token) return null;
  const gistId = env.VITE_GIST_ID?.trim() || storedId?.trim() || null;
  return { token, gistId, filename: env.VITE_GIST_FILENAME?.trim() || "progress.json" };
}

/** A gist id created from the UI is remembered in this browser until it's added to .env.local. */
export const loadStoredGistId = () => { try { return localStorage.getItem(ID_KEY); } catch { return null; } };
export const storeGistId = (id: string) => { try { localStorage.setItem(ID_KEY, id); } catch { /* blocked */ } };

export class GistError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function explain(status: number): string {
  if (status === 401) return "GitHub rejected the token. Check VITE_GITHUB_TOKEN.";
  if (status === 403) return "GitHub refused access. The token needs the gist scope, or you've hit a rate limit.";
  if (status === 404) return "Gist not found. Check VITE_GIST_ID, and that it belongs to the token's account.";
  if (status === 422) return "GitHub couldn't accept the progress file.";
  return `GitHub request failed (${status}).`;
}

async function request(cfg: GistConfig, path: string, init: RequestInit = {}, fetchImpl: typeof fetch = fetch): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetchImpl(`${API}${path}`, {
      ...init,
      signal: ctrl.signal,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${cfg.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
    });
    if (!res.ok) throw new GistError(explain(res.status), res.status);
    return res;
  } catch (e) {
    if (e instanceof GistError) throw e;
    throw new GistError((e as Error)?.name === "AbortError" ? "GitHub didn't respond in time." : "Couldn't reach GitHub.", 0);
  } finally {
    clearTimeout(timer);
  }
}

interface GistFile { content?: string; truncated?: boolean; raw_url?: string }

/** Reads progress from the gist; null if the file is missing or empty. */
export async function pullGist(cfg: GistConfig, fetchImpl: typeof fetch = fetch): Promise<ProgressState | null> {
  if (!cfg.gistId) return null;
  const gist = await (await request(cfg, `/gists/${encodeURIComponent(cfg.gistId)}`, {}, fetchImpl)).json() as { files?: Record<string, GistFile> };
  const file = gist.files?.[cfg.filename];
  if (!file) return null;
  let text = file.content ?? "";
  if (file.truncated && file.raw_url) {
    const raw = await fetchImpl(file.raw_url);
    if (!raw.ok) throw new GistError(explain(raw.status), raw.status);
    text = await raw.text();
  }
  if (!text.trim()) return null;
  try { return normalize(JSON.parse(text)); } catch { throw new GistError("The gist's progress file isn't valid JSON.", 0); }
}

export async function pushGist(cfg: GistConfig, s: ProgressState, fetchImpl: typeof fetch = fetch): Promise<void> {
  if (!cfg.gistId) throw new GistError("No gist configured yet.", 0);
  await request(cfg, `/gists/${encodeURIComponent(cfg.gistId)}`, {
    method: "PATCH",
    body: JSON.stringify({ files: { [cfg.filename]: { content: serialize(s) } } }),
  }, fetchImpl);
}

/** Creates a new private (secret) gist holding the current progress and returns its id. */
export async function createGist(cfg: GistConfig, s: ProgressState, fetchImpl: typeof fetch = fetch): Promise<string> {
  const res = await request(cfg, "/gists", {
    method: "POST",
    body: JSON.stringify({ description: "The AI Engineer: progress", public: false, files: { [cfg.filename]: { content: serialize(s) } } }),
  }, fetchImpl);
  const { id } = await res.json() as { id?: string };
  if (!id) throw new GistError("GitHub didn't return a gist id.", 0);
  return id;
}

export const gistUrl = (id: string) => `https://gist.github.com/${id}`;
