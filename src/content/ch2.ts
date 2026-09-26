// Chapter 2 — Working With Models (weeks 4–6)
import type { Chapter } from "./types";

export const ch2: Chapter = {
  id: "ch2",
  number: 2,
  title: "Working With Models",
  tagline: "Treat prompting and the API as engineering, not incantation.",
  description:
    "Three weeks turning prompting into a disciplined practice, learning the Messages API in depth, and getting structured, reliable output out of chains of calls.",
  why:
    "Prompting is the cheapest lever you have and the API is the substrate everything else sits on. Engineers who treat both casually end up with brittle features; engineers who treat them as code ship features they can change with confidence.",
  weeks: [
    {
      number: 4,
      title: "Prompting as engineering",
      focus: "Clear, structured, example-driven prompts, versioned like code.",
      groups: [
        {
          title: "Structure & clarity",
          concepts: [
            {
              id: "ch2.c.system-vs-turns",
              title: "System prompt vs user/assistant turns",
              summary:
                "The system prompt sets role, persona and standing instructions once; user and assistant turns carry the actual conversation, and mixing the two up causes instructions to get ignored.",
              minutes: 25,
            },
            {
              id: "ch2.c.clear-direct",
              title: "Be clear, direct, and give the why",
              summary:
                "Explaining the audience, goal and constraints behind a request steers a model further than clever phrasing does, because the model can reason about intent instead of guessing at it.",
              minutes: 25,
            },
            {
              id: "ch2.c.xml-tags",
              title: "XML tags to structure inputs",
              summary:
                "Wrapping instructions, documents and examples in distinct tags stops them from bleeding into each other, which matters most once a prompt has more than one moving part.",
              minutes: 20,
            },
          ],
        },
        {
          title: "Examples & reasoning",
          concepts: [
            {
              id: "ch2.c.few-shot",
              title: "Few-shot (multishot) examples",
              summary:
                "A small set of diverse, representative examples steers format and tone far more reliably than describing the format in prose alone.",
              minutes: 30,
            },
            {
              id: "ch2.c.let-model-think",
              title: "Let the model think",
              summary:
                "Asking for step-by-step reasoning before a final answer improves accuracy on multi-step problems, at the cost of extra output tokens you should account for.",
              minutes: 25,
            },
            {
              id: "ch2.c.prompts-as-code",
              title: "Prompts as versioned code",
              summary:
                "Prompt templates with named variables belong in git, reviewed like any other change, so a regression in behavior is traceable to a specific commit.",
              minutes: 20,
            },
          ],
        },
      ],
    },
    {
      number: 5,
      title: "The Messages API",
      focus: "Anatomy, statelessness, streaming, and handling failure.",
      groups: [
        {
          title: "Anatomy & state",
          concepts: [
            {
              id: "ch2.c.messages-api-anatomy",
              title: "Messages API anatomy",
              summary:
                "model, max_tokens, system and messages go in; content blocks, stop_reason and usage come back, and reading stop_reason correctly is what tells you whether the model finished, hit a limit, or wants a tool.",
              minutes: 30,
            },
            {
              id: "ch2.c.stateless-history",
              title: "The API is stateless",
              summary:
                "Nothing persists between calls on the server side, so your application owns the full conversation history: what to resend, when to trim it, and when to summarize it.",
              minutes: 30,
            },
            {
              id: "ch2.c.streaming-basics",
              title: "Streaming basics",
              summary:
                "Server-sent events deliver the response incrementally through event types like message_start and content_block_delta, which is what lets a UI render partial markdown as it arrives.",
              minutes: 35,
            },
          ],
        },
        {
          title: "Failure handling",
          concepts: [
            {
              id: "ch2.c.errors-retries-timeouts",
              title: "Errors, retries & timeouts",
              summary:
                "429, 529 and 5xx responses call for different handling; exponential backoff with jitter, sensible client timeouts, and only retrying idempotent requests keep a bad moment from becoming an outage.",
              minutes: 35,
            },
            {
              id: "ch2.c.token-counting-api",
              title: "Token counting in practice",
              summary:
                "Counting tokens before sending lets you estimate cost and truncate history proactively, instead of discovering the context limit by hitting it.",
              minutes: 20,
            },
          ],
        },
      ],
    },
    {
      number: 6,
      title: "Structured output & prompt chains",
      focus: "Reliable JSON, multi-step prompt pipelines, and the patterns behind them.",
      groups: [
        {
          title: "Structured output",
          concepts: [
            {
              id: "ch2.c.structured-outputs",
              title: "Structured outputs & validation",
              summary:
                "Constraining a response to a JSON schema and then validating it in code with Zod or Pydantic turns free text into something your application can trust and act on.",
              minutes: 35,
            },
          ],
        },
        {
          title: "Chains & workflow patterns",
          concepts: [
            {
              id: "ch2.c.prompt-chaining",
              title: "Prompt chaining",
              summary:
                "Splitting a big task into sequential calls, each with a narrower job, tends to beat one giant prompt on both reliability and debuggability.",
              minutes: 30,
            },
            {
              id: "ch2.c.routing",
              title: "Routing",
              summary:
                "A first, cheap call classifies the input and picks which specialized prompt or model handles it next, instead of one prompt trying to handle every case.",
              minutes: 25,
            },
            {
              id: "ch2.c.parallelization",
              title: "Parallelization",
              summary:
                "Independent subtasks can run as concurrent calls and be merged afterward, which cuts latency when steps don't depend on each other's output.",
              minutes: 20,
            },
            {
              id: "ch2.c.evaluator-optimizer",
              title: "Evaluator-optimizer",
              summary:
                "One call drafts, a second call critiques against explicit criteria, and the loop repeats until the draft passes — a pattern that trades latency for quality on tasks worth the extra call.",
              minutes: 30,
            },
          ],
        },
      ],
    },
  ],
  majorObjective:
    "Turn prompting and API usage into a repeatable practice: structured outputs you can validate, chains you can debug, and failures you can recover from.",
  resources: [
    {
      id: "ch2.r.prompt-eng-interactive-tutorial",
      title: "Interactive Prompt Engineering Tutorial — Anthropic",
      url: "https://github.com/anthropics/prompt-eng-interactive-tutorial",
      kind: "Course",
      hours: 6,
      required: true,
      note: "Nine chapters of hands-on notebooks with exercises. Do every exercise.",
      week: 4,
    },
    {
      id: "ch2.r.prompt-eng-overview",
      title: "Prompt engineering overview & best practices — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview",
      kind: "Docs",
      hours: 2,
      required: true,
      note: "The official, up-to-date techniques. Read the whole section this time, not just the preview from chapter 1.",
      week: 4,
    },
    {
      id: "ch2.r.messages-api-reference",
      title: "Messages API reference — Claude Docs",
      url: "https://platform.claude.com/docs/en/api/messages",
      kind: "Docs",
      hours: 1,
      required: true,
      note: "Keep it open while building the Structured Extractor and the Prompt Chain Pipeline.",
      week: 5,
    },
    {
      id: "ch2.r.streaming-docs",
      title: "Streaming Messages — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/streaming",
      kind: "Docs",
      hours: 0.5,
      required: true,
      note: "The SSE event types you'll parse in chapter 3's chat app; understand them here first.",
      week: 5,
    },
    {
      id: "ch2.r.structured-outputs-docs",
      title: "Structured outputs — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs",
      kind: "Docs",
      hours: 0.5,
      required: true,
      note: "Guaranteed-valid JSON against your schema; the backbone of the Structured Extractor mission.",
      week: 6,
    },
    {
      id: "ch2.r.token-counting-docs",
      title: "Token counting — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/token-counting",
      kind: "Docs",
      hours: 0.5,
      required: false,
      note: "Count tokens before sending to keep conversation history within budget.",
      week: 5,
    },
    {
      id: "ch2.r.courses-repo",
      title: "Anthropic courses repo (API fundamentals notebooks)",
      url: "https://github.com/anthropics/courses",
      kind: "Course",
      hours: 4,
      required: false,
      note: "Notebook versions of API fundamentals and prompt evaluation.",
      week: 4,
    },
    {
      id: "ch2.r.lilian-weng-prompting",
      title: "Prompt Engineering — Lilian Weng",
      url: "https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/",
      kind: "Article",
      hours: 1,
      required: false,
      note: "A research-backed survey of prompting techniques, useful background for the chaining patterns.",
      week: 4,
    },
    {
      id: "ch2.r.deeplearning-prompting",
      title: "ChatGPT Prompt Engineering for Developers — DeepLearning.AI",
      url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/",
      kind: "Course",
      hours: 1.5,
      required: false,
      note: "Provider-agnostic short course; the ideas carry over directly.",
      week: 4,
    },
    {
      id: "ch2.r.claude-cookbooks",
      title: "Claude Cookbooks",
      url: "https://github.com/anthropics/claude-cookbooks",
      kind: "Code",
      hours: 1,
      required: false,
      note: "Structured-output and chaining recipes worth copying into your own pipeline.",
      week: 6,
    },
    {
      id: "ch2.r.ai-engineering-prompting",
      title: "AI Engineering (book) — Chip Huyen · ch. 5",
      url: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/",
      kind: "Book",
      hours: 2,
      required: false,
      note: "Chapter 5 covers prompting technique in more depth than any single article.",
      week: 4,
    },
  ],
  missions: [
    {
      id: "ch2.m3",
      number: 3,
      title: "Structured Extractor",
      track: "Backend",
      hours: 5,
      major: true,
      objective:
        "Turn messy real-world text — job posts, support emails, receipts — into validated JSON with a strict schema, so you have hands-on experience with the gap between \"the model returned JSON\" and \"the JSON is correct.\"",
      requirements: [
        "Define the schema in Zod or Pydantic and use structured outputs to constrain the response",
        "Validate every response and log and count validation failures",
        "Handle missing fields explicitly with null plus a reason instead of letting the model guess",
        "Test on at least 30 real-world samples and record accuracy per field",
      ],
      milestones: [
        { id: "ch2.m3.s1", title: "Schema defined and wired into structured outputs", minutes: 40 },
        { id: "ch2.m3.s2", title: "Response validation with failure logging", minutes: 35 },
        { id: "ch2.m3.s3", title: "Explicit null + reason handling for missing fields", minutes: 30 },
        { id: "ch2.m3.s4", title: "30-sample test run with per-field accuracy recorded", minutes: 60 },
      ],
      deliverable:
        "A script that takes raw text and returns schema-validated JSON, with a report of per-field accuracy across 30+ real samples.",
      reflection: [
        "Which fields failed most often, and was that a prompt problem or a schema problem?",
        "What did explicit null-plus-reason handling reveal that silent guessing would have hidden?",
      ],
      stretch: [
        { id: "ch2.m3.x1", title: "Compare Haiku vs Sonnet accuracy and cost on the same 30 samples", minutes: 45 },
      ],
    },
    {
      id: "ch2.m4",
      number: 4,
      title: "Prompt Chain Pipeline",
      track: "Backend",
      hours: 5,
      major: false,
      objective:
        "Build a multi-step pipeline — for example a support email that gets classified and routed, drafted, and self-critiqued — to feel the difference between one big prompt and a chain of smaller, checkable ones.",
      requirements: [
        "A classification/routing step that picks a path before any drafting happens",
        "A draft step that produces the actual response for the routed case",
        "A self-critique (evaluator-optimizer) step that checks the draft against explicit criteria and can send it back for revision",
        "Structured output at each step boundary so you can log and inspect intermediate results",
        "A trace of the whole run showing which path was taken and how long each step took",
      ],
      milestones: [
        { id: "ch2.m4.s1", title: "Routing step classifies input into 2–3 categories", minutes: 40 },
        { id: "ch2.m4.s2", title: "Per-category draft prompt produces a response", minutes: 40 },
        { id: "ch2.m4.s3", title: "Evaluator-optimizer critique loop with a revision path", minutes: 50 },
        { id: "ch2.m4.s4", title: "Structured intermediate output logged at each step", minutes: 30 },
        { id: "ch2.m4.s5", title: "End-to-end trace showing path taken and per-step timing", minutes: 35 },
      ],
      deliverable:
        "A working pipeline that takes a raw support email and produces a routed, drafted, self-critiqued reply, with a visible trace of every step.",
      reflection: [
        "Where did splitting the task into steps catch a mistake a single prompt would have missed?",
        "Was the extra latency from the critique step worth the quality gain, and how would you measure that?",
      ],
      stretch: [],
    },
  ],
  trial: [
    {
      id: "ch2.t.structure-prompt",
      dimension: "Implementation",
      statement: "You can write a prompt with a system message, XML-tagged inputs and few-shot examples that reliably produces the format you asked for.",
    },
    {
      id: "ch2.t.explain-statelessness",
      dimension: "Understanding",
      statement: "You can explain why the Messages API is stateless and how your application manages history as a result.",
    },
    {
      id: "ch2.t.debug-stream",
      dimension: "Debugging",
      statement: "You can read a stream of SSE events and identify where a partial-JSON parse would need to resume.",
    },
    {
      id: "ch2.t.validate-output",
      dimension: "Evaluation",
      statement: "You can measure and report per-field accuracy on a structured-extraction task, not just \"it looked right.\"",
    },
    {
      id: "ch2.t.chain-tradeoffs",
      dimension: "Tradeoffs",
      statement: "You can justify when a prompt chain is worth its extra latency and cost over a single call.",
    },
    {
      id: "ch2.t.version-prompts",
      dimension: "Independence",
      statement: "You keep your prompt templates in git and can point to a diff that changed model behavior.",
    },
  ],
  skills: { knowledge: 2, building: 1 },
};
