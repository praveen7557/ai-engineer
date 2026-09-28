# The AI Engineer

A self-paced 24-week progression system for developers going from frontend/backend work to an engineer who builds real AI products. There are eight chapters, each with training, intel (resources), hands-on missions and a trial. The app also has XP and ranks, a companion named Nox, and a journal.

No backend and no account. Progress lives in your browser's local storage, and optionally in a progress.json you link or export. It only leaves your machine if you configure GitHub Gist sync (see below).

## Run

```bash
npm install
npm run dev        # http://localhost:5173
```

Or build a static copy and serve the `dist/` folder with any static server:

```bash
npm run build
npm run preview
```

## Progress & your data

- **Browser:** progress saves to localStorage automatically.
- **progress.json on disk (Chrome/Edge):** go to *Progress file* → *Link existing progress.json* or *Create new file*. Every change is then written to that file. The browser may ask you to *Reconnect* once per visit.
- **Export / Import:** works in any browser.

When the browser copy and a linked file disagree, the copy with the newer `updatedAt` wins. Before local progress is replaced (loading a linked file, import, reset, restore, or a gist pull), a **snapshot** is saved in this browser; *Progress file → Snapshots* keeps the last five and can restore any of them.

### Sync across machines with a private GitHub Gist (optional)

1. Create a classic personal access token with **only** the `gist` scope: <https://github.com/settings/tokens/new?scopes=gist&description=The%20AI%20Engineer>
2. `cp .env.example .env.local` and set `VITE_GITHUB_TOKEN`.
3. Restart `npm run dev`, then open **Progress file** → **Create private gist**. Copy the id it shows into `.env.local` as `VITE_GIST_ID`. You can also set `VITE_GIST_ID` to a gist you already own.
4. On every other machine, clone the repo and use the same `.env.local`.

| Variable | Required | Meaning |
|---|---|---|
| `VITE_GITHUB_TOKEN` | yes | Token with the `gist` scope. Sync is off when it's empty. |
| `VITE_GIST_ID` | after setup | The gist to sync with. |
| `VITE_GIST_FILENAME` | no | File inside the gist. Defaults to `progress.json`. |

What syncs: the whole progress file: completed items with timestamps, not-applicable reasons, journal text and evidence links, the Continuing log and the start date.

How syncing works:

- The app pulls the gist on load, and again when you return to the tab (at most every 30 s). It pushes about 2 s after each change.
- Each browser remembers the version it last agreed on with the gist. If only one side changed since then, that side is copied to the other.
- If both changed, or on the first sync when both hold different progress, **sync stops and asks** which version to keep. The other version is saved as a snapshot either way. There's no field-level merge.
- *Disconnect sync in this browser* stops all sync traffic without touching local progress or the gist.

> **Privacy:** `createGist` makes a *secret* gist. Secret gists are unlisted, not access-controlled: anyone with the URL can read them.

> **Security:** Vite inlines `VITE_*` values into the JavaScript it serves, so anyone who can load the app can read the token.
> - Run the app locally.
> - Never publish a `dist/` build made with a token.
> - Keep the token scoped to `gist` only.
>
> `.env.local` is gitignored.

### progress.json

```json
{
  "app": "the-ai-engineer",
  "version": 3,
  "updatedAt": "2026-10-01T09:30:00.000Z",
  "startDate": "2026-10-01",
  "done": { "ch4.c.hybrid-rrf": "2026-11-20T18:02:11.000Z" },
  "na": { "ch2.m1.s7": { "reason": "Single call met the bar: 94% field accuracy", "at": "…" } },
  "journal": { "w11": { "text": "…", "updatedAt": "…", "links": { "repo": "https://…" } }, "ch4.m1": { "text": "mission reflection", "updatedAt": "…" } },
  "journalDays": ["2026-11-20"],
  "continuing": [],
  "seen": { "rank": 0, "stage": 0, "achievements": [] }
}
```

IDs are stable and defined in `src/content/ch*.ts`:

| Item | ID pattern | Example |
|---|---|---|
| Concept | `chN.c.slug` | `ch4.c.hybrid-rrf` |
| Resource | `chN.r.slug` | — |
| Mission | `chN.mK` | — |
| Milestone | `chN.mK.sK` | — |
| Stretch goal | `chN.mK.xK` | — |
| Trial criterion | `chN.t.slug` | — |
| Setup item | `setup.slug` | — |

### Completion rules

- **Week complete** (+100 XP) = the week's build milestones and its required concepts are all resolved. Concepts alone no longer complete a week.
- **Conditional milestones** (e.g. the chapter 2 prompt chain, chapter 5 context work, chapter 7 LLM judge) can be *Completed* or marked *Not applicable* with a written reason. Both count as resolved and earn the same XP.
- **Optional concepts** (e.g. SDKs, subagents) and **stretch goals** are tracked and rewarded but never required.
- **Show Your Work** (achievement) = a finished major mission plus a written reflection.

### Migrations

`src/content/migrations.ts` maps retired or split item ids to their successors; `normalize()` applies it on every load, so older progress files keep their credit. Version 3 (this release) added `na` and journal `links`, split chapter 4's week-12 milestone into five outcomes, and credited two stretch goals that became required work. Week-complete bonuses are now computed from the new rule, so a v2 file whose weeks were complete by concepts alone shows less bonus XP; the completed items themselves are all kept.

## Structure

```
src/content/    8 chapters (typed content), course path, continuing sources, setup; types.ts is the contract
src/engine/     pure logic: state + normalize + migrations, XP/ranks/companion/pace/achievements, sync decisions, storage + snapshots
src/store.tsx   React state, persistence, progress events (pops, rank-ups, achievements)
src/ui/         shell, Nox, atmosphere, feedback, search, shared bits
src/pages/      HQ, chapter, journal, roadmap, course path, companion, record, continuing, progress file
```

## Tests

```bash
npm test
```
