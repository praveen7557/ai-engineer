// One-time setup checklist, adapted from the roadmap's SETUP list.
import type { SetupItem } from "./types";

export const setupItems: SetupItem[] = [
  {
    id: "setup.api-account",
    title: "Personal API account with a monthly spend limit",
    note: "Total API spend for this roadmap is typically tens of dollars. Set a hard limit anyway.",
  },
  {
    id: "setup.runtime",
    title: "Node 20+ and/or Python 3.11+",
    note: "Use whichever matches your stack; every project works in either.",
  },
  {
    id: "setup.docker",
    title: "Docker Desktop",
    note: "For Postgres + pgvector, Langfuse, and the Temporal dev server.",
  },
  {
    id: "setup.git-repo",
    title: "One git repo: ai-engineering-journey",
    note: "A folder per project; commit notes and eval results alongside the code.",
  },
  {
    id: "setup.learning-log",
    title: "A learning log",
    note: "A LOG.md in the repo: what you tried, what broke, what you measured.",
  },
];
