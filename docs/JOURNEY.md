# The AI Engineer: Project Journey & Learnings

A reference for future conversations: what this project is, how it got here, the decisions behind it, and what to keep in mind when changing it.

_Last updated: 2026-09-26 · repo: `praveen7557/ai-engineer` · local: `~/the-ai-engineer`_

---

## 1. What this is

A personal, no-backend web app that tracks a **24-week, build-first journey from frontend/backend developer to AI engineer**.

- **Source of truth for the curriculum:** `RESOURCES.md`, the human-readable roadmap. It's mirrored by typed content in `src/content/ch*.ts`, which is what the app renders.
- **Theme:** a dark, cinematic "progression" world with an original companion, **Nox**. No franchise references.
- **Priorities, in order:** build → measure → decide. Gamification (XP, ranks, Nox) is a layer on top and must never hide what to learn, why, what to build, or how to prove it.

### Current curriculum (8 chapters · 24 weeks)

| Ch | Weeks | Title | Missions |
|---|---|---|---|
| 1 | 1–3 | LLM Foundations | #1 Prompt Lab CLI |
| 2 | 4–6 | Working With Models | #2 Measured Structured Extractor · #3 Open-Model Lab |
| 3 | 7–9 | Building AI & Multimodal Applications | #4 Streaming Assistant · #5 Document & Image Extraction · #6 Restricted Pilot |
| 4 | 10–12 | RAG & Knowledge Systems | #7 Measured Retrieval Pipeline |
| 5 | 13–15 | Agents & Autonomous Workflows | #8 Workflow vs Hand-Built Agent · #9 Bounded Tools & Recovery · #10 Improve the Weakest Behavior |
| 6 | 16–17 | MCP & Tool Integration | #11 Local MCP Server · #12 Authenticated Remote MCP |
| 7 | 18–21 | Model Adaptation, Evaluation & Production | #13 Small Adaptation Experiment · #14 Eval CI Gate · #15 Load & Recovery Drill · #16 Security & Release Rehearsal |
| 8 | 22–24 | Capstone & Deployment | #17 The Final Build |

Totals:

| Item | Count |
|---|---|
| Concepts | 112 (2 optional) |
| Resources | 82 (21 must-read · 29 reference · 32 bonus) |
| Missions / milestones | 17 / 105 (3 conditional) |
| Trial criteria | 40 |

Every week has a **build** (deliverable + evidence), 3–5 concepts linked to the resources that teach them, and scheduled milestones. Every chapter has "Done when", an "Engineering decision", and a Trial.

---

## 2. How it evolved

| Step | What happened | Why |
|---|---|---|
| 1 | A text roadmap in chat | A first answer to "how do I stay future-proof as an FE/BE dev?" |
| 2 | Interactive tracker as a claude.ai artifact | Wanted to track progress per phase and keep every resource in one place |
| 3 | Plain static HTML/CSS/JS + `progress.json` | Wanted a site usable anywhere, not an artifact |
| 4 | Comic/superhero reskin (Bangers font, POW pops) | "Make it fun" |
| 5 | **Full rebuild in React + Vite + TS** (`~/the-ai-engineer`) | A detailed product brief: cinematic progression theme, Nox, ranks, missions, trials, journal, end state, Continuing |
| 6 | Pushed to GitHub | Wanted access anywhere and version history |
| 7 | Optional **GitHub Gist sync** via env vars | Progress needed to follow the learner across browsers and machines |
| 8 | Content rebuilt from a reviewed, **build-first `RESOURCES.md`** | A review (with another bot) produced a better curriculum: weekly builds, a Reference tier, 2–4-week chapters, open-model and fine-tuning labs |
| 9 | Concept → resource links, "how to use this week", "I can explain this" | "How do I know concepts before reading them?" Clarified that ticking means understanding |
| 10 | **Review fixes (P1–P5)** | A structured review: functional bugs, honest completion rules, data handling, build-first usability, content corrections |
| 11 | **Course Path page** (`#/courses`, `src/content/coursePath.ts`) | A researched, course-led roadmap (8 phases, ~285 h) within a $1,000 yearly budget. Read-only: it adds no progress IDs or XP |

The old static site lives at `~/ai-engineer-roadmap` and is no longer the focus.

---

## 3. Architecture

