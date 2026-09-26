// Chapter 1 — LLM Foundations (weeks 1–3)
import type { Chapter } from "./types";

export const ch1: Chapter = {
  id: "ch1",
  number: 1,
  title: "LLM Foundations",
  tagline: "Build the mental model everything else stands on.",
  description:
    "Make a useful model call immediately, then explain its behavior, failure modes, and cost.",
  why:
    "Every later decision — cost, latency, chunk size, agent design — comes down to tokens, context and sampling. Skip this and you debug by guesswork for the rest of the roadmap.",
  weeks: [
    {
      number: 1,
      title: "First calls & generation",
      focus: "A working mental model of how a model generates text, and your first real API calls.",
      build: {
        deliverable:
          "Build the Prompt Lab CLI: send a task, save the result, and vary one prompt or sampling setting.",
        evidence:
          "A runnable CLI and 10 examples showing successes and failures; inspect tokenization alongside the calls.",
      },
      groups: [
        {
          title: "How generation works",
          concepts: [
            {
              id: "ch1.c.next-token-prediction",
              title: "Next-token prediction",
              summary:
                "A model is trained to predict the next token given everything before it; every capability it has emerges from that one objective repeated at scale.",
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
          title: "Your first calls",
          concepts: [
            {
              id: "ch1.c.first-api-call",
              title: "Your first API call",
              summary:
                "Sending one Messages API request end to end — model, system prompt, a user message, and reading the response's content, stop_reason and usage — is the smallest unit of everything that follows.",
              minutes: 30,
            },
            {
              id: "ch1.c.sampling-temperature",
              title: "Sampling: temperature & top_p",
              summary:
                "Temperature and top_p control how much randomness enters token selection; lower them for extraction and classification, raise them for brainstorming and creative variation.",
              minutes: 30,
            },
            {
              id: "ch1.c.tokenization",
              title: "Tokens & tokenization",
              summary:
                "Text is split into sub-word tokens before the model ever sees it, which is why it can miscount letters in a word and why input and output tokens are billed separately at different rates.",
              minutes: 30,
            },
          ],
        },
      ],
    },
    {
      number: 2,
      title: "Tokens, cost & variance",
      focus: "What actually gets billed, and why the same prompt doesn't always produce the same output.",
      build: {
        deliverable: "Add token/cost estimates and a small comparison report.",
        evidence:
          "Predicted versus billed usage, input/output limits, and repeat-run variation; explain why fluent output can be wrong.",
      },
      groups: [
        {
          title: "Tokens & cost",
          concepts: [
            {
              id: "ch1.c.context-window",
              title: "Context window economics",
              summary:
                "Everything you send costs money and attention: cost scales with context size, and content in the middle of a very long prompt tends to get less effective attention than content at the edges.",
              minutes: 30,
            },
            {
              id: "ch1.c.cost-estimation",
              title: "Pricing & cost estimation",
              summary:
                "A feature's monthly cost is estimated as requests per day times average tokens per request times the per-token price for that model, and a predicted estimate should be checked against what was actually billed.",
              minutes: 35,
            },
          ],
        },
        {
          title: "Reliability of output",
          concepts: [
            {
              id: "ch1.c.sampling-variance",
              title: "Run-to-run variance",
              summary:
                "The same prompt at the same temperature can still produce different outputs on different calls, so any claim about \"the\" output should really be a claim about a distribution of outputs.",
              minutes: 25,
            },
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
      number: 3,
      title: "Resilience & reproducibility",
      focus: "Making the client survive real failures and run the same way from a clean checkout.",
      build: {
        deliverable: "Make the client resilient and reproducible.",
        evidence:
          "Tests for timeout, throttling, refusal, and truncated output; bounded retries, externalized secrets, and pinned dependencies.",
      },
      groups: [
        {
          title: "Handling failure",
          concepts: [
            {
              id: "ch1.c.error-types",
              title: "Errors: retryable vs not",
              summary:
                "A 429 or 529 calls for backoff and another attempt; a 400 means the request itself is wrong and retrying it unchanged will just fail again the same way.",
              minutes: 25,
            },
            {
              id: "ch1.c.retries-backoff",
              title: "Backoff, jitter & timeouts",
              summary:
                "Exponential backoff with jitter and a hard request timeout keep a slow or throttled provider from turning into an unbounded retry loop that stalls or bankrupts the caller.",
              minutes: 30,
            },
            {
              id: "ch1.c.testing-failure-modes",
              title: "Testing failure modes",
              summary:
                "Refusals and truncated (max-tokens) output are not errors the client throws — they're stop reasons the application has to check for and handle explicitly, so they need their own test cases.",
              minutes: 25,
            },
          ],
        },
        {
          title: "Reproducibility",
          concepts: [
            {
              id: "ch1.c.key-hygiene",
              title: "Key hygiene",
              summary:
                "API keys stay server-side and never ship inside a frontend bundle or a log line; set a hard spend limit on any personal account before you start making real calls.",
              minutes: 15,
            },
            {
              id: "ch1.c.pinned-deps",
              title: "Pinned dependencies & clean checkout",
              summary:
                "A CLI that only runs on \"my machine\" isn't done: pinned dependency versions and externalized configuration are what let it run the same way from a fresh clone.",
              minutes: 20,
            },
          ],
        },
      ],
    },
  ],
  majorObjective:
    "Explain how a model produces text, estimate what a feature will cost, and make reliable API calls with keys handled safely.",
  doneWhen:
    "The CLI runs from a clean checkout, reports usage, avoids logging secrets, and handles failed requests without an unbounded retry loop.",
  decision:
    "When is a model call justified over ordinary code, and what quality/cost limits would make you reject it?",
  resources: [
    {
      id: "ch1.r.karpathy-deep-dive",
      title: "Deep Dive into LLMs like ChatGPT — Andrej Karpathy",
      url: "https://www.youtube.com/watch?v=7xTGNNLPyMI",
      kind: "Video",
      hours: 3.5,
      use: "must",
      note: "Watch sections on tokenization, generation, training, and hallucinations alongside observed CLI behavior.",
      week: 1,
      weekEnd: 3,
    },
    {
      id: "ch1.r.3blue1brown-attention",
      title: "Neural networks series (ch. 5–7: Transformers, Attention) — 3Blue1Brown",
      url: "https://www.3blue1brown.com/topics/neural-networks",
      kind: "Video",
      hours: 1.5,
      use: "must",
      note: "Watch the attention/transformer chapters; connect tensors, attention, and next-token prediction to the API mental model.",
      week: 2,
    },
    {
      id: "ch1.r.messages-api-reference",
      title: "Messages API reference — Claude Docs",
      url: "https://platform.claude.com/docs/en/api/messages",
      kind: "Docs",
      hours: 0.5,
      use: "reference",
      note: "Implement one request and inspect response/stop reasons. Return here as needed throughout the roadmap.",
      week: 1,
    },
    {
      id: "ch1.r.pricing",
      title: "Pricing — Anthropic",
      url: "https://claude.com/pricing",
      kind: "Docs",
      hours: 0.25,
      use: "reference",
      note: "Use the API pricing tab; include input, output, and applicable cache charges. Record the pricing date.",
      week: 2,
    },
    {
      id: "ch1.r.token-counting",
      title: "Token counting — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/token-counting",
      kind: "Docs",
      hours: 0.5,
      use: "reference",
      note: "Implement the cost calculator and enforce an input/output budget.",
      week: 2,
    },
    {
      id: "ch1.r.errors-docs",
      title: "Errors — Claude Docs",
      url: "https://platform.claude.com/docs/en/api/errors",
      kind: "Docs",
      hours: 0.25,
      use: "reference",
      note: "Separate retryable failures from errors that require changing the request; respect retry limits.",
      week: 3,
    },
    {
      id: "ch1.r.karpathy-intro-llms",
      title: "Intro to Large Language Models — Andrej Karpathy",
      url: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
      kind: "Video",
      hours: 1,
      use: "bonus",
      note: "A shorter orientation if the deep dive is difficult; not a second required introduction.",
      week: 1,
    },
    {
      id: "ch1.r.anthropic-academy-api",
      title: "Building with the Claude API — Anthropic Academy",
      url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api",
      kind: "Course",
      hours: 8,
      use: "bonus",
      note: "An alternative guided route. Select API fundamentals now; use later modules only when they support the corresponding build.",
      week: 1,
      weekEnd: 3,
    },
    {
      id: "ch1.r.llm-cli",
      title: "LLM CLI — Simon Willison",
      url: "https://llm.datasette.io",
      kind: "Tool",
      hours: 1,
      use: "bonus",
      note: "Compare its experiments/logging ergonomics with your own CLI.",
      week: 3,
    },
  ],
  missions: [
    {
      id: "ch1.m1",
      number: 1,
      title: "Prompt Lab CLI",
      track: "Backend",
      hours: 20,
      major: true,
      objective:
        "Build a command-line tool that runs a prompt against real inputs, reports tokens/cost/latency, and survives real failures — a reusable instrument for every chapter that follows.",
      requirements: [
        "Send a task to the Messages API, save the result, and vary one prompt or sampling setting",
        "Produce 10 example runs showing successes and failures, with tokenization inspected alongside the calls",
        "Report predicted versus billed token usage, input/output limits, and repeat-run variation",
        "Explain, with an example, why fluent output can still be wrong",
        "Add tests for timeout, throttling, refusal, and truncated output",
        "Bound retries with backoff and jitter, externalize secrets, and pin dependencies for a clean-checkout run",
      ],
      milestones: [
        { id: "ch1.m1.s1", title: "Single API call sends a task and saves the result", minutes: 45, week: 1 },
        { id: "ch1.m1.s2", title: "10-example run set showing successes and failures, tokenization inspected", minutes: 60, week: 1 },
        { id: "ch1.m1.s3", title: "Prompt or sampling setting made variable via a flag", minutes: 30, week: 1 },
        { id: "ch1.m1.s4", title: "Token/cost estimator comparing predicted vs billed usage", minutes: 50, week: 2 },
        { id: "ch1.m1.s5", title: "Repeat-run variance report explaining fluent-but-wrong output", minutes: 40, week: 2 },
        { id: "ch1.m1.s6", title: "Timeout, throttling, refusal and truncation test cases", minutes: 55, week: 3 },
        { id: "ch1.m1.s7", title: "Bounded backoff-with-jitter retries, externalized secrets, pinned deps", minutes: 50, week: 3 },
      ],
      deliverable:
        "A CLI that runs from a clean checkout, reports usage and cost, handles failed requests without an unbounded retry loop, and never logs a secret.",
      reflection: [
        "When is a model call justified over ordinary code, and what quality/cost limits would make you reject it?",
        "Which part of the cost formula surprised you most once you saw predicted numbers next to billed ones?",
        "Where did a bounded retry actually save a run versus just delaying an inevitable failure?",
      ],
      stretch: [
        { id: "ch1.m1.x1", title: "Run the same input 5× and report output variance as a distribution", minutes: 40, week: 2 },
        { id: "ch1.m1.x2", title: "Cache responses by hash of (prompt, model, params)", minutes: 45, week: 3 },
      ],
    },
  ],
  trial: [
    {
      id: "ch1.t.run-clean-checkout",
      dimension: "Implementation",
      statement: "You can clone your own repo fresh and get the CLI running with no undocumented local state.",
    },
    {
      id: "ch1.t.debug-retries",
      dimension: "Debugging",
      statement: "You can diagnose why a request failed (retryable vs not) and pick a bounded retry strategy instead of an unbounded loop.",
    },
    {
      id: "ch1.t.explain-fluent-wrong",
      dimension: "Explanation",
      statement: "You can explain, with an example from your own runs, why fluent output can still be wrong.",
    },
    {
      id: "ch1.t.estimate-cost",
      dimension: "Evaluation",
      statement: "You can compare a predicted cost estimate against actually billed usage and account for the gap.",
    },
    {
      id: "ch1.t.justify-model-call",
      dimension: "Tradeoffs",
      statement: "You can justify when a model call is worth it over ordinary code, and state the quality/cost limit that would make you reject it.",
    },
  ],
  skills: { knowledge: 3 },
};
