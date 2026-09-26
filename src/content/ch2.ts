// Chapter 2 — Working With Models (weeks 4–6)
import type { Chapter } from "./types";

export const ch2: Chapter = {
  id: "ch2",
  number: 2,
  title: "Working With Models",
  tagline: "Treat prompting and model choice as engineering, not incantation.",
  description:
    "Build a measured extractor and learn to choose between prompts, model families, and open-model inference.",
  why:
    "Prompting is the cheapest lever you have, and choosing between a prompt, a model family and a fine-tune is a decision you'll make repeatedly. Engineers who measure it ship features they can improve; engineers who guess end up rewriting from scratch.",
  weeks: [
    {
      number: 4,
      title: "Structured extraction & evals",
      focus: "A schema-constrained extractor with a minimal eval runner, so improvement is measured, not felt.",
      build: {
        deliverable: "Build a Structured Extractor with a minimal eval runner.",
        evidence:
          "Start with 30–50 labeled examples, separate development and held-out cases, and report field accuracy, schema validity, and abstentions. Compare a simple rule-based baseline.",
      },
      groups: [
        {
          title: "Prompting the extractor",
          concepts: [
            {
              id: "ch2.c.clear-direct",
              title: "Be clear, direct, and give the why",
              summary:
                "Explaining the audience, goal and constraints behind a request steers a model further than clever phrasing does, because the model can reason about intent instead of guessing at it.",
              minutes: 25,
            },
            {
              id: "ch2.c.few-shot",
              title: "Few-shot (multishot) examples",
              summary:
                "A small set of diverse, representative examples steers format and tone far more reliably than describing the format in prose alone.",
              minutes: 30,
            },
          ],
        },
        {
          title: "Structured output & evaluation",
          concepts: [
            {
              id: "ch2.c.structured-outputs",
              title: "Structured outputs & validation",
              summary:
                "Constraining a response to a JSON schema and then validating it in code with Zod or Pydantic turns free text into something your application can trust and act on.",
              minutes: 35,
            },
            {
              id: "ch2.c.eval-criteria",
              title: "Defining success criteria",
              summary:
                "Before iterating on a prompt, write down what \"correct\" means per field and split your examples into development and held-out sets, or you'll tune against the same data you evaluate on.",
              minutes: 30,
            },
            {
              id: "ch2.c.rule-based-baseline",
              title: "Why a rule-based baseline",
              summary:
                "A regex or simple parser baseline gives you a floor to beat and quickly shows which fields never needed a model call at all.",
              minutes: 20,
            },
          ],
        },
      ],
    },
    {
      number: 5,
      title: "Cross-model comparison",
      focus: "Running the same task against two model families and deciding whether a chain is worth it.",
      build: {
        deliverable: "Run the same task against two model families.",
        evidence:
          "Use identical validation inputs and semantic checks; compare failures, latency, and cost. Add a two-step chain only if error analysis justifies it.",
      },
      groups: [
        {
          title: "Comparing models fairly",
          concepts: [
            {
              id: "ch2.c.model-family-comparison",
              title: "Comparing model families",
              summary:
                "A fair comparison runs identical inputs through each provider's own idioms (not a lowest-common-denominator prompt) and holds the validation set and grading fixed across both.",
              minutes: 30,
            },
            {
              id: "ch2.c.semantic-checks",
              title: "Semantic checks, not exact match",
              summary:
                "Two correct answers rarely share exact text, so grading needs a semantic or rubric-based check instead of a brittle string comparison.",
              minutes: 25,
            },
            {
              id: "ch2.c.errors-retries-timeouts",
              title: "Errors, retries & timeouts across providers",
              summary:
                "429, 529 and 5xx responses call for different handling per provider; comparing failure behavior is as much a part of the model comparison as accuracy is.",
              minutes: 30,
            },
          ],
        },
        {
          title: "When to add a chain",
          concepts: [
            {
              id: "ch2.c.prompt-chaining",
              title: "Prompt chaining",
              summary:
                "Splitting a big task into sequential calls, each with a narrower job, tends to beat one giant prompt on reliability and debuggability — but only add the second step once error analysis shows the single call is the bottleneck.",
              minutes: 30,
            },
            {
              id: "ch2.c.token-counting-api",
              title: "Token counting in practice",
              summary:
                "Counting tokens per provider lets you compare cost apples-to-apples, since input/output pricing and tokenization differ across model families.",
              minutes: 20,
            },
          ],
        },
      ],
    },
    {
      number: 6,
      title: "Open-model inference lab",
      focus: "Running a small open model in Python and comparing it honestly against the hosted baseline.",
      build: {
        deliverable: "Run a small open model in Python and expose the same task interface.",
        evidence:
          "Inspect tokenizer/chat template and tensor shapes; compare memory, speed, and quality with the hosted baseline. Try one supported quantized variant within the hardware budget.",
      },
      groups: [
        {
          title: "Local inference internals",
          concepts: [
            {
              id: "ch2.c.tokenizer-chat-template",
              title: "Tokenizer & chat template",
              summary:
                "An open model's tokenizer and chat template decide exactly how your messages get turned into the token sequence it was trained on, and getting the template wrong silently degrades output quality.",
              minutes: 30,
            },
            {
              id: "ch2.c.tensor-shapes",
              title: "Tensor shapes through a forward pass",
              summary:
                "Tracing batch size, sequence length and hidden dimension through a forward pass turns \"the model\" into something you can actually reason about and debug.",
              minutes: 35,
            },
            {
              id: "ch2.c.quantization-tradeoffs",
              title: "Quantization trade-offs",
              summary:
                "Quantizing weights trades memory and speed against quality, and the right method depends on the hardware budget you actually have, not the best published benchmark.",
              minutes: 30,
            },
          ],
        },
        {
          title: "Comparing to the hosted baseline",
          concepts: [
            {
              id: "ch2.c.memory-speed-quality-comparison",
              title: "Memory, speed & quality, side by side",
              summary:
                "A local open model isn't free — measured against the hosted baseline on the same task, it usually trades some quality for control over cost and data locality, and that trade needs numbers, not a guess.",
              minutes: 30,
            },
          ],
        },
      ],
    },
  ],
  majorObjective:
    "Turn prompting, structured extraction and model choice into a measured practice: an eval-backed extractor compared across model families, and against a small open model run locally in Python.",
  doneWhen:
    "One command compares versioned implementations, including malformed inputs, missing fields, refusals, and truncation. Iterate on development/validation data, then report results on an untouched test split after selecting the implementation. Explain the limits of a small evaluation set.",
  decision:
    "Choose ordinary code, a better prompt, another model, or a chain using measured errors. Identify which failures need new information (retrieval) versus behavioral adaptation (fine-tuning).",
  resources: [
    {
      id: "ch2.r.hamel-evals",
      title: "Your AI Product Needs Evals — Hamel Husain",
      url: "https://hamel.dev/blog/posts/evals/",
      kind: "Article",
      hours: 1,
      use: "must",
      note: "Read before iterating on prompts; use observed errors to define the first evaluation rubric.",
      week: 4,
    },
    {
      id: "ch2.r.prompt-eng-overview",
      title: "Prompt engineering overview & best practices — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview",
      kind: "Docs",
      hours: 1,
      use: "must",
      note: "Select clarity, examples, and context sections relevant to the failures you actually see.",
      week: 4,
    },
    {
      id: "ch2.r.structured-outputs-docs",
      title: "Structured outputs — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs",
      kind: "Docs",
      hours: 0.5,
      use: "reference",
      note: "Use schema constraints plus semantic validation. Handle refusals and token-limit exits; valid structure does not prove correct facts.",
      week: 4,
    },
    {
      id: "ch2.r.develop-test-cases",
      title: "Develop test cases / define success — Claude Docs",
      url: "https://platform.claude.com/docs/en/test-and-evaluate/develop-tests",
      kind: "Docs",
      hours: 0.5,
      use: "reference",
      note: "Define success criteria and separate tuning data from held-out evaluation.",
      week: 4,
    },
    {
      id: "ch2.r.hf-llm-course",
      title: "Hugging Face LLM Course — selected inference sections",
      url: "https://huggingface.co/learn/llm-course",
      kind: "Course",
      hours: 2,
      use: "must",
      note: "Moved into the core path from Continuing. Read only the tokenizer, model loading, and inference sections needed for the lab; allow build time for Python/tensor practice.",
      week: 6,
    },
    {
      id: "ch2.r.quantization-overview",
      title: "Quantization overview — Hugging Face Transformers",
      url: "https://huggingface.co/docs/transformers/quantization/overview",
      kind: "Docs",
      hours: 0.5,
      use: "reference",
      note: "Choose one method supported by your hardware; measure the memory/quality trade-off and note context/KV-cache overhead.",
      week: 6,
      suggested: true,
    },
    {
      id: "ch2.r.prompt-eng-interactive-tutorial",
      title: "Interactive Prompt Engineering Tutorial — Anthropic",
      url: "https://github.com/anthropics/prompt-eng-interactive-tutorial",
      kind: "Course",
      hours: 2,
      use: "bonus",
      note: "Selected exercises only. Examples use the Claude 3 era; check current model support and measure whether each technique helps.",
      week: 4,
    },
    {
      id: "ch2.r.lilian-weng-prompting",
      title: "Prompt Engineering — Lilian Weng",
      url: "https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/",
      kind: "Article",
      hours: 1,
      use: "bonus",
      note: "Historical research survey; treat individual prompting techniques as hypotheses to test.",
      week: 4,
    },
    {
      id: "ch2.r.deeplearning-prompting",
      title: "ChatGPT Prompt Engineering for Developers — DeepLearning.AI",
      url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/",
      kind: "Course",
      hours: 1.5,
      use: "bonus",
      note: "Alternative introduction using the OpenAI API. Concepts transfer, but examples and API behavior are provider-specific.",
      week: 5,
    },
    {
      id: "ch2.r.ai-engineering-prompting",
      title: "AI Engineering (book) — Chip Huyen · ch. 5",
      url: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/",
      kind: "Book",
      hours: 2,
      use: "bonus",
      note: "Deeper prompting background after the extractor works.",
      week: 4,
    },
  ],
  missions: [
    {
      id: "ch2.m1",
      number: 2,
      title: "Measured Structured Extractor",
      track: "Backend",
      hours: 14,
      major: true,
      objective:
        "Build a schema-validated extractor with a minimal eval runner, then run the same task against two model families with identical validation inputs and semantic checks.",
      requirements: [
        "Extract structured fields from real messy text using structured outputs and a Zod/Pydantic schema",
        "Build an eval runner over 30–50 labeled examples, split into development and held-out sets",
        "Report field accuracy, schema validity, and abstention rate; compare against a rule-based baseline",
        "Run the same task against a second model family using identical validation inputs and semantic checks",
        "Compare failures, latency, and cost across model families",
        "Add a two-step chain only where error analysis on the single call justifies it",
      ],
      milestones: [
        { id: "ch2.m1.s1", title: "Schema defined and structured-output extractor implemented", minutes: 45, week: 4 },
        { id: "ch2.m1.s2", title: "30–50 labeled examples split into development/held-out sets", minutes: 50, week: 4 },
        { id: "ch2.m1.s3", title: "Eval runner reporting field accuracy, schema validity, abstentions", minutes: 60, week: 4 },
        { id: "ch2.m1.s4", title: "Rule-based baseline compared against the extractor", minutes: 40, week: 4 },
        { id: "ch2.m1.s5", title: "Same task run against a second model family, identical validation inputs", minutes: 55, week: 5 },
        { id: "ch2.m1.s6", title: "Semantic-check comparison of failures, latency and cost across families", minutes: 50, week: 5 },
        { id: "ch2.m1.s7", title: "Two-step chain added only where error analysis justifies it", minutes: 45, week: 5 },
      ],
      deliverable:
        "One command that runs the structured extractor across two model families and reports field accuracy, schema validity, abstentions, latency and cost against a held-out test split.",
      reflection: [
        "Which failures pointed at a prompt problem, a model choice, or a genuine need for retrieval or fine-tuning?",
        "What did the untouched test split reveal that your development-set iteration didn't?",
        "Was the two-step chain worth its extra latency and cost, and how do you know?",
      ],
      stretch: [
        { id: "ch2.m1.x1", title: "Cache extractor responses by hash of (input, model, schema version)", minutes: 40, week: 5 },
      ],
    },
    {
      id: "ch2.m2",
      number: 3,
      title: "Open-Model Lab",
      track: "Python lab",
      hours: 8,
      major: false,
      objective:
        "Run a small open model locally in Python and expose the same task interface as the hosted extractor, so you can compare inference internals and quality side by side.",
      requirements: [
        "Load a small open model and inspect its tokenizer, chat template and tensor shapes through a forward pass",
        "Expose the same input/output task interface as the hosted Structured Extractor",
        "Compare memory, speed and quality against the hosted baseline on identical inputs",
        "Try one supported quantized variant within the hardware budget and record the trade-off",
      ],
      milestones: [
        { id: "ch2.m2.s1", title: "Small open model loaded, tokenizer/chat template inspected", minutes: 45, week: 6 },
        { id: "ch2.m2.s2", title: "Tensor shapes traced through a forward pass", minutes: 40, week: 6 },
        { id: "ch2.m2.s3", title: "Same task interface wired to the open model", minutes: 50, week: 6 },
        { id: "ch2.m2.s4", title: "Memory/speed/quality comparison against the hosted baseline", minutes: 55, week: 6 },
        { id: "ch2.m2.s5", title: "One quantized variant tried within the hardware budget", minutes: 45, week: 6 },
      ],
      deliverable:
        "A Python script exposing the same extractor interface backed by a small local open model, with a written memory/speed/quality comparison against the hosted baseline.",
      reflection: [
        "What surprised you about tensor shapes or the chat template once you could actually inspect them?",
        "Was the quantized variant a real trade-off for this task, or a strict downgrade?",
      ],
      stretch: [
        { id: "ch2.m2.x1", title: "Try a second quantization method and compare against the first", minutes: 40, week: 6 },
      ],
    },
  ],
  trial: [
    {
      id: "ch2.t.compare-versioned",
      dimension: "Implementation",
      statement: "You can run one command that compares versioned extractor implementations, including malformed inputs, missing fields, refusals and truncation.",
    },
    {
      id: "ch2.t.held-out-report",
      dimension: "Evaluation",
      statement: "You can iterate on development/validation data and then report results on an untouched test split only after selecting an implementation.",
    },
    {
      id: "ch2.t.eval-set-limits",
      dimension: "Understanding",
      statement: "You can explain the limits of a small evaluation set and what conclusions it can't support.",
    },
    {
      id: "ch2.t.choose-by-measurement",
      dimension: "Tradeoffs",
      statement: "You can choose between ordinary code, a better prompt, another model or a chain using measured errors, not intuition.",
    },
    {
      id: "ch2.t.retrieval-vs-finetune",
      dimension: "Explanation",
      statement: "You can identify which failures call for new information (retrieval) versus behavioral adaptation (fine-tuning).",
    },
  ],
  notes: [
    {
      label: "Lab boundary",
      text: "Use a small model that fits available hardware or a capped hosted notebook. This week teaches inference, not production GPU serving. Reserve training for week 18.",
    },
  ],
  skills: { knowledge: 2, building: 1, evaluation: 1 },
};