```
src/content/    typed curriculum (ch1–ch8), guide, continuing sources/tracks, setup, migrations.ts; types.ts is the contract
src/engine/     pure logic (no React):
                  state.ts     ProgressState v3, normalize(), ID migrations, sameProgress/isEmptyProgress
                  progress.ts  XP, ranks, Nox stages/mood/bond, pace, next steps, achievements, week budget, status labels
                  sync.ts      decideSync(local, remote, lastSyncedAt) → noop | push | pull | conflict
                  storage.ts   localStorage, linked file (File System Access), export/import, snapshots, per-browser gist flags
                  gist.ts      GitHub Gist client (pull/push/create) with readable errors
src/store.tsx   React context: actions, persistence, gist sync orchestration, feedback events (XP pops, rank-ups)
src/ui/         Shell (rail, header, mobile nav + More menu, overlay clearance), Nox (SVG), Feed, Search, CheckRow
src/pages/      HQ, ChapterPage, Journal, CoursePath, Other (Roadmap, Companion, Record, Continuing, Progress file)
```

- **Stack:** React 19, Vite 8, TypeScript 6, framer-motion. Tests use vitest, plus jsdom for the DOM tests.
- **Fonts:** Cormorant Garamond (display), Geist and Geist Mono (UI and numbers).
- **Run:** `npm run dev` (5173). Build: `npm run build`.
- **Tests:** `npm test`, currently 128 tests across 9 files (content, course path, state, progress, rules, sync, gist, DOM).
- **Tooling quirk:** an RTK proxy hook can break `npx vitest`/`npx tsc` output. Use `./node_modules/.bin/vitest` and `./node_modules/.bin/tsc -b` directly.

---

## 4. Key rules & decisions (keep these stable)

### IDs
- IDs are explicit, stable strings. Progress is keyed by them.

  | Item | Pattern |
  |---|---|
  | Concept | `chN.c.slug` |
  | Resource | `chN.r.slug` |
  | Mission | `chN.mK` (K restarts per chapter) |
  | Milestone | `chN.mK.sN` |
  | Stretch goal | `chN.mK.xN` |
  | Trial criterion | `chN.t.slug` |
  | Setup item | `setup.slug` |

- **Never rename or reuse an ID.** If an item is split, retired or promoted, add an entry to `src/content/migrations.ts` (old id → successor ids). `normalize()` applies it on every load, and tests check every target exists.
- A past mistake to avoid repeating: a helper agent reused `ch6.m2.x1` for a new meaning. It was fixed with a new ID plus a migration.

### Completion
- **Week complete** (+100 XP) = the week's build milestones plus its required concepts are resolved. It's no longer concepts-only.
- **Conditional milestones** (`Milestone.conditional`) can be *Completed* or *Not applicable with a reason*. Both count and earn the same XP. They're used for the Ch2 prompt chain, the Ch5 context work and the Ch7 LLM judge.
- **Optional concepts** (`Concept.optional`) and **stretch goals** are never required. The Ch5 SDK and subagent concepts are optional.
- **Tiers:** must-read resources count toward progress; reference and bonus earn XP only.
- **Next step** is build-first: the next unresolved milestone, then must-reads, then concepts.
- **Ranks** (Developer → Master Engineer), **Nox stages** (Awakened → Guardian) and **achievements** are learning-progress markers, not credentials. The "Show Your Work" achievement requires a finished major mission plus a written reflection.
- **Continuing:** the sources are always open; the *log* unlocks at the end state (all 24 weeks complete plus the capstone mission).

### XP values
| Item | XP |
|---|---|
| Concept | 20 |
| Must-read | 15 |
| Reference | 10 |
| Bonus | 5 |
| Milestone | 100 |
| Stretch | 50 |
| Trial criterion | 50 |
| Major mission complete | +250 |
| Minor mission complete | +100 |
| Week complete | +100 |
| Trial passed | +500 |

Rank and stage thresholds are fractions of the maximum core XP, so they adjust automatically when content changes.

### Time estimates
- **Milestone minutes** are focused implementation slices.
- **Mission hours** are total project work: implementation, debugging, evaluation and write-up, at roughly 6–8 hours per week spanned.
- **Reading hours** are separate; concept study overlaps reading, so it isn't added on top.
- **Weekly budget:** 10–14 h. Each week panel shows its build share, milestone time and reading time.

---

## 5. Data, sync & security (what's true; verify before claiming more)

