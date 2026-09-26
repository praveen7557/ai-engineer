# The AI Engineer: Build-First 24-Week Roadmap & Resources

Build something useful every week. Use the resources to unblock an implementation, explain a failure, or choose between alternatives. Progress is demonstrated by working software, measured results, and a short decision record.

**Audience:** frontend/backend developers moving into AI engineering. Use your familiar application stack; use Python for the open-model and training labs. The scope is production AI applications plus practical model inference and adaptation. Training foundation models from scratch remains a later specialization.

## How to use this roadmap

- **Start with the weekly build.** Get the smallest end-to-end path running, then study the concepts needed to improve it. Read security and authorization guidance before exposing a feature or enabling side effects.
- **Must read:** a focused concept or section needed for the build. **Reference:** consult while implementing; no cover-to-cover assignment. **Bonus:** an optional deeper dive or alternative explanation. New resource suggestions are explicitly marked in resource tables.
- **Budget 10–14 hours/week, approximately 240–336 hours total.** Aim for 2 hours of focused resources, 6–8 hours building, 1–2 hours evaluating/documenting, and 1–2 hours of buffer. Resource-table hours estimate selected reading/viewing only; exercises, setup, and experiments belong in build time. Spread longer resources across their listed weeks.
- **Keep scope small.** Reuse the extractor, dataset, UI, and tooling across chapters. If behind, cut bonus work and UI polish first. Model labs and the capstone may use the full weekly budget; unfamiliar Python or infrastructure may require extending the calendar.
- **Complete each week with evidence:** a runnable demo, relevant automated checks, observed failures, and a short note on the decision made. From week 4 onward, record quality, latency, and cost with model/prompt/data versions. A disappointing experiment is useful evidence; an untested improvement is not completion.
- **Use Claude as the default teaching stack, then compare alternatives.** Week 5 requires another model family and week 6 an open model. Compare native behavior before introducing a provider abstraction. Check current API pricing, supported features, data handling, model licenses, and SDK versions rather than copying old defaults.
- **Deploy only to an org-approved platform** (Cloudflare or Google Cloud Platform). Any other hosting provider needs procurement and security approval first, even for a pilot.
- **Keep the capstone narrow.** Identify a useful problem and prospective users by week 9, collect representative examples during later builds, and reuse whichever components earn their complexity. RAG, agents, MCP, and fine-tuning are choices, not a required stack.
- **Reading the time estimates:** milestone minutes are focused implementation slices, not the whole week — they naturally sum to less than a mission's total project-work hours. Reading hours are tracked separately from build time; concept-study time overlaps with reading rather than adding to it. Evaluation/write-up and buffer time come out of the same weekly budget above them; don't add all these numbers on top of each other.

**Core resource allowance:** approximately 25 hours of focused must-read material plus 19 hours of implementation references across 24 weeks. These estimates exclude builds and optional courses; use the weekly total budget above.

**Prerequisite checkpoint:** be comfortable with HTTP, async code, tests, Git, and a small backend. By week 6, be able to load JSONL data in Python, inspect tensor shapes, and explain sampling, precision/recall, and train/validation/test splits. Learn these through the labs; allow extra preparation time if they are new. Set an API/compute spending cap before running experiments and use public, synthetic, or explicitly permitted data.

## Chapter 01: LLM Foundations (Weeks 1–3)

_Make a useful model call immediately, then explain its behavior, failure modes, and cost._

### Build first

| Week | Deliverable | Evidence to keep |
|---|---|---|
| 1 | Build the Prompt Lab CLI: send a task, save the result, and vary one prompt or sampling setting. | A runnable CLI and 10 examples showing successes and failures; inspect tokenization alongside the calls. |
| 2 | Add token/cost estimates and a small comparison report. | Predicted versus billed usage, input/output limits, and repeat-run variation; explain why fluent output can be wrong. |
| 3 | Make the client resilient and reproducible. | Tests for timeout, throttling, refusal, and truncated output; bounded retries, externalized secrets, and pinned dependencies. |

**Done when:** The CLI runs from a clean checkout, reports usage, avoids logging secrets, and handles failed requests without an unbounded retry loop.

**Engineering decision:** When is a model call justified over ordinary code, and what quality/cost limits would make you reject it?

### Resources for the build

