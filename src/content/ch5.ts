// Chapter 5 — Agents & Autonomous Workflows (weeks 13-15).
import type { Chapter } from "./types";

export const ch5: Chapter = {
  id: "ch5",
  number: 5,
  title: "Agents & Autonomous Workflows",
  tagline: "Give the model a loop, not just an answer.",
  description:
    "Build and debug a bounded tool-calling agent, and justify whether it improves on a fixed workflow.",
  why:
    "Most new AI product work is agentic: models that read, search, act and check their own work. The skill that matters is designing the tools and the loop, and knowing when a fixed workflow is the better call.",
  weeks: [
    {
      number: 13,
      title: "Workflow vs hand-built loop",
      focus: "Implement the task as a fixed workflow, then build a small tool-calling loop by hand on the same task.",
      build: {
        deliverable:
          "Implement the task as a fixed workflow, then build a small tool-calling loop by hand.",
        evidence:
          "Run both on the same task set. Record task completion, tool calls, side effects, latency, and cost.",
      },
      groups: [
        {
          title: "Workflow or agent first",
          concepts: [
            {
              id: "ch5.c.workflows-vs-agents",
              title: "Workflows vs agents",
              summary:
                "A workflow is a fixed code path that happens to call an LLM; an agent lets the model decide what happens next. Start with the simplest one that works.",
              minutes: 30,
              resources: ["ch5.r.building-effective-agents"],
            },
            {
              id: "ch5.c.five-workflow-patterns",
              title: "Five workflow patterns",
              summary:
                "Prompt chaining, routing, parallelization, orchestrator-workers and evaluator-optimizer cover most real production LLM systems without needing a fully autonomous agent.",
              minutes: 40,
              resources: ["ch5.r.building-effective-agents"],
            },
          ],
        },
        {
          title: "The hand-built loop",
          concepts: [
            {
              id: "ch5.c.agentic-loop",
              title: "The agentic loop",
              summary:
                "The core loop is stop_reason = tool_use → run the tool → send back tool_result → repeat until end_turn; this loop is the entire mechanism behind every agent you'll build.",
              minutes: 40,
              resources: ["ch5.r.tool-use-overview", "ch5.r.react-paper"],
            },
            {
              id: "ch5.c.tool-definitions",
              title: "Tool definitions",
              summary:
                "A tool has a name, a description and a JSON-schema input; the description is a prompt in disguise, so write it like documentation the model can act on.",
              minutes: 30,
              resources: ["ch5.r.tool-use-overview", "ch5.r.writing-tools-for-agents"],
            },
            {
              id: "ch5.c.lethal-trifecta",
              title: "The lethal trifecta",
              summary:
                "Private data, untrusted input, and a way to send data out together make an exfiltration risk; identify all three legs before granting any tool access.",
              minutes: 25,
              resources: ["ch5.r.lethal-trifecta"],
            },
          ],
        },
      ],
    },
    {
      number: 14,
      title: "Bounded tools & recovery",
      focus: "Add execution limits and recovery around two or three useful, side-effecting tools.",
      build: {
        deliverable: "Add execution limits and recovery around two or three useful tools.",
        evidence:
          "Inject tool failures, duplicate calls, and untrusted instructions. Verify permissions, approvals, idempotency, step/time/spend limits, and safe resume behavior.",
      },
      groups: [
        {
          title: "Designing bounded tools",
          concepts: [
            {
              id: "ch5.c.designing-tools-for-agents",
              title: "Designing tools for agents",
              summary:
                "Fewer, higher-level tools with token-efficient, paginated responses and meaningful errors make an agent noticeably more reliable than a thin wrapper over your existing API.",
              minutes: 40,
              resources: ["ch5.r.writing-tools-for-agents"],
            },
            {
              id: "ch5.c.idempotent-tools",
              title: "Idempotent tools",
              summary:
                "Every side-effecting tool needs an idempotency key so a retry after a crash can't double-send or double-charge; test failure after the effect happens but before it's acknowledged.",
              minutes: 30,
              resources: ["ch5.r.idempotency-stripe"],
            },
            {
              id: "ch5.c.stopping-conditions",
              title: "Stopping conditions & budgets",
              summary:
                "Max iterations, token or dollar caps, and timeouts stop an agent that's stuck in a loop from silently burning your budget.",
              minutes: 25,
              resources: ["ch5.r.12-factor-agents"],
            },
          ],
        },
        {
          title: "Verifying recovery",
          concepts: [
            {
              id: "ch5.c.human-in-the-loop",
              title: "Human-in-the-loop",
              summary:
                "Any side effect that sends, deletes, pays or posts needs an approval gate that shows exactly what will happen before it happens.",
              minutes: 25,
              resources: ["ch5.r.12-factor-agents"],
            },
            {
              id: "ch5.c.outcome-trajectory-checks",
              title: "Outcome and trajectory checks",
              summary:
                "Checking the real side effects and the path the agent took to get there — not just a success message — is what an honest agent evaluation actually verifies.",
              minutes: 30,
              resources: ["ch5.r.demystifying-agent-evals"],
            },
          ],
        },
      ],
    },
    {
      number: 15,
      title: "Improve the weakest behavior",
      focus: "Evaluate outcomes and traces, fix the weakest behavior, and optionally port the loop to an SDK.",
      build: {
        deliverable: "Improve the weakest behavior and optionally port the loop to an SDK.",
        evidence:
          "Evaluate outcomes and traces; compare context compaction/retrieval when history grows. If porting, demonstrate the behavior the SDK supplies or changes.",
      },
      groups: [
        {
          title: "Reading and improving the agent",
          concepts: [
            {
              id: "ch5.c.tracing-agent-runs",
              title: "Tracing an agent run",
              summary:
                "Logging every step — the model's reasoning, each tool's input and output, tokens and time — is what turns 'the agent did something weird' into a diagnosable bug.",
              minutes: 30,
              resources: ["ch5.r.demystifying-agent-evals"],
            },
            {
              id: "ch5.c.common-failure-modes",
              title: "Common failure modes",
              summary:
                "Loops, hallucinated tool arguments, calling the wrong tool, context bloat and quitting too early are the failure modes you'll see over and over; learn to recognize each in a trace.",
              minutes: 30,
              resources: ["ch5.r.ai-engineering-agents"],
            },
            {
              id: "ch5.c.context-engineering",
              title: "Context engineering",
              summary:
                "What enters the context window, and when, matters more than the prompt's wording: just-in-time retrieval, compaction and memory files keep an agent from drowning in its own history.",
              minutes: 45,
              resources: ["ch5.r.context-engineering"],
            },
          ],
        },
        {
          title: "Optional SDK path",
          concepts: [
            {
              id: "ch5.c.agent-sdk",
              title: "Claude Agent SDK",
              summary:
                "The Agent SDK packages built-in tools, permission modes, hooks and sessions around the same loop you just wrote by hand — it's the same foundation Claude Code itself is built on.",
              minutes: 40,
              resources: ["ch5.r.agent-sdk-overview"],
            },
            {
              id: "ch5.c.subagents",
              title: "Subagents & multi-agent",
              summary:
                "Fanning work out to subagents helps for broad, parallelizable research, but it adds cost, coordination overhead and lost shared context — reach for it deliberately, not by default.",
              minutes: 35,
              resources: ["ch5.r.multi-agent-research-system"],
            },
          ],
        },
      ],
    },
  ],
  majorObjective:
    "By the end you can build a fixed workflow and a hand-built tool-calling agent for the same task, bound the agent's tools with limits and idempotency, and use evidence from traces to fix its weakest behavior.",
  doneWhen:
    "The agent stops predictably, cannot exceed tool permissions, and recovers from a partial failure without duplicating a consequential action. A fixed workflow remains a measured baseline.",
  decision:
    "Choose a workflow or agent based on task variability and failure cost; document which decisions remain deterministic or require human approval.",
  resources: [
    {
      id: "ch5.r.building-effective-agents",
      title: "Building Effective Agents — Anthropic",
      url: "https://www.anthropic.com/engineering/building-effective-agents",
      kind: "Article",
      hours: 0.75,
      use: "must",
      note: "Read workflow-versus-agent patterns before choosing the implementation.",
      week: 13,
    },
    {
      id: "ch5.r.tool-use-overview",
      title: "Tool use overview & implementation — Claude Docs",
      url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview",
      kind: "Docs",
      hours: 1,
      use: "reference",
      note: "Implement tool schemas, dispatch, results, and error handling in the handwritten loop.",
      week: 13,
    },
    {
      id: "ch5.r.lethal-trifecta",
      title: "The lethal trifecta for AI agents — Simon Willison",
      url: "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/",
      kind: "Article",
      hours: 0.3,
      use: "must",
      note: "Identify private data, untrusted inputs, and external communication paths before granting tools access.",
      week: 13,
    },
    {
      id: "ch5.r.writing-tools-for-agents",
      title: "Writing effective tools for agents — Anthropic",
      url: "https://www.anthropic.com/engineering/writing-tools-for-agents",
      kind: "Article",
      hours: 0.75,
      use: "must",
      note: "Improve tool descriptions and responses using observed selection/argument failures.",
      week: 14,
    },
    {
      id: "ch5.r.idempotency-stripe",
      title: "Designing robust APIs with idempotency — Stripe",
      url: "https://stripe.com/blog/idempotency",
      kind: "Article",
      hours: 0.5,
      use: "must",
      note: "Make retrying side-effecting tools safe; test failure after the side effect but before acknowledgment.",
      week: 14,
    },
    {
      id: "ch5.r.demystifying-agent-evals",
      title: "Demystifying evals for AI agents — Anthropic",
      url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
      kind: "Article",
      hours: 0.75,
      use: "must",
      note: "Build outcome and trajectory checks; verify real side effects rather than trusting a success message.",
      week: 14,
    },
    {
      id: "ch5.r.context-engineering",
      title: "Effective context engineering for AI agents — Anthropic",
      url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      kind: "Article",
      hours: 0.75,
      use: "must",
      note: "Use retrieval, compaction, and memory only when context-related failures justify them.",
      week: 15,
    },
    {
      id: "ch5.r.agent-sdk-overview",
      title: "Agent SDK overview — Claude Docs",
      url: "https://code.claude.com/docs/en/agent-sdk/overview",
      kind: "Docs",
      hours: 1,
      use: "bonus",
      note: "Optional port after the manual loop works; compare permissions, execution, and recovery semantics.",
      week: 15,
    },
    {
      id: "ch5.r.hf-agents-course",
      title: "Hugging Face Agents Course",
      url: "https://huggingface.co/learn/agents-course",
      kind: "Course",
      hours: 2,
      use: "bonus",
      note: "Selected concept units as an alternative explanation; the full course is outside the core time budget.",
      week: 13,
    },
    {
      id: "ch5.r.react-paper",
      title: "ReAct: Synergizing Reasoning and Acting (paper)",
      url: "https://arxiv.org/abs/2210.03629",
      kind: "Paper",
      hours: 0.5,
      use: "bonus",
      note: "Read the abstract and figures for the original loop framing.",
      week: 13,
    },
    {
      id: "ch5.r.12-factor-agents",
      title: "12-Factor Agents — HumanLayer",
      url: "https://github.com/humanlayer/12-factor-agents",
      kind: "Article",
      hours: 1.5,
      use: "bonus",
      note: "Compare its control-flow and state principles with your implementation.",
      week: 14,
    },
    {
      id: "ch5.r.ai-engineering-agents",
      title: "AI Engineering — Chip Huyen · ch. 6 (Agents section)",
      url: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/",
      kind: "Book",
      hours: 2,
      use: "bonus",
      note: "Deeper treatment of planning and failure modes.",
      week: 14,
    },
    {
      id: "ch5.r.multi-agent-research-system",
      title: "How we built our multi-agent research system — Anthropic",
      url: "https://www.anthropic.com/engineering/multi-agent-research-system",
      kind: "Article",
      hours: 0.75,
      use: "bonus",
      note: "Case study only; add multiple agents only after demonstrating a single-agent limitation.",
      week: 15,
    },
    {
      id: "ch5.r.claude-code-best-practices",
      title: "Claude Code best practices — Claude Code docs",
      url: "https://code.claude.com/docs/en/best-practices",
      kind: "Article",
      hours: 0.5,
      use: "bonus",
      note: "Optional case study in tool permissions and context management.",
      week: 15,
    },
  ],
  missions: [
    {
      id: "ch5.m1",
      number: 8,
      title: "Workflow vs Hand-Built Agent",
      track: "Backend",
      hours: 7,
      major: true,
      objective:
        "Implement the same task as a deterministic fixed workflow and as a small tool-calling agent you write by hand, then compare them with real measurements instead of a hunch.",
      requirements: [
        "The task implemented as a deterministic fixed workflow first.",
        "The same task implemented as a hand-built tool-calling loop, with no agent framework.",
        "Both versions run against the identical task set.",
        "Task completion, tool calls, side effects, latency, and cost recorded for each run.",
        "At least one lethal-trifecta risk (private data, untrusted input, external communication) identified before any tool is given access.",
      ],
      milestones: [
        { id: "ch5.m1.s1", title: "Build the fixed-workflow version of the task end to end", minutes: 60, week: 13 },
        { id: "ch5.m1.s2", title: "Define tool schemas and dispatch for the hand-built loop", minutes: 45, week: 13 },
        { id: "ch5.m1.s3", title: "Implement the agentic loop until end_turn with a max-iterations guard", minutes: 60, week: 13 },
        { id: "ch5.m1.s4", title: "Run both versions against the identical task set", minutes: 45, week: 13 },
        { id: "ch5.m1.s5", title: "Record completion, tool calls, side effects, latency, and cost for each run", minutes: 40, week: 13 },
        { id: "ch5.m1.s6", title: "Check the design against the lethal trifecta before granting tool access", minutes: 25, week: 13 },
      ],
      deliverable:
        "A working fixed workflow and a hand-built agent for the same task, with a measured comparison table backing your choice of one over the other.",
      reflection: [
        "Given the measured task variability and failure cost, would you ship the workflow or the agent — and why?",
        "Where did the hand-built loop almost get stuck, and what stopped it?",
      ],
      stretch: [],
    },
    {
      id: "ch5.m2",
      number: 9,
      title: "Bounded Tools & Recovery",
      track: "Backend",
      hours: 8,
      major: true,
      objective:
        "Add execution limits and recovery around two or three real, side-effecting tools so the agent can't exceed its permissions or duplicate a consequential action.",
      requirements: [
        "Two or three real, side-effecting tools wired into the agent from Workflow vs Hand-Built Agent.",
        "Idempotency keys on every side-effecting tool so a retry can't duplicate the effect.",
        "Step, time, and spend limits that halt a run predictably.",
        "An approval gate in front of every side-effecting call.",
        "Injected tool failures, duplicate calls, and untrusted instructions used as test cases.",
        "Safe resume after a partial failure, verified by test.",
      ],
      milestones: [
        { id: "ch5.m2.s1", title: "Wire two or three real tools, each with an idempotency key", minutes: 60, week: 14 },
        { id: "ch5.m2.s2", title: "Add step, time, and spend limits that halt the run predictably", minutes: 45, week: 14 },
        { id: "ch5.m2.s3", title: "Add an approval gate in front of every side-effecting call", minutes: 45, week: 14 },
        { id: "ch5.m2.s4", title: "Inject a tool failure mid-run and verify safe resume without duplicating the effect", minutes: 50, week: 14 },
        { id: "ch5.m2.s5", title: "Inject duplicate calls and an untrusted instruction and verify the agent doesn't act on them", minutes: 45, week: 14 },
        { id: "ch5.m2.s6", title: "Rewrite tool descriptions and responses based on observed selection or argument failures", minutes: 40, week: 14 },
      ],
      deliverable:
        "An agent with two or three bounded, idempotent, approval-gated tools, with demonstrated recovery from an injected partial failure.",
      reflection: [
        "Which failure mode — a duplicate call, an untrusted instruction, or a mid-run crash — was hardest to defend against?",
        "Which decisions remain deterministic, and which require human approval, in this version?",
      ],
      stretch: [],
    },
    {
      id: "ch5.m3",
      number: 10,
      title: "Improve the Weakest Behavior",
      track: "Backend",
      hours: 6,
      major: false,
      objective:
        "Use evaluation and traces to find the single weakest behavior in your agent, fix it, and optionally port the loop to the Claude Agent SDK.",
      requirements: [
        "Outcomes and full traces from the agent in Bounded Tools & Recovery evaluated for weak spots.",
        "The single weakest behavior identified with evidence from the traces, not a guess.",
        "Context compaction or retrieval compared if context growth is a contributing factor.",
        "The fix implemented and re-evaluated against the same cases to show measured improvement.",
      ],
      milestones: [
        { id: "ch5.m3.s1", title: "Evaluate outcomes and traces to find the weakest behavior", minutes: 60, week: 15 },
        { id: "ch5.m3.s2", title: "Compare context compaction or retrieval strategies if context growth is a factor", minutes: 45, week: 15 },
        { id: "ch5.m3.s3", title: "Implement the fix for the identified weak behavior", minutes: 60, week: 15 },
        { id: "ch5.m3.s4", title: "Re-run the evaluation and show the measured improvement", minutes: 40, week: 15 },
      ],
      deliverable:
        "A measured before/after improvement on the agent's single weakest behavior, with an optional port to the Agent SDK.",
      reflection: [
        "What evidence told you this was the weakest behavior, rather than just the most visible one?",
        "If you ported to the SDK, what did it give you for free, and what control did you lose?",
      ],
      stretch: [
        { id: "ch5.m3.x1", title: "Port the loop to the Claude Agent SDK and demonstrate the behavior it supplies or changes", minutes: 60, week: 15 },
      ],
    },
  ],
  trial: [
    {
      id: "ch5.t.agentic-loop",
      dimension: "Understanding",
      statement:
        "You can explain the agentic loop (tool_use → run tool → tool_result → repeat) and why a fixed workflow can beat it for a low-variability task.",
    },
    {
      id: "ch5.t.bounded-loop",
      dimension: "Implementation",
      statement:
        "You can build a tool-calling loop by hand with step/time/spend limits and idempotent, approval-gated tools.",
    },
    {
      id: "ch5.t.trace-debugging",
      dimension: "Debugging",
      statement:
        "You can read an agent's trace and identify where it looped, duplicated a side effect, or acted on an untrusted instruction.",
    },
    {
      id: "ch5.t.workflow-vs-agent",
      dimension: "Tradeoffs",
      statement:
        "You can justify, from measured task variability and failure cost, whether a task calls for a workflow or an agent.",
    },
    {
      id: "ch5.t.weakest-behavior",
      dimension: "Evaluation",
      statement:
        "You can show a measured before/after improvement on your agent's single weakest behavior, backed by traces.",
    },
  ],
  skills: { building: 2, systemDesign: 3 },
};
