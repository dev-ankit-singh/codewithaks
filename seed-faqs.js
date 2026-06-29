require("dotenv").config();
const mongoose = require("mongoose");
const Faq = require("./models/FAQs");

const faqsData = [
  // ── CATEGORY 1: AI & LLM SEO ──
  {
    question: "What is LLM SEO and why does it matter in 2025?",
    category: "AI & LLM SEO",
    tags: ["LLM SEO", "AI Search", "GEO"],
    slug: "llm-seo",
    status: "Published",
    answer: `
      <h2 id="what-is">What is LLM SEO?</h2>
      <p>LLM SEO (Large Language Model Search Engine Optimization) is a specialized branch of search optimization that targets the way AI-powered systems discover, evaluate, and cite web content when generating responses. Unlike traditional SEO which focuses on ranking in 10-blue-links results, LLM SEO targets the training pipelines, retrieval mechanisms, and inference-time reasoning of Large Language Models like OpenAI's GPT series, Google's Gemini, Anthropic's Claude, and Meta's Llama.</p>
      <p>The fundamental insight of LLM SEO is that AI search systems don't simply rank pages — they synthesize answers from content they've been trained on or retrieved at query time. Being absent from that synthesis means being invisible to a rapidly growing segment of search users.</p>

      <div class="callout callout-info">
        <strong>Key Fact:</strong> As of 2025, Google AI Overviews appear in over 40% of US Google searches. ChatGPT handles over 100 million daily queries. Perplexity serves over 10 million queries per day. LLM SEO is no longer optional for brands that compete in search.
      </div>

      <h2 id="why-different">How LLM SEO differs from Traditional SEO</h2>
      <p>Traditional SEO optimizes signals that Google's crawlers and ranking algorithms evaluate — backlinks, page speed, keyword relevance, and user engagement. LLM SEO targets a fundamentally different set of signals that determine whether an AI system includes your content in its generated answers.</p>

      <div class="table-responsive">
        <table class="compare-table" aria-label="LLM SEO vs Traditional SEO comparison">
          <thead>
            <tr>
              <th>Factor</th>
              <th>Traditional SEO</th>
              <th>LLM SEO</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="label-col">Primary target</td>
              <td>Google/Bing crawlers</td>
              <td>LLM training data & RAG retrieval</td>
            </tr>
            <tr>
              <td class="label-col">Success metric</td>
              <td>Ranking position</td>
              <td>AI citation frequency / share-of-voice</td>
            </tr>
            <tr>
              <td class="label-col">Content format</td>
              <td>Keyword-optimized pages</td>
              <td>Entity-clear, answer-formatted documents</td>
            </tr>
            <tr>
              <td class="label-col">Link signals</td>
              <td>Backlink quantity/quality</td>
              <td>Citations from LLM-trusted authoritative sources</td>
            </tr>
            <tr>
              <td class="label-col">Structured data</td>
              <td>Rich results enhancement</td>
              <td>Critical for entity recognition & RAG chunking</td>
            </tr>
            <tr>
              <td class="label-col">Time horizon</td>
              <td>Months (crawl cycles)</td>
              <td>Continuous (RAG retrieval is real-time)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="core-tactics">Core LLM SEO Tactics</h2>
      <p>Effective LLM SEO combines multiple disciplines into a coherent strategy. The following tactics are the highest-impact actions brands can take to improve their visibility in AI-generated answers:</p>

      <div class="tactic-grid">
        <div class="tactic-card">
          <div class="tactic-icon"><i class="bi bi-diagram-3"></i></div>
          <h4>Entity Optimization</h4>
          <p>Establish your brand as a clear, disambiguated entity with Schema markup, Wikipedia/Wikidata presence, and consistent brand signals across the web.</p>
        </div>
        <div class="tactic-card">
          <div class="tactic-icon"><i class="bi bi-layers"></i></div>
          <h4>Topical Authority</h4>
          <p>Build comprehensive content coverage on your topic so LLMs recognize your domain as the authoritative source — not just for individual queries but for the entire subject area.</p>
        </div>
        <div class="tactic-card">
          <div class="tactic-icon"><i class="bi bi-braces"></i></div>
          <h4>Schema & Structured Data</h4>
          <p>Implement FAQPage, Article, Person, Organization schemas. Structured data helps AI systems accurately parse, attribute, and represent your content.</p>
        </div>
        <div class="tactic-card">
          <div class="tactic-icon"><i class="bi bi-newspaper"></i></div>
          <h4>Digital PR Citations</h4>
          <p>Earn mentions in publications that LLMs were trained on — Forbes, TechCrunch, Wikipedia, academic journals. These co-citation signals build model-level authority.</p>
        </div>
        <div class="tactic-card">
          <div class="tactic-icon"><i class="bi bi-chat-quote"></i></div>
          <h4>Answer-Formatted Content</h4>
          <p>Structure every piece of content to lead with a clear, concise, extractable answer. LLMs retrieve the most directly relevant answer fragment — not the best overall page.</p>
        </div>
        <div class="tactic-card">
          <div class="tactic-icon"><i class="bi bi-shield-check"></i></div>
          <h4>EEAT Signals</h4>
          <p>Build Experience, Expertise, Authoritativeness, and Trustworthiness signals: author bios, credentials, first-person expertise, editorial standards, and brand entity consistency.</p>
        </div>
      </div>

      <h2 id="rag-connection">LLM SEO and RAG Systems</h2>
      <p>The majority of modern AI search engines — including Perplexity, Google AI Overviews, and Bing Copilot — use <strong>Retrieval-Augmented Generation (RAG)</strong>. In RAG systems, your content is retrieved in real-time at query time and fed to the LLM as context for generating the answer. This means RAG SEO is a core component of LLM SEO.</p>

      <div class="callout callout-success">
        <strong>RAG SEO Tip:</strong> RAG systems chunk your content into semantic segments before embedding them in vector databases. Use clear heading structure, concise paragraphs, and entity-explicit language so each chunk is self-contained and meaningful when retrieved in isolation.
      </div>

      <h2 id="measurement">How to Measure LLM SEO Success</h2>
      <p>Traditional SEO metrics (ranking positions, organic traffic) are insufficient for measuring LLM SEO performance. New measurement frameworks are emerging:</p>
      <p><strong>AI Share-of-Voice:</strong> Manually or via tools (like Perplexity analytics, Semrush AI tracking) measure how often your brand appears in AI-generated answers for your target queries.</p>
      <p><strong>Citation Frequency:</strong> Track how often AI systems cite your domain as a source. Tools like Brandwatch and emerging AI monitoring platforms track LLM mentions.</p>
      <p><strong>Prompt Coverage:</strong> Identify the universe of AI prompts relevant to your brand and systematically test your presence in responses to each.</p>
      <p><strong>AI-Referred Traffic:</strong> Google Analytics 4 can segment traffic from AI platforms like Perplexity, ChatGPT Browse, and Bing Copilot as new referral sources.</p>

      <div class="callout callout-warning">
        <strong>Important:</strong> LLM SEO is not about gaming AI systems with manipulation tactics. AI models are trained to detect and discount low-quality, spammy, or deceptive content at scale. The fundamentals are the same as great SEO: be genuinely authoritative, accurate, and useful.
      </div>

      <h2 id="related-disciplines">Related Disciplines</h2>
      <p>LLM SEO is part of a broader ecosystem of emerging search disciplines. Understanding how they relate helps build a comprehensive AI search strategy:</p>
      <p><strong>GEO (Generative Engine Optimization)</strong> — focuses on inclusion in AI-generated summaries. <strong>AEO (Answer Engine Optimization)</strong> — focuses on being the direct answer to specific queries. <strong>AIVO (AI Visibility Optimization)</strong> — umbrella term covering all AI visibility practices. <strong>RAG SEO</strong> — specific to retrieval-augmented generation systems. <strong>Citation SEO</strong> — building the authoritative citation profile that AI systems trust.</p>
    `
  },
  {
    question: "What is GEO — Generative Engine Optimization?",
    category: "AI & LLM SEO",
    tags: ["GEO", "SGE", "AI Answers"],
    slug: "geo",
    status: "Published",
    answer: `
      <p>GEO (Generative Engine Optimization) is the practice of structuring and distributing content so that generative AI systems — such as Google SGE, Bing Copilot, ChatGPT Browse, and Perplexity — select your content for inclusion in their AI-generated summaries and answers.</p>
      <p>Key GEO tactics include: clear entity definition, authoritative factual statements, structured Q&amp;A format, schema markup, high EEAT signals, and earning citations from sources that AI models are trained to trust.</p>
    `
  },
  {
    question: "What is AEO — Answer Engine Optimization?",
    category: "AI & LLM SEO",
    tags: ["AEO", "Featured Snippets", "Voice Search"],
    slug: "aeo",
    status: "Published",
    answer: `
      <p>AEO (Answer Engine Optimization) is the strategy of formatting and optimizing content to be directly extracted and shown as an answer by search engines, voice assistants, and AI chatbots. It predates GEO but has evolved to include optimization for AI answer engines like Perplexity, ChatGPT, and Google's AI Overviews.</p>
      <p>Core AEO techniques: concise direct answers in the first 40–60 words, FAQ schema, structured headings (H2/H3 as questions), bullet-point factual lists, and clear authorship signals.</p>
    `
  },
  {
    question: "What is RAG SEO and how does Retrieval-Augmented Generation affect search?",
    category: "AI & LLM SEO",
    tags: ["RAG SEO", "Vector Search", "AI Retrieval"],
    slug: "rag-seo",
    status: "Published",
    answer: `
      <p>RAG SEO refers to optimizing content to be retrieved by Retrieval-Augmented Generation systems — the architecture used by AI search engines like Perplexity, Bing Copilot, and Google AI Overviews. In RAG, a vector database retrieves relevant documents at query time, which are then fed to an LLM to generate the answer.</p>
      <p>To win in RAG SEO: ensure your content is indexable, factually dense, semantically clear, and uses entities and concepts that match likely query patterns. Technical factors include fast page speed, clean markup, and structured data so the retrieval system can chunk and embed your content accurately.</p>
    `
  },
  {
    question: "What is AIVO — AI Visibility Optimization?",
    category: "AI & LLM SEO",
    tags: ["AIVO", "AI Visibility", "Brand SEO"],
    slug: "aivo",
    status: "Published",
    answer: `
      <p>AIVO (AI Visibility Optimization) is the umbrella practice of improving how prominently a brand or piece of content appears within AI-generated search results, chatbot responses, and agent recommendations. It encompasses GEO, LLM SEO, AEO, and Citation SEO as sub-disciplines.</p>
      <p>AIVO success metrics differ from traditional SEO — instead of ranking positions, you measure share-of-voice in AI answers, citation frequency across LLMs, and brand mention rate in AI-generated content.</p>
    `
  },
  {
    question: "What is Prompt SEO and Conversational SEO?",
    category: "AI & LLM SEO",
    tags: ["Prompt SEO", "Conversational SEO"],
    slug: "prompt-seo",
    status: "Published",
    answer: `
      <p>Prompt SEO is the practice of identifying which prompts users submit to AI systems relate to your brand or products, and engineering your content and entity presence to appear in responses to those prompts. It mirrors keyword research but for conversational AI interactions.</p>
      <p>Conversational SEO extends this to multi-turn dialogue scenarios — optimizing content for follow-up questions, context-aware queries, and the long-tail conversational queries that AI assistants handle at massive scale.</p>
    `
  },
  {
    question: "What is AI Citation Optimization?",
    category: "AI & LLM SEO",
    tags: ["AI Citation", "Citation SEO", "Brand Authority"],
    slug: "ai-citation",
    status: "Published",
    answer: `
      <p>AI Citation Optimization is the practice of making your content more likely to be cited as a source by AI systems when they generate answers. AI models like those powering Perplexity, Bing Copilot, and Google AI Overviews actively attribute sources — being cited drives qualified traffic and establishes authoritative brand positioning.</p>
      <p>Optimization factors include: original research and unique data, clear factual claims, strong domain authority, Schema markup with author and organization entities, and content that directly answers high-volume queries.</p>
    `
  },

  // ── CATEGORY 2: Entity & Semantic SEO ──
  {
    question: "What is Entity SEO?",
    category: "Entity & Semantic SEO",
    tags: ["Entity SEO", "Knowledge Graph"],
    slug: "entity-seo",
    status: "Published",
    answer: `
      <p>Entity SEO is the optimization approach that centers on real-world entities — people, organizations, products, places, concepts — as the fundamental unit of search relevance. Google's Knowledge Graph stores billions of entities and their relationships; Entity SEO ensures your brand or content is correctly associated with the right entities.</p>
      <p>Core tactics: Schema markup with sameAs properties linking to Wikidata/Wikipedia, authorship entity establishment, brand entity disambiguation, and co-occurrence signals with authoritative entities in your niche.</p>
    `
  },
  {
    question: "What is Semantic SEO?",
    category: "Entity & Semantic SEO",
    tags: ["Semantic SEO", "NLP SEO", "Topical Depth"],
    slug: "semantic-seo",
    status: "Published",
    answer: `
      <p>Semantic SEO is the practice of optimizing content based on meaning, context, and relationships between concepts — rather than exact keyword match. It leverages how modern search engines use NLP and vector embeddings to understand topical relevance, user intent, and conceptual relationships between queries and documents.</p>
      <p>Semantic SEO involves comprehensive topical coverage, related entity co-occurrence, natural language variation, and content depth that demonstrates subject-matter mastery to both search engines and AI systems.</p>
    `
  },
  {
    question: "What is KGSEO — Knowledge Graph SEO?",
    category: "Entity & Semantic SEO",
    tags: ["KGSEO", "Knowledge Panel", "Wikidata"],
    slug: "kgseo",
    status: "Published",
    answer: `
      <p>KGSEO (Knowledge Graph SEO) is the specialized practice of optimizing a brand, person, or organization to be recognized and represented within Google's Knowledge Graph and other KGs like Wikidata, Freebase, and DBpedia. A Knowledge Graph entity gets a dedicated Knowledge Panel in search results — a powerful trust and visibility signal.</p>
      <p>KGSEO tactics include: Wikipedia/Wikidata entity creation, structured data with sameAs markup, consistent NAP data across the web, Google Business Profile optimization, and earning mentions from authoritative KG-trusted sources.</p>
    `
  },
  {
    question: "What is Topical SEO and Topical Authority?",
    category: "Entity & Semantic SEO",
    tags: ["Topical SEO", "Topic Clusters", "Authority"],
    slug: "topical-seo",
    status: "Published",
    answer: `
      <p>Topical SEO is the strategy of building comprehensive, authoritative content coverage across an entire topic cluster, rather than targeting isolated keywords. Topical Authority is the trust signal Google and AI systems assign to a domain that demonstrates depth and breadth of expertise on a subject.</p>
      <p>To build Topical Authority: create a pillar page on the main topic, support it with cluster content on every subtopic, interlink semantically related articles, ensure no topical gaps exist, and maintain content freshness signals.</p>
    `
  },
  {
    question: "What is Entity Authority Building?",
    category: "Entity & Semantic SEO",
    tags: ["Entity Authority", "Digital PR SEO", "Brand SEO"],
    slug: "entity-authority",
    status: "Published",
    answer: `
      <p>Entity Authority Building is the long-term process of establishing and strengthening the prominence, trustworthiness, and relevance of your brand or personal entity in the eyes of search engines and AI systems. It combines Digital PR, structured data, Wikipedia presence, and consistent expert publishing.</p>
      <p>High entity authority means your brand is recognized as the definitive source on your topic — critical for both traditional rankings and AI answer inclusion.</p>
    `
  },

  // ── CATEGORY 3: Technical SEO ──
  {
    question: "What is Core Web Vitals and why does it affect SEO?",
    category: "Technical SEO",
    tags: ["Core Web Vitals", "Page Speed"],
    slug: "core-web-vitals",
    status: "Published",
    answer: `
      <p>Core Web Vitals (CWV) are Google's user experience metrics — LCP (Largest Contentful Paint), INP (Interaction to Next Paint), and CLS (Cumulative Layout Shift). They are a confirmed Google ranking factor since 2021. Poor CWV reduces crawl budget, signals low quality to Google's algorithms, and negatively impacts PageRank distribution.</p>
      <p>Target benchmarks: LCP under 2.5s, INP under 200ms, CLS under 0.1. These also affect AI crawling efficiency — faster, cleaner pages get more thorough AI crawler indexation.</p>
    `
  },
  {
    question: "What is SXO — Search Experience Optimization?",
    category: "Technical SEO",
    tags: ["SXO", "UX SEO", "Search Intent"],
    slug: "sxo",
    status: "Published",
    answer: `
      <p>SXO (Search Experience Optimization) is the convergence of SEO and UX — optimizing the complete user journey from search query to on-page engagement and conversion. It recognizes that Google measures user satisfaction signals (dwell time, bounce, CTR) and rewards pages that deliver genuine value post-click.</p>
      <p>SXO factors: intuitive page layout, fast load time, clear content hierarchy, internal linking that deepens engagement, and alignment between search intent and on-page content.</p>
    `
  },
  {
    question: "What is Zero-Click SEO?",
    category: "Technical SEO",
    tags: ["Zero-Click SEO", "SERP Features", "Featured Snippets"],
    slug: "zero-click-seo",
    status: "Published",
    answer: `
      <p>Zero-Click SEO is the strategy of optimizing to gain brand visibility and authority even when users do not click through to your website. Over 50% of Google searches now result in zero clicks — answered directly in SERPs via featured snippets, Knowledge Panels, AI Overviews, or People Also Ask boxes.</p>
      <p>Zero-Click SEO embraces this reality: winning the featured snippet, earning the Knowledge Panel, and being cited in AI Overviews builds brand trust and recall even without click-through traffic.</p>
    `
  },
  {
    question: "What is Search Everywhere Optimization?",
    category: "Technical SEO",
    tags: ["Search Everywhere", "Omnichannel SEO", "VSO"],
    slug: "search-everywhere",
    status: "Published",
    answer: `
      <p>Search Everywhere Optimization is the holistic strategy of optimizing brand presence across all search touchpoints — Google, Bing, YouTube, TikTok, Amazon, App Stores, AI chatbots, social search, and voice assistants. Modern consumers search on 6+ platforms; visibility requires presence on all of them.</p>
      <p>It unifies traditional SEO, ASO (App Store Optimization), VSO (Video SEO), social SEO, and LLM SEO under a single omnichannel search strategy.</p>
    `
  },

  // ── CATEGORY 4: Content & EEAT ──
  {
    question: "What is EEAT in SEO?",
    category: "Content & EEAT",
    tags: ["EEAT", "Content Quality", "Trust SEO"],
    slug: "eeat",
    status: "Published",
    answer: `
      <p>EEAT stands for Experience, Expertise, Authoritativeness, and Trustworthiness — Google's quality rater framework for evaluating content quality. The "E" for Experience was added in 2022 to reward first-hand, lived experience in content. EEAT is not a direct ranking signal but influences how quality raters score content, which shapes algorithm training.</p>
      <p>Building EEAT: author bylines with credentials and bios, first-person experiential content, citations from authoritative sources, About/Author pages with Schema markup, and a strong brand entity presence across the web.</p>
    `
  },
  {
    question: "What is Information Gain SEO?",
    category: "Content & EEAT",
    tags: ["Information Gain", "Content Differentiation"],
    slug: "information-gain",
    status: "Published",
    answer: `
      <p>Information Gain SEO is the practice of creating content that provides genuinely new information — insights, data, perspectives, or analysis — that cannot be found elsewhere. Google's Information Gain patent measures how much unique information a page adds beyond what existing top-ranking pages already cover.</p>
      <p>High information gain content: original research, proprietary data, expert interviews, case studies, and unique synthesis of established knowledge. This is increasingly important for AI inclusion — LLMs cite sources that offer genuinely novel information.</p>
    `
  },
  {
    question: "What is Content Engineering in SEO?",
    category: "Content & EEAT",
    tags: ["Content Engineering", "Content Architecture"],
    slug: "content-engineering",
    status: "Published",
    answer: `
      <p>Content Engineering is the systematic approach to creating, structuring, and interlinking content so it optimally communicates with search engines and AI systems. It treats content as a technical system — with defined information architecture, semantic relationships, and machine-readable structure — not just writing.</p>
      <p>Core components: content modeling, semantic HTML markup, structured data layers, entity mapping, internal link architecture, and content freshness management.</p>
    `
  },
  {
    question: "What is Answer Optimization?",
    category: "Content & EEAT",
    tags: ["Answer Optimization", "AEO", "Featured Snippets"],
    slug: "answer-optimization",
    status: "Published",
    answer: `
      <p>Answer Optimization is the process of formatting content to directly and concisely answer specific questions that users ask search engines and AI systems. It is the tactical execution layer of AEO — ensuring that every piece of content leads with a clear, extractable answer in the first paragraph.</p>
      <p>Best practices: lead with a 2–3 sentence direct answer, follow with supporting detail, use question-format H2/H3 headers, implement FAQ schema, and match answer length to query complexity.</p>
    `
  },

  // ── CATEGORY 5: Schema & Structured Data SEO ──
  {
    question: "What is Schema SEO and why is it critical for AI search?",
    category: "Schema & Structured Data SEO",
    tags: ["Schema SEO", "Structured Data", "JSON-LD"],
    slug: "schema-seo",
    status: "Published",
    answer: `
      <p>Schema SEO is the practice of implementing Schema.org structured data markup to make content machine-readable. Schema helps search engines and AI systems understand page content with certainty — who wrote it, what it's about, what type of content it is, and how it relates to other entities.</p>
      <p>For AI search, Schema is especially critical: AI crawlers use structured data to accurately chunk, embed, and attribute content. FAQPage, Article, Person, Organization, Product, and HowTo schemas directly feed into AI answer generation.</p>
    `
  },
  {
    question: "What is Multimodal SEO?",
    category: "Schema & Structured Data SEO",
    tags: ["Multimodal SEO", "Image SEO", "Video SEO"],
    slug: "multimodal-seo",
    status: "Published",
    answer: `
      <p>Multimodal SEO is the optimization of all content modalities — text, images, video, audio, and interactive content — for AI systems capable of understanding multiple data types simultaneously. Modern AI models like Gemini and GPT-4V process images and video as well as text, making alt text, video transcripts, and image structured data ranking factors.</p>
      <p>Multimodal SEO includes: descriptive alt attributes, video transcript indexability, podcast transcriptions, ImageObject schema, VideoObject schema, and visual content that matches text intent.</p>
    `
  },
  {
    question: "What is MRO — Machine Readable Optimization?",
    category: "Schema & Structured Data SEO",
    tags: ["MRO", "Machine Readable", "RAG SEO"],
    slug: "mro",
    status: "Published",
    answer: `
      <p>MRO (Machine Readable Optimization) is the broad practice of ensuring all content is optimally structured for machine comprehension — beyond just Schema markup. It encompasses clean semantic HTML, logical heading hierarchy, structured data, accessible markup, and content chunking strategies that aid AI document parsing.</p>
      <p>MRO is foundational for RAG systems: AI retrieval pipelines must accurately split, embed, and store content. Poorly structured HTML leads to chunking errors and incomplete content representation in AI knowledge bases.</p>
    `
  },

  // ── CATEGORY 6: Advanced SEO Concepts ──
  {
    question: "What is AGO — AI Generative Optimization?",
    category: "Advanced SEO Concepts",
    tags: ["AGO", "GAIO", "AI Generation"],
    slug: "ago",
    status: "Published",
    answer: `
      <p>AGO (AI Generative Optimization) is the emerging discipline of optimizing not just for being cited in AI answers, but for being used by AI systems as a source for generating new content, summaries, and recommendations. As AI agents write blog posts, emails, and reports by synthesizing web content, being a trusted source for AI generation is a new form of reach.</p>
      <p>AGO involves: producing authoritative, factually accurate, well-cited content that AI systems trust enough to base generated outputs on.</p>
    `
  },
  {
    question: "What is Digital PR SEO?",
    category: "Advanced SEO Concepts",
    tags: ["Digital PR SEO", "Link Building", "Brand Authority"],
    slug: "digital-pr-seo",
    status: "Published",
    answer: `
      <p>Digital PR SEO is the integration of public relations tactics with SEO link building and entity authority goals. It involves earning mentions and citations from high-authority media outlets, industry publications, and relevant websites — both for backlinks and for LLM training data inclusion.</p>
      <p>AI models are trained on and retrieve from reputable publications. A brand mentioned frequently in Forbes, TechCrunch, or niche authority sites has a dramatically higher probability of being cited in AI-generated answers.</p>
    `
  },
  {
    question: "What is VSO — Voice Search Optimization?",
    category: "Advanced SEO Concepts",
    tags: ["VSO", "Voice Search", "Conversational SEO"],
    slug: "vso",
    status: "Published",
    answer: `
      <p>VSO (Voice Search Optimization) is the practice of optimizing content for voice assistant queries via Siri, Google Assistant, Alexa, and Cortana. Voice searches are typically longer, more conversational, and intent-specific. Voice answers are sourced from featured snippets, local listings, and increasingly from AI answer engines.</p>
      <p>VSO best practices: natural language phrasing, question-answer content format, local SEO optimization, concise paragraph answers (30–40 words), and fast mobile page speed.</p>
    `
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URI not defined in environment.");
      process.exit(1);
    }
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    console.log("Deleting old FAQs...");
    await Faq.deleteMany({});

    console.log("Inserting new seed FAQs...");
    const created = await Faq.insertMany(faqsData);
    console.log(`Successfully seeded ${created.length} FAQs!`);

    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
