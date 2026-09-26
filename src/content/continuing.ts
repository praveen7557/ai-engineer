// Ongoing sources and reflection prompts for staying current after the 24-week roadmap.
import type { ContinuingSource } from "./types";

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

export const continuingPrompts: string[] = [
  "A new model release: what changed on your evals?",
  "A new MCP server you built or found this month: what does it expose?",
  "A production incident or near-miss: what was the root cause, and what check would catch it next time?",
  "A cost or latency number that surprised you: what changed, and why?",
  "A pattern you read about (Anthropic, Simon Willison, Latent Space): did you try it, and what happened?",
  "A prompt injection or security near-miss: where was it, and how did you close it?",
  "One small build this month: what did you ship, and what did it teach you?",
];
