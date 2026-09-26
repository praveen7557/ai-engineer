// Chapter 5 — Agents & Autonomous Workflows (weeks 13-15).
import type { Chapter } from "./types";

export const ch5: Chapter = {
  id: "ch5",
  number: 5,
  title: "Agents & Autonomous Workflows",
  tagline: "Give the model a loop, not just an answer.",
  description:
    "Turn tool-calling into an agent by hand first, then learn the design patterns and the SDK that make agents reliable and debuggable.",
  why:
    "Most new AI product work is agentic: models that read, search, act and check their own work. The skill that matters is designing the tools and the loop, not the prompt.",
  weeks: [
    {
      number: 13,
      title: "Tool use by hand",
      focus: "Write the tool-calling loop yourself before any framework hides it from you.",
      groups: [
        {
          title: "Defining and calling tools",
          concepts: [
            {
              id: "ch5.c.tool-definitions",
              title: "Tool definitions",
              summary:
                "A tool has a name, a description and a JSON-schema input; the description is a prompt in disguise, so write it like documentation the model can act on.",
              minutes: 30,
            },
            {
              id: "ch5.c.agentic-loop",
              title: "The agentic loop",
              summary:
                "The core loop is stop_reason = tool_use → run the tool → send back tool_result → repeat until end_turn; this loop is the entire mechanism behind every agent you'll build.",
              minutes: 40,
            },
            {
              id: "ch5.c.parallel-tool-calls",
              title: "Parallel tool calls",
              summary:
                "A single turn can return several tool_use blocks at once; your code must run them all and return every tool_result together before continuing.",
              minutes: 30,
            },
          ],
        },
        {
          title: "Making tools reliable",
          concepts: [
            {
              id: "ch5.c.tool-choice",
              title: "tool_choice",
              summary:
                "tool_choice lets you force auto, any, a specific tool, or none — forcing a specific tool is the reliable way to get structured extraction out of a tool call.",
              minutes: 20,
            },
            {
              id: "ch5.c.error-results",
              title: "Error results",
              summary:
                "Returning is_error with a clear message lets the model recover from a bad tool call instead of the whole run crashing.",
              minutes: 25,
            },
            {
              id: "ch5.c.server-vs-client-tools",
              title: "Server tools vs client tools",
              summary:
                "Some tools run on the provider's infrastructure (web search, code execution); others run in your own code — know which is which before you design around either.",
              minutes: 20,
            },
          ],
        },
      ],
    },
    {
      number: 14,
      title: "Agent design patterns",
      focus: "Learn the patterns that make agents work in production, not just in demos.",
      groups: [
        {
          title: "Choosing a shape",
          concepts: [
            {
              id: "ch5.c.workflows-vs-agents",
              title: "Workflows vs agents",
              summary:
                "A workflow is a fixed code path that happens to call an LLM; an agent lets the model decide what happens next. Start with the simplest one that works.",
              minutes: 30,
            },
            {
              id: "ch5.c.five-workflow-patterns",
              title: "Five workflow patterns",
              summary:
                "Prompt chaining, routing, parallelization, orchestrator-workers and evaluator-optimizer cover most real production LLM systems without needing a fully autonomous agent.",
              minutes: 45,
            },
            {
              id: "ch5.c.context-engineering",
              title: "Context engineering",
              summary:
                "What enters the context window, and when, matters more than the prompt's wording: just-in-time retrieval, compaction and memory files keep an agent from drowning in its own history.",
              minutes: 45,
            },
          ],
        },
        {
          title: "Keeping agents in bounds",
          concepts: [
            {
              id: "ch5.c.designing-tools-for-agents",
              title: "Designing tools for agents",
              summary:
                "Fewer, higher-level tools with token-efficient, paginated responses and meaningful errors make an agent noticeably more reliable than a thin wrapper over your existing API.",
              minutes: 40,
            },
            {
              id: "ch5.c.stopping-conditions",
              title: "Stopping conditions & budgets",
              summary:
                "Max iterations, token or dollar caps, and timeouts stop an agent that's stuck in a loop from silently burning your budget.",
              minutes: 25,
            },
            {
              id: "ch5.c.human-in-the-loop",
              title: "Human-in-the-loop",
              summary:
                "Any side effect that sends, deletes, pays or posts needs an approval gate that shows exactly what will happen before it happens.",
              minutes: 25,
            },
          ],
        },
      ],
    },
    {
      number: 15,
      title: "SDK, multi-agent & failure modes",
      focus: "Move from a hand-built loop to the Agent SDK, and learn to read what went wrong.",
      groups: [
        {
          title: "Scaling up",
          concepts: [
            {
              id: "ch5.c.agent-sdk",
              title: "Claude Agent SDK",
              summary:
                "The Agent SDK packages built-in tools, permission modes, hooks and sessions around the same loop you just wrote by hand — it's the same foundation Claude Code itself is built on.",
              minutes: 40,
            },
            {
              id: "ch5.c.subagents",
              title: "Subagents & multi-agent",
              summary:
                "Fanning work out to subagents helps for broad, parallelizable research, but it adds cost, coordination overhead and lost shared context — reach for it deliberately, not by default.",
              minutes: 35,
            },
          ],
        },
        {
          title: "Reading and comparing agents",
          concepts: [
            {
              id: "ch5.c.tracing-agent-runs",
              title: "Tracing an agent run",
              summary:
                "Logging every step — the model's reasoning, each tool's input and output, tokens and time — is what turns 'the agent did something weird' into a diagnosable bug.",
              minutes: 30,
            },
            {
              id: "ch5.c.common-failure-modes",
              title: "Common failure modes",
              summary:
                "Loops, hallucinated tool arguments, calling the wrong tool, context bloat and quitting too early are the failure modes you'll see over and over; learn to recognize each in a trace.",
              minutes: 30,
            },
            {
              id: "ch5.c.agentic-search",
              title: "Agentic search",
              summary:
                "Instead of a vector index, an agent with grep/read/search tools can explore a corpus step by step — often simpler than RAG for small or code-shaped corpora, and directly comparable to it.",
              minutes: 35,
            },
          ],
        },
      ],
    },
  ],
  majorObjective:
    "By the end you can design, build and debug a multi-step tool-calling agent, both by hand and on the Agent SDK, and justify when an agent beats a fixed workflow.",
  resources: [
    {
      id: "ch5.r.tool-use-overview",
      title: "Tool use overview & implementation — Claude Docs",
      url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview",
      kind: "Docs",
      hours: 2,
      required: true,
      note: "Read overview, implement tool use, and the tool_choice sections.",
      week: 13,
    },
    {
      id: "ch5.r.building-effective-agents",
      title: "Building Effective Agents — Anthropic",
      url: "https://www.anthropic.com/engineering/building-effective-agents",
      kind: "Article",
      hours: 0.75,
      required: true,
      note: "The canonical patterns article: workflows vs agents, and the five patterns. Read it twice.",
      week: 14,
    },
    {
      id: "ch5.r.writing-tools-for-agents",
      title: "Writing effective tools for agents — Anthropic",
      url: "https://www.anthropic.com/engineering/writing-tools-for-agents",
      kind: "Article",
      hours: 0.75,
      required: true,
      note: "How to design tools that an agent actually uses well: fewer tools, better names, token-efficient responses.",
      week: 14,
    },
    {
      id: "ch5.r.context-engineering",
      title: "Effective context engineering for AI agents — Anthropic",
      url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      kind: "Article",
      hours: 0.75,
      required: true,
      note: "Compaction, memory files and just-in-time retrieval for long-running agents.",
      week: 14,
    },
    {
      id: "ch5.r.agent-sdk-overview",
      title: "Agent SDK overview — Claude Docs",
      url: "https://code.claude.com/docs/en/agent-sdk/overview",
      kind: "Docs",
      hours: 2,
      required: true,
      note: "Read this after you've built the loop by hand, so you can see exactly what it's giving you.",
      week: 15,
    },
    {
      id: "ch5.r.multi-agent-research-system",
      title: "How we built our multi-agent research system — Anthropic",
      url: "https://www.anthropic.com/engineering/multi-agent-research-system",
      kind: "Article",
      hours: 0.75,
      required: false,
      note: "Real-world trade-offs of an orchestrator-worker system at production scale.",
      week: 15,
    },
    {
      id: "ch5.r.claude-code-best-practices",
      title: "Claude Code best practices — Claude Code docs",
      url: "https://code.claude.com/docs/en/best-practices",
      kind: "Article",
      hours: 0.5,
      required: false,
      note: "You use Claude Code daily — read this once as an agent-design case study.",
      week: 15,
    },
    {
      id: "ch5.r.12-factor-agents",
      title: "12-Factor Agents — HumanLayer",
      url: "https://github.com/humanlayer/12-factor-agents",
      kind: "Article",
      hours: 1.5,
      required: false,
      note: "Engineering principles for production agents: own your prompts, own your control flow.",
      week: 14,
    },
    {
      id: "ch5.r.hf-agents-course",
      title: "Hugging Face Agents Course",
      url: "https://huggingface.co/learn/agents-course",
      kind: "Course",
      hours: 15,
      required: false,
      note: "Free and broad; framework-heavy, so do the concept units and skip what you don't need.",
      week: 13,
    },
    {
      id: "ch5.r.react-paper",
      title: "ReAct: Synergizing Reasoning and Acting (paper)",
      url: "https://arxiv.org/abs/2210.03629",
      kind: "Paper",
      hours: 1,
      required: false,
      note: "The original reason-then-act loop. Read the abstract and figures.",
      week: 13,
    },
    {
      id: "ch5.r.ai-engineering-agents",
      title: "AI Engineering — Chip Huyen · ch. 6 (Agents section)",
      url: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/",
      kind: "Book",
      hours: 2,
      required: false,
      note: "Planning, tool selection and agent failure modes in one place.",
      week: 14,
    },
  ],
  missions: [
    {
      id: "ch5.m1",
      number: 9,
      title: "Raw Agent Loop",
      track: "Backend",
      hours: 7,
      major: true,
      objective:
        "Build a tool-calling agent loop entirely by hand, with no agent framework, so you understand exactly what stop_reason, tool_use and tool_result are doing before anything hides them from you.",
      requirements: [
        "A codebase Q&A agent that answers questions like 'Where is auth handled?' using three tools: list_dir, read_file and search (grep) over a local repo.",
        "You write the loop yourself — don't have Claude Code generate it; the point is to understand the mechanism.",
        "The loop runs until stop_reason is end_turn, with a max_iterations guard so it can't run forever.",
        "Parallel tool_use blocks in one turn are all executed and returned together.",
        "Bad tool calls return is_error with a useful message, and you can see the model recover.",
      ],
      milestones: [
        { id: "ch5.m1.s1", title: "Get one full tool round trip working: model calls a tool, you run it, you send back tool_result", minutes: 60 },
        { id: "ch5.m1.s2", title: "Loop until end_turn with a max_iterations guard", minutes: 45 },
        { id: "ch5.m1.s3", title: "Handle parallel tool calls in a single turn", minutes: 45 },
        { id: "ch5.m1.s4", title: "Return is_error results for bad paths and watch the model recover", minutes: 40 },
        { id: "ch5.m1.s5", title: "Print a readable step-by-step trace with tokens and cost per run", minutes: 40 },
      ],
      deliverable:
        "A working command-line agent that answers questions about a real codebase using its own tool-calling loop, with a readable trace of every step.",
      reflection: [
        "Where did the loop almost get stuck, and what stopped it?",
        "What would break if you removed the max_iterations guard?",
      ],
      stretch: [{ id: "ch5.m1.x1", title: "Add a 'finish' tool so the agent returns a structured final answer", minutes: 45 }],
    },
    {
      id: "ch5.m2",
      number: 10,
      title: "Issue Triage Agent",
      track: "Full-stack",
      hours: 13,
      major: true,
      objective:
        "Build an agent that classifies a GitHub issue, searches the code, labels its severity and drafts a fix plan — and never posts anything without your approval.",
      requirements: [
        "Tools: get_issue, search_code, read_file, propose_labels, and an approval-gated post_comment.",
        "A routing step first — bug vs feature vs question — each with its own prompt.",
        "An orchestrator flow: plan, gather context, then draft the response.",
        "A trace viewer listing every step with its tokens and time.",
        "A budget guard that stops the run after N steps or $X.",
      ],
      milestones: [
        { id: "ch5.m2.s1", title: "Build the five tools, including the approval-gated post_comment", minutes: 60 },
        { id: "ch5.m2.s2", title: "Add the routing step: classify bug vs feature vs question", minutes: 45 },
        { id: "ch5.m2.s3", title: "Wire the orchestrator flow: plan → gather context → draft", minutes: 60 },
        { id: "ch5.m2.s4", title: "Build an approval UI or CLI prompt showing exactly what will be posted", minutes: 45 },
        { id: "ch5.m2.s5", title: "Add a trace-viewer page listing each step with tokens and time", minutes: 50 },
        { id: "ch5.m2.s6", title: "Add the budget guard: stop after N steps or $X", minutes: 30 },
      ],
      deliverable:
        "An agent that turns a raw GitHub issue into a labeled, planned, human-approved response, with a full trace of how it got there.",
      reflection: [
        "What did the routing step get wrong, and why?",
        "Where would you add a second approval gate if this went to production?",
      ],
      stretch: [{ id: "ch5.m2.x1", title: "Add an evaluator-optimizer step: a second call critiques the draft before approval", minutes: 40 }],
    },
    {
      id: "ch5.m3",
      number: 11,
      title: "Port to the Agent SDK",
      track: "Backend",
      hours: 5,
      major: false,
      objective:
        "Rebuild the raw loop from Raw Agent Loop on the Claude Agent SDK and compare what you gain against what control you give up.",
      requirements: [
        "Same three tools (list_dir, read_file, search), now running on the SDK instead of your hand-written loop.",
        "A hook logging every tool call.",
        "Permission modes that require approval before any write.",
        "A written comparison of what the SDK gives you and what it takes away.",
      ],
      milestones: [
        { id: "ch5.m3.s1", title: "Port the same three tools onto the SDK", minutes: 60 },
        { id: "ch5.m3.s2", title: "Add a hook that logs every tool call", minutes: 30 },
        { id: "ch5.m3.s3", title: "Use permission modes to require approval on writes", minutes: 30 },
        { id: "ch5.m3.s4", title: "Write a one-page comparison: what the SDK gives you, what control you lose", minutes: 40 },
      ],
      deliverable:
        "The same codebase Q&A agent running on the Agent SDK, plus a short written comparison against the hand-built version.",
      reflection: [
        "Which parts of your hand-written loop did the SDK replace cleanly, and which did it make harder to see?",
        "What would you have to give up if you had to drop the SDK and go back to your own loop under a deadline?",
      ],
      stretch: [{ id: "ch5.m3.x1", title: "Add a subagent for 'search' and measure whether it actually helps", minutes: 45 }],
    },
    {
      id: "ch5.m4",
      number: 12,
      title: "Agentic Search vs RAG Bake-off",
      track: "Backend",
      hours: 5,
      major: false,
      objective:
        "Answer the same 20 questions three ways — your RAG pipeline, your raw agent loop, and (if it fits) the whole corpus in context — and let the numbers say which one wins for your data.",
      requirements: [
        "Uses the RAG pipeline from Ask-My-Docs and the agent loop from Raw Agent Loop as two of the three approaches.",
        "A third approach — the whole corpus in the context window — attempted only if it actually fits.",
        "The same 20 questions run through all three, unchanged.",
        "A results table of accuracy, latency and cost for each approach.",
      ],
      milestones: [
        { id: "ch5.m4.s1", title: "Pick 20 questions and run them through your RAG pipeline", minutes: 45 },
        { id: "ch5.m4.s2", title: "Run the same 20 questions through your raw agent loop", minutes: 45 },
        { id: "ch5.m4.s3", title: "Try the whole-corpus-in-context approach where it fits, and note where it doesn't", minutes: 40 },
        { id: "ch5.m4.s4", title: "Build a table of accuracy, latency and cost for each approach", minutes: 40 },
        { id: "ch5.m4.s5", title: "Write a one-paragraph recommendation: when you'd choose each", minutes: 30 },
      ],
      deliverable: "A short comparison report with numbers, not opinions, on when RAG, agentic search or long context wins for your corpus.",
      reflection: ["Which approach surprised you, and why?", "What would change your recommendation if the corpus were 100x larger?"],
      stretch: [],
    },
  ],
  trial: [
    {
      id: "ch5.t.agentic-loop",
      dimension: "Understanding",
      statement: "You can explain the agentic loop (tool_use → run tool → tool_result → repeat) without looking it up.",
    },
    {
      id: "ch5.t.hand-built-loop",
      dimension: "Implementation",
      statement: "You can write a tool-calling loop by hand, with no agent framework, that handles parallel tool calls.",
    },
    {
      id: "ch5.t.trace-debugging",
      dimension: "Debugging",
      statement: "You can read an agent's step-by-step trace and identify where it looped, misused a tool, or quit early.",
    },
    {
      id: "ch5.t.workflow-vs-agent",
      dimension: "Tradeoffs",
      statement: "You can decide whether a problem calls for a fixed workflow or a model-directed agent, and justify it.",
    },
    {
      id: "ch5.t.bakeoff-evaluation",
      dimension: "Evaluation",
      statement: "You can compare RAG, agentic search and a raw agent loop on the same questions and back your choice with numbers.",
    },
    {
      id: "ch5.t.sdk-port",
      dimension: "Independence",
      statement: "You can port a hand-built agent loop to the Agent SDK and explain what you gained and what you gave up.",
    },
  ],
  skills: { building: 2, systemDesign: 3 },
};
