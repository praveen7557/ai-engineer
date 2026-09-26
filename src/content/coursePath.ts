export interface CourseLink {
  /** Stable progress id: course.pN.slug. Never rename or reuse. */
  id: string;
  title: string;
  url: string;
  provider: string;
  cost: string;
}

export interface CoursePhase {
  number: number;
  title: string;
  tier: "must" | "nice";
  hours: number;
  why: string;
  resources: CourseLink[];
  build: string;
  note?: string;
}

export interface BudgetLine {
  item: string;
  usd: [min: number, max: number];
  note: string;
}

export const coursePath = {
  researched: "September 2026",
  intro:
    "A course-led path from experienced developer to AI engineer, built from a critical review of the current course landscape. It runs alongside the 24-week chapters: use these courses as teachers for the builds. Ticking a course earns XP but doesn't change chapter completion or pace.",
  principle:
    "Courses don't make you job-ready; evaluated systems you can defend do. Every phase ends in a build, and from Phase 2 on every build ships with evals.",
  budgetCap: 1000,
  budget: [
    { item: "DeepLearning.AI Pro, one month", usd: [49, 49], note: "Agentic AI is Pro-only. It's ~8 hours: finish it in the month and cancel." },
    { item: "Frontend Masters, one month", usd: [39, 39], note: "Pay monthly, not yearly. Also watch Scott Moss's AI Agents Fundamentals v2 and Production AI that month." },
    { item: "Ed Donner's Core Track (Udemy)", usd: [15, 20], note: "Wait for a Udemy sale; they run almost constantly." },
    { item: "Chip Huyen, AI Engineering (book)", usd: [50, 60], note: "The Kindle edition is cheaper." },
    { item: "LLM API usage and tracing", usd: [200, 300], note: "Cheap models while developing, frontier models only in evals." },
  ] satisfies BudgetLine[],
  budgetTip:
    "Start the DeepLearning.AI month with Phase 1 and the Frontend Masters month when Phase 1 ends, so you never pay for an idle subscription. If money gets tight, cut the DeepLearning.AI month first: CS329Z's first five lectures cover the same patterns for free.",
  phases: [
    {
      number: 0, title: "Python in context", tier: "must", hours: 20,
      why: "Python is where most AI tooling, open models and fine-tuning live. Learn enough to build services and read any AI repo; TypeScript stays your product layer.",
      resources: [
        { id: "course.p0.uv", title: "uv", url: "https://docs.astral.sh/uv/", provider: "Astral", cost: "Free" },
        { id: "course.p0.fastapi", title: "FastAPI tutorial", url: "https://fastapi.tiangolo.com/tutorial/", provider: "FastAPI", cost: "Free" },
        { id: "course.p0.pydantic", title: "Pydantic docs", url: "https://docs.pydantic.dev/latest/", provider: "Pydantic", cost: "Free" },
        { id: "course.p0.pytest", title: "pytest getting started", url: "https://docs.pytest.org/en/stable/getting-started.html", provider: "pytest", cost: "Free" },
      ],
      build: "Port one of your Node services to FastAPI, with typed models and tests.",
    },
    {
      number: 1, title: "Agentic mental models", tier: "must", hours: 30,
      why: "Learn reflection, tool use, planning and multi-agent patterns in raw Python before any framework hides them.",
      resources: [
        { id: "course.p1.agentic-ai", title: "Agentic AI with Andrew Ng", url: "https://www.deeplearning.ai/courses/agentic-ai", provider: "DeepLearning.AI", cost: "$49 (1 month Pro)" },
        { id: "course.p1.ai-engineering-book", title: "AI Engineering (read across the whole path)", url: "https://huyenchip.com/books/", provider: "Chip Huyen · O'Reilly", cost: "~$50–60" },
      ],
      build: "An agent loop in raw Python with reflection and tool use. No framework.",
    },
    {
      number: 2, title: "Eval-first AI engineering in your stack", tier: "must", hours: 25,
      why: "Learn that AI features need measurement, not just prompting, in the language you already ship in.",
      resources: [
        { id: "course.p2.ai-engineering-fundamentals", title: "AI Engineering Fundamentals (Scott Moss, Apr 2026)", url: "https://master.dev/courses/ai-engineering/", provider: "Frontend Masters", cost: "$39 (1 month)" },
      ],
      build: "A TypeScript AI feature with a golden dataset and an eval harness that runs in CI.",
    },
    {
      number: 3, title: "Evals in depth", tier: "must", hours: 25,
      why: "Evals are the skill most often cited in 2026 hiring. This is the free replacement for the $4,200 cohort course.",
      resources: [
        { id: "course.p3.evals-email-course", title: "AI Evals email course + two e-books", url: "https://ai.hamel.dev/eval-course", provider: "Hamel Husain & Shreya Shankar", cost: "Free" },
        { id: "course.p3.evals-faq", title: "AI Evals FAQ", url: "https://hamel.dev/blog/posts/evals-faq/", provider: "Hamel Husain & Shreya Shankar", cost: "Free" },
      ],
      build: "Run error analysis by hand on at least 100 traces from your Phase 2 feature, then turn the failure categories into evals.",
      note: "No instructor feedback here, so the 100-trace error analysis isn't optional.",
    },
    {
      number: 4, title: "Breadth across LLM engineering", tier: "must", hours: 50,
      why: "One pass over the whole ecosystem: providers, multimodal, embeddings, RAG, fine-tuning, inference and cost.",
      resources: [
        { id: "course.p4.core-track", title: "AI Engineer Core Track (2026 refresh)", url: "https://www.udemy.com/course/llm-engineering-master-ai-and-large-language-models/", provider: "Ed Donner · Udemy", cost: "~$15–20 on sale" },
      ],
      build: "RAG over a real corpus with hybrid search and reranking, plus one QLoRA fine-tune evaluated against a prompting baseline. Colab's free GPU is enough.",
      note: "Skim the sections Phases 1–3 already covered.",
    },
    {
      number: 5, title: "Agents from scratch to production", tier: "must", hours: 60,
      why: "Build the harness yourself, then learn one framework deeply, MCP, and how agents get attacked.",
      resources: [
        { id: "course.p5.cs329z", title: "CS329Z: Engineering AI Agents (Fall 2026, public materials)", url: "https://cs329z.stanford.edu/", provider: "Stanford", cost: "Free" },
        { id: "course.p5.mcp-intro", title: "Introduction to Model Context Protocol", url: "https://anthropic.skilljar.com/introduction-to-model-context-protocol", provider: "Anthropic Academy", cost: "Free" },
        { id: "course.p5.owasp-llm-top10", title: "OWASP Top 10 for LLM Applications", url: "https://genai.owasp.org/llm-top-10/", provider: "OWASP", cost: "Free" },
      ],
      build: "An agent with MCP tools, memory, human approval for side effects and trace-based evals. Then red-team it for prompt injection.",
      note: "Pick one framework and go deep; skip the multi-framework tours.",
    },
    {
      number: 6, title: "Models and inference", tier: "must", hours: 25,
      why: "Enough model and serving intuition to make good engineering calls: attention, tokenization, KV cache, quantization, batching.",
      resources: [
        { id: "course.p6.zero-to-hero", title: "Neural Networks: Zero to Hero (micrograd, makemore 1, Let's build GPT, tokenizer)", url: "https://karpathy.ai/zero-to-hero.html", provider: "Andrej Karpathy", cost: "Free" },
        { id: "course.p6.vllm", title: "vLLM docs", url: "https://docs.vllm.ai/", provider: "vLLM", cost: "Free" },
        { id: "course.p6.llama-cpp", title: "llama.cpp", url: "https://github.com/ggml-org/llama.cpp", provider: "ggml", cost: "Free" },
      ],
      build: "Serve one open model locally and benchmark time-to-first-token, throughput and quantization trade-offs.",
      note: "The four lectures are must-learn; the local serving benchmark is nice to know.",
    },
    {
      number: 7, title: "Flagship project", tier: "must", hours: 50,
      why: "The portfolio piece. It should play to your strengths: frontend, streaming UX, Chrome extensions.",
      resources: [],
      build: "For example, a browser agent as a Chrome extension with evals, traces, a cost dashboard and injection defenses. Write it up as a case study: architecture, failures, evals, cost.",
    },
  ] satisfies CoursePhase[],
  timeSplit: [
    { area: "Agents", pct: 25 },
    { area: "Evals, observability and reliability", pct: 20 },
    { area: "Retrieval and context", pct: 15 },
    { area: "LLM engineering breadth", pct: 15 },
    { area: "Models and inference", pct: 10 },
    { area: "Capstone", pct: 10 },
    { area: "Security", pct: 5 },
  ],
  durable:
    "If today's frameworks disappear, these still hold: the agent loop itself, tool interface design, context management, error analysis and eval methodology, retrieval quality, cost and latency trade-offs, designing for failure, and trust boundaries.",
  paces: [10, 15, 20],
  afterwards: [
    { id: "course.after.cs336", title: "CS336: Language Modeling from Scratch", url: "https://online.stanford.edu/courses/cs336-language-modeling-scratch", note: "Only if you move toward model engineering. Lectures are free on YouTube." },
  ],
  dropped: [
    { title: "AI Evals for Engineers & PMs (Maven)", why: "$4,200 is over the yearly budget. The free email course, FAQ and CS329Z HW2 cover the method." },
    { title: "DataTalksClub LLM Zoomcamp", why: "A good free course, but a fourth pass at RAG. Donner plus the evals phase cover its material." },
    { title: "Ed Donner's Agentic Track", why: "A tour of five frameworks, the knowledge that goes stale fastest." },
    { title: "Ed Donner's Production Track", why: "Cloud deployment is out of scope for now." },
    { title: "Hugging Face LLM Course", why: "It teaches the transformers library and NLP tasks, which isn't this layer. Karpathy builds better intuition in fewer hours." },
  ],
};

/** Every trackable course and resource on the path, in page order. */
export const COURSE_LINKS: { id: string; title: string }[] = [
  ...coursePath.phases.flatMap(p => p.resources),
  ...coursePath.afterwards,
];

export const coursePathHours = coursePath.phases.reduce((sum, p) => sum + p.hours, 0);

export const coursePathBudget = coursePath.budget.reduce<[number, number]>(
  ([lo, hi], b) => [lo + b.usd[0], hi + b.usd[1]],
  [0, 0],
);
