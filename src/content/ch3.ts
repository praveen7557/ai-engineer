// Chapter 3 — Building AI Applications (weeks 7–9)
import type { Chapter } from "./types";

export const ch3: Chapter = {
  id: "ch3",
  number: 3,
  title: "Building AI Applications",
  tagline: "Ship a real chat surface, then make it feel intentional.",
  description:
    "Three weeks building a full-stack streaming chat app behind a backend proxy, then applying AI-native UX patterns and hardening the result for safe, affordable production use.",
  why:
    "A chatbot is the smallest complete AI product: a backend that guards the key and manages state, and a frontend that has to render an uncertain, streaming, sometimes-wrong output. Everything you learn here about state, streaming and safety carries into every later chapter.",
  weeks: [
    {
      number: 7,
      title: "Full-stack chat",
      focus: "A backend proxy that streams to the browser and manages conversation state.",
      groups: [
        {
          title: "Backend & state",
          concepts: [
            {
              id: "ch3.c.backend-proxy",
              title: "Backend proxy pattern",
              summary:
                "The browser never holds the API key; a small backend endpoint holds it, forwards requests, and is the only thing that talks to the model.",
              minutes: 30,
            },
            {
              id: "ch3.c.sse-through-backend",
              title: "SSE through your backend",
              summary:
                "Streaming tokens from the model to the browser means re-streaming through your own server, not just piping raw bytes, so you can also log, trim and handle disconnects along the way.",
              minutes: 35,
            },
            {
              id: "ch3.c.conversation-trimming",
              title: "Conversation state & trimming",
              summary:
                "As a conversation grows toward the context limit, you need a strategy — trimming old turns, summarizing them, or both — decided in code, not left to chance.",
              minutes: 30,
            },
          ],
        },
        {
          title: "Persistence & controls",
          concepts: [
            {
              id: "ch3.c.persistence",
              title: "Persisting conversations",
              summary:
                "Storing conversation history in a database turns a session-only demo into something a user can leave and come back to, and it's what later evals and tracing will read from.",
              minutes: 25,
            },
            {
              id: "ch3.c.stop-regenerate",
              title: "Stop & regenerate",
              summary:
                "Canceling an in-flight generation with an AbortController and offering a clean regenerate are small features that make a chat app feel controllable instead of at the mercy of the model.",
              minutes: 25,
            },
          ],
        },
      ],
    },
    {
      number: 8,
      title: "AI-native UX",
      focus: "Rendering uncertainty and partial results, and going beyond the chatbot.",
      groups: [
        {
          title: "Streaming & generative UI",
          concepts: [
            {
              id: "ch3.c.streaming-ui-patterns",
              title: "Streaming UI patterns",
              summary:
                "Skeleton, partial, complete and error states each need distinct treatment so a user always knows whether the app is thinking, has partially answered, or has failed.",
              minutes: 30,
            },
            {
              id: "ch3.c.partial-json",
              title: "Parsing partial JSON",
              summary:
                "Structured output arrives incrementally too, so rendering it live means parsing an incomplete JSON string safely instead of waiting for the whole response.",
              minutes: 30,
            },
            {
              id: "ch3.c.generative-ui",
              title: "Generative UI",
              summary:
                "When the model returns structured data or a tool call, you render real components from it instead of raw markdown, which is what makes an AI feature feel native to the app.",
              minutes: 30,
            },
          ],
        },
        {
          title: "Designing for uncertainty",
          concepts: [
            {
              id: "ch3.c.designing-uncertainty",
              title: "Designing for uncertainty",
              summary:
                "Citations, editable output, accept/reject controls and undo all communicate that the model might be wrong and give the user an easy way to correct it.",
              minutes: 25,
            },
            {
              id: "ch3.c.beyond-chatbot",
              title: "Beyond the chatbot",
              summary:
                "Inline suggestions, command palettes, autofill and in-context summaries put AI where the user is already working instead of routing everything through a sidebar.",
              minutes: 25,
            },
            {
              id: "ch3.c.pair-hax",
              title: "PAIR & HAX guidelines",
              summary:
                "Google's PAIR guidebook and Microsoft's HAX toolkit are research-backed checklists for setting expectations, handling errors gracefully, and building trust in AI-driven interfaces.",
              minutes: 30,
            },
          ],
        },
      ],
    },
    {
      number: 9,
      title: "Shipping safely & cheaply",
      focus: "XSS-safe rendering, accessibility, and the caching and budget controls that keep a feature affordable.",
      groups: [
        {
          title: "Safety & accessibility",
          concepts: [
            {
              id: "ch3.c.safe-rendering",
              title: "Safe rendering",
              summary:
                "Model output is untrusted content: sanitize any markdown or HTML before rendering it, and never pipe model text into innerHTML directly.",
              minutes: 25,
            },
            {
              id: "ch3.c.aria-live",
              title: "aria-live accessibility",
              summary:
                "Streamed content needs aria-live regions and careful focus management so a screen reader announces updates sensibly instead of re-reading the whole response on every token.",
              minutes: 25,
            },
          ],
        },
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
                "Provider rate limits protect the provider; your own per-user and per-tenant budgets protect you from one user's traffic or misuse driving the whole bill.",
              minutes: 25,
            },
          ],
        },
      ],
    },
  ],
  majorObjective:
    "Ship a full-stack streaming chat app with a safe backend, and apply the same patterns to make an AI feature feel native inside a real UI.",
  resources: [
    {
      id: "ch3.r.streaming-docs",
      title: "Streaming Messages — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/streaming",
      kind: "Docs",
      hours: 0.5,
      required: true,
      note: "The SSE event types your backend proxy re-streams to the browser.",
      week: 7,
    },
    {
      id: "ch3.r.sse-mdn",
      title: "Using server-sent events — MDN",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events",
      kind: "Docs",
      hours: 0.5,
      required: true,
      note: "The SSE fundamentals under every streaming UI you'll build.",
      week: 7,
    },
    {
      id: "ch3.r.pair-guidebook",
      title: "People + AI Guidebook — Google PAIR",
      url: "https://pair.withgoogle.com/guidebook",
      kind: "Docs",
      hours: 2,
      required: true,
      note: "Patterns for trust, explanations and feedback in AI-driven interfaces.",
      week: 8,
    },
    {
      id: "ch3.r.hax-guidelines",
      title: "Guidelines for Human-AI Interaction — Microsoft HAX",
      url: "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
      kind: "Docs",
      hours: 1,
      required: true,
      note: "18 research-backed interaction guidelines for setting expectations and handling errors.",
      week: 8,
    },
    {
      id: "ch3.r.ai-sdk-docs",
      title: "AI SDK (open-source TypeScript library) docs",
      url: "https://ai-sdk.dev",
      kind: "Docs",
      hours: 2,
      required: false,
      note: "Streaming UI and generative UI patterns in React; learn the patterns even if you build your own.",
      week: 8,
    },
    {
      id: "ch3.r.assistant-ui",
      title: "assistant-ui",
      url: "https://www.assistant-ui.com",
      kind: "Code",
      hours: 1,
      required: false,
      note: "Composable React chat primitives; study how they handle streaming state.",
      week: 8,
    },
    {
      id: "ch3.r.reduce-latency",
      title: "Reduce latency — Claude Docs",
      url: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency",
      kind: "Docs",
      hours: 0.5,
      required: true,
      note: "The official latency checklist, directly relevant to a chat app that has to feel responsive.",
      week: 9,
    },
    {
      id: "ch3.r.prompt-caching-docs",
      title: "Prompt caching — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching",
      kind: "Docs",
      hours: 1,
      required: true,
      note: "Structure prompts for cache hits; pricing and TTLs.",
      week: 9,
    },
    {
      id: "ch3.r.rate-limits-docs",
      title: "Rate limits — Claude Docs",
      url: "https://platform.claude.com/docs/en/api/rate-limits",
      kind: "Docs",
      hours: 0.5,
      required: true,
      note: "How limits are measured and how to read the response headers, needed for the per-user budget requirement.",
      week: 9,
    },
    {
      id: "ch3.r.errors-docs",
      title: "Errors — Claude Docs",
      url: "https://platform.claude.com/docs/en/api/errors",
      kind: "Docs",
      hours: 0.25,
      required: false,
      note: "Which errors to retry and which to surface to the chat UI.",
      week: 7,
    },
    {
      id: "ch3.r.owasp-preview",
      title: "OWASP Top 10 for LLM Applications",
      url: "https://genai.owasp.org/llm-top-10/",
      kind: "Spec",
      hours: 1,
      required: false,
      note: "A first read focused on improper output handling (XSS) ahead of the full treatment in chapter 7.",
      week: 9,
    },
  ],
  missions: [
    {
      id: "ch3.m5",
      number: 5,
      title: "Streaming Chat App",
      track: "Full-stack",
      hours: 11,
      major: true,
      objective:
        "Build a chat UI backed by a small server proxy that holds the API key and streams tokens to the browser, so you feel the full loop from user keystroke to streamed, rendered response.",
      requirements: [
        "A backend proxy endpoint that holds the key and forwards requests; the browser never sees it",
        "Tokens stream to the UI and render markdown incrementally",
        "Stop generation with an AbortController, and a clean regenerate",
        "Conversation history with trimming or summarizing as it nears the context limit",
        "Tokens and cost shown per message and per conversation",
        "A system-prompt editor panel to experiment with live",
      ],
      milestones: [
        { id: "ch3.m5.s1", title: "Backend proxy endpoint holding the key", minutes: 45 },
        { id: "ch3.m5.s2", title: "Streamed tokens rendered as incremental markdown", minutes: 60 },
        { id: "ch3.m5.s3", title: "Stop (AbortController) and regenerate", minutes: 40 },
        { id: "ch3.m5.s4", title: "History trimming/summarizing near the context limit", minutes: 50 },
        { id: "ch3.m5.s5", title: "Per-message and per-conversation token/cost display", minutes: 40 },
        { id: "ch3.m5.s6", title: "Live system-prompt editor panel", minutes: 35 },
      ],
      deliverable:
        "A chat app you can actually use, with the key kept server-side, live streaming, stop/regenerate, and visible cost per message.",
      reflection: [
        "What broke first when you tried to trim conversation history, and why?",
        "Where did streaming change how you had to think about error handling compared to a single request/response call?",
      ],
      stretch: [
        { id: "ch3.m5.x1", title: "Image upload (multimodal input)", minutes: 45 },
        { id: "ch3.m5.x2", title: "Persist conversations in Postgres", minutes: 60 },
      ],
    },
    {
      id: "ch3.m6",
      number: 6,
      title: "AI-Native Feature in a Real UI",
      track: "Frontend",
      hours: 12,
      major: true,
      objective:
        "Add AI as part of the interface of a small CRM-lite or notes app — not a chat sidebar — so the model's output is rendered as real, editable, accessible UI.",
      requirements: [
        "Inline AI suggestions for form fields, with accept/edit/reject controls",
        "A generative-UI summary card rendered from streamed partial JSON",
        "Explicit streaming states: skeleton, partial, complete, error, with retry",
        "Feedback capture (thumbs and edits) logged for later evaluation use",
        "aria-live announcements and full keyboard-only operation",
        "Model output sanitized, with a deliberate XSS attempt from the model blocked",
      ],
      milestones: [
        { id: "ch3.m6.s1", title: "Inline suggestion UI with accept/edit/reject", minutes: 60 },
        { id: "ch3.m6.s2", title: "Partial-JSON parser feeding a generative-UI summary card", minutes: 70 },
        { id: "ch3.m6.s3", title: "Skeleton/partial/complete/error states with retry", minutes: 45 },
        { id: "ch3.m6.s4", title: "Feedback capture (thumbs + edits) logged", minutes: 40 },
        { id: "ch3.m6.s5", title: "aria-live and keyboard-only pass", minutes: 45 },
        { id: "ch3.m6.s6", title: "Sanitization verified against an injected XSS payload", minutes: 40 },
      ],
      deliverable:
        "A small real app where AI suggestions and summaries are first-class UI elements, accessible, safely rendered, and instrumented for feedback.",
      reflection: [
        "Which HAX or PAIR guideline changed a specific design decision you made here?",
        "What did the XSS test teach you about trusting model output that you didn't already know?",
      ],
      stretch: [
        { id: "ch3.m6.x1", title: "Undo history for AI-made changes", minutes: 50 },
      ],
    },
  ],
  trial: [
    {
      id: "ch3.t.explain-proxy",
      dimension: "Understanding",
      statement: "You can explain why the API key must live behind a backend proxy and never in the browser bundle.",
    },
    {
      id: "ch3.t.build-streaming",
      dimension: "Implementation",
      statement: "You can implement a working stop-and-regenerate flow on a streaming response.",
    },
    {
      id: "ch3.t.debug-partial-json",
      dimension: "Debugging",
      statement: "You can debug a partial-JSON parse failure mid-stream and explain what state it left the UI in.",
    },
    {
      id: "ch3.t.explain-ux-patterns",
      dimension: "Explanation",
      statement: "You can explain, with an example from your own build, why designing for uncertainty beats hiding it.",
    },
    {
      id: "ch3.t.tradeoff-caching",
      dimension: "Tradeoffs",
      statement: "You can weigh prompt caching against response caching for a given feature and justify which one you'd add first.",
    },
    {
      id: "ch3.t.verify-sanitization",
      dimension: "Evaluation",
      statement: "You can demonstrate, with a real attempted payload, that your app's model-output rendering is XSS-safe.",
    },
  ],
  skills: { building: 3, systemDesign: 1, production: 1 },
};
