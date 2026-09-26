// Chapter 8 — Capstone & Deployment (weeks 22-24).
import type { Chapter } from "./types";

export const ch8: Chapter = {
  id: "ch8",
  number: 8,
  title: "Capstone & Deployment",
  tagline: "Ship the one thing that proves you can build these.",
  description:
    "Combine everything — LLMs, prompting, tools, RAG, agents, MCP, evals, tracing and production architecture — into one deployed product, then bring the same skills to your job.",
  why:
    "A finished, documented, evaluated project is worth more than ten tutorials, for your portfolio and for your own confidence. Turning the same skills into a proposal at work is what converts learning into career capital.",
  weeks: [
    {
      number: 22,
      title: "Design the final build",
      focus: "Decide what you're building and why before you write a line of it.",
      groups: [
        {
          title: "Picking your idea",
          concepts: [
            {
              id: "ch8.c.choosing-capstone-idea",
              title: "Choosing your capstone idea",
              summary:
                "Pick one: a codebase onboarding assistant that answers with file:line citations, a support copilot that drafts approved replies from a knowledge base, a meeting-notes-to-action-items agent, or a personal research agent — or bring your own of similar scope.",
              minutes: 45,
            },
            {
              id: "ch8.c.scoping-ruthlessly",
              title: "Scoping ruthlessly",
              summary:
                "A capstone that touches every skill from this roadmap is naturally large; deciding what's MVP and what's stretch before you start is what keeps it finishable.",
              minutes: 30,
            },
          ],
        },
        {
          title: "Spec and design",
          concepts: [
            {
              id: "ch8.c.spec-success-criteria",
              title: "Writing a spec with success criteria",
              summary:
                "A one-page spec — problem, users, success criteria, eval plan — written before you code is what keeps 'done' from drifting for the rest of the build.",
              minutes: 45,
            },
            {
              id: "ch8.c.architecture-trust-boundaries",
              title: "Architecture & trust boundaries",
              summary:
                "A diagram of data flow that marks exactly where untrusted content enters your system is the single artifact that makes your later security review possible.",
              minutes: 40,
            },
            {
              id: "ch8.c.planning-eval-plan",
              title: "Planning your eval set",
              summary:
                "Deciding the size, coverage and trajectory checks your eval set needs — before you build — is what turns 'I'll add evals later' into evals that actually happen.",
              minutes: 30,
            },
          ],
        },
      ],
    },
    {
      number: 23,
      title: "Build & harden",
      focus: "Wire every piece together, then subject it to the same scrutiny as anything you'd ship at work.",
      groups: [
        {
          title: "Putting it together",
          concepts: [
            {
              id: "ch8.c.integrating-pieces",
              title: "Integrating the pieces end to end",
              summary:
                "Wiring prompting, tool calling, retrieval, an agent step and at least one MCP-exposed capability into one working system is where every earlier chapter's shortcuts finally show up.",
              minutes: 60,
            },
            {
              id: "ch8.c.evals-in-ci-capstone",
              title: "Evals in CI for the capstone",
              summary:
                "A 50-plus case eval suite gating every merge is what turns your capstone from a demo you're afraid to touch into a system you can keep improving.",
              minutes: 45,
            },
          ],
        },
        {
          title: "Hardening",
          concepts: [
            {
              id: "ch8.c.tracing-cost-dashboard",
              title: "Tracing & cost dashboard",
              summary:
                "Per-request and per-user tracing and a cost dashboard are what let you answer 'why is this slow' or 'why did this cost so much' with data instead of a guess.",
              minutes: 40,
            },
            {
              id: "ch8.c.security-review-capstone",
              title: "Security review",
              summary:
                "A written threat model plus injection tests that actually pass is the bar every other chapter's security work was building toward.",
              minutes: 50,
            },
            {
              id: "ch8.c.cost-latency-pass-capstone",
              title: "Cost & latency pass",
              summary:
                "A measured before/after on cost and latency, with the eval score held steady, is the same discipline from the production chapter applied one more time, to your own finished product.",
              minutes: 45,
            },
          ],
        },
      ],
    },
    {
      number: 24,
      title: "Ship & show",
      focus: "Get the capstone in front of others, then turn the same skills into something at work.",
      groups: [
        {
          title: "Shipping",
          concepts: [
            {
              id: "ch8.c.deploying-approved-platform",
              title: "Deploying on an approved platform",
              summary:
                "Deploy to an org-approved platform — Cloudflare or Google Cloud Platform; anything else needs your company's procurement and security approval before you touch it, even for a personal project you'd bring to work.",
              minutes: 60,
            },
            {
              id: "ch8.c.readme-design-doc",
              title: "Writing the README / design doc",
              summary:
                "A README that states your design decisions, your eval results and your cost per request is what makes the project legible to someone who wasn't in your head while you built it.",
              minutes: 45,
            },
            {
              id: "ch8.c.recording-demo",
              title: "Recording a demo",
              summary:
                "A short, honest walkthrough that shows the system actually working is worth more to a reviewer or interviewer than any amount of written description.",
              minutes: 30,
            },
          ],
        },
        {
          title: "Bringing it to work",
          concepts: [
            {
              id: "ch8.c.proposal-at-work",
              title: "Bringing a proposal to work",
              summary:
                "A one-page proposal with success criteria, an eval plan, a cost estimate and security considerations is what turns 'I learned some AI stuff' into a project your team might actually fund.",
              minutes: 45,
            },
            {
              id: "ch8.c.staying-current",
              title: "Staying current after the roadmap",
              summary:
                "Rerunning your evals on every major model release, doing one small build a month, and writing up what you learn are the habits that keep this whole skill set from going stale.",
              minutes: 30,
            },
          ],
        },
      ],
    },
  ],
  majorObjective:
    "By the end you'll have shipped one capstone product end to end, spanning LLMs through production architecture, and put a real AI proposal in front of your team at work.",
  resources: [
    {
      id: "ch8.r.anthropic-engineering-blog",
      title: "Anthropic engineering blog",
      url: "https://www.anthropic.com/engineering",
      kind: "Article",
      hours: 1,
      required: true,
      note: "Case studies worth copying in your design doc.",
      week: 22,
    },
    {
      id: "ch8.r.applied-llms-strategy",
      title: "What We Learned from a Year of Building with LLMs (strategy section)",
      url: "https://applied-llms.org",
      kind: "Article",
      hours: 1,
      required: true,
      note: "Reread before writing your work proposal.",
      week: 24,
    },
    {
      id: "ch8.r.claude-cookbooks-revisit",
      title: "Claude Cookbooks (revisit)",
      url: "https://github.com/anthropics/claude-cookbooks",
      kind: "Code",
      hours: 1,
      required: false,
      note: "Find reference implementations for your capstone's pieces.",
      week: 23,
    },
    {
      id: "ch8.r.develop-test-cases-capstone",
      title: "Develop test cases / define success — Claude Docs",
      url: "https://platform.claude.com/docs/en/test-and-evaluate/develop-tests",
      kind: "Docs",
      hours: 1,
      required: true,
      note: "Reread while writing your capstone's success criteria and eval plan.",
      week: 22,
    },
    {
      id: "ch8.r.building-effective-agents-capstone",
      title: "Building Effective Agents — Anthropic",
      url: "https://www.anthropic.com/engineering/building-effective-agents",
      kind: "Article",
      hours: 0.75,
      required: false,
      note: "Revisit when deciding how much agentic behavior your capstone actually needs.",
      week: 22,
    },
    {
      id: "ch8.r.owasp-llm-top10-capstone",
      title: "OWASP Top 10 for LLM Applications",
      url: "https://genai.owasp.org/llm-top-10/",
      kind: "Spec",
      hours: 2,
      required: true,
      note: "Run your capstone's security review against this checklist directly.",
      week: 23,
    },
    {
      id: "ch8.r.mcp-specification-capstone",
      title: "MCP Specification",
      url: "https://modelcontextprotocol.io/specification",
      kind: "Spec",
      hours: 1,
      required: false,
      note: "Reread the Security Best Practices section while hardening your capstone's MCP surface.",
      week: 23,
    },
    {
      id: "ch8.r.lethal-trifecta-capstone",
      title: "The lethal trifecta for AI agents — Simon Willison",
      url: "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/",
      kind: "Article",
      hours: 0.3,
      required: false,
      note: "Check your capstone's architecture diagram against this model directly.",
      week: 23,
    },
    {
      id: "ch8.r.handling-overload-capstone",
      title: "Handling Overload — Google SRE Book",
      url: "https://sre.google/sre-book/handling-overload/",
      kind: "Book",
      hours: 1,
      required: true,
      note: "Reread before your capstone's cost/latency pass.",
      week: 23,
    },
    {
      id: "ch8.r.demystifying-agent-evals-capstone",
      title: "Demystifying evals for AI agents — Anthropic",
      url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
      kind: "Article",
      hours: 0.75,
      required: false,
      note: "Revisit if your capstone includes an agentic component that needs trajectory evals.",
      week: 22,
    },
  ],
  missions: [
    {
      id: "ch8.m1",
      number: 20,
      title: "The Final Build",
      track: "Full-stack",
      hours: 40,
      major: true,
      objective:
        "Design, build and ship one complete AI product that combines everything from this roadmap: an LLM-powered core with disciplined prompting, tool calling, retrieval, an agent loop, at least one MCP-exposed capability, a real eval suite, tracing and observability, and production-grade architecture. Pick one of four capstone ideas — a codebase onboarding assistant, a support copilot, a meeting-notes-to-action-items agent, or a personal research agent — or bring your own of similar scope.",
      requirements: [
        "Uses an LLM with engineered prompts and structured output as its reasoning core, plus at least one tool-calling or agent step that decides what happens next.",
        "Retrieves grounded context (RAG over your own documents, or an agentic search step) and cites where its answers come from.",
        "Exposes at least one capability as an MCP server (tools, resources or prompts) that a real MCP client can call.",
        "Ships with an eval suite of 50+ cases, including edge and adversarial cases, running in CI, plus tracing and a cost/latency dashboard per request.",
        "Has been through a security review (threat model plus passing injection tests) and a cost/latency pass with before/after numbers.",
        "Runs as a real, deployed system with a trust-boundary architecture diagram — not a notebook or a local-only demo.",
      ],
      milestones: [
        { id: "ch8.m1.s1", title: "Write a one-page spec: problem, users, success criteria, eval plan", minutes: 60 },
        { id: "ch8.m1.s2", title: "Draw an architecture diagram with trust boundaries", minutes: 45 },
        { id: "ch8.m1.s3", title: "Build the MVP end to end: LLM core, tools, retrieval and at least one agent step", minutes: 180 },
        { id: "ch8.m1.s4", title: "Expose one real capability as an MCP server and test it in MCP Inspector", minutes: 90 },
        { id: "ch8.m1.s5", title: "Build an eval suite (50+ cases) and gate it in CI", minutes: 120 },
        { id: "ch8.m1.s6", title: "Add tracing and a cost dashboard per request", minutes: 75 },
        { id: "ch8.m1.s7", title: "Run a security review: threat model plus passing injection tests", minutes: 90 },
        { id: "ch8.m1.s8", title: "Run a cost/latency pass with before/after numbers", minutes: 75 },
        { id: "ch8.m1.s9", title: "Deploy on an org-approved platform (Cloudflare or GCP); anything else needs procurement/security approval", minutes: 90 },
        { id: "ch8.m1.s10", title: "Write the README (design decisions, eval results, cost per request) and record a short demo", minutes: 60 },
      ],
      deliverable:
        "A deployed, end-to-end AI product — with retrieval, at least one agent loop, an MCP-exposed capability, a CI-gated eval suite, tracing and a documented security and cost pass — that you'd link on your resume.",
      reflection: [
        "Which piece — retrieval, the agent loop, MCP, or the evals — took the most iteration, and why?",
        "If you had to cut one requirement to ship two weeks earlier, which would you cut and what would you lose?",
        "What would you tell a version of yourself starting this roadmap 24 weeks ago?",
      ],
      stretch: [
        { id: "ch8.m1.x1", title: "Write a blog post: what broke, what you measured, what you'd do differently", minutes: 90 },
        { id: "ch8.m1.x2", title: "Add a second capstone idea's core feature as an additional integration", minutes: 120 },
      ],
    },
    {
      id: "ch8.m2",
      number: 21,
      title: "Bring It to Work",
      track: "Career",
      hours: 10,
      major: false,
      objective: "Turn the roadmap's skills into visible impact at your current job by proposing and prototyping one real AI improvement.",
      requirements: [
        "Identifies one real workflow pain point on your team that AI could remove.",
        "Writes a one-page proposal with success criteria, an eval plan, a cost estimate and security considerations.",
        "Demonstrates a working prototype, not just slides.",
        "Routes anything that touches company data or infrastructure through the required security and procurement review before going further.",
      ],
      milestones: [
        { id: "ch8.m2.s1", title: "Find one real workflow pain point on your team that AI could remove", minutes: 60 },
        { id: "ch8.m2.s2", title: "Write a one-page proposal with success criteria, an eval plan, a cost estimate and security considerations", minutes: 90 },
        { id: "ch8.m2.s3", title: "Demo a prototype to your manager or team", minutes: 45 },
        { id: "ch8.m2.s4", title: "Go through the required reviews (security/procurement) for anything new", minutes: 60 },
      ],
      deliverable: "A one-page proposal and a demoed prototype for a real AI improvement at your job, cleared through the required reviews.",
      reflection: [
        "What pushback did the proposal get, and how did you address it (or how would you)?",
        "What part of your 24 weeks of practice made the biggest difference in how the proposal was received?",
      ],
      stretch: [{ id: "ch8.m2.x1", title: "Run a lunch-and-learn on evals or MCP for your team", minutes: 60 }],
    },
  ],
  trial: [
    {
      id: "ch8.t.end-to-end-understanding",
      dimension: "Understanding",
      statement: "You can explain, end to end, how every layer of your capstone (prompting, tools, RAG, agent, MCP, evals, tracing) fits together.",
    },
    {
      id: "ch8.t.mcp-implementation",
      dimension: "Implementation",
      statement: "You can point to a working MCP-exposed capability inside your capstone that a real client can call.",
    },
    {
      id: "ch8.t.tracing-debugging",
      dimension: "Debugging",
      statement: "You can use your tracing to find which request or step is driving cost or latency in your deployed capstone.",
    },
    {
      id: "ch8.t.eval-score-evaluation",
      dimension: "Evaluation",
      statement: "You can show your capstone's eval score before and after a change, gated in CI.",
    },
    {
      id: "ch8.t.scope-tradeoffs",
      dimension: "Tradeoffs",
      statement: "You can defend the one requirement you'd cut under a tighter deadline and what it would cost you.",
    },
    {
      id: "ch8.t.work-proposal-independence",
      dimension: "Independence",
      statement: "You can take an AI proposal through your company's security/procurement review without help.",
    },
  ],
  skills: { building: 3, systemDesign: 3, evaluation: 1, production: 2 },
};
