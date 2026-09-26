// Chapter 3 — Building AI & Multimodal Applications (weeks 7–9)
import type { Chapter } from "./types";

export const ch3: Chapter = {
  id: "ch3",
  number: 3,
  title: "Building AI & Multimodal Applications",
  tagline: "Ship a streaming, multimodal feature that's safe and affordable.",
  description:
    "Ship a streaming interface and a useful image/document feature with observable, bounded backend behavior.",
  why:
    "A streaming assistant and a document/image extraction feature are two of the most common AI product shapes. The safety, cost and UX patterns you build here — server-side enforcement, redacted tracing, human correction — carry into every later chapter.",
  weeks: [
    {
      number: 7,
      title: "Streaming, authenticated backend",
      focus: "A backend that streams safely, cancels cleanly, and can be traced without leaking sensitive content.",
      build: {
        deliverable: "Put the extractor or assistant behind a streaming UI and authenticated backend.",
        evidence:
          "Test cancellation, interrupted streams, concurrent requests, safe output rendering, and access control. Trace model calls with sensitive content redacted.",
      },
      groups: [
        {
          title: "Streaming backend",
          concepts: [
            {
              id: "ch3.c.backend-proxy",
              title: "Backend proxy pattern",
              summary:
                "The browser never holds the API key; a small, authenticated backend endpoint holds it, forwards requests, and is the only thing that talks to the model.",
              minutes: 30,
            },
            {
              id: "ch3.c.sse-through-backend",
              title: "SSE through your backend",
              summary:
                "Streaming tokens from the model to the browser means re-streaming through your own server, not just piping raw bytes, so you can also log, trim and handle disconnects and concurrent requests along the way.",
              minutes: 35,
            },
            {
              id: "ch3.c.stop-regenerate",
              title: "Cancellation & interrupted streams",
              summary:
                "Canceling an in-flight generation with an AbortController and handling a stream that drops mid-response are what make a chat app feel controllable instead of at the mercy of the connection.",
              minutes: 25,
            },
          ],
        },
        {
          title: "Safety & tracing",
          concepts: [
            {
              id: "ch3.c.safe-rendering",
              title: "Safe rendering",
              summary:
                "Model output is untrusted content: sanitize any markdown or HTML before rendering it, and never pipe model text into innerHTML directly.",
              minutes: 25,
            },
            {
              id: "ch3.c.access-control-tracing",
              title: "Server-side access control & redacted tracing",
              summary:
                "Permission checks belong on the server, not the client, and a trace of each model call needs sensitive content redacted before it's persisted anywhere.",
              minutes: 30,
            },
          ],
        },
      ],
    },
    {
      number: 8,
      title: "Multimodal extraction & correction",
      focus: "Comparing OCR-plus-extractor against direct multimodal input, with a human correction step.",
      build: {
        deliverable: "Build a document/image extraction feature with a human correction step.",
        evidence:
          "Compare text extraction/OCR plus the existing extractor against direct multimodal input on a small labeled set, including unreadable images and tables.",
      },
      groups: [
        {
          title: "Multimodal extraction",
          concepts: [
            {
              id: "ch3.c.multimodal-vision",
              title: "Multimodal (vision) input",
              summary:
                "Images and rendered document pages can be sent directly as input, which skips a separate OCR step but adds meaningfully to token cost and has its own resolution limits.",
              minutes: 25,
            },
            {
              id: "ch3.c.ocr-vs-direct",
              title: "OCR-plus-extractor vs direct multimodal",
              summary:
                "Text extraction/OCR feeding your existing extractor and direct multimodal input are two real architectures for the same feature, and only a labeled comparison — including unreadable images and tables — tells you which wins on accuracy and cost.",
              minutes: 30,
            },
          ],
        },
        {
          title: "Human correction & UX guidance",
          concepts: [
            {
              id: "ch3.c.human-correction-step",
              title: "The human correction step",
              summary:
                "An extraction feature that's wrong 10% of the time needs a fast, obvious way for a person to fix that 10%, or the feature quietly erodes trust instead of saving time.",
              minutes: 25,
            },
            {
              id: "ch3.c.pair-hax",
              title: "PAIR & HAX guidelines",
              summary:
                "Google's PAIR guidebook and Microsoft's HAX toolkit are research-backed checklists for setting expectations, handling errors gracefully, and building trust in AI-driven correction interactions.",
              minutes: 30,
            },
          ],
        },
      ],
    },
    {
      number: 9,
      title: "Restricted pilot",
      focus: "Per-user spend limits, measured responsiveness, and picking the capstone problem.",
      build: {
        deliverable: "Deploy a restricted pilot, enforce per-user spend limits, and measure responsiveness.",
        evidence:
          "Record time to first token, total latency, token usage, and cache hit/miss costs. Gather feedback and select a capstone problem with representative examples.",
      },
      groups: [
        {
          title: "Cost & rate controls",
          concepts: [
            {
              id: "ch3.c.prompt-caching-intro",
              title: "Prompt caching, first pass",
              summary:
                "Putting static content — system prompts, tool definitions, reference documents — first in a request lets the model provider cache it, cutting cost and latency on repeat calls.",
              minutes: 30,
            },
            {
              id: "ch3.c.response-caching",
              title: "Response caching",
              summary:
                "Caching whole responses for identical or near-identical requests avoids paying for the same generation twice, especially for common queries.",
              minutes: 20,
            },
            {
              id: "ch3.c.rate-limits-budgets",
              title: "Rate limits & per-user budgets",
              summary:
                "Provider rate limits protect the provider; your own per-user and per-tenant budgets, enforced server-side, protect you from one user's traffic or misuse driving the whole bill.",
              minutes: 25,
            },
          ],
        },
        {
          title: "Measuring & piloting",
          concepts: [
            {
              id: "ch3.c.latency-measurement",
              title: "Measuring what users feel",
              summary:
                "Time to first token, total latency, and token usage each tell a different part of the story, and finding the actual bottleneck before touching prompts, models or concurrency saves a lot of wasted tuning.",
              minutes: 25,
            },
            {
              id: "ch3.c.capstone-selection",
              title: "Choosing the capstone from pilot feedback",
              summary:
                "Real feedback from a restricted pilot, plus representative examples of what worked and failed, is what turns \"pick a capstone problem\" from a guess into a decision backed by evidence.",
              minutes: 20,
            },
          ],
        },
      ],
    },
  ],
  majorObjective:
    "Ship a streaming, authenticated backend and a multimodal extraction feature with a human correction step, then run a restricted pilot with enforced spend limits and measured latency.",
  doneWhen:
    "A user can complete and correct a real task; failed or cancelled calls have clear UI states; permissions, upload limits, retention, and spend caps are enforced server-side.",
  decision:
    "Choose text parsing/OCR or multimodal inference using accuracy and cost. Decide when streaming, caching, and human review improve the actual workflow.",
  resources: [
    {
      id: "ch3.r.streaming-docs",
      title: "Streaming Messages — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/streaming",
      kind: "Docs",
      hours: 0.5,
      use: "reference",
      note: "Implement the backend stream and cancellation path; reuse Chapter 01 error handling.",
      week: 7,
    },
    {
      id: "ch3.r.sse-mdn",
      title: "Using server-sent events — MDN",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events",
      kind: "Docs",
      hours: 0.5,
      use: "reference",
      note: "Consult transport/event behavior as needed; use a client suited to your authentication and request method.",
      week: 7,
    },
    {
      id: "ch3.r.owasp-preview",
      title: "OWASP Top 10 for LLM Applications",
      url: "https://genai.owasp.org/llm-top-10/",
      kind: "Spec",
      hours: 1,
      use: "must",
      note: "Read prompt injection, sensitive information disclosure, improper output handling, and unbounded consumption before the pilot.",
      week: 7,
    },
    {
      id: "ch3.r.langfuse-docs",
      title: "Langfuse docs",
      url: "https://langfuse.com/docs",
      kind: "Tool",
      hours: 1,
      use: "reference",
      note: "Instrument one end-to-end request and inspect a failure. Decide which content to redact or omit and how long traces persist.",
      week: 7,
    },
    {
      id: "ch3.r.vision-docs",
      title: "Vision — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/vision",
      kind: "Docs",
      hours: 0.5,
      use: "reference",
      note: "Image input, resolution/cost trade-offs, and limitations. Use images or rendered document pages for the bounded lab.",
      week: 8,
      suggested: true,
    },
    {
      id: "ch3.r.pair-guidebook",
      title: "People + AI Guidebook — Google PAIR",
      url: "https://pair.withgoogle.com/guidebook",
      kind: "Docs",
      hours: 1,
      use: "must",
      note: "Select trust, feedback, and user-control guidance; implement one correction or recovery interaction.",
      week: 8,
    },
    {
      id: "ch3.r.hax-guidelines",
      title: "Guidelines for Human-AI Interaction — Microsoft HAX",
      url: "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
      kind: "Docs",
      hours: 1,
      use: "must",
      note: "Use the guidelines to review your feature and document the changes made.",
      week: 8,
    },
    {
      id: "ch3.r.reduce-latency",
      title: "Reduce latency — Claude Docs",
      url: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency",
      kind: "Docs",
      hours: 0.5,
      use: "reference",
      note: "Measure the bottleneck before changing prompts, models, or concurrency.",
      week: 9,
    },
    {
      id: "ch3.r.prompt-caching-docs",
      title: "Prompt caching — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching",
      kind: "Docs",
      hours: 0.5,
      use: "reference",
      note: "Compare cache hits/misses and the effect of prompt structure; do not assume all workloads benefit.",
      week: 9,
    },
    {
      id: "ch3.r.rate-limits-docs",
      title: "Rate limits — Claude Docs",
      url: "https://platform.claude.com/docs/en/api/rate-limits",
      kind: "Docs",
      hours: 0.5,
      use: "reference",
      note: "Handle provider throttling. Implement your own per-user budgets separately from provider quotas.",
      week: 9,
    },
    {
      id: "ch3.r.ai-sdk-docs",
      title: "AI SDK (open-source TypeScript library) docs",
      url: "https://ai-sdk.dev",
      kind: "Docs",
      hours: 2,
      use: "bonus",
      note: "Optional streaming implementation aid; keep failure and authorization behavior explicit.",
      week: 7,
    },
    {
      id: "ch3.r.assistant-ui",
      title: "assistant-ui",
      url: "https://www.assistant-ui.com",
      kind: "Code",
      hours: 1,
      use: "bonus",
      note: "Optional UI primitives to save time on chat scaffolding.",
      week: 7,
    },
  ],
  missions: [
    {
      id: "ch3.m1",
      number: 4,
      title: "Streaming Assistant",
      track: "Full-stack",
      hours: 8,
      major: true,
      objective:
        "Put the extractor or assistant behind a streaming, authenticated backend so users get incremental output over a connection that handles cancellation, concurrency and access control correctly.",
      requirements: [
        "Authenticated backend endpoint that holds the API key and forwards streamed requests",
        "Cancellation of an in-flight generation and handling of an interrupted stream",
        "Concurrent-request handling verified under a small load test",
        "Safe output rendering, verified against an attempted injection",
        "Access control enforced server-side, tested with an unauthorized request",
        "A trace of model calls with sensitive content redacted",
      ],
      milestones: [
        { id: "ch3.m1.s1", title: "Authenticated backend proxy streaming to the browser", minutes: 50, week: 7 },
        { id: "ch3.m1.s2", title: "Cancellation (AbortController) and interrupted-stream handling", minutes: 45, week: 7 },
        { id: "ch3.m1.s3", title: "Concurrent-request test showing correct isolation", minutes: 40, week: 7 },
        { id: "ch3.m1.s4", title: "Safe output rendering verified against an injected payload", minutes: 40, week: 7 },
        { id: "ch3.m1.s5", title: "Access control enforced server-side, tested with an unauthorized request", minutes: 40, week: 7 },
        { id: "ch3.m1.s6", title: "Trace of model calls with sensitive content redacted", minutes: 45, week: 7 },
      ],
      deliverable:
        "A streaming, authenticated backend and UI where cancellation, concurrent requests, safe rendering and access control are all demonstrably enforced, with redacted traces of each call.",
      reflection: [
        "What broke first when you tested cancellation or concurrent requests?",
        "Which OWASP LLM risk did you find you'd already mitigated, and which one required new work?",
      ],
      stretch: [],
    },
    {
      id: "ch3.m2",
      number: 5,
      title: "Document & Image Extraction",
      track: "Full-stack",
      hours: 8,
      major: true,
      objective:
        "Build a document/image extraction feature with a human correction step, comparing OCR-plus-extractor against direct multimodal input on a labeled set.",
      requirements: [
        "Ingest images/documents and run both an OCR-plus-extractor path and a direct multimodal path",
        "Compare accuracy and cost on a small labeled set, including unreadable images and tables",
        "A human correction step for extracted fields",
        "One PAIR or HAX guideline applied to the correction interaction, with the specific change documented",
      ],
      milestones: [
        { id: "ch3.m2.s1", title: "OCR + existing-extractor path implemented", minutes: 55, week: 8 },
        { id: "ch3.m2.s2", title: "Direct multimodal-input path implemented", minutes: 50, week: 8 },
        { id: "ch3.m2.s3", title: "Labeled set with unreadable images/tables; both paths compared", minutes: 60, week: 8 },
        { id: "ch3.m2.s4", title: "Human correction step for extracted fields", minutes: 45, week: 8 },
        { id: "ch3.m2.s5", title: "One PAIR or HAX guideline applied and documented", minutes: 35, week: 8 },
      ],
      deliverable:
        "A document/image extraction feature with a working human correction step, plus a written comparison of OCR-plus-extractor versus direct multimodal input on accuracy and cost.",
      reflection: [
        "Which approach won on accuracy, and did cost change that decision?",
        "What did the PAIR or HAX guideline you applied change about the correction interaction?",
      ],
      stretch: [
        { id: "ch3.m2.x1", title: "Bonus build: add audio transcription and compare word/task accuracy on noisy audio", minutes: 60, week: 8 },
      ],
    },
    {
      id: "ch3.m3",
      number: 6,
      title: "Restricted Pilot",
      track: "Full-stack",
      hours: 7,
      major: false,
      objective:
        "Deploy a restricted pilot of the assistant with per-user spend limits, measure responsiveness, and select a capstone problem from real feedback.",
      requirements: [
        "Deploy to a small, restricted group of real users",
        "Enforce per-user spend limits server-side, independent of provider rate limits",
        "Record time to first token, total latency, token usage, and cache hit/miss costs",
        "Gather feedback and select a capstone problem with representative examples",
      ],
      milestones: [
        { id: "ch3.m3.s1", title: "Restricted pilot deployed to a small user group", minutes: 45, week: 9 },
        { id: "ch3.m3.s2", title: "Per-user spend limits enforced server-side", minutes: 45, week: 9 },
        { id: "ch3.m3.s3", title: "Latency/token/cache-cost measurement report", minutes: 50, week: 9 },
        { id: "ch3.m3.s4", title: "Feedback gathered and capstone problem selected with representative examples", minutes: 40, week: 9 },
      ],
      deliverable:
        "A restricted pilot deployment with enforced per-user spend limits, a measured latency/cost report, and a chosen capstone problem backed by representative examples.",
      reflection: [
        "Where did prompt caching help versus not matter for this workload?",
        "What feedback most changed your view of the capstone problem you picked?",
      ],
      stretch: [],
    },
  ],
  trial: [
    {
      id: "ch3.t.server-side-enforcement",
      dimension: "Understanding",
      statement: "You can explain why permissions, upload limits, retention and spend caps must be enforced server-side, not just in the UI.",
    },
    {
      id: "ch3.t.complete-and-correct",
      dimension: "Implementation",
      statement: "You can build a UI where a user completes and corrects a real task, with clear states for failed and cancelled calls.",
    },
    {
      id: "ch3.t.ocr-vs-multimodal",
      dimension: "Evaluation",
      statement: "You can compare OCR-plus-extractor against direct multimodal input on accuracy and cost and justify which one you'd ship.",
    },
    {
      id: "ch3.t.when-review-helps",
      dimension: "Tradeoffs",
      statement: "You can decide when streaming, caching and human review actually improve a workflow instead of adding complexity for its own sake.",
    },
    {
      id: "ch3.t.trace-redacted",
      dimension: "Debugging",
      statement: "You can trace a model call end to end with sensitive content redacted and use that trace to diagnose a failure.",
    },
  ],
  notes: [
    {
      label: "Bonus build",
      text: "Add audio transcription and compare word/task accuracy on noisy audio. Realtime voice and video pipelines are extensions, not prerequisites for finishing the core track.",
    },
    {
      label: "Deployment",
      text: "Deploy only to an org-approved platform (Cloudflare or Google Cloud Platform); any other hosting provider needs the company's procurement and security approval first.",
    },
  ],
  skills: { building: 3, systemDesign: 1, production: 1 },
};
