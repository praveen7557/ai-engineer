# The AI Engineer: Course Resources

Every learning resource in the 24-week roadmap, by chapter. **Must read** items count toward progress; **Bonus** items are optional.

**Totals:** 97 resources (50 must read, 47 bonus) · ~70 hours of must-read material · 14 ongoing sources

## Chapter 01: LLM Foundations (Weeks 1–3)

_Explain how a model produces text, estimate what a feature will cost, and make reliable API calls with keys handled safely._

| | Resource | Type | Hours | Week | Why |
|---|---|---|---|---|---|
| **Must read** | [Intro to Large Language Models — Andrej Karpathy](https://www.youtube.com/watch?v=zjkBMFhNj_g) | Video | 1 | 1 | The best one-hour mental model of what an LLM is. Start here. |
| **Must read** | [Deep Dive into LLMs like ChatGPT — Andrej Karpathy](https://www.youtube.com/watch?v=7xTGNNLPyMI) | Video | 3.5 | 1 | Pre-training, post-training, RL, tokenization and hallucinations, all explained for developers. |
| **Must read** | [Neural networks series (ch. 5–7: Transformers, Attention) — 3Blue1Brown](https://www.3blue1brown.com/topics/neural-networks) | Video | 1.5 | 1 | Visual intuition for attention. Watch chapters 5–7; the earlier ones are optional. |
| **Must read** | [Building with the Claude API — Anthropic Academy](https://anthropic.skilljar.com/claude-with-the-anthropic-api) | Course | 8 | 3 | Free structured course covering the API, prompting, tool use, RAG and evals at a lighter depth than this roadmap. |
| **Must read** | [Messages API reference — Claude Docs](https://platform.claude.com/docs/en/api/messages) | Docs | 1 | 3 | Keep this open while building the Prompt Lab CLI. |
| **Must read** | [Pricing — Anthropic](https://claude.com/pricing) | Docs | 0.25 | 3 | Per-model input/output prices for your cost estimates. |
| Bonus | [AI Engineering (book) — Chip Huyen · ch. 1–2](https://www.oreilly.com/library/view/ai-engineering/9781098166298/) | Book | 4 | 1 | The reference book for this whole roadmap. Chapters 1–2 cover foundations. |
| Bonus | [Prompt engineering overview & best practices — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) | Docs | 2 | 2 | The official, up-to-date techniques; a preview of chapter 2's focus. |
| Bonus | [Token counting — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/token-counting) | Docs | 0.5 | 2 | Count tokens before sending; useful for the cost calculator mission. |
| Bonus | [Prompt Engineering — Lilian Weng](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/) | Article | 1 | 2 | A research-backed survey of prompting techniques you'll use starting chapter 2. |
| Bonus | [Embeddings — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/embeddings) | Docs | 0.5 | 3 | Anthropic's guidance and recommended embedding providers; a preview of chapter 4. |
| Bonus | [Claude Cookbooks](https://github.com/anthropics/claude-cookbooks) | Code | 2 | 3 | Copy-pasteable recipes. Browse now and come back in every later chapter. |
| Bonus | [LLM CLI — Simon Willison](https://llm.datasette.io) | Tool | 1 | 3 | A terminal tool for quick prompt experiments and logging; a nice reference while building the Prompt Lab CLI. |

## Chapter 02: Working With Models (Weeks 4–6)

_Turn prompting and API usage into a repeatable practice: structured outputs you can validate, chains you can debug, and failures you can recover from._

| | Resource | Type | Hours | Week | Why |
|---|---|---|---|---|---|
| **Must read** | [Interactive Prompt Engineering Tutorial — Anthropic](https://github.com/anthropics/prompt-eng-interactive-tutorial) | Course | 6 | 4 | Nine chapters of hands-on notebooks with exercises. Do every exercise. |
| **Must read** | [Prompt engineering overview & best practices — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) | Docs | 2 | 4 | The official, up-to-date techniques. Read the whole section this time, not just the preview from chapter 1. |
| **Must read** | [Messages API reference — Claude Docs](https://platform.claude.com/docs/en/api/messages) | Docs | 1 | 5 | Keep it open while building the Structured Extractor and the Prompt Chain Pipeline. |
| **Must read** | [Streaming Messages — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/streaming) | Docs | 0.5 | 5 | The SSE event types you'll parse in chapter 3's chat app; understand them here first. |
| **Must read** | [Structured outputs — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) | Docs | 0.5 | 6 | Guaranteed-valid JSON against your schema; the backbone of the Structured Extractor mission. |
| Bonus | [Anthropic courses repo (API fundamentals notebooks)](https://github.com/anthropics/courses) | Course | 4 | 4 | Notebook versions of API fundamentals and prompt evaluation. |
| Bonus | [Prompt Engineering — Lilian Weng](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/) | Article | 1 | 4 | A research-backed survey of prompting techniques, useful background for the chaining patterns. |
| Bonus | [ChatGPT Prompt Engineering for Developers — DeepLearning.AI](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/) | Course | 1.5 | 4 | Provider-agnostic short course; the ideas carry over directly. |
| Bonus | [AI Engineering (book) — Chip Huyen · ch. 5](https://www.oreilly.com/library/view/ai-engineering/9781098166298/) | Book | 2 | 4 | Chapter 5 covers prompting technique in more depth than any single article. |
| Bonus | [Token counting — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/token-counting) | Docs | 0.5 | 5 | Count tokens before sending to keep conversation history within budget. |
| Bonus | [Claude Cookbooks](https://github.com/anthropics/claude-cookbooks) | Code | 1 | 6 | Structured-output and chaining recipes worth copying into your own pipeline. |

## Chapter 03: Building AI Applications (Weeks 7–9)

_Ship a full-stack streaming chat app with a safe backend, and apply the same patterns to make an AI feature feel native inside a real UI._

| | Resource | Type | Hours | Week | Why |
|---|---|---|---|---|---|
| **Must read** | [Streaming Messages — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/streaming) | Docs | 0.5 | 7 | The SSE event types your backend proxy re-streams to the browser. |
| **Must read** | [Using server-sent events — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) | Docs | 0.5 | 7 | The SSE fundamentals under every streaming UI you'll build. |
| **Must read** | [People + AI Guidebook — Google PAIR](https://pair.withgoogle.com/guidebook) | Docs | 2 | 8 | Patterns for trust, explanations and feedback in AI-driven interfaces. |
| **Must read** | [Guidelines for Human-AI Interaction — Microsoft HAX](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/) | Docs | 1 | 8 | 18 research-backed interaction guidelines for setting expectations and handling errors. |
| **Must read** | [Reduce latency — Claude Docs](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency) | Docs | 0.5 | 9 | The official latency checklist, directly relevant to a chat app that has to feel responsive. |
| **Must read** | [Prompt caching — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) | Docs | 1 | 9 | Structure prompts for cache hits; pricing and TTLs. |
| **Must read** | [Rate limits — Claude Docs](https://platform.claude.com/docs/en/api/rate-limits) | Docs | 0.5 | 9 | How limits are measured and how to read the response headers, needed for the per-user budget requirement. |
| Bonus | [Errors — Claude Docs](https://platform.claude.com/docs/en/api/errors) | Docs | 0.25 | 7 | Which errors to retry and which to surface to the chat UI. |
| Bonus | [AI SDK (open-source TypeScript library) docs](https://ai-sdk.dev) | Docs | 2 | 8 | Streaming UI and generative UI patterns in React; learn the patterns even if you build your own. |
| Bonus | [assistant-ui](https://www.assistant-ui.com) | Code | 1 | 8 | Composable React chat primitives; study how they handle streaming state. |
| Bonus | [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/) | Spec | 1 | 9 | A first read focused on improper output handling (XSS) ahead of the full treatment in chapter 7. |

## Chapter 04: RAG & Knowledge Systems (Weeks 10–12)

_Build a measured retrieval pipeline — hybrid search, reranking and grounded, cited answers — and know when RAG is the wrong tool for the job._

| | Resource | Type | Hours | Week | Why |
|---|---|---|---|---|---|
| **Must read** | [pgvector README](https://github.com/pgvector/pgvector) | Docs | 1 | 10 | Installation, indexes (HNSW/IVFFlat), filtering and hybrid search notes. |
| **Must read** | [Retrieval-Augmented Generation — Pinecone Learn](https://www.pinecone.io/learn/retrieval-augmented-generation/) | Article | 1 | 10 | Clear conceptual walkthrough of the whole RAG pipeline. |
| **Must read** | [Chunking Strategies for LLM Applications — Pinecone Learn](https://www.pinecone.io/learn/chunking-strategies/) | Article | 1 | 10 | Chunking trade-offs with concrete examples. |
| **Must read** | [Embeddings — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/embeddings) | Docs | 0.5 | 10 | Anthropic's guidance and recommended embedding providers. |
| **Must read** | [Introducing Contextual Retrieval — Anthropic](https://www.anthropic.com/news/contextual-retrieval) | Article | 0.5 | 11 | Contextual embeddings plus BM25 plus reranking, with measured gains. |
| **Must read** | [Full Text Search — PostgreSQL docs](https://www.postgresql.org/docs/current/textsearch.html) | Docs | 1.5 | 11 | tsvector, tsquery and ranking — the keyword half of hybrid search. |
| **Must read** | [Systematically Improving Your RAG — Jason Liu](https://jxnl.co/writing/2024/05/22/systematically-improving-your-rag/) | Article | 1 | 11 | A practitioner's playbook: synthetic questions, metrics, segmentation. |
| **Must read** | [Citations — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/citations) | Docs | 0.5 | 12 | Native, verifiable citations back to source passages. |
| Bonus | [Voyage AI docs](https://docs.voyageai.com) | Docs | 1 | 10 | Embedding and reranker APIs from the provider Anthropic recommends. |
| Bonus | [MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard) | Tool | 0.25 | 10 | Compare embedding models; check the retrieval task scores specifically. |
| Bonus | [Building and Evaluating Advanced RAG — DeepLearning.AI](https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/) | Course | 1.5 | 11 | Sentence-window and auto-merging retrieval, plus the RAG triad of evals. |
| Bonus | [Practical BM25 — Elastic](https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables) | Article | 0.75 | 11 | What BM25 actually computes, explained intuitively. |
| Bonus | [Hybrid search with RRF — pgvector-python example](https://github.com/pgvector/pgvector-python/blob/master/examples/hybrid_search/rrf.py) | Code | 0.5 | 11 | Reciprocal Rank Fusion in plain SQL plus Python. |
| Bonus | [Rerank overview — Cohere docs](https://docs.cohere.com/docs/rerank-overview) | Docs | 0.5 | 11 | How rerankers slot into a retrieval pipeline. |
| Bonus | [Lost in the Middle (paper)](https://arxiv.org/abs/2307.03172) | Paper | 0.75 | 12 | Why position in the context matters, directly relevant to the RAG-vs-long-context concept. |
| Bonus | [Retrieval-Augmented Generation for Knowledge-Intensive NLP (paper)](https://arxiv.org/abs/2005.11401) | Paper | 1 | 12 | The original RAG paper — history and framing behind the pattern you're building. |

## Chapter 05: Agents & Autonomous Workflows (Weeks 13–15)

_By the end you can design, build and debug a multi-step tool-calling agent, both by hand and on the Agent SDK, and justify when an agent beats a fixed workflow._

| | Resource | Type | Hours | Week | Why |
|---|---|---|---|---|---|
| **Must read** | [Tool use overview & implementation — Claude Docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) | Docs | 2 | 13 | Read overview, implement tool use, and the tool_choice sections. |
| **Must read** | [Building Effective Agents — Anthropic](https://www.anthropic.com/engineering/building-effective-agents) | Article | 0.75 | 14 | The canonical patterns article: workflows vs agents, and the five patterns. Read it twice. |
| **Must read** | [Writing effective tools for agents — Anthropic](https://www.anthropic.com/engineering/writing-tools-for-agents) | Article | 0.75 | 14 | How to design tools that an agent actually uses well: fewer tools, better names, token-efficient responses. |
| **Must read** | [Effective context engineering for AI agents — Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Article | 0.75 | 14 | Compaction, memory files and just-in-time retrieval for long-running agents. |
| **Must read** | [Agent SDK overview — Claude Docs](https://code.claude.com/docs/en/agent-sdk/overview) | Docs | 2 | 15 | Read this after you've built the loop by hand, so you can see exactly what it's giving you. |
| Bonus | [Hugging Face Agents Course](https://huggingface.co/learn/agents-course) | Course | 15 | 13 | Free and broad; framework-heavy, so do the concept units and skip what you don't need. |
| Bonus | [ReAct: Synergizing Reasoning and Acting (paper)](https://arxiv.org/abs/2210.03629) | Paper | 1 | 13 | The original reason-then-act loop. Read the abstract and figures. |
| Bonus | [12-Factor Agents — HumanLayer](https://github.com/humanlayer/12-factor-agents) | Article | 1.5 | 14 | Engineering principles for production agents: own your prompts, own your control flow. |
| Bonus | [AI Engineering — Chip Huyen · ch. 6 (Agents section)](https://www.oreilly.com/library/view/ai-engineering/9781098166298/) | Book | 2 | 14 | Planning, tool selection and agent failure modes in one place. |
| Bonus | [How we built our multi-agent research system — Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system) | Article | 0.75 | 15 | Real-world trade-offs of an orchestrator-worker system at production scale. |
| Bonus | [Claude Code best practices — Claude Code docs](https://code.claude.com/docs/en/best-practices) | Article | 0.5 | 15 | You use Claude Code daily — read this once as an agent-design case study. |

## Chapter 06: MCP & Tool Integration (Weeks 16–18)

_By the end you can build, test and secure an MCP server, and wire an existing agent to use it as its tool source instead of hard-coded functions._

| | Resource | Type | Hours | Week | Why |
|---|---|---|---|---|---|
| **Must read** | [MCP docs: Introduction & Build a server](https://modelcontextprotocol.io/docs/develop/build-server) | Docs | 2 | 16 | Official quickstart in TypeScript or Python. |
| **Must read** | [MCP Specification](https://modelcontextprotocol.io/specification) | Spec | 3 | 16 | Read Architecture, Transports, Authorization and Security Best Practices. Skim the rest. |
| **Must read** | [MCP Inspector](https://github.com/modelcontextprotocol/inspector) | Tool | 0.5 | 16 | Your debugger for every server you build. |
| **Must read** | [Introduction to Model Context Protocol — Anthropic Academy](https://anthropic.skilljar.com/introduction-to-model-context-protocol) | Course | 3 | 17 | Free course: build a server and client from scratch. |
| **Must read** | [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) | Code | 1 | 17 | README and examples. Use the Python SDK instead if your backend is Python. |
| Bonus | [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk) | Code | 1 | 17 | The FastMCP-style API for Python servers. |
| Bonus | [MCP: Build Rich-Context AI Apps with Anthropic — DeepLearning.AI](https://www.deeplearning.ai/short-courses/mcp-build-rich-context-ai-apps-with-anthropic/) | Course | 2 | 17 | A second perspective with guided notebooks. |
| Bonus | [Reference MCP servers](https://github.com/modelcontextprotocol/servers) | Code | 1.5 | 17 | Read the filesystem and git servers' source to see idiomatic structure. |
| Bonus | [MCP: Advanced Topics — Anthropic Academy](https://anthropic.skilljar.com/model-context-protocol-advanced-topics) | Course | 3 | 18 | Sampling, notifications, roots and transports in depth. |

## Chapter 07: Evaluation & Production (Weeks 19–21)

_By the end you can ship an AI feature with a CI-gated eval suite, tracing, a passed security review and a defensible cost/latency budget._

| | Resource | Type | Hours | Week | Why |
|---|---|---|---|---|---|
| **Must read** | [Your AI Product Needs Evals — Hamel Husain](https://hamel.dev/blog/posts/evals/) | Article | 1 | 19 | The most-cited practical evals essay. Start here. |
| **Must read** | [Using LLM-as-a-Judge — Hamel Husain](https://hamel.dev/blog/posts/llm-judge/) | Article | 1 | 19 | How to build a judge you can trust, including critique shadowing. |
| **Must read** | [LLM Evals FAQ — Hamel Husain & Shreya Shankar](https://hamel.dev/blog/posts/evals-faq/) | Article | 1.5 | 19 | Answers to the questions you'll hit in practice. |
| **Must read** | [Develop test cases / define success — Claude Docs](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) | Docs | 1 | 19 | Success criteria and grading methods, with code examples. |
| **Must read** | [Demystifying evals for AI agents — Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | Article | 0.75 | 20 | How Anthropic approaches agent evaluation. |
| **Must read** | [Promptfoo docs](https://www.promptfoo.dev/docs/intro/) | Tool | 1.5 | 20 | An open-source eval runner with CI integration and red-team plugins. |
| **Must read** | [Langfuse docs](https://langfuse.com/docs) | Tool | 1 | 20 | Open-source tracing and evals; self-host with Docker. |
| **Must read** | [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/) | Spec | 2 | 21 | The industry checklist. Read every entry and map it to your apps. |
| **Must read** | [The lethal trifecta for AI agents — Simon Willison](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) | Article | 0.3 | 21 | The single most useful mental model for agent security. |
| Bonus | [AI Engineering — Chip Huyen · ch. 3-4](https://www.oreilly.com/library/view/ai-engineering/9781098166298/) | Book | 4 | 19 | Evaluation methodology in depth. |
| Bonus | [OpenTelemetry GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions-genai) | Spec | 0.5 | 20 | Standard span attributes for LLM calls. |
| Bonus | [Patterns for Building LLM-based Systems — Eugene Yan](https://eugeneyan.com/writing/llm-patterns/) | Article | 1.5 | 20 | Evals, RAG, guardrails, caching and feedback patterns in one survey. |
| Bonus | [Mitigate jailbreaks & prompt injections — Claude Docs](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks) | Docs | 0.5 | 21 | Guardrail techniques at the prompt and system level. |
| Bonus | [Reduce latency — Claude Docs](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency) | Docs | 0.5 | 21 | The official latency checklist. |
| Bonus | [Handling Overload — Google SRE Book](https://sre.google/sre-book/handling-overload/) | Book | 1 | 21 | Load shedding and client-side throttling; applies directly to LLM calls. |
| Bonus | [Designing robust APIs with idempotency — Stripe](https://stripe.com/blog/idempotency) | Article | 0.5 | 21 | The classic idempotency-keys write-up, directly applicable to side-effecting tools. |

## Chapter 08: Capstone & Deployment (Weeks 22–24)

_By the end you'll have shipped one capstone product end to end, spanning LLMs through production architecture, and put a real AI proposal in front of your team at work._

| | Resource | Type | Hours | Week | Why |
|---|---|---|---|---|---|
| **Must read** | [Anthropic engineering blog](https://www.anthropic.com/engineering) | Article | 1 | 22 | Case studies worth copying in your design doc. |
| **Must read** | [Develop test cases / define success — Claude Docs](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) | Docs | 1 | 22 | Reread while writing your capstone's success criteria and eval plan. |
| **Must read** | [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/) | Spec | 2 | 23 | Run your capstone's security review against this checklist directly. |
| **Must read** | [Handling Overload — Google SRE Book](https://sre.google/sre-book/handling-overload/) | Book | 1 | 23 | Reread before your capstone's cost/latency pass. |
| **Must read** | [What We Learned from a Year of Building with LLMs (strategy section)](https://applied-llms.org) | Article | 1 | 24 | Reread before writing your work proposal. |
| Bonus | [Building Effective Agents — Anthropic](https://www.anthropic.com/engineering/building-effective-agents) | Article | 0.75 | 22 | Revisit when deciding how much agentic behavior your capstone actually needs. |
| Bonus | [Demystifying evals for AI agents — Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | Article | 0.75 | 22 | Revisit if your capstone includes an agentic component that needs trajectory evals. |
| Bonus | [Claude Cookbooks (revisit)](https://github.com/anthropics/claude-cookbooks) | Code | 1 | 23 | Find reference implementations for your capstone's pieces. |
| Bonus | [MCP Specification](https://modelcontextprotocol.io/specification) | Spec | 1 | 23 | Reread the Security Best Practices section while hardening your capstone's MCP surface. |
| Bonus | [The lethal trifecta for AI agents — Simon Willison](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) | Article | 0.3 | 23 | Check your capstone's architecture diagram against this model directly. |

## Continuing (after Week 24)

| Category | Source | Type | Why |
|---|---|---|---|
| Practice | [Anthropic engineering blog](https://www.anthropic.com/engineering) | Article | Agent, tooling and eval practices from the people building the models. |
| Releases | [Claude release notes](https://platform.claude.com/docs/en/release-notes/overview) | Docs | New features and models; your trigger to rerun your evals. |
| Community | [Simon Willison's weblog](https://simonwillison.net) | Article | The best single feed for practical LLM news and security. |
| Community | [Prompt injection archive — Simon Willison](https://simonwillison.net/tags/prompt-injection/) | Article | Real incidents and patterns as they happen; skim the most recent posts. |
| Community | [Latent Space (podcast + newsletter)](https://www.latent.space) | Article | The AI-engineer community's publication. |
| Research | [Chip Huyen's blog](https://huyenchip.com/blog/) | Article | Long-form, rigorous AI engineering essays. |
| Research | [LMArena (arena.ai)](https://arena.ai) | Tool | Crowd-sourced model rankings; one signal among many. |
| Research | [Artificial Analysis](https://artificialanalysis.ai) | Tool | Independent model benchmarks for quality, speed and price. |
| Practice | [Claude Cookbooks](https://github.com/anthropics/claude-cookbooks) | Code | Browse for new recipes as the API evolves. |
| Releases | [Choosing the right model — Claude Docs](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model) | Docs | Your framework for re-evaluating tiers whenever a new model ships. |
| Deep dives | [Neural Networks: Zero to Hero — Andrej Karpathy](https://karpathy.ai/zero-to-hero.html) | Course | Deep dive: build backprop, then a GPT, from scratch in Python. |
| Deep dives | [Build a Large Language Model (From Scratch) — Sebastian Raschka](https://www.manning.com/books/build-a-large-language-model-from-scratch) | Book | Deep dive: a book-length companion to Zero to Hero, including fine-tuning. |
| Deep dives | [Hugging Face LLM Course](https://huggingface.co/learn/llm-course) | Course | Deep dive: transformers, tokenizers and fine-tuning with open models. |
| Deep dives | [Practical Deep Learning for Coders — fast.ai](https://course.fast.ai) | Course | Deep dive: top-down, code-first deep learning. |
