// Chapter 4 — RAG & Knowledge Systems (weeks 10–12)
import type { Chapter } from "./types";

export const ch4: Chapter = {
  id: "ch4",
  number: 4,
  title: "RAG & Knowledge Systems",
  tagline: "Teach the model what it was never trained on.",
  description:
    "Build a measured retrieval pipeline with maintainable ingestion, permission-aware search, and supported citations.",
  why:
    "\"Answer questions over our data\" is the most common AI feature request there is. The difference between a demo and a product is retrieval quality you can measure, not retrieval quality you hope for.",
  weeks: [
    {
      number: 10,
      title: "Embeddings, vector search & ingestion",
      focus: "What embeddings are, how vector indexes trade off recall and speed, and how raw sources become searchable chunks.",
      build: {
        deliverable: "Ingest a small permitted corpus and build lexical and vector search baselines.",
        evidence:
          "Preserve source/page metadata; handle parsing failures, duplicates, updates, and deletions. Create questions with relevant passages, including unanswerable cases.",
      },
      groups: [
        {
          title: "Embeddings & vector search",
          concepts: [
            {
              id: "ch4.c.what-embeddings-are",
              title: "What embeddings are",
              summary:
                "An embedding maps text to a vector so that cosine similarity between vectors approximates similarity of meaning, though similar meaning is not the same thing as relevant to a query; retrieval only changes what the model sees at request time, not its weights, so no training happens and the knowledge updates the moment the index does.",
              minutes: 30,
              resources: ["ch4.r.embeddings-docs", "ch4.r.rag-pinecone"],
            },
            {
              id: "ch4.c.vector-indexes",
              title: "Vector indexes",
              summary:
                "HNSW and IVFFlat in pgvector make different recall/speed/memory trade-offs, and picking one is a real engineering decision, not a default to leave alone.",
              minutes: 30,
              resources: ["ch4.r.pgvector-readme"],
            },
            {
              id: "ch4.c.pgvector-practice",
              title: "pgvector in practice",
              summary:
                "Schema design, indexing, metadata filters and top-k queries in plain SQL are what turn pgvector from a library into a working search feature.",
              minutes: 35,
              resources: ["ch4.r.pgvector-readme"],
            },
          ],
        },
        {
          title: "Ingestion & chunking",
          concepts: [
            {
              id: "ch4.c.parsing-sources",
              title: "Parsing sources",
              summary:
                "Markdown, HTML and PDF extraction each lose or preserve structure differently, and handling parsing failures, duplicates, updates and deletions matters as much as the chunking strategy itself.",
              minutes: 30,
              resources: [],
            },
            {
              id: "ch4.c.chunking-strategies",
              title: "Chunking strategies",
              summary:
                "Fixed-size-with-overlap, structure-aware (by heading) and semantic chunking each change what gets retrieved together, and chunk size alone can swing retrieval quality more than the embedding model does.",
              minutes: 35,
              resources: ["ch4.r.chunking-pinecone"],
            },
          ],
        },
      ],
    },
    {
      number: 11,
      title: "Hybrid retrieval & reranking",
      focus: "Combining keyword and vector search, adding a reranker one change at a time, and keeping access control before the prompt.",
      build: {
        deliverable: "Add hybrid fusion and a reranker, one change at a time.",
        evidence:
          "Compare recall@k or ranking quality, latency, and cost. Test tenant/document access restrictions before content enters a prompt or cache.",
      },
      groups: [
        {
          title: "Combining signals",
          concepts: [
            {
              id: "ch4.c.bm25-fulltext",
              title: "Keyword search / BM25",
              summary:
                "Postgres full-text search catches exact terms — error codes, product names, IDs — that a pure embedding similarity search often misses, though ts_rank is not BM25 and shouldn't be labeled as one.",
              minutes: 30,
              resources: ["ch4.r.postgres-fulltext", "ch4.r.practical-bm25"],
            },
            {
              id: "ch4.c.hybrid-rrf",
              title: "Hybrid search with Reciprocal Rank Fusion",
              summary:
                "Merging a keyword result list and a vector result list with Reciprocal Rank Fusion combines their strengths without needing to tune a single blended score.",
              minutes: 30,
              resources: ["ch4.r.hybrid-rrf-code"],
            },
            {
              id: "ch4.c.reranking",
              title: "Reranking",
              summary:
                "A cross-encoder reranker looks at the top candidates in detail and reorders them, which is cheap enough to run on a shortlist even though it's too slow to run on the whole corpus.",
              minutes: 30,
              resources: ["ch4.r.rerank-overview"],
            },
          ],
        },
        {
          title: "Measuring & securing retrieval",
          concepts: [
            {
              id: "ch4.c.retrieval-metrics",
              title: "Retrieval metrics",
              summary:
                "Recall@k, MRR and precision, computed against a small labeled question-to-document set, are what let you say a retrieval change helped instead of just feeling like it did.",
              minutes: 35,
              resources: ["ch4.r.systematically-improving-rag"],
            },
            {
              id: "ch4.c.permission-aware-retrieval",
              title: "Permission-aware retrieval",
              summary:
                "Access control has to filter documents before retrieval runs, not after generation, or a model can end up quoting content the requesting user was never allowed to see — including through a cache.",
              minutes: 25,
              resources: [],
            },
          ],
        },
      ],
    },
    {
      number: 12,
      title: "Grounded answers & measurement",
      focus: "Citations, saying \"I don't know,\" and knowing when RAG isn't the right tool.",
      build: {
        deliverable: "Generate cited answers and compare RAG with a long-context baseline.",
        evidence:
          "Score retrieval separately from answer correctness and citation support. Test abstention, stale/deleted documents, and an embedding-version migration on a small copy.",
      },
      groups: [
        {
          title: "Grounded generation",
          concepts: [
            {
              id: "ch4.c.grounded-generation",
              title: "Grounded generation",
              summary:
                "Answering only from the retrieved context, citing sources, and saying \"I don't know\" when the context doesn't support an answer is what separates a grounded RAG app from a model freely associating.",
              minutes: 30,
              resources: ["ch4.r.systematically-improving-rag"],
            },
            {
              id: "ch4.c.citations",
              title: "Citations",
              summary:
                "Model-native citation features and your own chunk-ID citations both let a user verify an answer, and rendering them as clickable links back to the source is what makes that verification actually happen.",
              minutes: 25,
              resources: ["ch4.r.citations-docs"],
            },
          ],
        },
        {
          title: "Knowing the limits",
          concepts: [
            {
              id: "ch4.c.rag-vs-long-context",
              title: "RAG vs long context vs agentic search",
              summary:
                "A big enough context window or a grep-like agentic search tool can beat a vector database outright for some corpora, and knowing which situation you're in is as important as building the pipeline.",
              minutes: 30,
              resources: ["ch4.r.lost-in-the-middle", "ch4.r.rag-paper"],
            },
            {
              id: "ch4.c.freshness-cost",
              title: "Freshness & cost",
              summary:
                "Re-embedding costs money and stale or deleted documents can serve wrong answers, so a real system needs a deliberate policy for cache invalidation, deletion, and an embedding-version migration, not an assumption that data never changes.",
              minutes: 25,
              resources: [],
            },
          ],
        },
      ],
    },
  ],
  majorObjective:
    "Build a measured retrieval pipeline — hybrid search, reranking and grounded, cited answers — and know when RAG is the wrong tool for the job.",
  doneWhen:
    "You can explain where a bad answer originated, reproduce retrieval comparisons, and demonstrate that unauthorized or deleted content cannot appear in answers.",
  decision:
    "Choose chunking, retrieval, reranking, or long context based on observed errors. Use contextual retrieval only if its measured gain justifies ingestion cost.",
  resources: [
    {
      id: "ch4.r.pgvector-readme",
      title: "pgvector README",
      url: "https://github.com/pgvector/pgvector",
      kind: "Docs",
      hours: 1,
      use: "reference",
      note: "Implement vector search, filtering, and one index appropriate to the corpus; distinguish exact from approximate search.",
      week: 10,
    },
    {
      id: "ch4.r.rag-pinecone",
      title: "Retrieval-Augmented Generation — Pinecone Learn",
      url: "https://www.pinecone.io/learn/retrieval-augmented-generation/",
      kind: "Article",
      hours: 1,
      use: "bonus",
      note: "Conceptual orientation if needed; its explanations do not require adopting Pinecone.",
      week: 10,
    },
    {
      id: "ch4.r.chunking-pinecone",
      title: "Chunking Strategies for LLM Applications — Pinecone Learn",
      url: "https://www.pinecone.io/learn/chunking-strategies/",
      kind: "Article",
      hours: 1,
      use: "must",
      note: "Compare two sensible chunking strategies on your corpus rather than implementing every option.",
      week: 10,
    },
    {
      id: "ch4.r.embeddings-docs",
      title: "Embeddings — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/embeddings",
      kind: "Docs",
      hours: 0.5,
      use: "reference",
      note: "Embedding API guidance; choose using your own retrieval cases, dimensions, cost, and data-handling needs.",
      week: 10,
    },
    {
      id: "ch4.r.postgres-fulltext",
      title: "Full Text Search — PostgreSQL docs",
      url: "https://www.postgresql.org/docs/current/textsearch.html",
      kind: "Docs",
      hours: 1.5,
      use: "reference",
      note: "Build the lexical baseline. PostgreSQL ts_rank/ts_rank_cd are not BM25; label the implementation accurately.",
      week: 10,
    },
    {
      id: "ch4.r.systematically-improving-rag",
      title: "Systematically Improving Your RAG — Jason Liu",
      url: "https://jxnl.co/writing/2024/05/22/systematically-improving-your-rag/",
      kind: "Article",
      hours: 1,
      use: "must",
      note: "Error segmentation and retrieval metrics. Human-check synthetic questions and prevent duplicate leakage across splits.",
      week: 11,
    },
    {
      id: "ch4.r.hybrid-rrf-code",
      title: "Hybrid search with RRF — pgvector-python example",
      url: "https://github.com/pgvector/pgvector-python/blob/master/examples/hybrid_search/rrf.py",
      kind: "Code",
      hours: 0.5,
      use: "reference",
      note: "Implement Reciprocal Rank Fusion and compare against each individual retriever.",
      week: 11,
    },
    {
      id: "ch4.r.rerank-overview",
      title: "Rerank overview — Cohere docs",
      url: "https://docs.cohere.com/docs/rerank-overview",
      kind: "Docs",
      hours: 0.5,
      use: "reference",
      note: "Implement one reranker; account for extra latency and cost.",
      week: 11,
    },
    {
      id: "ch4.r.citations-docs",
      title: "Citations — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/citations",
      kind: "Docs",
      hours: 0.5,
      use: "reference",
      note: "Link claims to source passages; citation presence alone does not establish support or correctness.",
      week: 12,
    },
    {
      id: "ch4.r.contextual-retrieval",
      title: "Introducing Contextual Retrieval — Anthropic",
      url: "https://www.anthropic.com/news/contextual-retrieval",
      kind: "Article",
      hours: 0.5,
      use: "bonus",
      note: "An additional experiment after the hybrid baseline works; reported vendor gains are not guarantees for your data.",
      week: 11,
    },
    {
      id: "ch4.r.voyage-docs",
      title: "Voyage AI docs",
      url: "https://docs.voyageai.com",
      kind: "Docs",
      hours: 1,
      use: "bonus",
      note: "Alternative embedding/reranker implementation reference.",
      week: 10,
    },
    {
      id: "ch4.r.mteb-leaderboard",
      title: "MTEB leaderboard",
      url: "https://huggingface.co/spaces/mteb/leaderboard",
      kind: "Tool",
      hours: 0.25,
      use: "bonus",
      note: "Shortlist candidates, then evaluate on your corpus.",
      week: 10,
    },
    {
      id: "ch4.r.advanced-rag-course",
      title: "Building and Evaluating Advanced RAG — DeepLearning.AI",
      url: "https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/",
      kind: "Course",
      hours: 1.5,
      use: "bonus",
      note: "Alternative retrieval strategies after error analysis indicates a need.",
      week: 11,
    },
    {
      id: "ch4.r.practical-bm25",
      title: "Practical BM25 — Elastic",
      url: "https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables",
      kind: "Article",
      hours: 0.75,
      use: "bonus",
      note: "Understand BM25 and how it differs from the PostgreSQL baseline.",
      week: 11,
    },
    {
      id: "ch4.r.lost-in-the-middle",
      title: "Lost in the Middle (paper)",
      url: "https://arxiv.org/abs/2307.03172",
      kind: "Paper",
      hours: 0.75,
      use: "bonus",
      note: "Historical evidence motivating context-position tests; verify the behavior of your chosen model.",
      week: 12,
    },
    {
      id: "ch4.r.rag-paper",
      title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP (paper)",
      url: "https://arxiv.org/abs/2005.11401",
      kind: "Paper",
      hours: 1,
      use: "bonus",
      note: "Original research framing, optional for the practical build.",
      week: 12,
    },
  ],
  missions: [
    {
      id: "ch4.m1",
      number: 7,
      title: "Measured Retrieval Pipeline",
      track: "Full-stack",
      hours: 20,
      major: true,
      objective:
        "Build a retrieval pipeline — ingestion, lexical and vector baselines, hybrid fusion with reranking, and cited grounded answers — measuring each change instead of assuming it helped.",
      requirements: [
        "Ingest a small permitted corpus preserving source/page metadata, handling parsing failures, duplicates, updates and deletions",
        "Build lexical (full-text) and vector search baselines",
        "Add hybrid fusion (Reciprocal Rank Fusion) and a reranker, one change at a time, measuring recall@k, latency and cost",
        "Enforce tenant/document access restrictions before content enters a prompt or cache",
        "Generate cited answers and compare against a long-context baseline, scoring retrieval separately from answer correctness",
        "Test abstention, stale/deleted documents, and an embedding-version migration on a small copy",
      ],
      milestones: [
        { id: "ch4.m1.s1", title: "Ingestion pipeline preserving source/page metadata, handling duplicates and deletions", minutes: 70, week: 10 },
        { id: "ch4.m1.s2", title: "Lexical full-text search baseline", minutes: 50, week: 10 },
        { id: "ch4.m1.s3", title: "Vector search baseline with pgvector", minutes: 55, week: 10 },
        { id: "ch4.m1.s4", title: "Labeled question set built, including unanswerable cases", minutes: 45, week: 10 },
        { id: "ch4.m1.s5", title: "Hybrid fusion (RRF) added and measured against each individual retriever", minutes: 60, week: 11 },
        { id: "ch4.m1.s6", title: "Reranker added and measured for recall/ranking quality, latency and cost", minutes: 55, week: 11 },
        { id: "ch4.m1.s7", title: "Tenant/document access restrictions enforced before retrieval reaches a prompt or cache", minutes: 50, week: 11 },
        { id: "ch4.m1.s8", title: "Cited answers generated over retrieved passages, scored separately from retrieval", minutes: 20, week: 12 },
        { id: "ch4.m1.s9", title: "RAG compared against a long-context baseline on the same task set", minutes: 20, week: 12 },
        { id: "ch4.m1.s10", title: "Abstention verified: model says it doesn't know when context doesn't support an answer", minutes: 15, week: 12 },
        { id: "ch4.m1.s11", title: "Stale/deleted documents tested to confirm they cannot appear in an answer", minutes: 15, week: 12 },
        { id: "ch4.m1.s12", title: "Embedding-version migration run on a small copy and diffed against the original", minutes: 20, week: 12 },
      ],
      deliverable:
        "A retrieval pipeline with ingestion, measured lexical/vector/hybrid/reranked retrieval, permission-aware access control, and cited grounded answers benchmarked against a long-context baseline.",
      reflection: [
        "Where did a bad answer originate — retrieval or generation — and how did you tell?",
        "Did contextual retrieval's measured gain justify its ingestion cost, or would you skip it here?",
        "Which failures pushed you toward a retrieval change versus a chunking or reranking change, and why?",
      ],
      stretch: [
        { id: "ch4.m1.x1", title: "Try contextual retrieval and measure the gain against the hybrid baseline", minutes: 55, week: 11 },
      ],
    },
  ],
  trial: [
    {
      id: "ch4.t.diagnose-failure",
      dimension: "Debugging",
      statement: "Given a wrong answer from your pipeline, you can tell whether retrieval or generation failed.",
    },
    {
      id: "ch4.t.reproduce-comparisons",
      dimension: "Evaluation",
      statement: "You can reproduce your retrieval comparisons (recall@k or ranking quality) and show which change actually helped.",
    },
    {
      id: "ch4.t.no-unauthorized-content",
      dimension: "Understanding",
      statement: "You can demonstrate that unauthorized or deleted content cannot appear in an answer.",
    },
    {
      id: "ch4.t.justify-choice",
      dimension: "Tradeoffs",
      statement: "You can justify a chunking, retrieval, reranking or long-context choice using observed errors rather than a general preference.",
    },
    {
      id: "ch4.t.contextual-retrieval-worth-it",
      dimension: "Explanation",
      statement: "You can explain when contextual retrieval's measured gain justifies its added ingestion cost.",
    },
  ],
  skills: { knowledge: 1, building: 2, systemDesign: 2, evaluation: 1 },
};
