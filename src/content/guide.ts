// Roadmap-level guide content (intro, audience, how-to-use, shared shelf, continuing intro).
import type { Guide } from "./types";

export const guide: Guide = {
  intro:
    "Build something useful every week. Use the resources to unblock an implementation, explain a failure, or choose between alternatives. Progress is demonstrated by working software, measured results, and a short decision record.",
  audience:
    "Frontend/backend developers moving into AI engineering. Use your familiar application stack; use Python for the open-model and training labs. The scope is production AI applications plus practical model inference and adaptation. Training foundation models from scratch remains a later specialization.",
  howToUse: [
    {
      label: "Start with the weekly build",
      text:
        "Get the smallest end-to-end path running, then study the concepts needed to improve it. Read security and authorization guidance before exposing a feature or enabling side effects.",
    },
    {
      label: "Resource tiers",
      text:
        "Must read: a focused concept or section needed for the build. Reference: consult while implementing; no cover-to-cover assignment. Bonus: an optional deeper dive or alternative explanation. New resource suggestions are explicitly marked in resource tables.",
    },
    {
      label: "Budget",
      text:
        "Budget 10–14 hours/week, approximately 240–336 hours total. Aim for 2 hours of focused resources, 6–8 hours building, 1–2 hours evaluating/documenting, and 1–2 hours of buffer. Resource-table hours estimate selected reading/viewing only; exercises, setup, and experiments belong in build time. Spread longer resources across their listed weeks.",
    },
    {
      label: "Keep scope small",
      text:
        "Reuse the extractor, dataset, UI, and tooling across chapters. If behind, cut bonus work and UI polish first. Model labs and the capstone may use the full weekly budget; unfamiliar Python or infrastructure may require extending the calendar.",
    },
    {
      label: "Evidence",
      text:
        "Complete each week with evidence: a runnable demo, relevant automated checks, observed failures, and a short note on the decision made. From week 4 onward, record quality, latency, and cost with model/prompt/data versions. A disappointing experiment is useful evidence; an untested improvement is not completion.",
    },
    {
      label: "Model choice",
      text:
        "Use Claude as the default teaching stack, then compare alternatives. Week 5 requires another model family and week 6 an open model. Compare native behavior before introducing a provider abstraction. Check current API pricing, supported features, data handling, model licenses, and SDK versions rather than copying old defaults.",
    },
    {
      label: "Capstone scope",
      text:
        "Keep the capstone narrow. Identify a useful problem and prospective users by week 9, collect representative examples during later builds, and reuse whichever components earn their complexity. RAG, agents, MCP, and fine-tuning are choices, not a required stack.",
    },
  ],
  resourceAllowance:
    "Core resource allowance: approximately 25 hours of focused must-read material plus 19 hours of implementation references across 24 weeks. These estimates exclude builds and optional courses; use the weekly total budget above.",
  prerequisites:
    "Prerequisite checkpoint: be comfortable with HTTP, async code, tests, Git, and a small backend. By week 6, be able to load JSONL data in Python, inspect tensor shapes, and explain sampling, precision/recall, and train/validation/test splits. Learn these through the labs; allow extra preparation time if they are new. Set an API/compute spending cap before running experiments and use public, synthetic, or explicitly permitted data.",
  deployment:
    "Deploy only to an org-approved platform (Cloudflare or Google Cloud Platform); any other hosting provider needs the company's procurement and security approval first.",
  shelf: [
    {
      title: "AI Engineering — Chip Huyen",
      url: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/",
      kind: "Book",
      note:
        "Optional book-length companion. Foundations, prompting, agents, and evaluation chapters can replace overlapping explanations rather than adding another full reading track.",
    },
    {
      title: "Claude Cookbooks",
      url: "https://github.com/anthropics/claude-cookbooks",
      kind: "Code",
      note: "Implementation examples to adapt and test against current APIs; avoid copying unused infrastructure.",
    },
    {
      title: "Anthropic courses repo",
      url: "https://github.com/anthropics/courses",
      kind: "Course",
      note: "Optional notebook alternatives when a guided exercise helps.",
    },
    {
      title: "Anthropic engineering blog",
      url: "https://www.anthropic.com/engineering",
      kind: "Article",
      note: "Choose a case study only when it answers a concrete design question; record which conditions differ from your project.",
    },
  ],
  continuingIntro:
    "Choose one specialization or one recurring source at a time. Product work and regression evaluations take priority over keeping up with every release.",
};
