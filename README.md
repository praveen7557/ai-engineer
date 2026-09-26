# The AI Engineer

A personal 24-week progression system for going from frontend/backend developer to an engineer who builds real AI products. There are eight chapters, each with training, intel (resources), hands-on missions and a trial. The app also has XP and ranks, a companion named Nox, and a journal.

No backend and no account: everything stays on your machine.

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

When the browser copy and the file disagree, the copy with the newer `updatedAt` wins.

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

How syncing works:

- The app pulls the gist on load, and again when you return to the tab (at most every 30 s).
- It pushes about 2 s after each change.
- Before pushing, it checks the gist. The newer save wins; there's no merge. Use one machine at a time and let it sync before switching.

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
  "version": 2,
  "updatedAt": "2026-10-01T09:30:00.000Z",
  "startDate": "2026-10-01",
  "done": { "ch4.c.hybrid-search": "2026-11-20T18:02:11.000Z" },
  "journal": { "w11": { "text": "…", "updatedAt": "…" }, "ch4.m8": { "text": "mission reflection", "updatedAt": "…" } },
  "journalDays": ["2026-11-20"],
  "continuing": [],
  "seen": { "rank": 0, "stage": 0, "achievements": [] }
}
```

IDs are stable and defined in `src/content/ch*.ts`:

| Item | ID pattern | Example |
|---|---|---|
| Concept | `chN.c.slug` | `ch4.c.hybrid-search` |
| Resource | `chN.r.slug` | — |
| Mission | `chN.mK` | — |
| Milestone | `chN.mK.sK` | — |
| Stretch goal | `chN.mK.xK` | — |
| Trial criterion | `chN.t.slug` | — |
| Setup item | `setup.slug` | — |

## Structure

```
src/content/    8 chapters (typed content), continuing sources, setup; types.ts is the contract
src/engine/     pure logic: state + normalize, XP/ranks/companion/pace/achievements, storage
src/store.tsx   React state, persistence, progress events (pops, rank-ups, achievements)
src/ui/         shell, Nox, atmosphere, feedback, search, shared bits
src/pages/      HQ, chapter, journal, roadmap, companion, record, continuing, progress file
```

## Tests

```bash
npm test
```
