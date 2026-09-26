// Ongoing sources and reflection prompts for staying current after the 24-week roadmap.
import type { ContinuingSource, ContinuingTrack } from "./types";

export const continuingSources: ContinuingSource[] = [
  {
    title: "Anthropic engineering blog",
    url: "https://www.anthropic.com/engineering",
    kind: "Article",
    note: "Agent, tooling and eval practices from the people building the models.",
    category: "Practice",
  },
  {
    title: "Claude release notes",
    url: "https://platform.claude.com/docs/en/release-notes/overview",
    kind: "Docs",
    note: "New features and models; your trigger to rerun your evals.",
    category: "Releases",
  },
  {
    title: "Simon Willison's weblog",
    url: "https://simonwillison.net",
    kind: "Article",
    note: "The best single feed for practical LLM news and security.",
    category: "Community",
  },
  {
    title: "Prompt injection archive — Simon Willison",
    url: "https://simonwillison.net/tags/prompt-injection/",
    kind: "Article",
    note: "Real incidents and patterns as they happen; skim the most recent posts.",
    category: "Community",
  },
  {
    title: "Latent Space (podcast + newsletter)",
    url: "https://www.latent.space",
    kind: "Article",
    note: "The AI-engineer community's publication.",
    category: "Community",
  },
  {
    title: "Chip Huyen's blog",
    url: "https://huyenchip.com/blog/",
    kind: "Article",
    note: "Long-form, rigorous AI engineering essays.",
    category: "Research",
  },
  {
    title: "LMArena (arena.ai)",
    url: "https://arena.ai",
    kind: "Tool",
    note: "Crowd-sourced model rankings; one signal among many.",
    category: "Research",
  },
  {
    title: "Artificial Analysis",
    url: "https://artificialanalysis.ai",
    kind: "Tool",
    note: "Independent model benchmarks for quality, speed and price.",
    category: "Research",
  },
  {
    title: "Claude Cookbooks",
    url: "https://github.com/anthropics/claude-cookbooks",
    kind: "Code",
    note: "Browse for new recipes as the API evolves.",
    category: "Practice",
  },
  {
    title: "Choosing the right model — Claude Docs",
    url: "https://platform.claude.com/docs/en/about-claude/models/choosing-a-model",
    kind: "Docs",
    note: "Your framework for re-evaluating tiers whenever a new model ships.",
    category: "Releases",
  },
  {
    title: "Neural Networks: Zero to Hero — Andrej Karpathy",
    url: "https://karpathy.ai/zero-to-hero.html",
    kind: "Course",
    note: "Deep dive: build backprop, then a GPT, from scratch in Python.",
    category: "Deep dives",
  },
  {
    title: "Build a Large Language Model (From Scratch) — Sebastian Raschka",
    url: "https://www.manning.com/books/build-a-large-language-model-from-scratch",
    kind: "Book",
    note: "Deep dive: a book-length companion to Zero to Hero, including fine-tuning.",
    category: "Deep dives",
  },
  {
    title: "Hugging Face LLM Course",
    url: "https://huggingface.co/learn/llm-course",
    kind: "Course",
    note: "Complete the remaining course after the selected inference and adaptation labs; expand data curation and model training depth.",
    category: "Deep dives",
  },
  {
    title: "Practical Deep Learning for Coders — fast.ai",
    url: "https://course.fast.ai",
    kind: "Course",
    note: "Deep dive: top-down, code-first deep learning.",
    category: "Deep dives",
  },
];

