import { describe, expect, it, vi } from "vitest";
import { createGist, GistError, pullGist, pushGist, readGistConfig, type GistConfig } from "./gist";
import { emptyState, serialize } from "./state";

const cfg: GistConfig = { token: "tkn", gistId: "abc123", filename: "progress.json" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("readGistConfig", () => {
  it("is disabled without a token", () => {
    expect(readGistConfig({})).toBeNull();
    expect(readGistConfig({ VITE_GITHUB_TOKEN: "   " })).toBeNull();
  });
  it("reads token, id and filename, trimming whitespace", () => {
    expect(readGistConfig({ VITE_GITHUB_TOKEN: " t ", VITE_GIST_ID: " g ", VITE_GIST_FILENAME: "p.json" })).toEqual({ token: "t", gistId: "g", filename: "p.json" });
  });
  it("defaults the filename and falls back to a stored id", () => {
    expect(readGistConfig({ VITE_GITHUB_TOKEN: "t" }, "stored")).toEqual({ token: "t", gistId: "stored", filename: "progress.json" });
    expect(readGistConfig({ VITE_GITHUB_TOKEN: "t" })?.gistId).toBeNull();
  });
  it("prefers the env id over a stored one", () => {
    expect(readGistConfig({ VITE_GITHUB_TOKEN: "t", VITE_GIST_ID: "env" }, "stored")?.gistId).toBe("env");
  });
});

describe("pullGist", () => {
  it("returns the normalized progress file and sends auth headers", async () => {
    const s = { ...emptyState(), updatedAt: "2026-10-01T00:00:00.000Z", done: { "ch1.c.x": "2026-10-01T00:00:00.000Z" } };
    const f = vi.fn(async () => json({ files: { "progress.json": { content: serialize(s) } } }));
    const got = await pullGist(cfg, f as unknown as typeof fetch);
    expect(got?.done).toEqual(s.done);
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.github.com/gists/abc123");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer tkn");
  });
  it("returns null when the file is missing or empty, or no gist id is set", async () => {
    expect(await pullGist(cfg, (async () => json({ files: {} })) as unknown as typeof fetch)).toBeNull();
    expect(await pullGist(cfg, (async () => json({ files: { "progress.json": { content: "  " } } })) as unknown as typeof fetch)).toBeNull();
    expect(await pullGist({ ...cfg, gistId: null }, vi.fn() as unknown as typeof fetch)).toBeNull();
  });
  it("follows raw_url when GitHub truncates the content", async () => {
    const s = { ...emptyState(), updatedAt: "2026-10-02T00:00:00.000Z" };
    const f = vi.fn()
      .mockResolvedValueOnce(json({ files: { "progress.json": { content: "{", truncated: true, raw_url: "https://gist.githubusercontent.com/raw" } } }))
      .mockResolvedValueOnce(new Response(serialize(s)));
    expect((await pullGist(cfg, f as unknown as typeof fetch))?.updatedAt).toBe(s.updatedAt);
    expect(f.mock.calls[1][0]).toBe("https://gist.githubusercontent.com/raw");
  });
  it("rejects invalid JSON and files from another app", async () => {
    await expect(pullGist(cfg, (async () => json({ files: { "progress.json": { content: "{nope" } } })) as unknown as typeof fetch)).rejects.toBeInstanceOf(GistError);
    expect(await pullGist(cfg, (async () => json({ files: { "progress.json": { content: JSON.stringify({ app: "other" }) } } })) as unknown as typeof fetch)).toBeNull();
  });
  it("maps HTTP failures to readable errors", async () => {
    for (const [status, text] of [[401, "rejected the token"], [403, "gist scope"], [404, "Gist not found"], [500, "(500)"]] as const) {
      await expect(pullGist(cfg, (async () => json({}, status)) as unknown as typeof fetch)).rejects.toThrow(text);
    }
  });
  it("reports network failures without leaking details", async () => {
    await expect(pullGist(cfg, (async () => { throw new TypeError("fetch failed"); }) as unknown as typeof fetch)).rejects.toThrow("Couldn't reach GitHub.");
  });
});

describe("pushGist / createGist", () => {
  it("PATCHes the configured file with the serialized state", async () => {
    const f = vi.fn(async () => json({}));
    const s = { ...emptyState(), updatedAt: "2026-10-03T00:00:00.000Z" };
    await pushGist(cfg, s, f as unknown as typeof fetch);
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.github.com/gists/abc123");
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body as string)).toEqual({ files: { "progress.json": { content: serialize(s) } } });
  });
  it("refuses to push without a gist id", async () => {
    await expect(pushGist({ ...cfg, gistId: null }, emptyState(), vi.fn() as unknown as typeof fetch)).rejects.toThrow("No gist configured");
  });
  it("creates a private gist and returns its id", async () => {
    const f = vi.fn(async () => json({ id: "new-id" }, 201));
    expect(await createGist({ ...cfg, gistId: null }, emptyState(), f as unknown as typeof fetch)).toBe("new-id");
    const body = JSON.parse((f.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body.public).toBe(false);
    expect(Object.keys(body.files)).toEqual(["progress.json"]);
  });
  it("fails clearly if GitHub returns no id", async () => {
    await expect(createGist(cfg, emptyState(), (async () => json({}, 201)) as unknown as typeof fetch)).rejects.toThrow("didn't return a gist id");
  });
});
