// Chapter 6 — MCP & Tool Integration (weeks 16-17).
import type { Chapter } from "./types";

export const ch6: Chapter = {
  id: "ch6",
  number: 6,
  title: "MCP & Tool Integration",
  tagline: "Give any agent a safe way to reach your systems.",
  description:
    "Expose existing tools through MCP and test local and authenticated remote integrations.",
  why:
    "Backend engineers who can expose their company's services safely as MCP servers are directly useful to every AI initiative. It's your existing API-design skill applied to a new kind of consumer.",
  weeks: [
    {
      number: 16,
      title: "Local MCP server",
      focus: "Wrap the Chapter 5 tools in a local MCP server and test it against a real client.",
      build: {
        deliverable: "Wrap the Chapter 05 tools in a local MCP server and connect a client.",
        evidence:
          "Use Inspector to test schemas, errors, and capability negotiation. Demonstrate tools and explain when resources/prompts would be useful.",
      },
      groups: [
        {
          title: "Protocol shape",
          concepts: [
            {
              id: "ch6.c.architecture",
              title: "Architecture",
              summary:
                "A host (the app) talks to one client per server, and each client talks to its server over JSON-RPC — understanding this three-layer shape explains most of MCP's design decisions.",
              minutes: 30,
              resources: ["ch6.r.mcp-specification"],
            },
            {
              id: "ch6.c.server-primitives",
              title: "Server primitives",
              summary:
                "Tools are model-invoked, resources are app-attached context, and prompts are user-invoked templates — three different jobs, and mixing them up leads to the wrong design.",
              minutes: 35,
              resources: ["ch6.r.mcp-specification", "ch6.r.mcp-build-server"],
            },
            {
              id: "ch6.c.transports",
              title: "Transports",
              summary:
                "stdio suits a local process the host launches directly; Streamable HTTP suits a remote server that many clients connect to over the network.",
              minutes: 25,
              resources: ["ch6.r.mcp-specification"],
            },
          ],
        },
        {
          title: "Building & testing",
          concepts: [
            {
              id: "ch6.c.mcp-inspector",
              title: "Testing with MCP Inspector",
              summary:
                "Inspector lets you call tools, read resources and watch the raw JSON-RPC messages your server sends — it's your debugger for every server you build.",
              minutes: 25,
              resources: ["ch6.r.mcp-inspector-tool"],
            },
            {
              id: "ch6.c.building-primitives",
              title: "Tools, resources & prompts in practice",
              summary:
                "Building all three primitives on a real server — a validated tool, an exposed resource, and a user-invoked prompt template — is what turns the spec into something you actually understand.",
              minutes: 60,
              resources: ["ch6.r.mcp-build-server", "ch6.r.mcp-typescript-sdk"],
            },
          ],
        },
      ],
    },
    {
      number: 17,
      title: "Remote & secure MCP",
      focus: "Deploy the same server over an authenticated remote transport and defend it against MCP-specific threats.",
      build: {
        deliverable:
          "Deploy the same small server over an authenticated remote transport, using an existing authorization provider or identity platform rather than building OAuth yourself. Prerequisites: an HTTPS endpoint, a test client, and a provider account or local test issuer.",
        evidence:
          "Test valid/invalid token handling, scopes, and tool-level permission checks, plus credential scope, timeouts, and client compatibility. Keep tool-level permissions independent of model instructions.",
      },
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
              resources: ["ch6.r.mcp-specification"],
            },
            {
              id: "ch6.c.oauth-per-spec",
              title: "OAuth 2.1 per the spec",
              summary:
                "The MCP spec defines an OAuth 2.1 authorization flow for remote servers. Use an existing authorization provider or identity platform rather than building OAuth yourself; the goal is correct valid/invalid token handling, scopes, and tool-level permission checks, not implementing the flow from scratch.",
              minutes: 40,
              resources: ["ch6.r.mcp-specification"],
            },
            {
              id: "ch6.c.integrating-mcp",
              title: "Integrating MCP into agents & products",
              summary:
                "An agent that discovers tools from an MCP server at startup, instead of hard-coding them, can gain new capabilities just by connecting to a new server.",
              minutes: 30,
              resources: [],
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
              resources: ["ch6.r.mcp-specification"],
            },
            {
              id: "ch6.c.token-passthrough",
              title: "Token passthrough",
              summary:
                "Forwarding a client's access token straight through to a downstream API is explicitly forbidden by the spec, because it breaks audience and scope guarantees the token was issued under.",
              minutes: 20,
              resources: ["ch6.r.mcp-specification"],
            },
          ],
        },
      ],
    },
  ],
  majorObjective:
    "By the end you can build, test and secure an MCP server locally, then deploy it over an authenticated remote transport with permissions enforced server-side.",
  doneWhen:
    "The existing agent can use the server, unauthorized calls fail, and the repository records compatible protocol, SDK, and client versions.",
  decision:
    "Choose direct functions, an ordinary API, or MCP based on interoperability needs; compare local stdio with remote Streamable HTTP and their security boundaries.",
  resources: [
    {
      id: "ch6.r.mcp-build-server",
      title: "MCP docs: Introduction & Build a server",
      url: "https://modelcontextprotocol.io/docs/develop/build-server",
      kind: "Docs",
      hours: 1,
      use: "reference",
      note: "Use one language quickstart to adapt existing tools; avoid rebuilding the business logic.",
      week: 16,
    },
    {
      id: "ch6.r.mcp-specification",
      title: "MCP Specification",
      url: "https://modelcontextprotocol.io/specification",
      kind: "Spec",
      hours: 2,
      use: "must",
      note: "Read Architecture, Transports, Authorization, and Security Best Practices for the pinned version. Treat authorization as distinct from permission to execute each tool.",
      week: 16,
      weekEnd: 17,
    },
    {
      id: "ch6.r.mcp-inspector-tool",
      title: "MCP Inspector",
      url: "https://github.com/modelcontextprotocol/inspector",
      kind: "Tool",
      hours: 0.5,
      use: "reference",
      note: "Exercise real client/server interactions and failure responses.",
      week: 16,
    },
    {
      id: "ch6.r.mcp-typescript-sdk",
      title: "MCP TypeScript SDK",
      url: "https://github.com/modelcontextprotocol/typescript-sdk",
      kind: "Code",
      hours: 0.75,
      use: "reference",
      note: "Use the stable version compatible with your client and examples; do not mix SDK generations.",
      week: 16,
    },
    {
      id: "ch6.r.mcp-python-sdk",
      title: "MCP Python SDK",
      url: "https://github.com/modelcontextprotocol/python-sdk",
      kind: "Code",
      hours: 0.75,
      use: "bonus",
      note: "Use instead of the TypeScript reference if building the server in Python; choose one SDK.",
      week: 16,
    },
    {
      id: "ch6.r.intro-to-mcp-course",
      title: "Introduction to Model Context Protocol — Anthropic Academy",
      url: "https://anthropic.skilljar.com/introduction-to-model-context-protocol",
      kind: "Course",
      hours: 3,
      use: "bonus",
      note: "Alternative guided route to the quickstart, not an additional mandatory course.",
      week: 16,
      weekEnd: 17,
    },
    {
      id: "ch6.r.mcp-deeplearning-course",
      title: "MCP: Build Rich-Context AI Apps with Anthropic — DeepLearning.AI",
      url: "https://www.deeplearning.ai/short-courses/mcp-build-rich-context-ai-apps-with-anthropic/",
      kind: "Course",
      hours: 2,
      use: "bonus",
      note: "Another guided route; choose at most one introductory course.",
      week: 16,
      weekEnd: 17,
    },
    {
      id: "ch6.r.reference-mcp-servers",
      title: "Reference MCP servers",
      url: "https://github.com/modelcontextprotocol/servers",
      kind: "Code",
      hours: 1,
      use: "bonus",
      note: "Inspect a relevant server for patterns; examples still need your own permission and threat review.",
      week: 17,
    },
    {
      id: "ch6.r.mcp-advanced-topics",
      title: "MCP: Advanced Topics — Anthropic Academy",
      url: "https://anthropic.skilljar.com/model-context-protocol-advanced-topics",
      kind: "Course",
      hours: 3,
      use: "bonus",
      note: "Sampling, notifications, and roots when required by an integration; not default scope.",
      week: 17,
    },
  ],
  missions: [
    {
      id: "ch6.m1",
      number: 11,
      title: "Local MCP Server",
      track: "Backend",
      hours: 8,
      major: true,
      objective:
        "Wrap the tools from your Chapter 5 agent in a local stdio MCP server and connect a real client to it.",
      requirements: [
        "Tools, a resource, and a prompt exposed from the server, wrapping existing business logic rather than rewriting it.",
        "Every tool, resource, and prompt tested in MCP Inspector, including error paths.",
        "Capability negotiation and the initialize → operation → shutdown lifecycle verified.",
        "A real client (e.g. Claude Code) connected to the server and used for an actual task.",
        "A short note on when a resource or prompt is useful versus a plain tool.",
      ],
      milestones: [
        { id: "ch6.m1.s1", title: "Wrap the Chapter 5 agent's tools as MCP tools with input validation", minutes: 60, week: 16 },
        { id: "ch6.m1.s2", title: "Expose at least one resource and one prompt from the server", minutes: 45, week: 16 },
        { id: "ch6.m1.s3", title: "Test every tool, resource, and prompt in MCP Inspector, including error paths", minutes: 45, week: 16 },
        { id: "ch6.m1.s4", title: "Verify capability negotiation and the full connection lifecycle", minutes: 30, week: 16 },
        { id: "ch6.m1.s5", title: "Connect a real client to the server and use it for an actual task", minutes: 30, week: 16 },
        { id: "ch6.m1.s6", title: "Write a short note on when you'd reach for a resource or prompt instead of a tool", minutes: 20, week: 16 },
      ],
      deliverable:
        "A working local stdio MCP server wrapping your Chapter 5 tools, tested in Inspector and connected to a real client for a real task.",
      reflection: [
        "What did MCP Inspector catch that you wouldn't have noticed from the client alone?",
        "Which primitive — tool, resource, or prompt — turned out to be the right fit for which piece of functionality?",
      ],
      stretch: [],
    },
    {
      id: "ch6.m2",
      number: 12,
      title: "Authenticated Remote MCP",
      track: "Backend",
      hours: 8,
      major: true,
      objective:
        "Deploy the same small server over an authenticated remote Streamable HTTP transport, using an existing authorization provider or identity platform, and keep tool-level permissions independent of whatever the model is told.",
      requirements: [
        "Streamable HTTP transport instead of stdio, deployed to an org-approved platform (Cloudflare or Google Cloud Platform).",
        "An authorization flow following the MCP spec via an existing authorization provider or identity platform, not a hand-built OAuth implementation.",
        "Prerequisites in place: an HTTPS endpoint, a test client, and a provider account or local test issuer.",
        "Valid/invalid token handling, scopes, and tool-level permission checks tested, plus credential scope and timeout cases.",
        "Client compatibility verified against at least one real client.",
        "Tool-level permissions enforced server-side, independent of model instructions.",
        "Protocol, SDK, and client versions recorded in the repository.",
      ],
      milestones: [
        { id: "ch6.m2.s1", title: "Stand up the server on Streamable HTTP transport behind an HTTPS endpoint, deployed to an org-approved platform (Cloudflare or Google Cloud Platform)", minutes: 60, week: 17 },
        { id: "ch6.m2.s2", title: "Wire the spec's OAuth 2.1 authorization flow to an existing authorization provider or identity platform (or a local test issuer)", minutes: 75, week: 17 },
        { id: "ch6.m2.s3", title: "Test valid/invalid token handling, scopes, and tool-level permission checks", minutes: 45, week: 17 },
        { id: "ch6.m2.s4", title: "Test timeouts and client compatibility against a real client", minutes: 40, week: 17 },
        { id: "ch6.m2.s5", title: "Enforce tool-level permissions server-side, independent of model instructions", minutes: 40, week: 17 },
        { id: "ch6.m2.s6", title: "Record the pinned protocol, SDK, and client versions in the repo", minutes: 20, week: 17 },
      ],
      deliverable:
        "A remote MCP server reachable over authenticated Streamable HTTP, with tested authorization and permission enforcement independent of the model.",
      reflection: [
        "What would happen if you removed server-side tool permission checks and relied only on model instructions?",
        "Where did an invalid-authorization test reveal a gap your happy-path testing missed?",
      ],
      stretch: [
        {
          id: "ch6.m2.x2",
          title: "Connect a second, different real client to the deployed server and verify it behaves the same way",
          minutes: 60,
          week: 17,
        },
      ],
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
      statement: "You can build a working MCP server with validated tools, a resource, and a prompt from scratch.",
    },
    {
      id: "ch6.t.inspector-debugging",
      dimension: "Debugging",
      statement: "You can use MCP Inspector to diagnose why a tool call from a client isn't returning what you expect.",
    },
    {
      id: "ch6.t.transport-tradeoffs",
      dimension: "Tradeoffs",
      statement: "You can compare local stdio with remote Streamable HTTP and explain their different security boundaries.",
    },
    {
      id: "ch6.t.auth-evaluation",
      dimension: "Evaluation",
      statement: "You can demonstrate that an unauthorized or invalid-credential call to your remote server fails as designed.",
    },
  ],
  notes: [
    {
      label: "Deployment",
      text:
        "Deploy only to an org-approved platform (Cloudflare or Google Cloud Platform); any other hosting provider needs the company's procurement and security approval first.",
    },
  ],
  skills: { building: 2, systemDesign: 2, production: 1 },
};