| Use | Resource | Type | Hours | Week | Focus |
|---|---|---|---|---|---|
| Must read | [Deep Dive into LLMs like ChatGPT — Andrej Karpathy](https://www.youtube.com/watch?v=7xTGNNLPyMI) | Video | 3.5 | 1–3 | Watch sections on tokenization, generation, training, and hallucinations alongside observed CLI behavior. |
| Must read | [Neural networks series (ch. 5–7: Transformers, Attention) — 3Blue1Brown](https://www.3blue1brown.com/topics/neural-networks) | Video | 1.5 | 2 | Watch the attention/transformer chapters; connect tensors, attention, and next-token prediction to the API mental model. |
| Reference | [Messages API reference — Claude Docs](https://platform.claude.com/docs/en/api/messages) | Docs | 0.5 | 1 | Implement one request and inspect response/stop reasons. Return here as needed throughout the roadmap. |
| Reference | [Pricing — Anthropic](https://claude.com/pricing) | Docs | 0.25 | 2 | Use the API pricing tab; include input, output, and applicable cache charges. Record the pricing date. |
| Reference | [Token counting — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/token-counting) | Docs | 0.5 | 2 | Implement the cost calculator and enforce an input/output budget. |
| Reference | [Errors — Claude Docs](https://platform.claude.com/docs/en/api/errors) | Docs | 0.25 | 3 | Separate retryable failures from errors that require changing the request; respect retry limits. |
| Bonus | [Intro to Large Language Models — Andrej Karpathy](https://www.youtube.com/watch?v=zjkBMFhNj_g) | Video | 1 | 1 | A shorter orientation if the deep dive is difficult; not a second required introduction. |
| Bonus | [Building with the Claude API — Anthropic Academy](https://anthropic.skilljar.com/claude-with-the-anthropic-api) | Course | 8 | 1–3 | An alternative guided route. Select API fundamentals now; use later modules only when they support the corresponding build. |
| Bonus | [LLM CLI — Simon Willison](https://llm.datasette.io) | Tool | 1 | 3 | Compare its experiments/logging ergonomics with your own CLI. |

## Chapter 02: Working With Models (Weeks 4–6)

_Build a measured extractor and learn to choose between prompts, model families, and open-model inference._

### Build first

| Week | Deliverable | Evidence to keep |
|---|---|---|
| 4 | Build a Structured Extractor with a minimal eval runner. | Start with 30–50 labeled examples, separate development and held-out cases, and report field accuracy, schema validity, and abstentions. Compare a simple rule-based baseline. |
| 5 | Run the same task against two model families. | Use identical validation inputs and semantic checks; compare failures, latency, and cost. Add a chain only if error analysis justifies it; otherwise record why not. |
| 6 | Run a small open model in Python and expose the same task interface. | Inspect tokenizer/chat template and tensor shapes; compare memory, speed, and quality with the hosted baseline. Try one supported quantized variant within the hardware budget. |

**Done when:** One command compares versioned implementations, including malformed inputs, missing fields, refusals, and truncation. Iterate on development/validation data, then report results on an untouched test split after selecting the implementation. Explain the limits of a small evaluation set.

**Engineering decision:** Choose ordinary code, a better prompt, another model, or a chain using measured errors. Identify which failures need new information (retrieval) versus behavioral adaptation (fine-tuning).

### Resources for the build

| Use | Resource | Type | Hours | Week | Focus |
|---|---|---|---|---|---|
| Must read | [Your AI Product Needs Evals — Hamel Husain](https://hamel.dev/blog/posts/evals/) | Article | 1 | 4 | Read before iterating on prompts; use observed errors to define the first evaluation rubric. |
| Must read | [Prompt engineering overview & best practices — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) | Docs | 1 | 4 | Select clarity, examples, and context sections relevant to the failures you actually see. |
| Reference | [Structured outputs — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) | Docs | 0.5 | 4 | Use schema constraints plus semantic validation. Handle refusals and token-limit exits; valid structure does not prove correct facts. |
| Reference | [Develop test cases / define success — Claude Docs](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) | Docs | 0.5 | 4 | Define success criteria and separate tuning data from held-out evaluation. |
| Must read | [Hugging Face LLM Course — selected inference sections](https://huggingface.co/learn/llm-course) | Course | 2 | 6 | Moved into the core path from Continuing. Read only the tokenizer, model loading, and inference sections needed for the lab; allow build time for Python/tensor practice. |
| Reference | [Quantization overview — Hugging Face Transformers](https://huggingface.co/docs/transformers/quantization/overview) | Docs | 0.5 | 6 | **Suggested addition:** Choose one method supported by your hardware; measure the memory/quality trade-off and note context/KV-cache overhead. |
| Bonus | [Interactive Prompt Engineering Tutorial — Anthropic](https://github.com/anthropics/prompt-eng-interactive-tutorial) | Course | 2 | 4 | Selected exercises only. Examples use the Claude 3 era; check current model support and measure whether each technique helps. |
| Bonus | [Prompt Engineering — Lilian Weng](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/) | Article | 1 | 4 | Historical research survey; treat individual prompting techniques as hypotheses to test. |
| Bonus | [ChatGPT Prompt Engineering for Developers — DeepLearning.AI](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/) | Course | 1.5 | 5 | Alternative introduction using the OpenAI API. Concepts transfer, but examples and API behavior are provider-specific. |
| Bonus | [AI Engineering (book) — Chip Huyen · ch. 5](https://www.oreilly.com/library/view/ai-engineering/9781098166298/) | Book | 2 | 4 | Deeper prompting background after the extractor works. |

**Lab boundary:** use a small model that fits available hardware or a capped hosted notebook. This week teaches inference, not production GPU serving. Reserve training for week 18.

## Chapter 03: Building AI & Multimodal Applications (Weeks 7–9)

_Ship a streaming interface and a useful image/document feature with observable, bounded backend behavior._

### Build first

| Week | Deliverable | Evidence to keep |
|---|---|---|
| 7 | Put the extractor or assistant behind a streaming UI and authenticated backend. | Test cancellation, interrupted streams, concurrent requests, safe output rendering, and access control. Trace model calls with sensitive content redacted. |
| 8 | Build a document/image extraction feature with a human correction step. | Compare text extraction/OCR plus the existing extractor against direct multimodal input on a small labeled set, including unreadable images and tables. Enforce and test server-side upload size/type limits. |
| 9 | Deploy a restricted pilot, enforce per-user spend limits, and measure responsiveness. | Record time to first token, total latency, token usage, and cache hit/miss costs. Document and test retention/deletion behavior for uploaded files and traces. Gather feedback and select a capstone problem with representative examples. |

**Done when:** A user can complete and correct a real task; failed or cancelled calls have clear UI states; permissions, upload limits, retention, and spend caps are enforced server-side.

**Engineering decision:** Choose text parsing/OCR or multimodal inference using accuracy and cost. Decide when streaming, caching, and human review improve the actual workflow.

### Resources for the build

| Use | Resource | Type | Hours | Week | Focus |
|---|---|---|---|---|---|
| Reference | [Streaming Messages — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/streaming) | Docs | 0.5 | 7 | Implement the backend stream and cancellation path; reuse Chapter 01 error handling. |
| Reference | [Using server-sent events — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) | Docs | 0.5 | 7 | Consult transport/event behavior as needed; use a client suited to your authentication and request method. |
| Must read | [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/) | Spec | 1 | 7 | Read prompt injection, sensitive information disclosure, improper output handling, and unbounded consumption before the pilot. |
| Reference | [Langfuse docs](https://langfuse.com/docs) | Tool | 1 | 7 | Instrument one end-to-end request and inspect a failure. Decide which content to redact or omit and how long traces persist. |
| Reference | [Vision — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/vision) | Docs | 0.5 | 8 | **Suggested addition:** Image input, resolution/cost trade-offs, and limitations. Use images or rendered document pages for the bounded lab. |
| Must read | [People + AI Guidebook — Google PAIR](https://pair.withgoogle.com/guidebook) | Docs | 1 | 8 | Select trust, feedback, and user-control guidance; implement one correction or recovery interaction. |
| Must read | [Guidelines for Human-AI Interaction — Microsoft HAX](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/) | Docs | 1 | 8 | Use the guidelines to review your feature and document the changes made. |
| Reference | [Reduce latency — Claude Docs](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency) | Docs | 0.5 | 9 | Measure the bottleneck before changing prompts, models, or concurrency. |
| Reference | [Prompt caching — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) | Docs | 0.5 | 9 | Compare cache hits/misses and the effect of prompt structure; do not assume all workloads benefit. |
| Reference | [Rate limits — Claude Docs](https://platform.claude.com/docs/en/api/rate-limits) | Docs | 0.5 | 9 | Handle provider throttling. Implement your own per-user budgets separately from provider quotas. |
| Bonus | [AI SDK (open-source TypeScript library) docs](https://ai-sdk.dev) | Docs | 2 | 7 | Optional streaming implementation aid; keep failure and authorization behavior explicit. |
| Bonus | [assistant-ui](https://www.assistant-ui.com) | Code | 1 | 7 | Optional UI primitives to save time on chat scaffolding. |

**Bonus build:** add audio transcription and compare word/task accuracy on noisy audio. Realtime voice and video pipelines are extensions, not prerequisites for finishing the core track.

## Chapter 04: RAG & Knowledge Systems (Weeks 10–12)

_Build a measured retrieval pipeline with maintainable ingestion, permission-aware search, and supported citations._

### Build first

| Week | Deliverable | Evidence to keep |
|---|---|---|
| 10 | Ingest a small permitted corpus and build lexical and vector search baselines. | Preserve source/page metadata; handle parsing failures, duplicates, updates, and deletions. Create questions with relevant passages, including unanswerable cases. |
| 11 | Add hybrid fusion and a reranker, one change at a time. | Compare recall@k or ranking quality, latency, and cost. Test tenant/document access restrictions before content enters a prompt or cache. |
| 12 | Generate cited answers and compare RAG with a long-context baseline. | Score retrieval separately from answer correctness and citation support. Test abstention, stale/deleted documents, and an embedding-version migration on a small copy. |

**Done when:** You can explain where a bad answer originated, reproduce retrieval comparisons, and demonstrate that unauthorized or deleted content cannot appear in answers.

**Engineering decision:** Choose chunking, retrieval, reranking, or long context based on observed errors. Use contextual retrieval only if its measured gain justifies ingestion cost.

### Resources for the build

| Use | Resource | Type | Hours | Week | Focus |
|---|---|---|---|---|---|
| Reference | [pgvector README](https://github.com/pgvector/pgvector) | Docs | 1 | 10 | Implement vector search, filtering, and one index appropriate to the corpus; distinguish exact from approximate search. |
| Bonus | [Retrieval-Augmented Generation — Pinecone Learn](https://www.pinecone.io/learn/retrieval-augmented-generation/) | Article | 1 | 10 | Conceptual orientation if needed; its explanations do not require adopting Pinecone. |
| Must read | [Chunking Strategies for LLM Applications — Pinecone Learn](https://www.pinecone.io/learn/chunking-strategies/) | Article | 1 | 10 | Compare two sensible chunking strategies on your corpus rather than implementing every option. |
| Reference | [Embeddings — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/embeddings) | Docs | 0.5 | 10 | Embedding API guidance; choose using your own retrieval cases, dimensions, cost, and data-handling needs. |
| Reference | [Full Text Search — PostgreSQL docs](https://www.postgresql.org/docs/current/textsearch.html) | Docs | 1 | 10 | Build the lexical baseline. PostgreSQL ts_rank/ts_rank_cd are not BM25; label the implementation accurately. |
| Must read | [Systematically Improving Your RAG — Jason Liu](https://jxnl.co/writing/2024/05/22/systematically-improving-your-rag/) | Article | 1 | 11 | Error segmentation and retrieval metrics. Human-check synthetic questions and prevent duplicate leakage across splits. |
| Reference | [Hybrid search with RRF — pgvector-python example](https://github.com/pgvector/pgvector-python/blob/master/examples/hybrid_search/rrf.py) | Code | 0.5 | 11 | Implement Reciprocal Rank Fusion and compare against each individual retriever. |
| Reference | [Rerank overview — Cohere docs](https://docs.cohere.com/docs/rerank-overview) | Docs | 0.5 | 11 | Implement one reranker; account for extra latency and cost. |
| Reference | [Citations — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/citations) | Docs | 0.5 | 12 | Link claims to source passages; citation presence alone does not establish support or correctness. |
| Bonus | [Introducing Contextual Retrieval — Anthropic](https://www.anthropic.com/news/contextual-retrieval) | Article | 0.5 | 11 | An additional experiment after the hybrid baseline works; reported vendor gains are not guarantees for your data. |
| Bonus | [Voyage AI docs](https://docs.voyageai.com) | Docs | 1 | 10 | Alternative embedding/reranker implementation reference. |
| Bonus | [MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard) | Tool | 0.25 | 10 | Shortlist candidates, then evaluate on your corpus. |
| Bonus | [Building and Evaluating Advanced RAG — DeepLearning.AI](https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/) | Course | 1.5 | 11 | Alternative retrieval strategies after error analysis indicates a need. |
| Bonus | [Practical BM25 — Elastic](https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables) | Article | 0.75 | 11 | Understand BM25 and how it differs from the PostgreSQL baseline. |
| Bonus | [Lost in the Middle (paper)](https://arxiv.org/abs/2307.03172) | Paper | 0.75 | 12 | Historical evidence motivating context-position tests; verify the behavior of your chosen model. |
| Bonus | [Retrieval-Augmented Generation for Knowledge-Intensive NLP (paper)](https://arxiv.org/abs/2005.11401) | Paper | 1 | 12 | Original research framing, optional for the practical build. |

## Chapter 05: Agents & Autonomous Workflows (Weeks 13–15)

_Build and debug a bounded tool-calling agent, and justify whether it improves on a fixed workflow._

### Build first

| Week | Deliverable | Evidence to keep |
|---|---|---|
| 13 | Implement the task as a fixed workflow, then build a small tool-calling loop by hand. | Run both on the same task set. Record task completion, tool calls, side effects, latency, and cost. |
| 14 | Add execution limits and recovery around two or three useful tools. | Inject tool failures, duplicate calls, and untrusted instructions. Verify approval gates (for high-consequence/irreversible actions), idempotency, step/time/spend limits, and safe resume behavior. |
| 15 | Improve the weakest behavior and optionally port the loop to an SDK. | Evaluate outcomes and traces; compare context compaction/retrieval only if context-related failures show up in the traces or evals. If porting, demonstrate the behavior the SDK supplies or changes. |

**Done when:** The agent stops predictably, cannot exceed tool permissions, and recovers from a partial failure without duplicating a consequential action. A fixed workflow remains a measured baseline.

**Engineering decision:** Choose a workflow or agent based on task variability and failure cost; document which decisions remain deterministic or require human approval.

### Resources for the build

| Use | Resource | Type | Hours | Week | Focus |
|---|---|---|---|---|---|
| Must read | [Building Effective Agents — Anthropic](https://www.anthropic.com/engineering/building-effective-agents) | Article | 0.75 | 13 | Read workflow-versus-agent patterns before choosing the implementation. |
| Reference | [Tool use overview & implementation — Claude Docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) | Docs | 1 | 13 | Implement tool schemas, dispatch, results, and error handling in the handwritten loop. |
| Must read | [The lethal trifecta for AI agents — Simon Willison](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) | Article | 0.3 | 13 | Identify private data, untrusted inputs, and external communication paths before granting tools access. |
| Must read | [Writing effective tools for agents — Anthropic](https://www.anthropic.com/engineering/writing-tools-for-agents) | Article | 0.75 | 14 | Improve tool descriptions and responses using observed selection/argument failures. |
| Must read | [Designing robust APIs with idempotency — Stripe](https://stripe.com/blog/idempotency) | Article | 0.5 | 14 | Make retrying side-effecting tools safe; test failure after the side effect but before acknowledgment. |
| Must read | [Demystifying evals for AI agents — Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | Article | 0.75 | 14 | Build outcome and trajectory checks; verify real side effects rather than trusting a success message. |
| Must read | [Effective context engineering for AI agents — Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Article | 0.75 | 15 | Use retrieval, compaction, and memory only when context-related failures justify them. |
| Bonus | [Agent SDK overview — Claude Docs](https://code.claude.com/docs/en/agent-sdk/overview) | Docs | 1 | 15 | Optional port after the manual loop works; compare permissions, execution, and recovery semantics. |
| Bonus | [Hugging Face Agents Course](https://huggingface.co/learn/agents-course) | Course | 2 | 13 | Selected concept units as an alternative explanation; the full course is outside the core time budget. |
| Bonus | [ReAct: Synergizing Reasoning and Acting (paper)](https://arxiv.org/abs/2210.03629) | Paper | 0.5 | 13 | Read the abstract and figures for the original loop framing. |
| Bonus | [12-Factor Agents — HumanLayer](https://github.com/humanlayer/12-factor-agents) | Article | 1.5 | 14 | Compare its control-flow and state principles with your implementation. |
| Bonus | [AI Engineering — Chip Huyen · ch. 6 (Agents section)](https://www.oreilly.com/library/view/ai-engineering/9781098166298/) | Book | 2 | 14 | Deeper treatment of planning and failure modes. |
| Bonus | [How we built our multi-agent research system — Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system) | Article | 0.75 | 15 | Case study only; add multiple agents only after demonstrating a single-agent limitation. |
| Bonus | [Claude Code best practices — Claude Code docs](https://code.claude.com/docs/en/best-practices) | Article | 0.5 | 15 | Optional case study in tool permissions and context management. |

## Chapter 06: MCP & Tool Integration (Weeks 16–17)

_Expose existing tools through MCP and test local and authenticated remote integrations._

### Build first

| Week | Deliverable | Evidence to keep |
|---|---|---|
| 16 | Wrap the Chapter 05 tools in a local MCP server and connect a client. | Use Inspector to test schemas, errors, and capability negotiation. Demonstrate tools and explain when resources/prompts would be useful. |
| 17 | Deploy the same small server over an authenticated remote transport, using an existing authorization provider or identity platform rather than building OAuth yourself. Prerequisites: an HTTPS endpoint, a test client, and a provider account or local test issuer. | Test valid/invalid token handling, scopes, and tool-level permission checks, plus credential scope, timeouts, and client compatibility. Keep tool-level permissions independent of model instructions. |

**Done when:** The existing agent can use the server, unauthorized calls fail, and the repository records compatible protocol, SDK, and client versions.

**Engineering decision:** Choose direct functions, an ordinary API, or MCP based on interoperability needs; compare local stdio with remote Streamable HTTP and their security boundaries.

### Resources for the build

| Use | Resource | Type | Hours | Week | Focus |
|---|---|---|---|---|---|
| Reference | [MCP docs: Introduction & Build a server](https://modelcontextprotocol.io/docs/develop/build-server) | Docs | 1 | 16 | Use one language quickstart to adapt existing tools; avoid rebuilding the business logic. |
| Must read | [MCP Specification](https://modelcontextprotocol.io/specification) | Spec | 2 | 16–17 | Read Architecture, Transports, Authorization, and Security Best Practices for the pinned version. Treat authorization as distinct from permission to execute each tool. |
| Reference | [MCP Inspector](https://github.com/modelcontextprotocol/inspector) | Tool | 0.5 | 16 | Exercise real client/server interactions and failure responses. |
| Reference | [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) | Code | 0.75 | 16 | Use the stable version compatible with your client and examples; do not mix SDK generations. |
| Bonus | [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk) | Code | 0.75 | 16 | Use instead of the TypeScript reference if building the server in Python; choose one SDK. |
| Bonus | [Introduction to Model Context Protocol — Anthropic Academy](https://anthropic.skilljar.com/introduction-to-model-context-protocol) | Course | 3 | 16–17 | Alternative guided route to the quickstart, not an additional mandatory course. |
| Bonus | [MCP: Build Rich-Context AI Apps with Anthropic — DeepLearning.AI](https://www.deeplearning.ai/short-courses/mcp-build-rich-context-ai-apps-with-anthropic/) | Course | 2 | 16–17 | Another guided route; choose at most one introductory course. |
| Bonus | [Reference MCP servers](https://github.com/modelcontextprotocol/servers) | Code | 1 | 17 | Inspect a relevant server for patterns; examples still need your own permission and threat review. |
| Bonus | [MCP: Advanced Topics — Anthropic Academy](https://anthropic.skilljar.com/model-context-protocol-advanced-topics) | Course | 3 | 17 | Sampling, notifications, and roots when required by an integration; not default scope. |

## Chapter 07: Model Adaptation, Evaluation & Production (Weeks 18–21)

_Run a small adaptation experiment, then harden the evaluations and operating behavior developed throughout the course._

### Build first

| Week | Deliverable | Evidence to keep |
|---|---|---|
| 18 | Fine-tune a small open model or adapter on one narrow task. | Use permitted, deduplicated train/validation/test data. Compare the base model, tuned model, and best prompt baseline on held-out cases; save training settings, model revision, and reloadable weights/adapter. |
| 19 | Make the eval suite a useful CI gate. | Version datasets/rubrics; grade with deterministic/code-based checks wherever possible, and calibrate an LLM judge against human labels only for criteria that can't be graded deterministically. Report segment failures and uncertainty; rerun variable cases rather than treating tiny score changes as reliable gains. Gate CI on a minimum score or allowed regression margin, not on every score decrease. |
| 20 | Load-test the deployed feature and exercise recovery. | Measure p95 latency and throughput; inject throttling, timeouts, and provider failure. Test queues/backpressure, bounded retries, circuit breaking or graceful degradation, and any chosen fallback. |
| 21 | Perform a security and release rehearsal. | Test injection, data isolation, unsafe output, and excessive spending. Demonstrate a staged rollout and rollback; record alerts, an incident runbook, and cost per successful task. |

**Done when:** The adaptation comparison is reproducible, CI catches a deliberately introduced regression, and failure/load drills provide evidence for your stated operating limits. Record remaining security findings rather than declaring the system universally safe.

**Engineering decision:** Choose whether to deploy the tuned model or retain the baseline. Justify hosted versus self-hosted inference, routing/fallback, batch versus interactive execution, and quality/latency/cost targets.

### Resources for the build

| Use | Resource | Type | Hours | Week | Focus |
|---|---|---|---|---|---|
| Must read | [Hugging Face LLM Course — selected training and dataset sections](https://huggingface.co/learn/llm-course) | Course | 2 | 18 | Reuse the existing course. Select fine-tuning, dataset curation, and evaluation sections for one narrow experiment; do not assign the entire course. |
| Reference | [PEFT quicktour — Hugging Face](https://huggingface.co/docs/peft/quicktour) | Docs | 1 | 18 | **Suggested addition:** Configure a small LoRA experiment and save/reload the adapter. Compare trainable parameters, memory, and held-out performance. |
| Must read | [Using LLM-as-a-Judge — Hamel Husain](https://hamel.dev/blog/posts/llm-judge/) | Article | 1 | 19 | Calibrate against human judgments; inspect disagreements and avoid judging outputs with unsupported self-confidence scores. |
| Reference | [LLM Evals FAQ — Hamel Husain & Shreya Shankar](https://hamel.dev/blog/posts/evals-faq/) | Article | 1 | 19 | Read the sections needed for datasets, graders, and release decisions; revisit earlier error analysis. |
| Reference | [Promptfoo docs](https://www.promptfoo.dev/docs/intro/) | Tool | 1 | 19 | Put the existing evaluation suite in CI. A custom runner is acceptable if it gives reproducible cases, reports, and gates. |
| Reference | [OpenTelemetry GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions-genai) | Spec | 0.5 | 20 | Map model, retrieval, and tool operations to portable telemetry; pin the convention version and omit sensitive payloads by default. |
| Must read | [Handling Overload — Google SRE Book](https://sre.google/sre-book/handling-overload/) | Book | 1 | 20 | Apply bounded concurrency, load shedding, and client throttling to a measured failure drill. |
| Reference | [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/) | Spec | 1 | 21 | Apply remaining relevant entries and retest the controls introduced in Chapters 03–06; retain findings and evidence. |
| Bonus | [AI Engineering — Chip Huyen · ch. 3-4](https://www.oreilly.com/library/view/ai-engineering/9781098166298/) | Book | 4 | 19 | Deeper evaluation methodology if the current rubric or metrics remain weak. |
| Bonus | [Patterns for Building LLM-based Systems — Eugene Yan](https://eugeneyan.com/writing/llm-patterns/) | Article | 1.5 | 20 | Compare system patterns with the bottlenecks and failures in your application. |
| Bonus | [Mitigate jailbreaks & prompt injections — Claude Docs](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks) | Docs | 0.5 | 21 | Defense-in-depth ideas. Prompt instructions do not replace authorization, isolation, or output validation. |

**Lab boundary:** week 18 is one small training run plus a baseline comparison, not a hyperparameter sweep. A tiny model/task is acceptable on constrained hardware; richer experiments are optional. Estimate compute cost before training and include model/license/data provenance in the result. Production cost accounting includes model calls, retries, embeddings, reranking, tools, storage/hosting, and evaluation overhead; report one-time training separately.

## Chapter 08: Capstone & Deployment (Weeks 22–24)

_Ship one useful product to a small real audience and make an evidence-backed proposal for its next stage._

### Build first

| Week | Deliverable | Evidence to keep |
|---|---|---|
| 22 | Finish one end-to-end workflow for the problem chosen in week 9, using only the techniques that problem justifies (retrieval, an agent, MCP, fine-tuning, or none of these). | Reuse proven components; freeze a held-out test set and acceptance criteria. Compare with an ordinary-code or manual baseline and record a written justification for each technique used. |
| 23 | Deploy a pilot and run the release checklist against the actual deployment. | Record access/security tests, load results, monitoring/alerts, cost limits, restore/rollback steps, and known limitations. Exercise any RAG, agent, or MCP surface actually used. |
| 24 | Observe real usage, fix the highest-impact failure, and present the result. | Show a demo, user feedback, before/after task outcomes, cost per successful task, operational ownership, and a scoped next-step proposal. |

**Done when:** A real user can complete the target workflow, the deployment is reproducible, and the proposal includes measured benefits, failure cases, cost, ownership, and a rollback plan.

**Engineering decision:** Explain why each AI technique earns its complexity and when a human or deterministic path takes over. An extractor with strong evidence is a valid capstone; every chapter need not appear in the architecture.

### Resources for the build

| Use | Resource | Type | Hours | Week | Focus |
|---|---|---|---|---|---|
| Must read | [What We Learned from a Year of Building with LLMs (strategy section)](https://applied-llms.org) | Article | 1 | 24 | Read the strategy section while writing the work proposal; compare its lessons with your own evidence. |

**Apply earlier resources; do not restart the reading list.** Use the Chapter 02 eval criteria, Chapter 03 UX/trace checks, Chapter 05 side-effect controls, Chapter 06 MCP security guidance where applicable, and Chapter 07 release drills. Reserve this chapter for finishing, deploying, and learning from usage. If the product is not ready, reduce scope or extend the schedule rather than dropping validation.

## Shared reference shelf

These references support multiple chapters. Consult the relevant section once, then return when a build exposes a new question; repeat visits are not separate progress milestones.

- [AI Engineering — Chip Huyen](https://www.oreilly.com/library/view/ai-engineering/9781098166298/): optional book-length companion. Foundations, prompting, agents, and evaluation chapters can replace overlapping explanations rather than adding another full reading track.
- [Claude Cookbooks](https://github.com/anthropics/claude-cookbooks): implementation examples to adapt and test against current APIs; avoid copying unused infrastructure.
- [Anthropic courses repo](https://github.com/anthropics/courses): optional notebook alternatives when a guided exercise helps.
- [Anthropic engineering blog](https://www.anthropic.com/engineering): choose a case study only when it answers a concrete design question; record which conditions differ from your project.

## Continuing (after Week 24)

Choose one specialization or one recurring source at a time. Product work and regression evaluations take priority over keeping up with every release.

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
| Deep dives | [Hugging Face LLM Course](https://huggingface.co/learn/llm-course) | Course | Complete the remaining course after the selected inference and adaptation labs; expand data curation and model training depth. |
| Deep dives | [Practical Deep Learning for Coders — fast.ai](https://course.fast.ai) | Course | Deep dive: top-down, code-first deep learning. |

### Next steps by specialization

- **Model internals & training** — Neural Networks: Zero to Hero, Build a Large Language Model (From Scratch), the remaining Hugging Face LLM Course, Practical Deep Learning for Coders (fast.ai).
- **Evaluation & reliability** — Using LLM-as-a-Judge and the LLM Evals FAQ (Hamel Husain), Promptfoo docs, Patterns for Building LLM-based Systems (Eugene Yan).
- **Security** — OWASP Top 10 for LLM Applications, the lethal trifecta for AI agents, Simon Willison's prompt injection archive.
- **Agents & tools** — Building Effective Agents, Effective context engineering for AI agents, the MCP Specification.
- **Staying current** — Claude release notes, Simon Willison's weblog, Latent Space, Artificial Analysis.
