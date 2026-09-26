// Chapter 4 — RAG & Knowledge Systems (weeks 10–12)
import type { Chapter } from "./types";

export const ch4: Chapter = {
  id: "ch4",
  number: 4,
  title: "RAG & Knowledge Systems",
  tagline: "Teach the model what it was never trained on.",
  description:
    "Three weeks of search engineering: embeddings and vector search, ingestion and chunking, hybrid retrieval and reranking, and grounded answers you can measure.",
  why:
    "\"Answer questions over our data\" is the most common AI feature request there is. The difference between a demo and a product is retrieval quality you can measure, not retrieval quality you hope for.",
  weeks: [
    {
      number: 10,
      title: "Embeddings, vector search & ingestion",
      focus: "What embeddings are, how vector indexes trade off recall and speed, and how raw sources become searchable chunks.",
      groups: [
        {
          title: "Embeddings & vector search",
          concepts: [
            {
              id: "ch4.c.what-embeddings-are",
              title: "What embeddings are",
              summary:
                "An embedding maps text to a vector so that cosine similarity between vectors approximates similarity of meaning, though similar meaning is not the same thing as relevant to a query.",
              minutes: 30,
            },
            {
              id: "ch4.c.choosing-embedding-model",
              title: "Choosing an embedding model",
              summary:
                "Embedding models trade quality, cost and vector dimension against each other, and the MTEB leaderboard is useful evidence only if you read the retrieval-task scores specifically, not the overall rank.",
              minutes: 25,
            },
            {
              id: "ch4.c.vector-indexes",
              title: "Vector indexes",
              summary:
                "HNSW and IVFFlat in pgvector make different recall/speed/memory trade-offs, and picking one is a real engineering decision, not a default to leave alone.",
              minutes: 30,
            },
            {
              id: "ch4.c.pgvector-practice",
              title: "pgvector in practice",
              summary:
                "Schema design, indexing, metadata filters and top-k queries in plain SQL are what turn pgvector from a library into a working search feature.",
              minutes: 35,
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
                "Markdown, HTML and PDF extraction each lose or preserve structure differently, and cleaning boilerplate before chunking matters as much as the chunking strategy itself.",
              minutes: 30,
            },
            {
              id: "ch4.c.chunking-strategies",
              title: "Chunking strategies",
              summary:
                "Fixed-size-with-overlap, structure-aware (by heading) and semantic chunking each change what gets retrieved together, and chunk size alone can swing retrieval quality more than the embedding model does.",
              minutes: 35,
            },
          ],
        },
      ],
    },
    {
      number: 11,
      title: "Retrieval quality",
      focus: "Keyword search, hybrid retrieval, reranking, query transformation, and contextual retrieval.",
      groups: [
        {
          title: "Combining signals",
          concepts: [
            {
              id: "ch4.c.bm25-fulltext",
              title: "Keyword search / BM25",
              summary:
                "Postgres full-text search and the BM25 ranking behind it catch exact terms — error codes, product names, IDs — that a pure embedding similarity search often misses.",
              minutes: 30,
            },
            {
              id: "ch4.c.hybrid-rrf",
              title: "Hybrid search with Reciprocal Rank Fusion",
              summary:
                "Merging a keyword result list and a vector result list with Reciprocal Rank Fusion combines their strengths without needing to tune a single blended score.",
              minutes: 30,
            },
            {
              id: "ch4.c.reranking",
              title: "Reranking",
              summary:
                "A cross-encoder reranker looks at the top ~50 candidates in detail and reorders them, which is cheap enough to run on a shortlist even though it's too slow to run on the whole corpus.",
              minutes: 30,
            },
          ],
        },
        {
          title: "Improving what gets retrieved",
          concepts: [
            {
              id: "ch4.c.query-transformation",
              title: "Query transformation",
              summary:
                "Rewriting the query, generating multiple queries, or using HyDE (a hypothetical answer as the search query) can each recover relevant chunks that the original phrasing missed.",
              minutes: 30,
            },
            {
              id: "ch4.c.contextual-retrieval",
              title: "Contextual retrieval",
              summary:
                "Prepending a short, model-written summary of where a chunk sits in its source document before embedding it measurably improves retrieval, because the chunk alone often lacks that context.",
              minutes: 30,
            },
            {
              id: "ch4.c.retrieval-metrics",
              title: "Retrieval metrics",
              summary:
                "Recall@k, MRR and precision, computed against a small labeled question-to-document set, are what let you say a retrieval change helped instead of just feeling like it did.",
              minutes: 35,
            },
          ],
        },
      ],
    },
    {
      number: 12,
      title: "Grounded answers & measurement",
      focus: "Citations, saying \"I don't know,\" permission-aware retrieval, and knowing when RAG isn't the right tool.",
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
            },
            {
              id: "ch4.c.citations",
              title: "Citations",
              summary:
                "Model-native citation features and your own chunk-ID citations both let a user verify an answer, and rendering them as clickable links back to the source is what makes that verification actually happen.",
              minutes: 25,
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
            },
            {
              id: "ch4.c.permission-aware-retrieval",
              title: "Permission-aware retrieval",
              summary:
                "Access control has to filter documents before retrieval runs, not after generation, or a model can end up quoting content the requesting user was never allowed to see.",
              minutes: 25,
            },
            {
              id: "ch4.c.freshness-cost",
              title: "Freshness & cost",
              summary:
                "Re-embedding costs money and stale indexes serve wrong answers, so a real system needs a deliberate policy for cache invalidation and re-indexing, not an assumption that data never changes.",
              minutes: 25,
            },
          ],
        },
      ],
    },
  ],
  majorObjective:
    "Build a measured retrieval pipeline — hybrid search, reranking and grounded, cited answers — and know when RAG is the wrong tool for the job.",
  resources: [
    {
      id: "ch4.r.contextual-retrieval",
      title: "Introducing Contextual Retrieval — Anthropic",
      url: "https://www.anthropic.com/news/contextual-retrieval",
      kind: "Article",
      hours: 0.5,
      required: true,
      note: "Contextual embeddings plus BM25 plus reranking, with measured gains.",
      week: 11,
    },
    {
      id: "ch4.r.pgvector-readme",
      title: "pgvector README",
      url: "https://github.com/pgvector/pgvector",
      kind: "Docs",
      hours: 1,
      required: true,
      note: "Installation, indexes (HNSW/IVFFlat), filtering and hybrid search notes.",
      week: 10,
    },
    {
      id: "ch4.r.rag-pinecone",
      title: "Retrieval-Augmented Generation — Pinecone Learn",
      url: "https://www.pinecone.io/learn/retrieval-augmented-generation/",
      kind: "Article",
      hours: 1,
      required: true,
      note: "Clear conceptual walkthrough of the whole RAG pipeline.",
      week: 10,
    },
    {
      id: "ch4.r.chunking-pinecone",
      title: "Chunking Strategies for LLM Applications — Pinecone Learn",
      url: "https://www.pinecone.io/learn/chunking-strategies/",
      kind: "Article",
      hours: 1,
      required: true,
      note: "Chunking trade-offs with concrete examples.",
      week: 10,
    },
    {
      id: "ch4.r.postgres-fulltext",
      title: "Full Text Search — PostgreSQL docs",
      url: "https://www.postgresql.org/docs/current/textsearch.html",
      kind: "Docs",
      hours: 1.5,
      required: true,
      note: "tsvector, tsquery and ranking — the keyword half of hybrid search.",
      week: 11,
    },
    {
      id: "ch4.r.embeddings-docs",
      title: "Embeddings — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/embeddings",
      kind: "Docs",
      hours: 0.5,
      required: true,
      note: "Anthropic's guidance and recommended embedding providers.",
      week: 10,
    },
    {
      id: "ch4.r.voyage-docs",
      title: "Voyage AI docs",
      url: "https://docs.voyageai.com",
      kind: "Docs",
      hours: 1,
      required: false,
      note: "Embedding and reranker APIs from the provider Anthropic recommends.",
      week: 10,
    },
    {
      id: "ch4.r.citations-docs",
      title: "Citations — Claude Docs",
      url: "https://platform.claude.com/docs/en/build-with-claude/citations",
      kind: "Docs",
      hours: 0.5,
      required: true,
      note: "Native, verifiable citations back to source passages.",
      week: 12,
    },
    {
      id: "ch4.r.systematically-improving-rag",
      title: "Systematically Improving Your RAG — Jason Liu",
      url: "https://jxnl.co/writing/2024/05/22/systematically-improving-your-rag/",
      kind: "Article",
      hours: 1,
      required: true,
      note: "A practitioner's playbook: synthetic questions, metrics, segmentation.",
      week: 11,
    },
    {
      id: "ch4.r.advanced-rag-course",
      title: "Building and Evaluating Advanced RAG — DeepLearning.AI",
      url: "https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/",
      kind: "Course",
      hours: 1.5,
      required: false,
      note: "Sentence-window and auto-merging retrieval, plus the RAG triad of evals.",
      week: 11,
    },
    {
      id: "ch4.r.practical-bm25",
      title: "Practical BM25 — Elastic",
      url: "https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables",
      kind: "Article",
      hours: 0.75,
      required: false,
      note: "What BM25 actually computes, explained intuitively.",
      week: 11,
    },
    {
      id: "ch4.r.hybrid-rrf-code",
      title: "Hybrid search with RRF — pgvector-python example",
      url: "https://github.com/pgvector/pgvector-python/blob/master/examples/hybrid_search/rrf.py",
      kind: "Code",
      hours: 0.5,
      required: false,
      note: "Reciprocal Rank Fusion in plain SQL plus Python.",
      week: 11,
    },
    {
      id: "ch4.r.rerank-overview",
      title: "Rerank overview — Cohere docs",
      url: "https://docs.cohere.com/docs/rerank-overview",
      kind: "Docs",
      hours: 0.5,
      required: false,
      note: "How rerankers slot into a retrieval pipeline.",
      week: 11,
    },
    {
      id: "ch4.r.mteb-leaderboard",
      title: "MTEB leaderboard",
      url: "https://huggingface.co/spaces/mteb/leaderboard",
      kind: "Tool",
      hours: 0.25,
      required: false,
      note: "Compare embedding models; check the retrieval task scores specifically.",
      week: 10,
    },
    {
      id: "ch4.r.lost-in-the-middle",
      title: "Lost in the Middle (paper)",
      url: "https://arxiv.org/abs/2307.03172",
      kind: "Paper",
      hours: 0.75,
      required: false,
      note: "Why position in the context matters, directly relevant to the RAG-vs-long-context concept.",
      week: 12,
    },
    {
      id: "ch4.r.rag-paper",
      title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP (paper)",
      url: "https://arxiv.org/abs/2005.11401",
      kind: "Paper",
      hours: 1,
      required: false,
      note: "The original RAG paper — history and framing behind the pattern you're building.",
      week: 12,
    },
  ],
  missions: [
    {
      id: "ch4.m7",
      number: 7,
      title: "Semantic Search From Scratch",
      track: "Backend",
      hours: 6,
      major: false,
      objective:
        "Embed 500+ documents from a real source — a public docs site, your own notes, or an open-source project's docs — into Postgres with pgvector, and compare keyword-only against vector-only search on real queries.",
      requirements: [
        "Postgres + pgvector running in Docker Compose",
        "An ingestion script that parses, chunks, embeds and inserts documents with metadata",
        "A /search endpoint returning top-k results with scores",
        "Keyword-only vs vector-only results compared on at least 10 queries, with notes on where each wins",
      ],
      milestones: [
        { id: "ch4.m7.s1", title: "Postgres + pgvector running in Docker Compose", minutes: 35 },
        { id: "ch4.m7.s2", title: "Ingestion script: parse, chunk, embed, insert with metadata", minutes: 70 },
        { id: "ch4.m7.s3", title: "/search endpoint returning top-k with scores", minutes: 45 },
        { id: "ch4.m7.s4", title: "10-query keyword-vs-vector comparison with notes", minutes: 50 },
      ],
      deliverable:
        "A working semantic search endpoint over 500+ real documents, plus a written comparison of keyword-only vs vector-only results on 10 queries.",
      reflection: [
        "Which of your 10 queries did keyword search win on, and why do you think vector search missed it?",
        "What would you change about your chunking if you started over with what you know now?",
      ],
      stretch: [
        { id: "ch4.m7.x1", title: "Try two chunk sizes and record the differences", minutes: 45 },
      ],
    },
    {
      id: "ch4.m8",
      number: 8,
      title: "Ask-My-Docs",
      track: "Full-stack",
      hours: 20,
      major: true,
      objective:
        "Build a complete Q&A app over a real document set with hybrid retrieval, reranking, contextual retrieval and clickable citations, measured with your own recall@5 report.",
      requirements: [
        "An ingestion pipeline for markdown/HTML/PDF with heading-aware chunking and metadata",
        "Contextual retrieval: a model-written context summary prepended to each chunk before embedding",
        "Hybrid search (BM25 + vector) merged with Reciprocal Rank Fusion",
        "Reranking that narrows the top ~50 candidates down to the top 8",
        "Answers with citations the user can click to open the source chunk, and an explicit \"I don't know\" when confidence is low",
        "Incremental re-indexing when a source file changes, based on a content hash",
      ],
      milestones: [
        { id: "ch4.m8.s1", title: "Heading-aware ingestion pipeline for markdown/HTML/PDF", minutes: 90 },
        { id: "ch4.m8.s2", title: "Contextual retrieval: model-written chunk context", minutes: 70 },
        { id: "ch4.m8.s3", title: "Hybrid search (BM25 + vector) merged with RRF", minutes: 80 },
        { id: "ch4.m8.s4", title: "Reranking top 50 down to top 8", minutes: 60 },
        { id: "ch4.m8.s5", title: "Cited answers with clickable source chunks", minutes: 70 },
        { id: "ch4.m8.s6", title: "\"I don't know\" path for low-confidence retrieval", minutes: 40 },
        { id: "ch4.m8.s7", title: "Hash-based incremental re-indexing", minutes: 55 },
        { id: "ch4.m8.s8", title: "30-question labeled set with a recall@5 report", minutes: 75 },
      ],
      deliverable:
        "A Q&A app over a real document set that cites its sources, declines to answer when it shouldn't, re-indexes incrementally, and ships with a recall@5 report against a 30-question labeled set.",
      reflection: [
        "When your app got an answer wrong, was it a retrieval failure or a generation failure — and how did you tell the difference?",
        "What did reranking actually change in your recall@5 number, before and after?",
      ],
      stretch: [
        { id: "ch4.m8.x1", title: "Metadata filters in the UI (by section or date)", minutes: 50 },
        { id: "ch4.m8.x2", title: "Access-control filter applied per user before retrieval", minutes: 55 },
      ],
    },
  ],
  trial: [
    {
      id: "ch4.t.diagnose-failure",
      dimension: "Debugging",
      statement: "Given a wrong answer from your RAG app, you can tell whether retrieval or generation failed.",
    },
    {
      id: "ch4.t.measure-recall",
      dimension: "Evaluation",
      statement: "You can measure recall@k on your own labeled set and show a change that improved it.",
    },
    {
      id: "ch4.t.explain-hybrid",
      dimension: "Explanation",
      statement: "You can explain how Reciprocal Rank Fusion combines keyword and vector result lists without a tuned blend score.",
    },
    {
      id: "ch4.t.chunking-tradeoffs",
      dimension: "Tradeoffs",
      statement: "You can justify a chunking strategy for a given source type and describe what you'd expect to break with a different one.",
    },
    {
      id: "ch4.t.know-when-not-rag",
      dimension: "Understanding",
      statement: "You can state when a grep-style agentic search or a long context window beats a vector database, with a concrete example.",
    },
    {
      id: "ch4.t.build-independently",
      dimension: "Independence",
      statement: "You can add a new document source to your ingestion pipeline and get it searchable without guidance.",
    },
  ],
  skills: { knowledge: 1, building: 2, systemDesign: 2, evaluation: 1 },
};
