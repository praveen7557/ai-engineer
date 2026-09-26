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