- **Always:** browser localStorage (`the-ai-engineer/progress`). **Optional:** a linked `progress.json` (Chrome/Edge), export/import, or Gist sync.
- **Gist sync** is configured with `VITE_GITHUB_TOKEN` (classic token, `gist` scope only), `VITE_GIST_ID` and an optional `VITE_GIST_FILENAME` in a gitignored `.env.local`.
  - **What syncs:** the whole progress file, including journal text.
  - **Conflict safety:**
    - Each browser stores the last agreed version (`gist-last-synced/<id>`).
    - If only one side changed, it's fast-forwarded to the other.
    - If both changed, or on the first sync with differing data, sync stops and the learner chooses.
    - A **snapshot** (last 5, in localStorage) is saved before local progress is ever replaced: Gist pull, conflict choice, linking a file, import, reset, restore.
  - **Disconnect** is per browser (`gist-paused` flag). Local progress and the Gist are untouched.
- **Privacy facts:**
  - A "secret" Gist is unlisted, **not access-controlled**: anyone with the URL can read it.
  - `VITE_*` values are **inlined into the built JavaScript**, so a token in any hosted or public build is public. If that ever happened: revoke the token and rebuild without it.
  - A safer future option is per-browser runtime token entry (not built yet).
- **`VITE_GIST_ID` is the bare ID** (e.g. `a9b9…`), not `user/id`. A `user/` prefix causes "Gist not found".
- **Deployment constraint** (explicit project policy, also in `RESOURCES.md` and the chapter notes):
  - Deploy only to an org-approved platform (Cloudflare or Google Cloud Platform).
  - Anything else needs procurement and security approval first.
  - Don't invent other policies.

---

## 6. Learnings

**Product**
- Build-first beats read-first. A week needs a concrete deliverable and evidence to keep; concepts serve the build.
- Honest completion matters. "Not applicable with a reason" rewards good engineering judgment instead of penalizing a simpler solution.
- A checkbox needs a clear meaning. "I can explain this" is clearer than a bare tick for concepts.
- The home screen should answer "what do I do next?" first; analytics come second.
- Time numbers must say what they measure (slices vs project work vs reading), or they look contradictory.

**Engineering**
- Stable IDs plus a migration map make curriculum edits safe for saved progress.
- Last-write-wins sync silently destroys work. Use a last-agreed marker, fast-forward one-sided changes, ask on conflicts, and snapshot before replacing.
- The same item rendered twice needs per-instance DOM IDs (`useId`) while sharing state. SVG gradient IDs need the same care.
- Deep links need care with scroll-to-top-on-navigation, which cancels scroll-into-view. Smooth scrolling doesn't run in hidden tabs; respect reduced motion.
- Handle third-party overlays generically: lift the mobile nav when an element outside the app covers it, rather than relying on vendor-specific settings.
- Type-level contracts (`types.ts`) let content be written in parallel by several helpers; validation tests (`content.test.ts`, `rules.test.ts`) catch drift.

**Process**
- Test UI changes on an **isolated origin** (separate port, fake env values) so real progress and the real Gist are never touched. Mock GitHub in tests.
- Keep `RESOURCES.md` and the rendered content consistent in the same change.
- Verify review claims before fixing them. Separate confirmed bugs from editorial improvements.
- Repo conventions:
  - single-line commit messages, no co-author lines, atomic commits
  - PRs as drafts
  - ask about `/review` before raising a PR
  - pre-push check that new source files have tests

---

## 7. Known limitations & open ideas

- **Not verified:** against the real hosting badge (only simulated), a real Gist with a real token, Safari/Firefox, real touch devices, or a screen reader.
- **Hand-verified only:** the linked-file flow needs a native picker, so it has no automated test.
- **Lint:** 0 errors; a handful of React fast-refresh and effect-pattern warnings remain.
- **Possible next steps:**
  - per-browser runtime Gist token (keeps tokens out of builds)
  - accept `user/id` or full Gist URLs in `VITE_GIST_ID`
  - field-level merge for sync conflicts (today it's a whole-version choice)
  - code-split the bundle (~550 KB unminified)

---

## 8. Resuming work: quick checklist

1. `cd ~/the-ai-engineer && git pull && npm install`
2. Read this file, `README.md`, and `RESOURCES.md` (the curriculum source of truth).
3. After changes run: `./node_modules/.bin/vitest run`, `./node_modules/.bin/tsc -b`, `./node_modules/.bin/oxlint`, `npm run build`.
4. Content changes: never change IDs, add migrations when splitting or retiring items, and mirror requirement changes in `RESOURCES.md`.
5. UI changes: test on an isolated port with fake `VITE_*` values; check 390px mobile, keyboard use and accessible names.