/** Specialization tracks to pursue after week 24, built only from sources already used elsewhere in the roadmap. */
export const continuingTracks: ContinuingTrack[] = [
  {
    name: "Model internals & training",
    summary:
      "For engineers who want to go under the prompting/adaptation layer and understand how the models themselves are built and trained.",
    items: [
      {
        title: "Neural Networks: Zero to Hero — Andrej Karpathy",
        url: "https://karpathy.ai/zero-to-hero.html",
        kind: "Course",
        note: "Build backprop, then a GPT, from scratch in Python.",
      },
      {
        title: "Build a Large Language Model (From Scratch) — Sebastian Raschka",
        url: "https://www.manning.com/books/build-a-large-language-model-from-scratch",
        kind: "Book",
        note: "A book-length companion to Zero to Hero, including fine-tuning.",
      },
      {
        title: "Hugging Face LLM Course",
        url: "https://huggingface.co/learn/llm-course",
        kind: "Course",
        note: "Complete the remaining sections beyond the week-18 adaptation lab; expand data curation and training depth.",
      },
      {
        title: "Practical Deep Learning for Coders — fast.ai",
        url: "https://course.fast.ai",
        kind: "Course",
        note: "Top-down, code-first deep learning.",
      },
    ],
  },
  {
    name: "Evaluation & reliability",
    summary:
      "For engineers who want their eval suite and judge calibration to be as rigorous as the systems they're grading.",
    items: [
      {
        title: "Using LLM-as-a-Judge — Hamel Husain",
        url: "https://hamel.dev/blog/posts/llm-judge/",
        kind: "Article",
        note: "Calibrate a judge against human labels and inspect disagreements.",
      },
      {
        title: "LLM Evals FAQ — Hamel Husain & Shreya Shankar",
        url: "https://hamel.dev/blog/posts/evals-faq/",
        kind: "Article",
        note: "Deepen datasets, graders, and release-decision practice beyond the week-19 build.",
      },
      {
        title: "Promptfoo docs",
        url: "https://www.promptfoo.dev/docs/intro/",
        kind: "Tool",
        note: "Explore more of the eval-in-CI tooling beyond what week 19 required.",
      },
      {
        title: "Patterns for Building LLM-based Systems — Eugene Yan",
        url: "https://eugeneyan.com/writing/llm-patterns/",
        kind: "Article",
        note: "Compare system patterns against the bottlenecks and failures you measured in your own builds.",
      },
    ],
  },
  {
    name: "Security",
    summary:
      "For engineers whose next step is treating LLM-application security as a first-class, continuously retested discipline.",
    items: [
      {
        title: "OWASP Top 10 for LLM Applications",
        url: "https://genai.owasp.org/llm-top-10/",
        kind: "Spec",
        note: "Re-run the full checklist against a new release or a new feature, not just the entries covered in week 21.",
      },
      {
        title: "The lethal trifecta for AI agents — Simon Willison",
        url: "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/",
        kind: "Article",
        note: "Re-check every agent or MCP integration you add against private data, untrusted input, and exfiltration paths.",
      },
      {
        title: "Prompt injection archive — Simon Willison",
        url: "https://simonwillison.net/tags/prompt-injection/",
        kind: "Article",
        note: "Real incidents and patterns as they happen; skim the most recent posts.",
      },
    ],
  },
  {
    name: "Agents & tools",
    summary:
      "For engineers going deeper on agent design, context management, and exposing tools safely beyond the Chapter 05–06 builds.",
    items: [
      {
        title: "Building Effective Agents — Anthropic",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
        kind: "Article",
        note: "Revisit workflow-versus-agent patterns as you design new systems.",
      },
      {
        title: "Effective context engineering for AI agents — Anthropic",
        url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
        kind: "Article",
        note: "Apply retrieval, compaction, and memory choices to a new agent, not just the one from week 15.",
      },
      {
        title: "MCP Specification",
        url: "https://modelcontextprotocol.io/specification",
        kind: "Spec",
        note: "Track spec revisions as they ship; re-check authorization and permission guidance against your servers.",
      },
    ],
  },
  {
    name: "Staying current",
    summary:
      "For engineers who want a lightweight, recurring habit of tracking the field instead of a one-time deep dive.",
    items: [
      {
        title: "Claude release notes",
        url: "https://platform.claude.com/docs/en/release-notes/overview",
        kind: "Docs",
        note: "New features and models; your trigger to rerun your evals.",
      },
      {
        title: "Simon Willison's weblog",
        url: "https://simonwillison.net",
        kind: "Article",
        note: "The best single feed for practical LLM news and security.",
      },
      {
        title: "Latent Space (podcast + newsletter)",
        url: "https://www.latent.space",
        kind: "Article",
        note: "The AI-engineer community's publication.",
      },
      {
        title: "Artificial Analysis",
        url: "https://artificialanalysis.ai",
        kind: "Tool",
        note: "Independent model benchmarks for quality, speed and price.",
      },
    ],
  },
];

export const continuingPrompts: string[] = [
  "A new model release: what changed on your evals?",
  "A new MCP server you built or found this month: what does it expose?",
  "A production incident or near-miss: what was the root cause, and what check would catch it next time?",
  "A cost or latency number that surprised you: what changed, and why?",
  "A pattern you read about (Anthropic, Simon Willison, Latent Space): did you try it, and what happened?",
  "A prompt injection or security near-miss: where was it, and how did you close it?",
  "One small build this month: what did you ship, and what did it teach you?",
];
