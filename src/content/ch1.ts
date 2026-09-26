// Chapter 1 — LLM Foundations (weeks 1–3)
import type { Chapter } from "./types";

export const ch1: Chapter = {
  id: "ch1",
  number: 1,
  title: "LLM Foundations",
  tagline: "Build the mental model everything else stands on.",
  description:
    "Three weeks on how large language models actually work, what tokens and context really cost, and how to make your first real API calls with keys handled safely.",
  why:
    "Every later decision — cost, latency, chunk size, agent design — comes down to tokens, context and sampling. Skip this and you debug by guesswork for the rest of the roadmap.",
  weeks: [
    {
      number: 1,
      title: "How LLMs actually work",
      focus: "A working mental model of prediction, training and failure modes, without the math.",
      groups: [
        {
          title: "Prediction & training",
          concepts: [
            {
              id: "ch1.c.next-token-prediction",
              title: "Next-token prediction",
              summary:
                "A model is trained to predict the next token given everything before it; every capability it has emerges from that one objective repeated at scale.",
              minutes: 30,
            },
            {
              id: "ch1.c.pretraining-posttraining",
              title: "Pre-training vs post-training",
              summary:
                "Pre-training builds a raw text predictor from huge unlabeled corpora; instruction tuning and RLHF/RLAIF on top of that turn it into a model that follows instructions and holds a conversation.",
              minutes: 30,
            },
            {
              id: "ch1.c.attention-intuition",
              title: "Attention, intuitively",
              summary:
                "Attention lets each token look at every other token and weigh how relevant it is, which is how a model tracks pronouns, code structure and long-range dependencies without a fixed window.",
              minutes: 40,
            },
          ],
        },
        {
          title: "Failure modes",
          concepts: [
            {
              id: "ch1.c.hallucination",
              title: "Why hallucinations happen",
              summary:
                "The model is predicting plausible text, not looking up facts, so a confident wrong answer costs it nothing during training; grounding, citations and letting it say \"I don't know\" are the practical mitigations.",
              minutes: 25,
            },
            {
              id: "ch1.c.model-tiers-intro",
              title: "Model tiers, first pass",
              summary:
                "Opus, Sonnet and Haiku trade quality against latency and cost; the engineering skill is picking the smallest tier that still passes your checks, not defaulting to the biggest model.",
              minutes: 20,
            },
          ],
        },
      ],
    },
    {
      number: 2,
      title: "Tokens, context & sampling",
      focus: "What actually gets billed and how outputs vary run to run.",
      groups: [
        {
          title: "Tokens & context",
          concepts: [
            {
              id: "ch1.c.tokenization",
              title: "Tokens & tokenization",
              summary:
                "Text is split into sub-word tokens before the model ever sees it, which is why it can miscount letters in a word and why input and output tokens are billed separately at different rates.",
              minutes: 30,
            },
            {
              id: "ch1.c.context-window",
              title: "Context window economics",
              summary:
                "Everything you send costs money and attention: cost scales with context size, and content in the middle of a very long prompt tends to get less effective attention than content at the edges.",
              minutes: 30,
            },
            {
              id: "ch1.c.conversation-state",
              title: "Conversation state is yours",
              summary:
                "The API itself holds no memory between calls, so your application owns the history: what to resend, what to trim, and when to summarize as a conversation grows.",
              minutes: 25,
            },
          ],
        },
        {
          title: "Sampling",
          concepts: [
            {
              id: "ch1.c.sampling-temperature",
              title: "Sampling: temperature & top_p",
              summary:
                "Temperature and top_p control how much randomness enters token selection; lower them for extraction and classification, raise them for brainstorming and creative variation.",
              minutes: 30,
            },
            {
              id: "ch1.c.sampling-variance",
              title: "Run-to-run variance",
              summary:
                "The same prompt at the same temperature can still produce different outputs on different calls, so any claim about \"the\" output should really be a claim about a distribution of outputs.",
              minutes: 25,
            },
          ],
        },
      ],
    },
    {
      number: 3,
      title: "The model landscape",
      focus: "Tiers, thinking modes, multimodal input, cost math and your first API call.",
      groups: [
        {
          title: "Choosing a model",
          concepts: [
            {
              id: "ch1.c.model-tiers",
              title: "Model tiers in depth",
              summary:
                "Opus is for the hardest reasoning and highest stakes, Sonnet is the default workhorse, and Haiku is for high-volume, latency-sensitive tasks; most products use more than one tier.",
              minutes: 25,
            },
            {
              id: "ch1.c.extended-thinking",
              title: "Extended thinking",
              summary:
                "Extended or adaptive thinking lets a model spend extra reasoning tokens before answering, which pays off on multi-step logic and planning but only adds latency and cost on simple tasks.",
              minutes: 25,
            },
            {
              id: "ch1.c.multimodal-inputs",
              title: "Multimodal inputs",
              summary:
                "Images and PDFs can be sent as input alongside text, which is useful for document understanding and UI screenshots but adds meaningfully to token cost.",
              minutes: 20,
            },
          ],
        },
        {
          title: "Cost, embeddings & the API",
          concepts: [
            {
              id: "ch1.c.cost-estimation",
              title: "Pricing & cost estimation",
              summary:
                "A feature's monthly cost is estimated as requests per day times average tokens per request times the per-token price for that model, done before you build anything.",
              minutes: 35,
            },
            {
              id: "ch1.c.embeddings-primer",
              title: "Embeddings primer",
              summary:
                "An embedding turns text into a vector such that similar meanings land near each other in that vector space, which is the foundation for later semantic search work.",
              minutes: 25,
            },
            {
              id: "ch1.c.key-hygiene",
              title: "Key hygiene",
              summary:
                "API keys stay server-side and never ship inside a frontend bundle; set a hard spend limit on any personal account before you start making real calls.",
              minutes: 15,
            },
            {
              id: "ch1.c.first-api-call",
              title: "Your first API call",
              summary:
                "Sending one Messages API request end to end — model, system prompt, a user message, and reading the response's content, stop_reason and usage — is the smallest unit of everything that follows.",
              minutes: 30,
            },
          ],
        },
      ],
    },
  ],
  majorObjective:
    "Explain how a model produces text, estimate what a feature will cost, and make reliable API calls with keys handled safely.",
  resources: [
    {
      id: "ch1.r.karpathy-intro-llms",
      title: "Intro to Large Language Models — Andrej Karpathy",
      url: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
      kind: "Video",
      hours: 1,
      required: true,
      note: "The best one-hour mental model of what an LLM is. Start here.",
      week: 1,
    },
    {
      id: "ch1.r.karpathy-deep-dive",
      title: "Deep Dive into LLMs like ChatGPT — Andrej Karpathy",
      url: "https://www.youtube.com/watch?v=7xTGNNLPyMI",
      kind: "Video",
      hours: 3.5,
      required: true,
      note: "Pre-training, post-training, RL, tokenization and hallucinations, all explained for developers.",
      week: 1,
    },
    {
      id: "ch1.r.3blue1brown-attention",
      title: "Neural networks series (ch. 5–7: Transformers, Attention) — 3Blue1Brown",
      url: "https://www.3blue1brown.com/topics/neural-networks",
      kind: "Video",
      hours: 1.5,
      required: true,
      note: "Visual intuition for attention. Watch chapters 5–7; the earlier ones are optional.",
      week: 1,
    },
    {
      id: "ch1.r.prompting-overview",
      title: "Prompt engineering overview & best practices — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview",
      kind: "Docs",
      hours: 2,
      required: false,
      note: "The official, up-to-date techniques; a preview of chapter 2's focus.",
      week: 2,
    },
    {
      id: "ch1.r.anthropic-academy-api",
      title: "Building with the Claude API — Anthropic Academy",
      url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api",
      kind: "Course",
      hours: 8,
      required: true,
      note: "Free structured course covering the API, prompting, tool use, RAG and evals at a lighter depth than this roadmap.",
      week: 3,
    },
    {
      id: "ch1.r.messages-api-reference",
      title: "Messages API reference — Claude Docs",
      url: "https://platform.claude.com/docs/en/api/messages",
      kind: "Docs",
      hours: 1,
      required: true,
      note: "Keep this open while building the Prompt Lab CLI.",
      week: 3,
    },
    {
      id: "ch1.r.token-counting",
      title: "Token counting — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/token-counting",
      kind: "Docs",
      hours: 0.5,
      required: false,
      note: "Count tokens before sending; useful for the cost calculator mission.",
      week: 2,
    },
    {
      id: "ch1.r.pricing",
      title: "Pricing — Anthropic",
      url: "https://claude.com/pricing",
      kind: "Docs",
      hours: 0.25,
      required: true,
      note: "Per-model input/output prices for your cost estimates.",
      week: 3,
    },
    {
      id: "ch1.r.embeddings-docs",
      title: "Embeddings — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/embeddings",
      kind: "Docs",
      hours: 0.5,
      required: false,
      note: "Anthropic's guidance and recommended embedding providers; a preview of chapter 4.",
      week: 3,
    },
    {
      id: "ch1.r.claude-cookbooks",
      title: "Claude Cookbooks",
      url: "https://github.com/anthropics/claude-cookbooks",
      kind: "Code",
      hours: 2,
      required: false,
      note: "Copy-pasteable recipes. Browse now and come back in every later chapter.",
      week: 3,
    },
    {
      id: "ch1.r.lilian-weng-prompting",
      title: "Prompt Engineering — Lilian Weng",
      url: "https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/",
      kind: "Article",
      hours: 1,
      required: false,
      note: "A research-backed survey of prompting techniques you'll use starting chapter 2.",
      week: 2,
    },
    {
      id: "ch1.r.llm-cli",
      title: "LLM CLI — Simon Willison",
      url: "https://llm.datasette.io",
      kind: "Tool",
      hours: 1,
      required: false,
      note: "A terminal tool for quick prompt experiments and logging; a nice reference while building the Prompt Lab CLI.",
      week: 3,
    },
    {
      id: "ch1.r.ai-engineering-book-foundations",
      title: "AI Engineering (book) — Chip Huyen · ch. 1–2",
      url: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/",
      kind: "Book",
      hours: 4,
      required: false,
      note: "The reference book for this whole roadmap. Chapters 1–2 cover foundations.",
      week: 1,
    },
  ],
  missions: [
    {
      id: "ch1.m1",
      number: 1,
      title: "Prompt Lab CLI",
      track: "Backend",
      hours: 7,
      major: true,
      objective:
        "Build a command-line tool that runs a prompt template against many inputs and reports the output, tokens, cost and latency for each run, so you have a reusable instrument for every chapter that follows.",
      requirements: [
        "Call the Messages API and print the response with token usage and computed cost",
        "Load prompt templates from files with {{variable}} substitution",
        "Run a CSV of inputs and write results to JSONL",
        "Support --model and --temperature flags, with a side-by-side comparison table for two models",
        "Retry failed requests with exponential backoff and jitter, and enforce a request timeout",
      ],
      milestones: [
        { id: "ch1.m1.s1", title: "Single API call prints response, tokens and cost", minutes: 45 },
        { id: "ch1.m1.s2", title: "Template loader with {{variable}} substitution", minutes: 40 },
        { id: "ch1.m1.s3", title: "CSV-of-inputs runner writing JSONL results", minutes: 60 },
        { id: "ch1.m1.s4", title: "--model and --temperature flags wired through", minutes: 30 },
        { id: "ch1.m1.s5", title: "Side-by-side comparison table for two models", minutes: 45 },
        { id: "ch1.m1.s6", title: "Backoff-with-jitter retries and a request timeout", minutes: 50 },
      ],
      deliverable:
        "A CLI you can point at a prompt file and a CSV of inputs, which reports per-row output, tokens, cost and latency, and that you'll keep reusing in later chapters.",
      reflection: [
        "Which part of the cost formula surprised you most once you saw real numbers?",
        "Where did retries actually save a run versus just delaying an inevitable failure?",
      ],
      stretch: [
        { id: "ch1.m1.x1", title: "Run the same input 5× and report output variance", minutes: 40 },
        { id: "ch1.m1.x2", title: "Cache responses by hash of (prompt, model, params)", minutes: 45 },
      ],
    },
    {
      id: "ch1.m2",
      number: 2,
      title: "Token & Cost Explorer",
      track: "Backend",
      hours: 4,
      major: false,
      objective:
        "Run small, structured experiments on tokenization and sampling, then build a cost calculator for a hypothetical product feature so cost estimation becomes a habit rather than a guess.",
      requirements: [
        "Show how the same string tokenizes differently across a few example inputs (code, non-English text, numbers)",
        "Run one prompt at several temperatures and record how much the output actually changes",
        "Build a calculator that takes requests/day, average input/output tokens and a model tier and returns monthly cost",
        "Compare the calculator's estimate across all three model tiers for the same feature",
      ],
      milestones: [
        { id: "ch1.m2.s1", title: "Tokenization experiment across 3+ input types", minutes: 35 },
        { id: "ch1.m2.s2", title: "Sampling-variance run across a temperature sweep", minutes: 35 },
        { id: "ch1.m2.s3", title: "Cost calculator taking traffic and token inputs", minutes: 45 },
        { id: "ch1.m2.s4", title: "Cross-tier cost comparison for one hypothetical feature", minutes: 30 },
      ],
      deliverable:
        "A short script or notebook that tokenizes sample inputs, sweeps temperature on one prompt, and outputs a monthly cost estimate for a feature across all three model tiers.",
      reflection: [
        "What surprised you about how a string you expected to be simple actually tokenized?",
        "How different was the cheapest viable tier from the most expensive one, in dollars per month?",
      ],
      stretch: [],
    },
  ],
  trial: [
    {
      id: "ch1.t.explain-mental-model",
      dimension: "Explanation",
      statement: "You can explain next-token prediction, context window and temperature to a teammate without notes.",
    },
    {
      id: "ch1.t.estimate-cost",
      dimension: "Evaluation",
      statement: "You can estimate the monthly cost of a hypothetical feature from its traffic and token profile.",
    },
    {
      id: "ch1.t.tier-tradeoffs",
      dimension: "Tradeoffs",
      statement: "You can justify choosing Haiku, Sonnet or Opus for a given task based on quality, latency and cost.",
    },
    {
      id: "ch1.t.debug-retries",
      dimension: "Debugging",
      statement: "You can diagnose why a request failed (429 vs 529 vs a timeout) and pick the right retry strategy.",
    },
    {
      id: "ch1.t.build-cli",
      dimension: "Implementation",
      statement: "You can point your Prompt Lab CLI at a new prompt and a new CSV of inputs and get a working run with no code changes.",
    },
    {
      id: "ch1.t.key-hygiene",
      dimension: "Understanding",
      statement: "You can state where your API key lives in your own code and why it never reaches the browser.",
    },
  ],
  skills: { knowledge: 3 },
};
