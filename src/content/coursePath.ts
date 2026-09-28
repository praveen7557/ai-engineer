export interface CourseLink {
  /** Stable progress id: course.slug. Never rename or reuse; retire or replace through migrations.ts. */
  id: string;
  title: string;
  /** Name used in the concept map. */
  short: string;
  url: string;
  provider: string;
  cost: string;
}

export interface CoursePhase {
  number: number;
  title: string;
  hours: number;
  why: string;
  resources: CourseLink[];
  build: string;
  note?: string;
}

export interface NiceToKnow extends CourseLink {
  note: string;
}

export interface ConceptMapping {
  concept: string;
  /** Course ids that teach it, the main teacher first. */
  courseIds: string[];
  /** Where the course path covers it outside a course, e.g. the flagship build. */
  alsoIn?: string;
}

export interface ChapterMapping {
  chapterId: string;
  coverage: "Full" | "Mostly" | "Partial";
  courses: string;
  /** What no course teaches well; the chapter's own resources below cover it. */
  gaps?: string;
  gapResourceIds?: string[];
}

export interface BudgetLine {
  item: string;
  usd: [min: number, max: number];
  note: string;
}

export const coursePath = {
  researched: "September 2026",
  intro:
    "A course-led path from experienced developer to AI engineer, aimed at building production agents: a stateful agent behind a chat UI, tools with approvals, MCP servers with auth, durable runs, and evals. It runs alongside the 24-week chapters: use these courses as teachers for the builds. Ticking a course earns XP but doesn't change chapter completion or pace.",
  principle:
    "Courses don't make you job-ready; evaluated systems you can defend do. Every phase ends in a build, and every build ships with evals.",
  budgetCap: 1000,
  budget: [
    { item: "Frontend Masters, one or two months", usd: [39, 78], note: "Pay monthly. Month one: Phases 1–2. Month two: Phase 4. The free evals phase sits in between." },
    { item: "Epic MCP (Kent C. Dodds)", usd: [0, 0], note: "Access you already have." },
    { item: "Chip Huyen, AI Engineering (book)", usd: [50, 60], note: "The Kindle edition is cheaper." },
    { item: "LLM API usage and tracing", usd: [200, 300], note: "Cheap models while developing, frontier models only in evals." },
  ] satisfies BudgetLine[],
  budgetTip:
    "Watch the three Scott Moss courses back to back where you can, so the subscription is never idle. Everything else on the path is free or already paid for.",
  phases: [
    {
      number: 1, title: "An agent from scratch", hours: 18,
      why: "Write the agent loop yourself before any framework hides it: tool calling, streaming, evals, telemetry, context compaction, and a sandboxed tool behind human approval.",
      resources: [
        { id: "course.ai-agents-fundamentals-v2", short: "AI Agents Fundamentals v2", title: "AI Agents Fundamentals, v2 (Scott Moss, Jan 2026)", url: "https://master.dev/courses/ai-agents-v2/", provider: "Frontend Masters", cost: "Subscription" },
      ],
      build: "A CLI agent with file, web-search and shell tools, an approval step before anything destructive, and single- and multi-turn evals.",
    },
    {
      number: 2, title: "AI features in a web app", hours: 25,
      why: "The in-app assistant pattern: a stateful agent behind a chat UI, client-side tools, context engineering, and an eval harness that drives the improvement loop.",
      resources: [
        { id: "course.ai-engineering-fundamentals", short: "AI Engineering Fundamentals", title: "AI Engineering Fundamentals (Scott Moss, Apr 2026)", url: "https://master.dev/courses/ai-engineering/", provider: "Frontend Masters", cost: "Subscription" },
        { id: "course.ai-engineering-book", short: "Chip Huyen's book", title: "AI Engineering (read across the whole path)", url: "https://huyenchip.com/books/", provider: "Chip Huyen · O'Reilly", cost: "~$50–60" },
      ],
      build: "A TypeScript chat assistant whose tool results render as UI cards, with a golden dataset and an eval harness that runs in CI.",
    },
    {
      number: 3, title: "Evals in depth", hours: 25,
      why: "Evals are what make every later change safe: error analysis, trustworthy LLM-as-judge, synthetic data, and feedback signals from real use.",
      resources: [
        { id: "course.evals-email-course", short: "Evals email course", title: "AI Evals email course + two e-books", url: "https://ai.hamel.dev/eval-course", provider: "Hamel Husain & Shreya Shankar", cost: "Free" },
        { id: "course.evals-faq", short: "Evals FAQ", title: "AI Evals FAQ", url: "https://hamel.dev/blog/posts/evals-faq/", provider: "Hamel Husain & Shreya Shankar", cost: "Free" },
      ],
      build: "Run error analysis by hand on at least 100 traces from your Phase 2 assistant, then turn the failure categories into evals and a judge you've checked against your own labels.",
      note: "No instructor feedback here, so the 100-trace error analysis isn't optional.",
    },
    {
      number: 4, title: "Durable agent systems", hours: 15,
      why: "What separates a demo from a system: runs that survive crashes and resume, sandboxed tools, memory and compaction, and sub-agents under supervision.",
      resources: [
        { id: "course.durable-agent-systems", short: "Durable Agent Systems", title: "Build Durable AI Agent Systems (Scott Moss, Jul 2026)", url: "https://master.dev/courses/agent-harness/", provider: "Frontend Masters", cost: "Subscription" },
      ],
      build: "Make your Phase 1 agent durable: checkpoint each step, resume after a killed process, and hand one task to a supervised sub-agent.",
    },
    {
      number: 5, title: "Building MCP servers, with auth", hours: 30,
      why: "You already use MCP; this is the other side. Build servers with tools, resources, prompts, sampling, elicitation, long-running tasks and interactive UI, then secure them with OAuth 2.1 and scopes.",
      resources: [
        { id: "course.epic-mcp", short: "Epic MCP", title: "Epic MCP: From Scratch to Production (Kent C. Dodds)", url: "https://www.epicai.pro/workshops/epic-mcp-from-scratch-to-production", provider: "EpicAI.pro · 4 workshops, 47 exercises", cost: "Have access" },
        { id: "course.mcp-security-best-practices", short: "MCP security best practices", title: "MCP Security Best Practices", url: "https://modelcontextprotocol.io/specification/latest/basic/security_best_practices", provider: "Model Context Protocol spec", cost: "Free" },
      ],
      build: "A remote MCP server over an API you know, with OAuth 2.1 and per-tool scopes, one tool that returns interactive UI, and tests for every tool.",
      note: "If a deployment lesson targets a platform other than Cloudflare or GCP, do it locally: other platforms need approval.",
    },
    {
      number: 6, title: "Research depth: data, evals, safety, coding agents", hours: 30,
      why: "The ideas the practical courses skip: optimizing prompts and test-time compute, data for agents, benchmark design, guardrails and red-teaming, coding agents, and proactive agents.",
      resources: [
        { id: "course.cs329z", short: "CS329Z", title: "CS329Z: Engineering AI Agents (Fall 2026, selected lectures)", url: "https://cs329z.stanford.edu/", provider: "Stanford", cost: "Free" },
        { id: "course.owasp-llm-top10", short: "OWASP Top 10", title: "OWASP Top 10 for LLM Applications", url: "https://genai.owasp.org/llm-top-10/", provider: "OWASP", cost: "Free" },
        { id: "course.python-tutorial", short: "Python tutorial", title: "The Python Tutorial (only what HW2 needs)", url: "https://docs.python.org/3/tutorial/", provider: "Python docs", cost: "Free" },
      ],
      build: "CS329Z HW2: design evals that challenge frontier models. Then red-team your Phase 5 server and Phase 2 assistant for prompt injection.",
      note: "Watch: Optimization (Oct 21), Data for agentic systems (Oct 28), Data selection & quality (Nov 2), Evaluation fundamentals (Nov 4), LLM-as-judge & eval infrastructure (Nov 9), Safety & guardrails (Nov 11), Coding agents (Nov 18), Proactive agents (Nov 30), Open problems (Dec 2). Skip the rest and HW1: Phases 1–4 already cover them. Its framework lecture (DSPy, LangGraph) shows what frameworks hide; it isn't a new stack to adopt.",
    },
    {
      number: 7, title: "Flagship project", hours: 50,
      why: "The portfolio piece, and where the ideas no course teaches get built: structured output you can trust, and post-run summaries checked against what actually happened.",
      resources: [],
      build: "A small production-style assistant: chat UI with tool cards and approvals, your MCP server as its tools, memory, one scheduled background run, durable execution, structured output where every value must trace to a tool result, evals and tracing. Write it up as a case study: architecture, failures, evals, cost.",
    },
  ] satisfies CoursePhase[],
  conceptMapIntro:
    "Every concept the path is meant to teach, and where you learn it. The first course listed is the main teacher.",
  conceptMap: [
    { concept: "Agent loop and tool calling", courseIds: ["course.ai-agents-fundamentals-v2", "course.ai-engineering-fundamentals"] },
    { concept: "Streaming and chat UX", courseIds: ["course.ai-engineering-fundamentals", "course.ai-agents-fundamentals-v2"] },
    { concept: "Tool results rendered as UI", courseIds: ["course.ai-engineering-fundamentals", "course.epic-mcp"] },
    { concept: "Human approval before side effects", courseIds: ["course.ai-agents-fundamentals-v2", "course.durable-agent-systems", "course.epic-mcp"] },
    { concept: "Context engineering and compaction", courseIds: ["course.ai-engineering-fundamentals", "course.ai-agents-fundamentals-v2", "course.durable-agent-systems"] },
    { concept: "Retrieval (RAG)", courseIds: ["course.ai-engineering-fundamentals", "course.evals-email-course"] },
    { concept: "Error analysis and LLM-as-judge", courseIds: ["course.evals-email-course", "course.evals-faq", "course.cs329z"] },
    { concept: "Eval harnesses and CI gates", courseIds: ["course.ai-engineering-fundamentals", "course.ai-agents-fundamentals-v2", "course.evals-faq"] },
    { concept: "Tracing and user feedback signals", courseIds: ["course.ai-agents-fundamentals-v2", "course.ai-engineering-fundamentals", "course.evals-email-course"] },
    { concept: "Durable execution and resumable runs", courseIds: ["course.durable-agent-systems"] },
    { concept: "Memory across sessions", courseIds: ["course.durable-agent-systems", "course.ai-engineering-book"] },
    { concept: "Sub-agents and orchestration", courseIds: ["course.durable-agent-systems", "course.cs329z"] },
    { concept: "Sandboxing and least-privilege tools", courseIds: ["course.durable-agent-systems", "course.ai-agents-fundamentals-v2", "course.owasp-llm-top10"] },
    { concept: "Building MCP servers (tools, resources, prompts, sampling, elicitation)", courseIds: ["course.epic-mcp"] },
    { concept: "MCP authorization (OAuth 2.1, scopes)", courseIds: ["course.epic-mcp", "course.mcp-security-best-practices"] },
    { concept: "Prompt injection, guardrails and red-teaming", courseIds: ["course.owasp-llm-top10", "course.cs329z", "course.mcp-security-best-practices"] },
    { concept: "Structured output you can trust (provenance)", courseIds: ["course.ai-engineering-book"], alsoIn: "Flagship build" },
    { concept: "Post-run summaries checked against the transcript", courseIds: [], alsoIn: "Flagship build" },
    { concept: "Scheduled and proactive agents", courseIds: ["course.cs329z"], alsoIn: "Flagship build" },
    { concept: "Coding agents", courseIds: ["course.cs329z"] },
    { concept: "Data for agents and synthetic data", courseIds: ["course.cs329z", "course.evals-email-course"] },
    { concept: "Prompt optimization, test-time compute, fine-tuning", courseIds: ["course.cs329z", "course.core-track"] },
    { concept: "How models work inside", courseIds: ["course.zero-to-hero"] },
  ] satisfies ConceptMapping[],
  chapterMapIntro:
    "The courses teach the concepts; the chapters' builds and free docs teach the production engineering around them. Where a chapter is only partly covered, its own resources fill the gap.",
  chapterMap: [
    { chapterId: "ch1", coverage: "Mostly", courses: "Scott Moss (LLM setup, tool calling), Chip Huyen (foundation models)",
      gaps: "Retries, backoff with jitter, timeouts and key hygiene.", gapResourceIds: ["ch1.r.errors-docs"] },
    { chapterId: "ch2", coverage: "Mostly", courses: "Chip Huyen (prompting, structured output), Scott Moss (evals), Hamel & Shreya (error analysis)",
      gaps: "Running an open model and comparing a quantized variant.", gapResourceIds: ["ch2.r.hf-llm-course", "ch2.r.quantization-overview"] },
    { chapterId: "ch3", coverage: "Partial", courses: "Scott Moss (stateful chat agent, client-side tools, streaming)",
      gaps: "An SSE proxy with cancellation, multimodal extraction, and human-correction UX.", gapResourceIds: ["ch3.r.streaming-docs", "ch3.r.vision-docs", "ch3.r.pair-guidebook"] },
    { chapterId: "ch4", coverage: "Mostly", courses: "Scott Moss (RAG), Hamel & Shreya (RAG evals e-book)",
      gaps: "Permission-aware retrieval and embedding-version migration.", gapResourceIds: ["ch4.r.systematically-improving-rag"] },
    { chapterId: "ch5", coverage: "Mostly", courses: "Scott Moss (agent loop, approvals, durable runs, sub-agents), CS329Z (coding and proactive agents)",
      gaps: "Idempotency keys and spend limits on tools.", gapResourceIds: ["ch5.r.idempotency-stripe", "ch5.r.lethal-trifecta"] },
    { chapterId: "ch6", coverage: "Full", courses: "Epic MCP (servers, OAuth 2.1, scopes), MCP Security Best Practices" },
    { chapterId: "ch7", coverage: "Partial", courses: "Hamel & Shreya (evals, LLM-as-judge), CS329Z (optimization, eval infrastructure), Scott Moss (durable recovery)",
      gaps: "A small fine-tuning experiment, load and recovery testing, staged rollout and rollback.", gapResourceIds: ["ch7.r.peft-quicktour", "ch7.r.handling-overload", "ch7.r.otel-genai-conventions"] },
    { chapterId: "ch8", coverage: "Full", courses: "Phase 7 flagship project (no course by design)" },
  ] satisfies ChapterMapping[],
  pathOnly: "Only on the Course Path: durable execution, MCP servers that return interactive UI, and CS329Z's research lectures on data, optimization, coding agents and proactive agents.",
  timeSplit: [
    { area: "Agent building (loop, durable runs, sub-agents)", pct: 25 },
    { area: "Evals and observability", pct: 20 },
    { area: "Capstone", pct: 15 },
    { area: "Tools and MCP", pct: 15 },
    { area: "Context and retrieval", pct: 10 },
    { area: "Safety and security", pct: 10 },
    { area: "Research depth", pct: 5 },
  ],
  durable:
    "If today's frameworks disappear, these still hold: the agent loop itself, tool interface design, context management, error analysis and eval methodology, treating an agent's own claims as unverified, designing for failure, and trust boundaries.",
  paces: [10, 15, 20],
  niceToKnow: [
    { id: "course.core-track", short: "Ed Donner Core Track", title: "AI Engineer Core Track (selected weeks)", url: "https://www.udemy.com/course/llm-engineering-master-ai-and-large-language-models/", provider: "Ed Donner · Udemy", cost: "~$15–20 on sale", note: "Open models and QLoRA fine-tuning. Most of the rest repeats Phases 1–2." },
    { id: "course.zero-to-hero", short: "Karpathy Zero to Hero", title: "Neural Networks: Zero to Hero (micrograd, makemore 1, Let's build GPT, tokenizer)", url: "https://karpathy.ai/zero-to-hero.html", provider: "Andrej Karpathy", cost: "Free", note: "Intuition for how models work inside. None of the target systems need it." },
  ] satisfies NiceToKnow[],
  dropped: [
    { title: "Andrew Ng, Agentic AI", why: "Its patterns (reflection, planning, multi-agent) are covered with more practice by Phases 1, 4 and 6." },
    { title: "A separate Python phase", why: "The target systems are TypeScript. Learn the Python CS329Z HW2 needs, in Phase 6." },
    { title: "Anthropic Academy MCP courses; Brian Holt's Complete Intro to MCP", why: "You already use MCP, and Epic MCP covers building servers, advanced features and auth in one course." },
    { title: "Scott Moss, AI Agent: From Prototype to Production (2024)", why: "Superseded by his 2026 courses, which cover the same topics in more depth." },
    { title: "vLLM and llama.cpp", why: "Serving your own models is infrastructure; the target systems call hosted models through a gateway." },
    { title: "Stanford CS336", why: "Pre-training models is research territory, not this path." },
    { title: "CS329Z HW1 and its early lectures", why: "Building a harness from scratch repeats Phase 1; tools, patterns, memory and multi-agent repeat Phases 1–4." },
    { title: "AI Evals for Engineers & PMs (Maven)", why: "$4,200 is over the yearly budget. The free email course, FAQ and CS329Z HW2 cover the method." },
    { title: "DataTalksClub LLM Zoomcamp", why: "Another pass at RAG the path already covers." },
    { title: "Ed Donner's Agentic and Production Tracks", why: "A tour of frameworks, and cloud deployment, which is out of scope." },
    { title: "Hugging Face LLM Course", why: "It teaches the transformers library and NLP tasks, which isn't this layer." },
  ],
};

/** Every trackable course and resource on the path, in page order. */
export const COURSE_LINKS: CourseLink[] = [
  ...coursePath.phases.flatMap(p => p.resources),
  ...coursePath.niceToKnow,
];

export const coursePathHours = coursePath.phases.reduce((sum, p) => sum + p.hours, 0);

export const coursePathBudget = coursePath.budget.reduce<[number, number]>(
  ([lo, hi], b) => [lo + b.usd[0], hi + b.usd[1]],
  [0, 0],
);
