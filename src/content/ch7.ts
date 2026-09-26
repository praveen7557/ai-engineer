// Chapter 7 — Model Adaptation, Evaluation & Production (weeks 18-21).
import type { Chapter } from "./types";

export const ch7: Chapter = {
  id: "ch7",
  number: 7,
  title: "Model Adaptation, Evaluation & Production",
  tagline: "Turn 'looks good' into numbers you can defend.",
  description:
    "Run a small adaptation experiment, then harden the evaluations and operating behavior developed throughout the course.",
  why:
    "This is what separates hobbyists from professionals. With a real eval suite you can change a prompt, a model, or a fine-tune with confidence; without one every change is a gamble, and load or security failures ship silently.",
  weeks: [
    {
      number: 18,
      title: "Small adaptation experiment",
      focus: "Fine-tune a small open model or adapter on one narrow task and compare it against the alternatives.",
      build: {
        deliverable: "Fine-tune a small open model or adapter on one narrow task.",
        evidence:
          "Use permitted, deduplicated train/validation/test data. Compare the base model, tuned model, and best prompt baseline on held-out cases; save training settings, model revision, and reloadable weights/adapter.",
      },
      groups: [
        {
          title: "Preparing the experiment",
          concepts: [
            {
              id: "ch7.c.narrow-task-selection",
              title: "Choosing one narrow task",
              summary:
                "A fine-tune earns its complexity only on a task narrow enough to have a clear, measurable win over prompting — pick one such task rather than a general capability.",
              minutes: 25,
            },
            {
              id: "ch7.c.dataset-dedup-splits",
              title: "Deduplicated, permitted data splits",
              summary:
                "Train/validation/test splits with duplicates removed and clear data provenance are what make a fine-tuning comparison trustworthy instead of accidentally inflated.",
              minutes: 35,
            },
          ],
        },
        {
          title: "Running & comparing",
          concepts: [
            {
              id: "ch7.c.lora-peft-adapters",
              title: "LoRA / PEFT adapters",
              summary:
                "Training a small low-rank adapter instead of the full model cuts memory and time dramatically, and saving/reloading it is what makes the experiment reproducible.",
              minutes: 40,
            },
            {
              id: "ch7.c.reproducible-training-runs",
              title: "Reproducible training runs",
              summary:
                "Recording training settings, the exact model revision, and reloadable weights is what turns 'it worked once' into a result someone else — including future you — can reproduce.",
              minutes: 30,
            },
          ],
        },
      ],
    },
    {
      number: 19,
      title: "Eval CI gate",
      focus: "Make the eval suite a versioned, calibrated, useful gate in your CI pipeline.",
      build: {
        deliverable: "Make the eval suite a useful CI gate.",
        evidence:
          "Version datasets/rubrics; calibrate a judge against human labels where needed. Report segment failures and uncertainty; rerun variable cases rather than treating tiny score changes as reliable gains.",
      },
      groups: [
        {
          title: "Building the gate",
          concepts: [
            {
              id: "ch7.c.evals-in-ci",
              title: "Evals in CI",
              summary:
                "A regression in your eval score should block the merge, the same way a failing test does; tracking scores over time per prompt and model version is what lets you change either with confidence.",
              minutes: 40,
            },
            {
              id: "ch7.c.golden-datasets",
              title: "Versioned golden datasets",
              summary:
                "A golden set mixes real examples with synthetic ones for coverage — edge cases, unanswerable questions and adversarial inputs — and needs its own version history alongside the rubric that grades it.",
              minutes: 40,
            },
          ],
        },
        {
          title: "Trusting the judge",
          concepts: [
            {
              id: "ch7.c.calibrated-llm-judge",
              title: "Calibrated LLM-as-judge",
              summary:
                "A judge that gives a binary pass/fail with a written critique is only trustworthy once you've checked its agreement against your own labels, including its false-positive and false-negative rates.",
              minutes: 45,
            },
            {
              id: "ch7.c.uncertainty-reporting",
              title: "Reporting uncertainty, not just a score",
              summary:
                "Segment failures and confidence intervals tell you more than one aggregate number, and rerunning a variable case is how you tell a real regression from noise.",
              minutes: 30,
            },
          ],
        },
      ],
    },
    {
      number: 20,
      title: "Load & recovery",
      focus: "Load-test the deployed feature and exercise every recovery path under injected failure.",
      build: {
        deliverable: "Load-test the deployed feature and exercise recovery.",
        evidence:
          "Measure p95 latency and throughput; inject throttling, timeouts, and provider failure. Test queues/backpressure, bounded retries, circuit breaking or graceful degradation, and any chosen fallback.",
      },
      groups: [
        {
          title: "Measuring under load",
          concepts: [
            {
              id: "ch7.c.load-testing-p95",
              title: "Load testing & p95 latency",
              summary:
                "p95 (or p99) latency and throughput under realistic concurrency tell you what your users actually experience, which an average latency number hides.",
              minutes: 35,
            },
            {
              id: "ch7.c.tracing-otel",
              title: "Tracing with OpenTelemetry GenAI conventions",
              summary:
                "Mapping model, retrieval, and tool operations to portable, pinned-version telemetry spans is what makes a load-test failure traceable to a specific step.",
              minutes: 35,
            },
          ],
        },
        {
          title: "Recovery under failure",
          concepts: [
            {
              id: "ch7.c.reliability-patterns",
              title: "Reliability patterns",
              summary:
                "Timeouts, retries with jitter, fallbacks to another model or provider, and circuit breakers keep your app working through 429s, 529s and outright outages instead of cascading into failure.",
              minutes: 40,
            },
            {
              id: "ch7.c.backpressure-load-shedding",
              title: "Backpressure & load shedding",
              summary:
                "Bounded queues, client-side throttling, and deliberately shedding low-priority load are what keep a system merely degraded instead of falling over entirely under overload.",
              minutes: 35,
            },
          ],
        },
      ],
    },
    {
      number: 21,
      title: "Security & release rehearsal",
      focus: "Test injection and spend controls, then rehearse a staged rollout and rollback.",
      build: {
        deliverable: "Perform a security and release rehearsal.",
        evidence:
          "Test injection, data isolation, unsafe output, and excessive spending. Demonstrate a staged rollout and rollback; record alerts, an incident runbook, and cost per successful task.",
      },
      groups: [
        {
          title: "Security rehearsal",
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
              id: "ch7.c.data-isolation-excessive-spend",
              title: "Data isolation & excessive spending",
              summary:
                "Verifying that one tenant's data can't leak into another's answer, and that spend caps actually hold under an adversarial or runaway request, are two of the most consequential checks in a release rehearsal.",
              minutes: 30,
            },
          ],
        },
        {
          title: "Release rehearsal",
          concepts: [
            {
              id: "ch7.c.versioned-rollout",
              title: "Versioned rollout",
              summary:
                "Prompt and model versions behind feature flags, rolled out gradually and shadow-tested against your evals, turn a risky change into a reversible one.",
              minutes: 30,
            },
            {
              id: "ch7.c.incident-runbook-alerts",
              title: "Alerts & an incident runbook",
              summary:
                "Alerts that fire on the metrics you actually care about, paired with a runbook that tells the on-call engineer what to do next, are what turn a rollback plan from theory into something you can execute at 2am.",
              minutes: 30,
            },
          ],
        },
      ],
    },
  ],
  majorObjective:
    "By the end you can run a reproducible adaptation experiment, gate your evals in CI, prove your system survives load and failure, and rehearse a security review and staged release.",
  doneWhen:
    "The adaptation comparison is reproducible, CI catches a deliberately introduced regression, and failure/load drills provide evidence for your stated operating limits. Record remaining security findings rather than declaring the system universally safe.",
  decision:
    "Choose whether to deploy the tuned model or retain the baseline. Justify hosted versus self-hosted inference, routing/fallback, batch versus interactive execution, and quality/latency/cost targets.",
  resources: [
    {
      id: "ch7.r.hf-llm-course-training",
      title: "Hugging Face LLM Course — selected training and dataset sections",
      url: "https://huggingface.co/learn/llm-course",
      kind: "Course",
      hours: 2,
      use: "must",
      note: "Reuse the existing course. Select fine-tuning, dataset curation, and evaluation sections for one narrow experiment; do not assign the entire course.",
      week: 18,
    },
    {
      id: "ch7.r.peft-quicktour",
      title: "PEFT quicktour — Hugging Face",
      url: "https://huggingface.co/docs/peft/quicktour",
      kind: "Docs",
      hours: 1,
      use: "reference",
      note: "Configure a small LoRA experiment and save/reload the adapter. Compare trainable parameters, memory, and held-out performance.",
      week: 18,
      suggested: true,
    },
    {
      id: "ch7.r.llm-as-judge-hamel",
      title: "Using LLM-as-a-Judge — Hamel Husain",
      url: "https://hamel.dev/blog/posts/llm-judge/",
      kind: "Article",
      hours: 1,
      use: "must",
      note: "Calibrate against human judgments; inspect disagreements and avoid judging outputs with unsupported self-confidence scores.",
      week: 19,
    },
    {
      id: "ch7.r.evals-faq",
      title: "LLM Evals FAQ — Hamel Husain & Shreya Shankar",
      url: "https://hamel.dev/blog/posts/evals-faq/",
      kind: "Article",
      hours: 1,
      use: "reference",
      note: "Read the sections needed for datasets, graders, and release decisions; revisit earlier error analysis.",
      week: 19,
    },
    {
      id: "ch7.r.promptfoo-docs",
      title: "Promptfoo docs",
      url: "https://www.promptfoo.dev/docs/intro/",
      kind: "Tool",
      hours: 1,
      use: "reference",
      note: "Put the existing evaluation suite in CI. A custom runner is acceptable if it gives reproducible cases, reports, and gates.",
      week: 19,
    },
    {
      id: "ch7.r.otel-genai-conventions",
      title: "OpenTelemetry GenAI semantic conventions",
      url: "https://github.com/open-telemetry/semantic-conventions-genai",
      kind: "Spec",
      hours: 0.5,
      use: "reference",
      note: "Map model, retrieval, and tool operations to portable telemetry; pin the convention version and omit sensitive payloads by default.",
      week: 20,
    },
    {
      id: "ch7.r.handling-overload",
      title: "Handling Overload — Google SRE Book",
      url: "https://sre.google/sre-book/handling-overload/",
      kind: "Book",
      hours: 1,
      use: "must",
      note: "Apply bounded concurrency, load shedding, and client throttling to a measured failure drill.",
      week: 20,
    },
    {
      id: "ch7.r.owasp-llm-top10",
      title: "OWASP Top 10 for LLM Applications",
      url: "https://genai.owasp.org/llm-top-10/",
      kind: "Spec",
      hours: 1,
      use: "reference",
      note: "Apply remaining relevant entries and retest the controls introduced in Chapters 03–06; retain findings and evidence.",
      week: 21,
    },
    {
      id: "ch7.r.ai-engineering-evals",
      title: "AI Engineering — Chip Huyen · ch. 3-4",
      url: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/",
      kind: "Book",
      hours: 4,
      use: "bonus",
      note: "Deeper evaluation methodology if the current rubric or metrics remain weak.",
      week: 19,
    },
    {
      id: "ch7.r.llm-patterns-eugene",
      title: "Patterns for Building LLM-based Systems — Eugene Yan",
      url: "https://eugeneyan.com/writing/llm-patterns/",
      kind: "Article",
      hours: 1.5,
      use: "bonus",
      note: "Compare system patterns with the bottlenecks and failures in your application.",
      week: 20,
    },
    {
      id: "ch7.r.mitigate-jailbreaks",
      title: "Mitigate jailbreaks & prompt injections — Claude Docs",
      url: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks",
      kind: "Docs",
      hours: 0.5,
      use: "bonus",
      note: "Defense-in-depth ideas. Prompt instructions do not replace authorization, isolation, or output validation.",
      week: 21,
    },
  ],
  missions: [
    {
      id: "ch7.m1",
      number: 13,
      title: "Small Adaptation Experiment",
      track: "Python lab",
      hours: 8,
      major: true,
      objective:
        "Fine-tune a small open model or LoRA adapter on one narrow task and compare it against the base model and your best prompt baseline.",
      requirements: [
        "Permitted, deduplicated train/validation/test data for one narrow task.",
        "A LoRA/adapter (or small full fine-tune) trained and saved as reloadable weights.",
        "Base model, tuned model, and best prompt baseline compared on the same held-out test cases.",
        "Training settings and the exact model revision recorded for reproducibility.",
        "Compute cost estimated before training, with model/license/data provenance recorded.",
      ],
      milestones: [
        { id: "ch7.m1.s1", title: "Assemble permitted, deduplicated train/validation/test data for one narrow task", minutes: 60, week: 18 },
        { id: "ch7.m1.s2", title: "Configure and run a small LoRA experiment, saving the adapter", minutes: 75, week: 18 },
        { id: "ch7.m1.s3", title: "Reload the saved adapter and confirm it reproduces the trained behavior", minutes: 30, week: 18 },
        { id: "ch7.m1.s4", title: "Compare base model, tuned model, and best prompt baseline on held-out cases", minutes: 60, week: 18 },
        { id: "ch7.m1.s5", title: "Record training settings, model revision, and estimated compute cost", minutes: 30, week: 18 },
      ],
      deliverable:
        "A reproducible fine-tuning experiment with saved, reloadable weights and a held-out comparison against the base model and prompt baseline.",
      reflection: [
        "Did the tuned model win on held-out cases, and was the gain worth the training cost?",
        "Would you deploy the tuned model or retain the baseline, and what would change your answer?",
      ],
      stretch: [],
    },
    {
      id: "ch7.m2",
      number: 14,
      title: "Eval CI Gate",
      track: "Backend",
      hours: 7,
      major: true,
      objective:
        "Turn your eval suite into a versioned, calibrated CI gate that catches a deliberately introduced regression before it merges.",
      requirements: [
        "Versioned datasets and rubrics.",
        "A judge calibrated against human labels where an LLM grader is used.",
        "Segment failure reporting and uncertainty, not a single aggregate score.",
        "Variable cases rerun rather than trusting a tiny score change.",
        "A CI job that fails the build on a deliberately introduced regression.",
      ],
      milestones: [
        { id: "ch7.m2.s1", title: "Version your eval datasets and rubrics", minutes: 30, week: 19 },
        { id: "ch7.m2.s2", title: "Calibrate an LLM judge against human labels and report agreement", minutes: 75, week: 19 },
        { id: "ch7.m2.s3", title: "Report segment failures and uncertainty instead of one aggregate score", minutes: 45, week: 19 },
        { id: "ch7.m2.s4", title: "Rerun variable cases and confirm tiny score changes aren't treated as real gains", minutes: 30, week: 19 },
        { id: "ch7.m2.s5", title: "Wire the suite into CI and confirm it fails on a deliberately introduced regression", minutes: 60, week: 19 },
      ],
      deliverable:
        "A CI-gated eval suite with versioned data, a calibrated judge, and a demonstrated catch of an injected regression.",
      reflection: [
        "What regression did you inject, and did the gate actually catch it on the first try?",
        "Where would a false-positive in your judge have slipped past you before you calibrated it?",
      ],
      stretch: [],
    },
    {
      id: "ch7.m3",
      number: 15,
      title: "Load & Recovery Drill",
      track: "Backend",
      hours: 6,
      major: false,
      objective:
        "Load-test a deployed feature and exercise its recovery paths under deliberately injected failure.",
      requirements: [
        "p95 latency and throughput measured under realistic load.",
        "Throttling, timeouts, and provider failure injected deliberately.",
        "Queues/backpressure and bounded retries tested.",
        "A circuit breaker or graceful degradation, plus any chosen fallback, exercised.",
      ],
      milestones: [
        { id: "ch7.m3.s1", title: "Measure p95 latency and throughput under load", minutes: 60, week: 20 },
        { id: "ch7.m3.s2", title: "Inject throttling and timeouts and observe the response", minutes: 45, week: 20 },
        { id: "ch7.m3.s3", title: "Inject a simulated provider failure and verify bounded retries", minutes: 45, week: 20 },
        { id: "ch7.m3.s4", title: "Test queueing/backpressure behavior under sustained load", minutes: 40, week: 20 },
        { id: "ch7.m3.s5", title: "Exercise the circuit breaker or graceful-degradation path and any fallback", minutes: 45, week: 20 },
      ],
      deliverable:
        "A load and failure drill report with p95/throughput numbers and evidence that each recovery path actually works.",
      reflection: [
        "Which failure mode caused the worst degradation, and did your circuit breaker or fallback actually kick in?",
      ],
      stretch: [],
    },
    {
      id: "ch7.m4",
      number: 16,
      title: "Security & Release Rehearsal",
      track: "Security",
      hours: 7,
      major: true,
      objective:
        "Rehearse a security review and a staged release for one deployed feature, and record what you found rather than declaring it safe.",
      requirements: [
        "Injection, data isolation, unsafe output, and excessive-spending tests performed.",
        "A staged rollout demonstrated, with a working rollback.",
        "Alerts and an incident runbook in place.",
        "Cost per successful task recorded.",
        "Remaining findings documented rather than a claim of universal safety.",
      ],
      milestones: [
        { id: "ch7.m4.s1", title: "Test prompt injection (direct and indirect) against the feature", minutes: 60, week: 21 },
        { id: "ch7.m4.s2", title: "Test data isolation and unsafe-output handling", minutes: 45, week: 21 },
        { id: "ch7.m4.s3", title: "Test excessive-spending scenarios and confirm caps hold", minutes: 40, week: 21 },
        { id: "ch7.m4.s4", title: "Demonstrate a staged rollout behind a flag and a working rollback", minutes: 60, week: 21 },
        { id: "ch7.m4.s5", title: "Set up alerts and write a short incident runbook", minutes: 45, week: 21 },
        { id: "ch7.m4.s6", title: "Record cost per successful task and remaining findings", minutes: 30, week: 21 },
      ],
      deliverable:
        "A security and release rehearsal report: passing injection/isolation/spend tests, a demonstrated rollout and rollback, alerts, a runbook, and cost per successful task.",
      reflection: [
        "Which finding would you not ship without fixing, and which are you consciously deferring?",
        "Justify hosted versus self-hosted inference and your routing/fallback choice given what you measured this chapter.",
      ],
      stretch: [],
    },
  ],
  trial: [
    {
      id: "ch7.t.judge-calibration",
      dimension: "Understanding",
      statement: "You can explain why LLM-as-judge needs to be checked against human labels before you trust it.",
    },
    {
      id: "ch7.t.ci-gate-implementation",
      dimension: "Implementation",
      statement: "You can build a versioned, CI-gated eval suite with a calibrated judge and segment-level reporting.",
    },
    {
      id: "ch7.t.load-drill-debugging",
      dimension: "Debugging",
      statement: "You can read a load/failure drill's output and pinpoint which recovery path failed to engage.",
    },
    {
      id: "ch7.t.deploy-tradeoff",
      dimension: "Tradeoffs",
      statement: "You can justify deploying the tuned model or retaining the baseline, given measured quality, cost, and latency.",
    },
    {
      id: "ch7.t.regression-evaluation",
      dimension: "Evaluation",
      statement: "You can demonstrate CI catching a deliberately introduced regression before it merges.",
    },
  ],
  notes: [
    {
      label: "Lab boundary",
      text:
        "Week 18 is one small training run plus a baseline comparison, not a hyperparameter sweep. A tiny model/task is acceptable on constrained hardware; richer experiments are optional. Estimate compute cost before training and include model/license/data provenance in the result. Production cost accounting includes model calls, retries, embeddings, reranking, tools, storage/hosting, and evaluation overhead; report one-time training separately.",
    },
  ],
  skills: { evaluation: 3, production: 3, knowledge: 1 },
};
