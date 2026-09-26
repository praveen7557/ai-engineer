// Chapter 7 — Evaluation & Production (weeks 19-21).
import type { Chapter } from "./types";

export const ch7: Chapter = {
  id: "ch7",
  number: 7,
  title: "Evaluation & Production",
  tagline: "Turn 'looks good' into numbers you can defend.",
  description:
    "Build the eval suite, tracing and security review that separate a demo from a product, then make the whole thing fast, cheap and reliable.",
  why:
    "This is what separates hobbyists from professionals. With evals you can change a prompt or model with confidence; without them every change is a gamble, and security holes ship silently.",
  weeks: [
    {
      number: 19,
      title: "Eval fundamentals",
      focus: "Turn vague quality judgments into a measurable, repeatable eval process.",
      groups: [
        {
          title: "From vibes to categories",
          concepts: [
            {
              id: "ch7.c.error-analysis-first",
              title: "Error analysis first",
              summary:
                "Read 50-100 real traces, write free-form notes on every failure, then group the notes into categories — this is the highest-leverage hour you'll spend on evals.",
              minutes: 90,
            },
            {
              id: "ch7.c.success-criteria",
              title: "Define success criteria",
              summary:
                "'Cites a valid source in ≥95% of answers' is a success criterion; 'good answers' is not — specific and measurable criteria are what make an eval actionable.",
              minutes: 30,
            },
            {
              id: "ch7.c.golden-datasets",
              title: "Golden datasets",
              summary:
                "A golden set mixes real examples with synthetic ones for coverage — edge cases, unanswerable questions and adversarial inputs your real traffic hasn't produced yet.",
              minutes: 45,
            },
          ],
        },
        {
          title: "Grading the output",
          concepts: [
            {
              id: "ch7.c.grader-types",
              title: "Grader types",
              summary:
                "Code-based graders (exact match, regex, schema), LLM-as-judge, and human review each have a cost and a ceiling — use the cheapest grader that still catches the failure you care about.",
              minutes: 35,
            },
            {
              id: "ch7.c.calibrated-llm-judge",
              title: "Calibrated LLM-as-judge",
              summary:
                "A judge that gives a binary pass/fail with a written critique is only trustworthy once you've checked its agreement against your own labels, including its false-positive and false-negative rates.",
              minutes: 45,
            },
          ],
        },
      ],
    },
    {
      number: 20,
      title: "Eval ops & observability",
      focus: "Make evals a routine part of shipping, and see what your system does in production.",
      groups: [
        {
          title: "Evals as infrastructure",
          concepts: [
            {
              id: "ch7.c.evals-in-ci",
              title: "Evals in CI",
              summary:
                "A regression in your eval score should block the merge, the same way a failing test does; tracking scores over time per prompt and model version is what lets you change either with confidence.",
              minutes: 40,
            },
            {
              id: "ch7.c.agent-trajectory-evals",
              title: "Agent & trajectory evals",
              summary:
                "For an agent, check the final outcome and the trajectory it took to get there, run multi-turn scenarios, and repeat each one (pass@k) because agents are non-deterministic.",
              minutes: 40,
            },
          ],
        },
        {
          title: "Seeing production",
          concepts: [
            {
              id: "ch7.c.tracing",
              title: "Tracing",
              summary:
                "Spans for every model call, tool call and retrieval step, following the OpenTelemetry GenAI semantic conventions, turn a black-box request into something you can actually inspect.",
              minutes: 40,
            },
            {
              id: "ch7.c.observability-tooling",
              title: "Observability tooling",
              summary:
                "Self-hostable tools like Langfuse or Phoenix give you traces, cost, latency and datasets in one place, without sending your data to a third party you haven't reviewed.",
              minutes: 30,
            },
            {
              id: "ch7.c.online-signals",
              title: "Online signals",
              summary:
                "Thumbs up/down, user edits to the output, task completion and escalation rate are real signals of quality that your offline eval set can't see.",
              minutes: 25,
            },
            {
              id: "ch7.c.ab-shadow-testing",
              title: "A/B & shadow testing",
              summary:
                "Comparing a prompt or model change against the current version — live for a slice of traffic, or silently in shadow — catches regressions your eval set missed.",
              minutes: 30,
            },
          ],
        },
      ],
    },
    {
      number: 21,
      title: "Security & production hardening",
      focus: "Defend your app against prompt injection, and make it fast, cheap and reliable under real load.",
      groups: [
        {
          title: "LLM security",
          concepts: [
            {
              id: "ch7.c.owasp-llm-top-10",
              title: "OWASP LLM Top 10",
              summary:
                "The industry checklist for LLM-application risks — prompt injection, sensitive information disclosure, excessive agency, improper output handling and more — is the baseline every shipped app should be checked against.",
              minutes: 60,
            },
            {
              id: "ch7.c.prompt-injection",
              title: "Direct vs indirect prompt injection",
              summary:
                "Direct injection comes from the user; indirect injection hides in a document, a web page, an issue or a tool result the model reads — the second kind is far easier to miss.",
              minutes: 35,
            },
            {
              id: "ch7.c.lethal-trifecta",
              title: "The lethal trifecta",
              summary:
                "Private data, plus untrusted content, plus a way to send data out, equals an exfiltration risk — removing any one of the three legs closes the attack.",
              minutes: 25,
            },
            {
              id: "ch7.c.output-handling-privacy",
              title: "Output handling & privacy",
              summary:
                "Model output is untrusted: sanitize any markdown or HTML it produces, never eval or build SQL from it, and redact PII before it reaches your logs.",
              minutes: 30,
            },
          ],
        },
        {
          title: "Production hardening",
          concepts: [
            {
              id: "ch7.c.reliability-patterns",
              title: "Reliability patterns",
              summary:
                "Timeouts, retries with jitter, fallbacks to another model or provider, and circuit breakers keep your app working through 429s, 529s and outright outages instead of cascading into failure.",
              minutes: 40,
            },
            {
              id: "ch7.c.model-routing-batch",
              title: "Model routing & batch processing",
              summary:
                "Start with a small model and escalate on low confidence or hard inputs, and move offline or bulk work onto the batch API for a meaningful discount.",
              minutes: 35,
            },
            {
              id: "ch7.c.durable-workflows-idempotency",
              title: "Durable workflows & idempotency",
              summary:
                "A long-running agent should checkpoint and resume after a crash rather than restart from zero, and every side-effecting tool needs an idempotency key so a retry can't double-send or double-charge.",
              minutes: 40,
            },
            {
              id: "ch7.c.versioned-rollout",
              title: "Versioned rollout",
              summary:
                "Prompt and model versions behind feature flags, rolled out gradually and shadow-tested against your evals, turn a risky change into a reversible one.",
              minutes: 30,
            },
          ],
        },
      ],
    },
  ],
  majorObjective:
    "By the end you can ship an AI feature with a CI-gated eval suite, tracing, a passed security review and a defensible cost/latency budget.",
  resources: [
    {
      id: "ch7.r.evals-hamel",
      title: "Your AI Product Needs Evals — Hamel Husain",
      url: "https://hamel.dev/blog/posts/evals/",
      kind: "Article",
      hours: 1,
      required: true,
      note: "The most-cited practical evals essay. Start here.",
      week: 19,
    },
    {
      id: "ch7.r.llm-as-judge-hamel",
      title: "Using LLM-as-a-Judge — Hamel Husain",
      url: "https://hamel.dev/blog/posts/llm-judge/",
      kind: "Article",
      hours: 1,
      required: true,
      note: "How to build a judge you can trust, including critique shadowing.",
      week: 19,
    },
    {
      id: "ch7.r.evals-faq",
      title: "LLM Evals FAQ — Hamel Husain & Shreya Shankar",
      url: "https://hamel.dev/blog/posts/evals-faq/",
      kind: "Article",
      hours: 1.5,
      required: true,
      note: "Answers to the questions you'll hit in practice.",
      week: 19,
    },
    {
      id: "ch7.r.develop-test-cases",
      title: "Develop test cases / define success — Claude Docs",
      url: "https://platform.claude.com/docs/en/test-and-evaluate/develop-tests",
      kind: "Docs",
      hours: 1,
      required: true,
      note: "Success criteria and grading methods, with code examples.",
      week: 19,
    },
    {
      id: "ch7.r.ai-engineering-evals",
      title: "AI Engineering — Chip Huyen · ch. 3-4",
      url: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/",
      kind: "Book",
      hours: 4,
      required: false,
      note: "Evaluation methodology in depth.",
      week: 19,
    },
    {
      id: "ch7.r.demystifying-agent-evals",
      title: "Demystifying evals for AI agents — Anthropic",
      url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
      kind: "Article",
      hours: 0.75,
      required: true,
      note: "How Anthropic approaches agent evaluation.",
      week: 20,
    },
    {
      id: "ch7.r.promptfoo-docs",
      title: "Promptfoo docs",
      url: "https://www.promptfoo.dev/docs/intro/",
      kind: "Tool",
      hours: 1.5,
      required: true,
      note: "An open-source eval runner with CI integration and red-team plugins.",
      week: 20,
    },
    {
      id: "ch7.r.langfuse-docs",
      title: "Langfuse docs",
      url: "https://langfuse.com/docs",
      kind: "Tool",
      hours: 1,
      required: true,
      note: "Open-source tracing and evals; self-host with Docker.",
      week: 20,
    },
    {
      id: "ch7.r.otel-genai-conventions",
      title: "OpenTelemetry GenAI semantic conventions",
      url: "https://github.com/open-telemetry/semantic-conventions-genai",
      kind: "Spec",
      hours: 0.5,
      required: false,
      note: "Standard span attributes for LLM calls.",
      week: 20,
    },
    {
      id: "ch7.r.llm-patterns-eugene",
      title: "Patterns for Building LLM-based Systems — Eugene Yan",
      url: "https://eugeneyan.com/writing/llm-patterns/",
      kind: "Article",
      hours: 1.5,
      required: false,
      note: "Evals, RAG, guardrails, caching and feedback patterns in one survey.",
      week: 20,
    },
    {
      id: "ch7.r.owasp-llm-top10",
      title: "OWASP Top 10 for LLM Applications",
      url: "https://genai.owasp.org/llm-top-10/",
      kind: "Spec",
      hours: 2,
      required: true,
      note: "The industry checklist. Read every entry and map it to your apps.",
      week: 21,
    },
    {
      id: "ch7.r.lethal-trifecta-willison",
      title: "The lethal trifecta for AI agents — Simon Willison",
      url: "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/",
      kind: "Article",
      hours: 0.3,
      required: true,
      note: "The single most useful mental model for agent security.",
      week: 21,
    },
    {
      id: "ch7.r.mitigate-jailbreaks",
      title: "Mitigate jailbreaks & prompt injections — Claude Docs",
      url: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks",
      kind: "Docs",
      hours: 0.5,
      required: false,
      note: "Guardrail techniques at the prompt and system level.",
      week: 21,
    },
    {
      id: "ch7.r.reduce-latency",
      title: "Reduce latency — Claude Docs",
      url: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency",
      kind: "Docs",
      hours: 0.5,
      required: false,
      note: "The official latency checklist.",
      week: 21,
    },
    {
      id: "ch7.r.handling-overload-sre",
      title: "Handling Overload — Google SRE Book",
      url: "https://sre.google/sre-book/handling-overload/",
      kind: "Book",
      hours: 1,
      required: false,
      note: "Load shedding and client-side throttling; applies directly to LLM calls.",
      week: 21,
    },
    {
      id: "ch7.r.idempotency-stripe",
      title: "Designing robust APIs with idempotency — Stripe",
      url: "https://stripe.com/blog/idempotency",
      kind: "Article",
      hours: 0.5,
      required: false,
      note: "The classic idempotency-keys write-up, directly applicable to side-effecting tools.",
      week: 21,
    },
  ],
  missions: [
    {
      id: "ch7.m1",
      number: 16,
      title: "Eval Suite for Ask-My-Docs",
      track: "Backend",
      hours: 15,
      major: true,
      objective:
        "Build a proper eval harness for your Ask-My-Docs app, including tracing, that runs in CI and blocks a regression before it ships.",
      requirements: [
        "Error analysis on real traces, grouped into named failure categories.",
        "A 50-case golden set, including unanswerable and adversarial questions.",
        "Code graders plus a calibrated LLM judge, and a runner that produces a scores table gated in CI.",
        "Tracing across model calls, tool calls and retrieval steps, with a cost and latency dashboard per request.",
      ],
      milestones: [
        { id: "ch7.m1.s1", title: "Read 50 real traces and write your failure categories", minutes: 90 },
        { id: "ch7.m1.s2", title: "Build a 50-case golden set, including unanswerable and adversarial questions", minutes: 60 },
        { id: "ch7.m1.s3", title: "Write code graders: citation present, citation valid, format correct", minutes: 60 },
        { id: "ch7.m1.s4", title: "Build an LLM judge for faithfulness, checked against 30 hand labels with agreement reported", minutes: 75 },
        { id: "ch7.m1.s5", title: "Wire up a runner (promptfoo or your own) that produces a scores table", minutes: 60 },
        { id: "ch7.m1.s6", title: "Add a CI job that fails the build when the score drops past a threshold", minutes: 45 },
        { id: "ch7.m1.s7", title: "Add tracing spans for every model call, tool call and retrieval step", minutes: 60 },
        { id: "ch7.m1.s8", title: "Wire up self-hosted Langfuse or OTel-to-console", minutes: 45 },
        { id: "ch7.m1.s9", title: "Build a dashboard view of tokens, latency and cost per request and per user", minutes: 60 },
      ],
      deliverable:
        "A CI-gated eval suite for Ask-My-Docs with a reported judge-agreement rate, plus full tracing and a cost/latency dashboard.",
      reflection: [
        "Which failure category was the largest, and did fixing it change your architecture or just your prompt?",
        "How much do you trust your LLM judge, and what evidence backs that number?",
      ],
      stretch: [{ id: "ch7.m1.x1", title: "Build a dashboard of eval scores across commits over time", minutes: 60 }],
    },
    {
      id: "ch7.m2",
      number: 17,
      title: "Agent Evals & Model Swap",
      track: "Backend",
      hours: 8,
      major: false,
      objective:
        "Write scenario-based evals for your Issue Triage Agent, then use the same discipline to decide whether a smaller model still passes.",
      requirements: [
        "20 scenario fixtures, each an issue plus its expected label and route.",
        "Trajectory checks: the agent never posts without approval, stays within a step budget, and used the right tools.",
        "Each scenario run 3x, with pass rate and variance reported.",
        "A model swap (e.g. Sonnet to Haiku) on one task, evaluated the same way.",
      ],
      milestones: [
        { id: "ch7.m2.s1", title: "Build 20 scenario fixtures: issue plus expected label and route", minutes: 60 },
        { id: "ch7.m2.s2", title: "Write trajectory checks: no unapproved posts, step budget, correct tools used", minutes: 60 },
        { id: "ch7.m2.s3", title: "Run each scenario 3x and report pass rate and variance", minutes: 45 },
        { id: "ch7.m2.s4", title: "Swap models on one task and rerun the same evals", minutes: 40 },
        { id: "ch7.m2.s5", title: "Build a results table (quality, cost, latency) and write a recommendation you'd defend", minutes: 40 },
      ],
      deliverable: "A scenario-based eval suite for the triage agent, plus a defensible recommendation on the model swap.",
      reflection: [
        "Which trajectory check caught something a final-answer-only check would have missed?",
        "Did the smaller model's failures cluster in one category, or were they spread evenly?",
      ],
      stretch: [],
    },
    {
      id: "ch7.m3",
      number: 18,
      title: "Red-Team Your Own Apps",
      track: "Security",
      hours: 6,
      major: true,
      objective: "Attack the apps you've built, fix what breaks, and write it up like a real security report.",
      requirements: [
        "A written threat model covering the data, tools and exfiltration paths in each app.",
        "A planted indirect injection in a document and in an issue.",
        "An attempt to trigger an unapproved tool call or exfiltrate data (e.g. via a markdown image URL).",
        "Fixes applied — least privilege, approval gates, output sanitization, an egress allowlist — with an automated check that each fix holds.",
      ],
      milestones: [
        { id: "ch7.m3.s1", title: "Write a threat model: the data, tools and exfiltration paths in each app", minutes: 60 },
        { id: "ch7.m3.s2", title: "Plant an indirect injection in a document and in an issue", minutes: 45 },
        { id: "ch7.m3.s3", title: "Try to trigger an unapproved tool call and to exfiltrate data via a markdown image URL", minutes: 60 },
        { id: "ch7.m3.s4", title: "Apply fixes: least privilege, approval gates, output sanitization, egress allowlist", minutes: 75 },
        { id: "ch7.m3.s5", title: "Write a findings report: attack, impact, fix, and an automated check that the fix holds", minutes: 60 },
      ],
      deliverable: "A findings report on your own apps, with each attack fixed and covered by an automated regression check.",
      reflection: [
        "Which fix removed a leg of the lethal trifecta, and which app still has all three?",
        "What would you have missed without writing the threat model first?",
      ],
      stretch: [{ id: "ch7.m3.x1", title: "Run promptfoo's red-team plugins against the app", minutes: 45 }],
    },
    {
      id: "ch7.m4",
      number: 19,
      title: "Cost, Latency & Reliability Pass",
      track: "Backend",
      hours: 8,
      major: false,
      objective:
        "Take Ask-My-Docs and make it cheaper, faster and harder to knock over, without losing quality — and prove it with your own evals.",
      requirements: [
        "A baseline measurement: cost per request, p50/p95 latency and eval score.",
        "Model routing (cheap steps to a small model, hard steps to a larger one) and a response cache for repeated questions.",
        "Retries with backoff, a circuit breaker, and a fallback path for an overloaded or failing model call.",
        "A final measurement showing the same or better numbers, with the eval score no worse than baseline.",
      ],
      milestones: [
        { id: "ch7.m4.s1", title: "Measure the baseline: cost per request, p50/p95 latency and eval score", minutes: 45 },
        { id: "ch7.m4.s2", title: "Route cheap steps (e.g. query rewriting) to a smaller model, answers to a larger one", minutes: 45 },
        { id: "ch7.m4.s3", title: "Add a response cache for repeated questions", minutes: 40 },
        { id: "ch7.m4.s4", title: "Add retries with backoff and a circuit breaker around the primary model call", minutes: 50 },
        { id: "ch7.m4.s5", title: "Add a fallback path for when the primary model returns overloaded or fails", minutes: 40 },
        { id: "ch7.m4.s6", title: "Re-measure everything and confirm the eval score is no worse than baseline", minutes: 40 },
      ],
      deliverable: "Ask-My-Docs with measured before/after cost, latency and reliability numbers, and no drop in eval score.",
      reflection: [
        "Which single change gave you the best cost or latency win for the least risk?",
        "Did any change move latency and cost in opposite directions, and how did you decide the trade-off?",
      ],
      stretch: [{ id: "ch7.m4.x1", title: "Move an offline or bulk variant of the pipeline onto the batch API", minutes: 45 }],
    },
  ],
  trial: [
    {
      id: "ch7.t.judge-calibration",
      dimension: "Understanding",
      statement: "You can explain why LLM-as-judge needs to be checked against human labels before you trust it.",
    },
    {
      id: "ch7.t.golden-set-ci",
      dimension: "Implementation",
      statement: "You can build a golden eval set with adversarial and unanswerable cases and wire it into CI.",
    },
    {
      id: "ch7.t.trace-debugging",
      dimension: "Debugging",
      statement: "You can read an agent trace and pinpoint which step caused a wrong answer.",
    },
    {
      id: "ch7.t.model-swap-evaluation",
      dimension: "Evaluation",
      statement: "You can measure whether a model swap changed quality, cost or latency, and by how much.",
    },
    {
      id: "ch7.t.lethal-trifecta-tradeoffs",
      dimension: "Tradeoffs",
      statement: "You can explain the lethal trifecta and name which leg you removed in your own app.",
    },
    {
      id: "ch7.t.red-team-independence",
      dimension: "Independence",
      statement: "You can red-team your own AI app end to end and fix what you find without being told how.",
    },
  ],
  skills: { evaluation: 3, production: 3 },
};
