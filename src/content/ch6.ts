// Chapter 6 — MCP & Tool Integration (weeks 16-18).
import type { Chapter } from "./types";

export const ch6: Chapter = {
  id: "ch6",
  number: 6,
  title: "MCP & Tool Integration",
  tagline: "Give any agent a safe way to reach your systems.",
  description:
    "MCP is the standard way to expose tools, data and prompts to any AI app. Build a server locally, test it against a real client, then make it remote and secure.",
  why:
    "Backend engineers who can expose their company's services safely as MCP servers are directly useful to every AI initiative. It's your existing API-design skill applied to a new kind of consumer.",
  weeks: [
    {
      number: 16,
      title: "Protocol concepts",
      focus: "Learn the architecture and lifecycle every MCP server and client follows.",
      groups: [
        {
          title: "How the pieces fit together",
          concepts: [
            {
              id: "ch6.c.architecture",
              title: "Architecture",
              summary:
                "A host (the app) talks to one client per server, and each client talks to its server over JSON-RPC — understanding this three-layer shape explains most of MCP's design decisions.",
              minutes: 30,
            },
            {
              id: "ch6.c.server-primitives",
              title: "Server primitives",
              summary:
                "Tools are model-invoked, resources are app-attached context, and prompts are user-invoked templates — three different jobs, and mixing them up leads to the wrong design.",
              minutes: 35,
            },
            {
              id: "ch6.c.client-features",
              title: "Client features",
              summary:
                "Sampling, elicitation and roots let a server ask something of the client — request a completion, ask the user a question, or learn what's on disk — instead of only answering requests.",
              minutes: 30,
            },
          ],
        },
        {
          title: "Connecting and observing",
          concepts: [
            {
              id: "ch6.c.transports",
              title: "Transports",
              summary:
                "stdio suits a local process the host launches directly; Streamable HTTP suits a remote server that many clients connect to over the network.",
              minutes: 25,
            },
            {
              id: "ch6.c.lifecycle",
              title: "Lifecycle",
              summary:
                "Every connection goes through initialize, capability negotiation, normal operation, then shutdown — knowing this sequence is what makes a broken handshake debuggable.",
              minutes: 25,
            },
          ],
        },
      ],
    },
    {
      number: 17,
      title: "Building servers",
      focus: "Build, test and design real tools, resources and prompts, not just wrappers over an API.",
      groups: [
        {
          title: "Building and testing",
          concepts: [
            {
              id: "ch6.c.mcp-inspector",
              title: "Testing with MCP Inspector",
              summary:
                "Inspector lets you call tools, read resources and watch the raw JSON-RPC messages your server sends — it's your debugger for every server you build.",
              minutes: 25,
            },
            {
              id: "ch6.c.building-primitives",
              title: "Tools, resources & prompts in practice",
              summary:
                "Building all three primitives on a real server — a validated tool, an exposed resource, and a user-invoked prompt template — is what turns the spec into something you actually understand.",
              minutes: 60,
            },
          ],
        },
        {
          title: "Designing for real clients",
          concepts: [
            {
              id: "ch6.c.structured-tool-output",
              title: "Structured tool output",
              summary:
                "Declaring an outputSchema and returning structuredContent lets a client rely on a tool's response shape instead of parsing free text.",
              minutes: 25,
            },
            {
              id: "ch6.c.outcome-oriented-design",
              title: "Outcome-oriented tool design",
              summary:
                "A tool like 'summarize_repo_activity' serves a model far better than a thin 'GET /events' wrapper — design for the outcome an agent needs, with pagination and response-size limits built in.",
              minutes: 35,
            },
            {
              id: "ch6.c.distribution-config",
              title: "Distribution & config",
              summary:
                "Registering a server in Claude Code (.mcp.json) or a desktop app, and versioning it sanely, is what makes it actually usable beyond your own machine.",
              minutes: 20,
            },
          ],
        },
      ],
    },
    {
      number: 18,
      title: "Remote & secure MCP",
      focus: "Take a server off your laptop and make it safe to expose to real clients.",
      groups: [
        {
          title: "Going remote",
          concepts: [
            {
              id: "ch6.c.streamable-http",
              title: "Streamable HTTP",
              summary:
                "Streamable HTTP is the transport for a remote server that many clients connect to over the network, replacing the older SSE-based transport.",
              minutes: 30,
            },
            {
              id: "ch6.c.oauth-per-spec",
              title: "OAuth 2.1 per the spec",
              summary:
                "The MCP spec defines an OAuth 2.1 authorization flow for remote servers; following it exactly, rather than improvising your own auth, is what keeps a server safe to expose.",
              minutes: 40,
            },
            {
              id: "ch6.c.integrating-mcp",
              title: "Integrating MCP into agents & products",
              summary:
                "An agent that discovers tools from an MCP server at startup, instead of hard-coding them, can gain new capabilities just by connecting to a new server.",
              minutes: 30,
            },
          ],
        },
        {
          title: "Threats you must design against",
          concepts: [
            {
              id: "ch6.c.tool-poisoning-confused-deputy",
              title: "Tool poisoning & confused deputy",
              summary:
                "A malicious or compromised server can smuggle instructions in its tool descriptions, and a server acting on a client's behalf can be tricked into misusing its own authority — both are classic MCP-specific risks.",
              minutes: 35,
            },
            {
              id: "ch6.c.token-passthrough",
              title: "Token passthrough",
              summary:
                "Forwarding a client's access token straight through to a downstream API is explicitly forbidden by the spec, because it breaks audience and scope guarantees the token was issued under.",
              minutes: 20,
            },
          ],
        },
      ],
    },
  ],
  majorObjective:
    "By the end you can build, test and secure an MCP server, and wire an existing agent to use it as its tool source instead of hard-coded functions.",
  resources: [
    {
      id: "ch6.r.mcp-build-server",
      title: "MCP docs: Introduction & Build a server",
      url: "https://modelcontextprotocol.io/docs/develop/build-server",
      kind: "Docs",
      hours: 2,
      required: true,
      note: "Official quickstart in TypeScript or Python.",
      week: 16,
    },
    {
      id: "ch6.r.mcp-specification",
      title: "MCP Specification",
      url: "https://modelcontextprotocol.io/specification",
      kind: "Spec",
      hours: 3,
      required: true,
      note: "Read Architecture, Transports, Authorization and Security Best Practices. Skim the rest.",
      week: 16,
    },
    {
      id: "ch6.r.mcp-inspector-tool",
      title: "MCP Inspector",
      url: "https://github.com/modelcontextprotocol/inspector",
      kind: "Tool",
      hours: 0.5,
      required: true,
      note: "Your debugger for every server you build.",
      week: 16,
    },
    {
      id: "ch6.r.intro-to-mcp-course",
      title: "Introduction to Model Context Protocol — Anthropic Academy",
      url: "https://anthropic.skilljar.com/introduction-to-model-context-protocol",
      kind: "Course",
      hours: 3,
      required: true,
      note: "Free course: build a server and client from scratch.",
      week: 17,
    },
    {
      id: "ch6.r.mcp-typescript-sdk",
      title: "MCP TypeScript SDK",
      url: "https://github.com/modelcontextprotocol/typescript-sdk",
      kind: "Code",
      hours: 1,
      required: true,
      note: "README and examples. Use the Python SDK instead if your backend is Python.",
      week: 17,
    },
    {
      id: "ch6.r.mcp-python-sdk",
      title: "MCP Python SDK",
      url: "https://github.com/modelcontextprotocol/python-sdk",
      kind: "Code",
      hours: 1,
      required: false,
      note: "The FastMCP-style API for Python servers.",
      week: 17,
    },
    {
      id: "ch6.r.mcp-advanced-topics",
      title: "MCP: Advanced Topics — Anthropic Academy",
      url: "https://anthropic.skilljar.com/model-context-protocol-advanced-topics",
      kind: "Course",
      hours: 3,
      required: false,
      note: "Sampling, notifications, roots and transports in depth.",
      week: 18,
    },
    {
      id: "ch6.r.mcp-deeplearning-course",
      title: "MCP: Build Rich-Context AI Apps with Anthropic — DeepLearning.AI",
      url: "https://www.deeplearning.ai/short-courses/mcp-build-rich-context-ai-apps-with-anthropic/",
      kind: "Course",
      hours: 2,
      required: false,
      note: "A second perspective with guided notebooks.",
      week: 17,
    },
    {
      id: "ch6.r.reference-mcp-servers",
      title: "Reference MCP servers",
      url: "https://github.com/modelcontextprotocol/servers",
      kind: "Code",
      hours: 1.5,
      required: false,
      note: "Read the filesystem and git servers' source to see idiomatic structure.",
      week: 17,
    },
  ],
  missions: [
    {
      id: "ch6.m1",
      number: 13,
      title: "Local Notes MCP Server",
      track: "Backend",
      hours: 8,
      major: true,
      objective:
        "Build a stdio MCP server over a SQLite notes or todo database that you actually use from Claude Code.",
      requirements: [
        "Tools: search_notes, add_note and list_tags, with input validation.",
        "Each note exposed as a resource, plus a 'weekly review' prompt.",
        "Tested end to end in MCP Inspector before connecting it to anything else.",
        "Connected to Claude Code via .mcp.json and used for a real task.",
        "Paginated search and structured tool output (outputSchema).",
      ],
      milestones: [
        { id: "ch6.m1.s1", title: "Build search_notes, add_note and list_tags with input validation", minutes: 60 },
        { id: "ch6.m1.s2", title: "Expose each note as a resource, plus a 'weekly review' prompt", minutes: 45 },
        { id: "ch6.m1.s3", title: "Test every tool and resource end to end in MCP Inspector", minutes: 30 },
        { id: "ch6.m1.s4", title: "Connect the server to Claude Code via .mcp.json and use it for a real task", minutes: 30 },
        { id: "ch6.m1.s5", title: "Add pagination to search and structured output (outputSchema) to every tool", minutes: 40 },
      ],
      deliverable:
        "A working stdio MCP server over your own notes database, wired into Claude Code and used for at least one real task.",
      reflection: [
        "What did MCP Inspector catch that you wouldn't have noticed from the client alone?",
        "Which tool's description needed the most rewriting before the model used it correctly?",
      ],
      stretch: [{ id: "ch6.m1.x1", title: "Write unit tests for every tool handler", minutes: 45 }],
    },
    {
      id: "ch6.m2",
      number: 14,
      title: "Remote MCP Server",
      track: "Backend",
      hours: 11,
      major: true,
      objective: "Wrap an API you know — GitHub, a public data API, or your own side-project API — as a remote MCP server.",
      requirements: [
        "Streamable HTTP transport, not stdio.",
        "Bearer-token auth locally, then OAuth following the spec's authorization flow.",
        "Outcome-level tools (e.g. 'summarize_repo_activity', not just 'GET /events').",
        "Rate limiting and structured logs for each tool call.",
        "Tests for each tool, including its error paths.",
      ],
      milestones: [
        { id: "ch6.m2.s1", title: "Stand up the server on Streamable HTTP transport", minutes: 60 },
        { id: "ch6.m2.s2", title: "Add bearer-token auth, then the spec's OAuth authorization flow", minutes: 75 },
        { id: "ch6.m2.s3", title: "Design outcome-level tools instead of thin API wrappers", minutes: 60 },
        { id: "ch6.m2.s4", title: "Add rate limiting and structured logs for every tool call", minutes: 40 },
        { id: "ch6.m2.s5", title: "Write tests for each tool, including error paths", minutes: 45 },
      ],
      deliverable:
        "A remote MCP server over a real API, reachable over Streamable HTTP with proper auth, rate limiting and test coverage.",
      reflection: [
        "What would a confused-deputy attack against this server look like, and what stops it?",
        "Which of your tools is still too close to a raw API wrapper?",
      ],
      stretch: [{ id: "ch6.m2.x1", title: "Deploy it: use an org-approved platform (Cloudflare or Google Cloud Platform); anything else needs procurement/security approval", minutes: 60 }],
    },
    {
      id: "ch6.m3",
      number: 15,
      title: "Wire MCP Into Your Agent",
      track: "Backend",
      hours: 3,
      major: false,
      objective: "Make your Issue Triage Agent an MCP client that uses your MCP servers instead of hard-coded tools.",
      requirements: [
        "The agent discovers its tools from the MCP server at startup instead of importing local functions.",
        "Tool calls are routed through the MCP client, not local code.",
        "The agent's existing traces and approval gates keep working unchanged.",
      ],
      milestones: [
        { id: "ch6.m3.s1", title: "Replace hard-coded tool definitions with tools discovered from the MCP server at startup", minutes: 40 },
        { id: "ch6.m3.s2", title: "Route tool calls through the MCP client instead of local functions", minutes: 35 },
        { id: "ch6.m3.s3", title: "Confirm existing traces still capture MCP tool calls, their tokens and their time", minutes: 25 },
        { id: "ch6.m3.s4", title: "Confirm approval gates still fire for side-effecting MCP tools", minutes: 20 },
      ],
      deliverable: "The triage agent from Chapter 5 running entirely on MCP-discovered tools, with no hard-coded tool list left.",
      reflection: [
        "What broke the first time you swapped local tools for MCP-discovered ones, and why?",
        "What would you need to change if the agent had to connect to two MCP servers instead of one?",
      ],
      stretch: [],
    },
  ],
  trial: [
    {
      id: "ch6.t.architecture",
      dimension: "Understanding",
      statement: "You can explain host/client/server roles in MCP and what JSON-RPC carries between them.",
    },
    {
      id: "ch6.t.build-server",
      dimension: "Implementation",
      statement: "You can build a working MCP server with validated tools, resources and a prompt from scratch.",
    },
    {
      id: "ch6.t.inspector-debugging",
      dimension: "Debugging",
      statement: "You can use MCP Inspector to diagnose why a tool call from a client isn't returning what you expect.",
    },
    {
      id: "ch6.t.transports-explanation",
      dimension: "Explanation",
      statement: "You can explain the difference between stdio and Streamable HTTP transports and when to use each.",
    },
    {
      id: "ch6.t.security-tradeoffs",
      dimension: "Tradeoffs",
      statement: "You can name three MCP security risks (e.g. tool poisoning, confused deputy, token passthrough) and how your server avoids them.",
    },
    {
      id: "ch6.t.agent-wiring",
      dimension: "Independence",
      statement: "You can wire an existing agent to discover and call tools from your own MCP server with no hard-coded tool list left.",
    },
  ],
  skills: { building: 2, systemDesign: 2, production: 1 },
};
