// Chapter 8 — Capstone & Deployment (weeks 22-24).
import type { Chapter } from "./types";

export const ch8: Chapter = {
  id: "ch8",
  number: 8,
  title: "Capstone & Deployment",
  tagline: "Ship the one thing that proves you can build these.",
  description:
    "Ship one useful product to a small real audience and make an evidence-backed proposal for its next stage.",
  why:
    "A finished, documented, evaluated project is worth more than ten tutorials, for your portfolio and for your own confidence. Turning the same skills into a proposal at work is what converts learning into career capital.",
  weeks: [
    {
      number: 22,
      title: "Finish the workflow",
      focus: "Finish one end-to-end workflow for the week-9 problem, reusing proven components and a frozen baseline.",
      build: {
        deliverable: "Finish one end-to-end workflow for the problem chosen in week 9.",
        evidence:
          "Reuse proven components; freeze a held-out test set and acceptance criteria. Compare with an ordinary-code or manual baseline and record the architecture decisions.",
      },
      groups: [
        {
          title: "Finishing the workflow",
          concepts: [
            {
              id: "ch8.c.integrating-pieces",
              title: "Integrating the pieces end to end",
              summary:
                "Wiring prompting, tool calling, retrieval, an agent step and at least one MCP-exposed capability into one working system is where every earlier chapter's shortcuts finally show up.",
              minutes: 60,
            },
            {
              id: "ch8.c.reuse-proven-components",
              title: "Reusing proven components",
              summary:
                "The extractor, dataset, UI and tooling you already built and measured are the fastest path to finishing — rebuilding them from scratch here is scope you don't need to spend.",
              minutes: 30,
            },
          ],
        },
        {
          title: "Baseline & acceptance",
          concepts: [
            {
              id: "ch8.c.frozen-test-set-acceptance",
              title: "Freezing a test set and acceptance criteria",
              summary:
                "A held-out test set and written acceptance criteria, frozen before the final push, are what keep 'done' from quietly drifting as you finish the build.",
              minutes: 30,
            },
            {
              id: "ch8.c.baseline-comparison-capstone",
              title: "Comparing against an ordinary-code baseline",
              summary:
                "Measuring your capstone against an ordinary-code or manual baseline is what proves the AI approach earned its complexity, instead of assuming it did.",
              minutes: 30,
            },
          ],
        },
      ],
    },
    {
      number: 23,
      title: "Deploy & harden",
      focus: "Deploy a pilot and run the full release checklist against the actual deployment.",
      build: {
        deliverable: "Deploy a pilot and run the release checklist against the actual deployment.",
        evidence:
          "Record access/security tests, load results, monitoring/alerts, cost limits, restore/rollback steps, and known limitations. Exercise any RAG, agent, or MCP surface actually used.",
      },
      groups: [
        {
          title: "Deploying the pilot",
          concepts: [
            {
              id: "ch8.c.deploying-approved-platform",
              title: "Deploying on an approved platform",
              summary:
                "Deploy to an org-approved platform — Cloudflare or Google Cloud Platform; anything else needs your company's procurement and security approval before you touch it, even for a personal project you'd bring to work.",
              minutes: 45,
            },
            {
              id: "ch8.c.release-checklist",
              title: "Running the release checklist for real",
              summary:
                "Access and security tests, load results, monitoring/alerts, cost limits, and restore/rollback steps only count as evidence once you've run them against the actual deployment, not a local copy.",
              minutes: 45,
            },
          ],
        },
        {
          title: "Hardening",
          concepts: [
            {
              id: "ch8.c.security-review-capstone",
              title: "Security review",
              summary:
                "A written threat model plus injection tests that actually pass is the bar every other chapter's security work was building toward.",
              minutes: 50,
            },
            {
              id: "ch8.c.tracing-cost-dashboard",
              title: "Tracing & cost dashboard",
              summary:
                "Per-request and per-user tracing and a cost dashboard are what let you answer 'why is this slow' or 'why did this cost so much' with data instead of a guess.",
              minutes: 40,
            },
            {
              id: "ch8.c.cost-latency-pass-capstone",
              title: "Cost & latency pass",
              summary:
                "A measured before/after on cost and latency, with the eval score held steady, is the same discipline from Chapter 07 applied one more time, to your own finished product.",
              minutes: 40,
            },
          ],
        },
      ],
    },
    {
      number: 24,
      title: "Ship & show",
      focus: "Observe real usage, fix the highest-impact failure, and turn the same skills into something at work.",
      build: {
        deliverable: "Observe real usage, fix the highest-impact failure, and present the result.",
        evidence:
          "Show a demo, user feedback, before/after task outcomes, cost per successful task, operational ownership, and a scoped next-step proposal.",
      },
      groups: [
        {
          title: "Shipping the result",
          concepts: [
            {
              id: "ch8.c.observing-real-usage-fix",
              title: "Observing real usage and fixing the highest-impact failure",
              summary:
                "Watching what real users actually hit, then fixing the single highest-impact failure rather than a dozen small ones, is what turns a pilot into evidence you can act on.",
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
              title: "Writing the next-step proposal",
              summary:
                "A scoped proposal with measured benefits, failure cases, cost, ownership and a rollback plan is what turns 'I built something' into a project someone can decide to fund.",
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
    "By the end you'll have shipped one capstone product end to end, spanning LLMs through production architecture, deployed it to a real audience, and made an evidence-backed proposal for its next stage.",
  doneWhen:
    "A real user can complete the target workflow, the deployment is reproducible, and the proposal includes measured benefits, failure cases, cost, ownership, and a rollback plan.",
  decision:
    "Explain why each AI technique earns its complexity and when a human or deterministic path takes over. An extractor with strong evidence is a valid capstone; every chapter need not appear in the architecture.",
  resources: [
    {
      id: "ch8.r.applied-llms-strategy",
      title: "What We Learned from a Year of Building with LLMs (strategy section)",
      url: "https://applied-llms.org",
      kind: "Article",
      hours: 1,
      use: "must",
      note: "Read the strategy section while writing the work proposal; compare its lessons with your own evidence.",
      week: 24,
    },
  ],
  revisit: [
    "ch2.r.develop-test-cases",
    "ch3.r.owasp-preview",
    "ch3.r.langfuse-docs",
    "ch3.r.pair-guidebook",
    "ch5.r.lethal-trifecta",
    "ch5.r.idempotency-stripe",
    "ch5.r.demystifying-agent-evals",
    "ch6.r.mcp-specification",
    "ch7.r.handling-overload",
    "ch7.r.promptfoo-docs",
  ],
  missions: [
    {
      id: "ch8.m1",
      number: 17,
      title: "The Final Build",
      track: "Full-stack",
      hours: 40,
      major: true,
      objective:
        "Design, build, deploy and present one complete AI product for the problem you chose in week 9, spanning the roadmap's skills end to end, and make an evidence-backed proposal for its next stage.",
      requirements: [
        "One end-to-end workflow finished for the week-9 problem, reusing proven components from earlier chapters.",
        "A frozen held-out test set and written acceptance criteria, compared against an ordinary-code or manual baseline.",
        "A deployed pilot on an org-approved platform, with the full release checklist run against the real deployment.",
        "Access/security tests, load results, monitoring/alerts, cost limits, and restore/rollback steps all recorded.",
        "Any RAG, agent, or MCP surface actually used exercised as part of the release checklist.",
        "Real usage observed, the highest-impact failure fixed, and a demo plus a scoped next-step proposal delivered.",
      ],
      milestones: [
        { id: "ch8.m1.s1", title: "Finish the end-to-end workflow, reusing proven components from earlier chapters", minutes: 120, week: 22 },
        { id: "ch8.m1.s2", title: "Freeze a held-out test set and write acceptance criteria", minutes: 45, week: 22 },
        { id: "ch8.m1.s3", title: "Compare against an ordinary-code or manual baseline and record the architecture decisions", minutes: 60, week: 22 },
        { id: "ch8.m1.s4", title: "Deploy a pilot to an org-approved platform and run the release checklist against it", minutes: 90, week: 23 },
        { id: "ch8.m1.s5", title: "Record access/security tests, load results, monitoring/alerts, cost limits, and restore/rollback steps", minutes: 75, week: 23 },
        { id: "ch8.m1.s6", title: "Exercise any RAG, agent, or MCP surface actually used in the pilot", minutes: 45, week: 23 },
        { id: "ch8.m1.s7", title: "Observe real usage and fix the highest-impact failure", minutes: 90, week: 24 },
        { id: "ch8.m1.s8", title: "Record before/after task outcomes and cost per successful task, then present a demo and a scoped next-step proposal", minutes: 60, week: 24 },
      ],
      deliverable:
        "A deployed, end-to-end AI product for your week-9 problem, with a frozen-baseline comparison, a passed release checklist, and an evidence-backed proposal for its next stage.",
      reflection: [
        "Which AI technique in your architecture earned its complexity, and which would you cut if you started over?",
        "What was the highest-impact failure you found from real usage, and what fixed it?",
        "What would you tell a version of yourself starting this roadmap 24 weeks ago?",
      ],
      stretch: [
        { id: "ch8.m1.x1", title: "Write a short blog post: what broke, what you measured, what you'd do differently", minutes: 90, week: 24 },
        { id: "ch8.m1.x2", title: "Add a second, smaller capstone feature as an additional integration", minutes: 90, week: 24 },
      ],
    },
  ],
  trial: [
    {
      id: "ch8.t.end-to-end-understanding",
      dimension: "Understanding",
      statement: "You can explain, end to end, why each AI technique in your capstone earns its complexity.",
    },
    {
      id: "ch8.t.deployed-implementation",
      dimension: "Implementation",
      statement: "You can point to a deployed, working end-to-end workflow for your chosen problem, not a notebook or local-only demo.",
    },
    {
      id: "ch8.t.tracing-debugging",
      dimension: "Debugging",
      statement: "You can use your tracing and monitoring to find which request or step is driving cost, latency, or a real user's failure.",
    },
    {
      id: "ch8.t.scope-tradeoffs",
      dimension: "Tradeoffs",
      statement: "You can defend the one requirement you'd cut under a tighter deadline and what it would cost you.",
    },
    {
      id: "ch8.t.usage-evaluation",
      dimension: "Evaluation",
      statement: "You can show your capstone's before/after task outcomes and cost per successful task from real usage.",
    },
  ],
  notes: [
    {
      label: "Apply earlier resources",
      text:
        "Apply earlier resources; do not restart the reading list. Use the Chapter 02 eval criteria, Chapter 03 UX/trace checks, Chapter 05 side-effect controls, Chapter 06 MCP security guidance where applicable, and Chapter 07 release drills. Reserve this chapter for finishing, deploying, and learning from usage. If the product is not ready, reduce scope or extend the schedule rather than dropping validation.",
    },
    {
      label: "Deployment",
      text:
        "Deploy only to an org-approved platform (Cloudflare or Google Cloud Platform); any other hosting provider needs the company's procurement and security approval first.",
    },
  ],
  skills: { building: 3, systemDesign: 3, evaluation: 1, production: 2 },
};
