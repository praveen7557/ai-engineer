// One-time setup checklist, adapted from the roadmap's SETUP list.
import type { SetupItem } from "./types";

export const setupItems: SetupItem[] = [
  {
    id: "setup.api-account",
    title: "Personal API account with a monthly spend limit",
    note: "Total API spend depends on model tier, token volume, and whether you run evaluations and fine-tuning — treat any total as a rough estimate, not a fact. Set a hard limit anyway.",
  },
  {
    id: "setup.runtime",
    title: "Node 20+ and/or Python 3.11+",
    note: "The application builds can use your usual stack (TypeScript/Node or Python); the open-model lab (week 6) and the adaptation lab (week 18) need Python 3.11+.",
  },
  {
    id: "setup.docker",
    title: "Docker Desktop",
    note: "For Postgres + pgvector and Langfuse.",
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
