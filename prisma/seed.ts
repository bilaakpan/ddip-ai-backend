import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Tag Data ───

const TAG_DATA: { name: string; category: string }[] = [
  // Work tags (13)
  { name: "Visual Style Definition", category: "work" },
  { name: "AI Model Selection & Optimization", category: "work" },
  { name: "Use-Case Development", category: "work" },
  { name: "Prompt Crafting", category: "work" },
  { name: "Enhanced Storytelling", category: "work" },
  { name: "High-Impact Brand Moment", category: "work" },
  { name: "Dynamic Interior Visuals", category: "work" },
  { name: "Refined Visual Storytelling", category: "work" },
  { name: "Consistent Brand Identity", category: "work" },
  { name: "Impactful Presentation Experience", category: "work" },
  { name: "Creative AI Integration", category: "work" },
  { name: "Custom Character Creation", category: "work" },
  { name: "Enhanced Campaign Impact", category: "work" },
  // AI Solution tags (16)
  { name: "Text Generation", category: "ai-solution" },
  { name: "Visual Generation", category: "ai-solution" },
  { name: "Video & Animation Generation", category: "ai-solution" },
  { name: "Personalized Content", category: "ai-solution" },
  { name: "AI Persona Creation", category: "ai-solution" },
  { name: "Investment Promotion", category: "ai-solution" },
  { name: "Brand Storytelling", category: "ai-solution" },
  { name: "Explainer & Training Videos", category: "ai-solution" },
  { name: "Automated Video Creator", category: "ai-solution" },
  { name: "Automated LinkedIn Posts", category: "ai-solution" },
  { name: "Amazon Stock & Price Tracker", category: "ai-solution" },
  { name: "Personal Assistant", category: "ai-solution" },
  { name: "Featured Snippets Optimization", category: "ai-solution" },
  { name: "Voice Search Optimization", category: "ai-solution" },
  { name: "FAQ & Q&A Content Strategy", category: "ai-solution" },
  { name: "NAP Consistency", category: "ai-solution" },
];

// ─── Hero Slider Data ───

const HERO_SLIDER_DATA = [
  {
    problem: "We need to promote our brand but the influencer prices are too high.",
    solution: "Create your own AI influencer with us! AI-powered creative production.",
    buttonText: "Discover AI Solutions",
    buttonHref: "/ai-solutions",
    sortOrder: 0,
    isActive: true,
  },
];

// ─── FAQ Data ───

const FAQ_DATA: { pageSlug: string; question: string; answer: string; sortOrder: number }[] = [
  // Main page (7 unique — faqRight[1] and faqRight[2] are duplicates in source)
  { pageSlug: "main", question: "What makes DDIP AI different from other AI agencies?", answer: "Answer coming soon.", sortOrder: 0 },
  { pageSlug: "main", question: "Do you develop your own AI tools?", answer: "Answer coming soon.", sortOrder: 1 },
  { pageSlug: "main", question: "How do your AI workflows improve efficiency?", answer: "Answer coming soon.", sortOrder: 2 },
  { pageSlug: "main", question: "What are AI Influencers, and how do they work?", answer: "Answer coming soon.", sortOrder: 3 },
  { pageSlug: "main", question: "How do you ensure the human element remains part of your AI-driven work?", answer: "Answer coming soon.", sortOrder: 4 },
  { pageSlug: "main", question: "Can non-creative or technical companies benefit from your workflow solutions?", answer: "Answer coming soon.", sortOrder: 5 },
  { pageSlug: "main", question: "How does DDIP stay up to date with evolving AI technologies?", answer: "Answer coming soon.", sortOrder: 6 },

  // AI Influencer page (6)
  { pageSlug: "ai-influencer", question: "How realistic are your AI influencers?", answer: "Our AI influencers are photorealistic and virtually indistinguishable from real people. We use the latest generative AI models to create consistent, believable personas.", sortOrder: 0 },
  { pageSlug: "ai-influencer", question: "Can I customize the influencer's appearance?", answer: "Absolutely. Every aspect is customizable — age, ethnicity, style, clothing, expressions, and more. We create a character that perfectly aligns with your brand.", sortOrder: 1 },
  { pageSlug: "ai-influencer", question: "What platforms do AI influencers work on?", answer: "Our AI influencers can create content for Instagram, TikTok, YouTube, LinkedIn, Twitter/X, and any other social platform. We optimize content for each platform's format.", sortOrder: 2 },
  { pageSlug: "ai-influencer", question: "How much does an AI influencer cost compared to a real one?", answer: "AI influencers typically cost 60-80% less than comparable human influencers, with the advantage of unlimited content production, no scheduling conflicts, and complete brand control.", sortOrder: 3 },
  { pageSlug: "ai-influencer", question: "Do I own the AI influencer?", answer: "Yes. Once created, the AI influencer and all associated content are fully owned by your brand. We transfer all rights and assets upon project completion.", sortOrder: 4 },
  { pageSlug: "ai-influencer", question: "How long does it take to create an AI influencer?", answer: "The initial persona can be ready within 1-2 weeks. A full content library for launch typically takes 3-4 weeks from brief to delivery.", sortOrder: 5 },

  // AI Commercial page (4)
  { pageSlug: "ai-commercial", question: "How does AI commercial production differ from traditional production?", answer: "AI commercial production uses generative AI models to create video, photography, and motion graphics without traditional shoots. This eliminates the need for studios, actors, locations, and extensive post-production crews. The result is 3-5x faster delivery and up to 70% cost savings while maintaining broadcast-quality output.", sortOrder: 0 },
  { pageSlug: "ai-commercial", question: "What quality level can I expect from AI-generated commercials?", answer: "Our AI-generated content meets broadcast and digital advertising standards. We use the latest generative models combined with professional post-production workflows to ensure every asset is indistinguishable from traditionally produced content. We provide 4K resolution output suitable for TV, streaming, and digital platforms.", sortOrder: 1 },
  { pageSlug: "ai-commercial", question: "Can you match our existing brand guidelines and visual identity?", answer: "Absolutely. We train our AI workflows on your brand assets, color palettes, typography, and visual language to ensure every piece of content is perfectly on-brand. This consistency actually exceeds what most traditional productions achieve across multiple shoots and campaigns.", sortOrder: 2 },
  { pageSlug: "ai-commercial", question: "How many revisions are included in a typical project?", answer: "Because AI production is inherently iterative, we offer unlimited revision cycles at no additional cost. Unlike traditional reshoots which require scheduling and setup, AI revisions can be turned around in hours — allowing us to fine-tune every detail until you are completely satisfied.", sortOrder: 3 },

  // AI Content page (4)
  { pageSlug: "ai-content", question: "How do you ensure AI content doesn't sound generic?", answer: "We train our AI models specifically on your brand voice, existing high-performing content, and style guidelines. Every piece goes through a calibration process where we fine-tune tone, vocabulary, and messaging patterns. The result is content that sounds distinctly like your brand, not a template. Human editors review output to maintain quality and authenticity.", sortOrder: 0 },
  { pageSlug: "ai-content", question: "Can AI content rank well in search engines?", answer: "Yes. Our AI content is built on comprehensive SEO research — keyword mapping, search intent analysis, and competitive gap assessment. We structure articles for featured snippets, optimize meta data, and build topical authority through content clusters. Our clients consistently see measurable organic traffic growth within 3-6 months.", sortOrder: 1 },
  { pageSlug: "ai-content", question: "What happens if the content needs revisions?", answer: "Revisions are built into our process. Because AI can regenerate and refine content rapidly, we offer unlimited revision rounds at no additional cost. Most revisions are completed within hours, not days. We also incorporate your feedback into our AI models so future content better matches your expectations from the start.", sortOrder: 2 },
  { pageSlug: "ai-content", question: "How do you handle content across different languages and markets?", answer: "Our AI content pipeline supports 30+ languages with native-level quality. Rather than simple translation, we localize content — adapting cultural references, idioms, and messaging for each market. Every localized piece is reviewed by native-speaking editors to ensure accuracy and cultural relevance.", sortOrder: 3 },

  // Automation page (7)
  { pageSlug: "automation", question: "What are Automated Workflows?", answer: "Automated Workflows are pre-built or custom-designed sequences of actions that connect your tools and automate repetitive tasks. They use AI to handle everything from data entry and email responses to complex multi-step business processes — running 24/7 without manual intervention.", sortOrder: 0 },
  { pageSlug: "automation", question: "How do I use these workflow templates?", answer: "Simply browse our template library, select a workflow that matches your needs, connect your tools with one-click integrations, and customize any triggers or actions. Most templates can be deployed in under 10 minutes with no coding required.", sortOrder: 1 },
  { pageSlug: "automation", question: "Do I need technical knowledge to use these workflows?", answer: "Not at all. Our templates are designed for non-technical users. The visual builder uses a drag-and-drop interface, and each template comes with step-by-step setup instructions. For advanced customization, our team provides full support.", sortOrder: 2 },
  { pageSlug: "automation", question: "Can I modify or combine templates?", answer: "Yes — every template is fully customizable. You can modify triggers, add or remove steps, change conditions, and even combine multiple templates into a single workflow. Think of templates as starting points that you shape to fit your exact needs.", sortOrder: 3 },
  { pageSlug: "automation", question: "Which integrations are supported?", answer: "We support 200+ integrations including popular tools like HubSpot, Slack, Gmail, Notion, Salesforce, Shopify, Google Sheets, Zapier, Make, and many more. If you need a custom integration, our team can build it for you.", sortOrder: 4 },
  { pageSlug: "automation", question: "How much do Automated Workflows cost?", answer: "Template-based workflows are included in all plans. Pricing is based on the number of workflow runs per month and the complexity of your automations. We offer starter, growth, and enterprise tiers. Contact us for a custom quote tailored to your usage.", sortOrder: 5 },
  { pageSlug: "automation", question: "Can you help me set up the first automation?", answer: "Absolutely. Every new client gets a free onboarding session where our automation specialists help you choose, customize, and deploy your first workflow. We ensure everything is running smoothly before you go live.", sortOrder: 6 },

  // GEO page (6)
  { pageSlug: "geo", question: "What is GEO and how is it different from SEO?", answer: "GEO (Generative Engine Optimization) focuses on optimizing your content for AI-powered search engines like ChatGPT, Gemini, and Perplexity — not just traditional search engines like Google. While SEO targets keyword rankings and backlinks, GEO optimizes for semantic understanding, entity recognition, and citation authority so AI models recommend your brand in generated responses.", sortOrder: 0 },
  { pageSlug: "geo", question: "Which AI platforms does GEO target?", answer: "We optimize for all major AI search platforms including ChatGPT (with browsing), Google Gemini, Microsoft Copilot, Perplexity AI, Claude, and emerging AI-powered search experiences. As new platforms launch, we continuously adapt our strategies to ensure coverage.", sortOrder: 1 },
  { pageSlug: "geo", question: "How long does it take to see results from GEO?", answer: "Initial improvements in AI visibility can appear within 4-6 weeks as AI models re-index your optimized content. However, building strong citation authority is an ongoing process — most clients see significant, measurable results within 3 months of implementation.", sortOrder: 2 },
  { pageSlug: "geo", question: "Do I still need traditional SEO if I invest in GEO?", answer: "Yes — GEO complements traditional SEO, it doesn't replace it. Strong SEO fundamentals (quality content, technical health, backlinks) actually improve your GEO performance because AI models often draw from well-ranked sources. Think of GEO as the next layer on top of your SEO foundation.", sortOrder: 3 },
  { pageSlug: "geo", question: "Can you guarantee AI will recommend my brand?", answer: "No ethical provider can guarantee specific AI outputs since these models are controlled by third parties. What we guarantee is implementing every known best practice to maximize your probability of being cited. Our track record shows significant visibility improvements for all clients who follow through with our recommendations.", sortOrder: 4 },
  { pageSlug: "geo", question: "How do you measure GEO success?", answer: "We track multiple metrics including: AI citation frequency (how often AI mentions your brand), referral traffic from AI platforms, branded query volume, share of voice in AI responses vs. competitors, and conversion rates from AI-referred visitors. You get a custom dashboard with all metrics.", sortOrder: 5 },
  // Process page FAQs
  { pageSlug: "process", question: "How long does a typical project take?", answer: "Project timelines vary based on scope and complexity. A focused AI integration project typically takes 4-6 weeks. Full-service engagements (strategy + design + development) usually run 8-12 weeks. We always provide a detailed timeline during the Discovery phase.", sortOrder: 0 },
  { pageSlug: "process", question: "What is the minimum budget for a project?", answer: "Our projects typically start at $5,000 for focused AI integrations and $15,000+ for comprehensive engagements. We're transparent about pricing from the first conversation — no surprises. We also offer flexible payment structures for larger projects.", sortOrder: 1 },
  { pageSlug: "process", question: "Do you work with startups or only enterprise clients?", answer: "We work with businesses of all sizes — from ambitious startups to established enterprises. What matters most is alignment on goals and commitment to leveraging AI effectively. We've helped early-stage companies build their first AI products and helped Fortune 500 companies transform their operations.", sortOrder: 2 },
  { pageSlug: "process", question: "What happens after the project launches?", answer: "We offer ongoing support and optimization packages. AI systems need continuous monitoring, model updates, and performance tuning. Most clients opt for a monthly retainer that includes monitoring, minor updates, and strategic consultations to keep their AI systems performing at peak.", sortOrder: 3 },
  { pageSlug: "process", question: "Can you work with our existing tech stack?", answer: "Absolutely. We're technology-agnostic and experienced with all major platforms, frameworks, and AI providers. Whether you're on AWS, GCP, or Azure, using React, Vue, or Next.js, or working with OpenAI, Anthropic, or open-source models — we integrate seamlessly with your existing infrastructure.", sortOrder: 4 },
];

// ─── Work Data ───

const WORK_DATA = [
  {
    title: "Vesta Global",
    body: "Lorem Ipsum is simply",
    field: "Real Estate",
    mediaUrl: "/videos/works/vesta-global.mp4",
    mediaType: "video",
    isHighlighted: true,
    sortOrder: 0,
    tagNames: ["Visual Style Definition", "AI Model Selection & Optimization", "Use-Case Development", "Prompt Crafting"],
  },
  {
    title: "Cesi Design",
    body: "Lorem Ipsum is simply",
    field: "Interior Design",
    mediaUrl: "/videos/works/cesi-design.mp4",
    mediaType: "video",
    isHighlighted: true,
    sortOrder: 1,
    tagNames: ["Enhanced Storytelling", "High-Impact Brand Moment", "Dynamic Interior Visuals"],
  },
  {
    title: "Mediterra Group",
    body: "Lorem Ipsum is simply",
    field: "Real Estate",
    mediaUrl: "/videos/works/mediterra.mp4",
    mediaType: "video",
    isHighlighted: true,
    sortOrder: 2,
    tagNames: ["Refined Visual Storytelling", "Consistent Brand Identity", "Impactful Presentation Experience"],
  },
  {
    title: "Brother",
    body: "Lorem Ipsum is simply",
    field: "Printer Solutions",
    mediaUrl: "/videos/works/brother.mp4",
    mediaType: "video",
    isHighlighted: true,
    sortOrder: 3,
    tagNames: ["Creative AI Integration", "Custom Character Creation", "Enhanced Campaign Impact"],
  },
];

// ─── AI Solution Data ───

const AI_SOLUTION_DATA = [
  {
    title: "AI Content Generation",
    slug: "ai-content",
    body: "Design meets intelligence as we use specialized AI tools to transform moodboards into refined, design-driven campaigns.",
    mediaUrl: "/videos/solutions/ai-content-gen.mp4",
    mediaType: "video",
    sortOrder: 0,
    tagNames: ["Text Generation", "Visual Generation", "Video & Animation Generation", "Personalized Content"],
  },
  {
    title: "Create Your Influencer with AI",
    slug: "ai-influencer",
    body: "AI influencers bring your brand to life with smart storytelling and real-time multilingual engagement.",
    mediaUrl: "/images/homepage/solution-influencer.jpg",
    mediaType: "image",
    sortOrder: 1,
    tagNames: ["AI Persona Creation", "Investment Promotion", "Brand Storytelling", "Explainer & Training Videos"],
  },
  {
    title: "Automation with a Creative Touch",
    slug: "automation",
    body: "We design intelligent workflows that eliminate repetitive tasks, allowing your teams to focus on what truly drives value, creativity and strategy.",
    mediaUrl: "/videos/solutions/automation.mp4",
    mediaType: "video",
    sortOrder: 2,
    tagNames: ["Automated Video Creator", "Automated LinkedIn Posts", "Amazon Stock & Price Tracker", "Personal Assistant"],
  },
  {
    title: "GEO Solutions",
    slug: "geo",
    body: "Traditional SEO isn't enough; it must be supported with GEO. At ddip, we optimize for generative engines.",
    mediaUrl: "/images/homepage/solution-geo.jpg",
    mediaType: "image",
    sortOrder: 3,
    tagNames: ["Featured Snippets Optimization", "Voice Search Optimization", "FAQ & Q&A Content Strategy", "NAP Consistency"],
  },
];

// ─── Influencer Data ───

const INFLUENCER_DATA = [
  { name: "Mina", surname: "Özdemir", persona: "Analytical Visionary", category: "Influencer", imageUrl: "/images/homepage/influencer-01.png", sortOrder: 0 },
  { name: "Mina", surname: "Şen", persona: "Color Story Weaver", category: "Influencer", imageUrl: "/images/homepage/influencer-02.jpg", sortOrder: 1 },
  { name: "Elif", surname: "Doğan", persona: "Market-to-Table Storyteller", category: "Influencer", imageUrl: "/images/homepage/influencer-03.png", sortOrder: 2 },
  { name: "Yasin", surname: "El Fassi", persona: "Heritage Remix Artist", category: "Influencer", imageUrl: "/images/homepage/influencer-04.png", sortOrder: 3 },
  { name: "Aylin", surname: "Demir", persona: "Calm Change Navigator", category: "Influencer", imageUrl: "/images/homepage/influencer-05.png", sortOrder: 4 },
  { name: "Laila", surname: "Haddad", persona: "People-First Strategist", category: "Influencer", imageUrl: "/images/homepage/influencer-06.png", sortOrder: 5 },
  { name: "Deniz", surname: "Akar", persona: "Future-Forward Thinker", category: "Influencer", imageUrl: "/images/homepage/influencer-07.png", sortOrder: 6 },
  { name: "Selin", surname: "Kara", persona: "Mindful Storyteller", category: "Influencer", imageUrl: "/images/homepage/influencer-08.png", sortOrder: 7 },
  { name: "Ece", surname: "Yilmaz", persona: "Cultural Bridge Builder", category: "Influencer", imageUrl: "/images/homepage/influencer-09.png", sortOrder: 8 },
  { name: "Mina", surname: "Şen", persona: "Color Story Weaver", category: "Influencer", imageUrl: "/images/homepage/influencer-10.png", sortOrder: 9 },
];

// ─── Filter Option Data ───

const FILTER_OPTION_DATA: { group: string; value: string; sortOrder: number }[] = [
  // Influencer categories
  { group: "influencer_category", value: "Influencer", sortOrder: 0 },
  { group: "influencer_category", value: "Ambassador", sortOrder: 1 },
  { group: "influencer_category", value: "Mascot", sortOrder: 2 },
  // Influencer personas
  { group: "influencer_persona", value: "Analytical Visionary", sortOrder: 0 },
  { group: "influencer_persona", value: "Color Story Weaver", sortOrder: 1 },
  { group: "influencer_persona", value: "Market-to-Table Storyteller", sortOrder: 2 },
  { group: "influencer_persona", value: "Heritage Remix Artist", sortOrder: 3 },
  { group: "influencer_persona", value: "Calm Change Navigator", sortOrder: 4 },
  { group: "influencer_persona", value: "People-First Strategist", sortOrder: 5 },
  { group: "influencer_persona", value: "Future-Forward Thinker", sortOrder: 6 },
  { group: "influencer_persona", value: "Mindful Storyteller", sortOrder: 7 },
  { group: "influencer_persona", value: "Cultural Bridge Builder", sortOrder: 8 },
  // Work fields
  { group: "work_field", value: "Real Estate", sortOrder: 0 },
  { group: "work_field", value: "Interior Design", sortOrder: 1 },
  { group: "work_field", value: "Printer Solutions", sortOrder: 2 },
];

// ─── Seed Functions ───

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@ddip.ai";
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        firstName: "Admin",
        lastName: "User",
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });
    console.log(`  Created SUPER_ADMIN: ${adminEmail}`);
  } else {
    console.log(`  SUPER_ADMIN already exists: ${adminEmail}`);
  }
}

async function seedContentBlocks() {
  const defaultContent = [
    { key: "hero_title", value: "CREATE YOUR OWN AI INFLUENCER WITH US!", type: "TEXT" as const },
    { key: "hero_subtitle", value: "AI-powered creative production. We design, automate, and deliver with artificial intelligence.", type: "TEXT" as const },
    { key: "about_text", value: "We don't just use AI — we design with it. Our AI automation systems accelerate production, reduce costs, and open new creative frontiers.", type: "TEXT" as const },
  ];

  for (const content of defaultContent) {
    await prisma.contentBlock.upsert({
      where: { key: content.key },
      create: content,
      update: {},
    });
  }
  console.log(`  Seeded ${defaultContent.length} content blocks`);
}

async function seedTags(): Promise<Map<string, string>> {
  await prisma.tag.deleteMany();
  await prisma.tag.createMany({ data: TAG_DATA });
  const allTags = await prisma.tag.findMany();
  const map = new Map<string, string>();
  for (const t of allTags) {
    map.set(`${t.category}:${t.name}`, t.id);
  }
  console.log(`  Seeded ${allTags.length} tags`);
  return map;
}

async function seedHeroSliders() {
  await prisma.heroSlider.deleteMany();
  await prisma.heroSlider.createMany({ data: HERO_SLIDER_DATA });
  console.log(`  Seeded ${HERO_SLIDER_DATA.length} hero sliders`);
}

async function seedFaqs() {
  await prisma.faq.deleteMany();
  await prisma.faq.createMany({ data: FAQ_DATA });
  console.log(`  Seeded ${FAQ_DATA.length} FAQs`);
}

async function seedFilterOptions() {
  await prisma.filterOption.deleteMany();
  await prisma.filterOption.createMany({ data: FILTER_OPTION_DATA });
  console.log(`  Seeded ${FILTER_OPTION_DATA.length} filter options`);
}

async function seedWorks(tagMap: Map<string, string>) {
  await prisma.work.deleteMany(); // cascades to work_tags
  for (const work of WORK_DATA) {
    await prisma.work.create({
      data: {
        title: work.title,
        body: work.body,
        field: work.field,
        mediaUrl: work.mediaUrl,
        mediaType: work.mediaType,
        isHighlighted: work.isHighlighted,
        sortOrder: work.sortOrder,
        tags: {
          create: work.tagNames.map((name) => ({
            tagId: tagMap.get(`work:${name}`)!,
          })),
        },
      },
    });
  }
  console.log(`  Seeded ${WORK_DATA.length} works with tags`);
}

async function seedAiSolutions(tagMap: Map<string, string>) {
  await prisma.aiSolution.deleteMany(); // cascades to ai_solution_tags
  for (const sol of AI_SOLUTION_DATA) {
    await prisma.aiSolution.create({
      data: {
        title: sol.title,
        slug: sol.slug,
        body: sol.body,
        mediaUrl: sol.mediaUrl,
        mediaType: sol.mediaType,
        sortOrder: sol.sortOrder,
        tags: {
          create: sol.tagNames.map((name) => ({
            tagId: tagMap.get(`ai-solution:${name}`)!,
          })),
        },
      },
    });
  }
  console.log(`  Seeded ${AI_SOLUTION_DATA.length} AI solutions with tags`);
}

async function seedInfluencers() {
  await prisma.influencer.deleteMany();
  await prisma.influencer.createMany({
    data: INFLUENCER_DATA.map((inf) => ({
      name: inf.name,
      surname: inf.surname,
      persona: inf.persona,
      category: inf.category,
      imageUrl: inf.imageUrl,
      showOnHomepage: true,
      showOnAiinf: false,
      sortOrder: inf.sortOrder,
    })),
  });
  console.log(`  Seeded ${INFLUENCER_DATA.length} influencers`);
}

// ─── Insight Data ───

const INSIGHT_DATA = [
  {
    title: "The Rise of AI Influencers: Why Brands Are Going Virtual",
    slug: "rise-of-ai-influencers",
    category: "AI Influencers",
    imageUrl: "/images/insights/ai-influencers.jpg",
    seoDescription: "Discover how AI-generated influencers are transforming brand marketing with consistent messaging, 24/7 availability, and creative freedom.",
    publishedAt: new Date("2026-02-15"),
    body: `<h2>The Virtual Influencer Revolution</h2>
<p>In 2026, the influencer marketing landscape is undergoing a seismic shift. Brands are increasingly turning to AI-generated virtual influencers — digital personas powered by artificial intelligence that can represent a brand with perfect consistency, unlimited availability, and zero controversy risk.</p>
<p>At DDip AI, we've been at the forefront of this revolution, helping brands create their own AI influencers that authentically connect with audiences while maintaining complete creative control.</p>
<h2>Why Virtual Influencers?</h2>
<p>Traditional influencer marketing comes with inherent challenges: scheduling conflicts, brand safety concerns, inconsistent messaging, and ever-increasing costs. AI influencers eliminate these pain points while offering unique advantages.</p>
<p>A virtual influencer never sleeps, never has an off day, and always stays on brand. They can be in multiple places at once, speak any language fluently, and adapt their appearance to any campaign requirement.</p>
<h2>The Technology Behind the Magic</h2>
<p>Creating a believable AI influencer requires a sophisticated blend of generative AI, computer vision, and natural language processing. Our pipeline combines state-of-the-art image generation with personality modeling to create personas that feel genuinely human.</p>
<h2>What's Next?</h2>
<p>As AI technology continues to evolve, we expect virtual influencers to become even more sophisticated — with real-time video capabilities, dynamic personality adaptation, and deeper audience engagement through AI-driven conversation.</p>`,
  },
  {
    title: "How AI Is Transforming Real Estate Visualization",
    slug: "ai-real-estate-visualization",
    category: "CGI & Visualization",
    imageUrl: "/images/insights/real-estate-ai.jpg",
    seoDescription: "Learn how AI-powered CGI is revolutionizing real estate marketing with photorealistic renders, virtual staging, and immersive property tours.",
    publishedAt: new Date("2026-02-08"),
    body: `<h2>Beyond Traditional Rendering</h2>
<p>The real estate industry has always relied on visualization to sell properties — from floor plans and scale models to 3D renders and virtual tours. Now, AI is taking property visualization to an entirely new level.</p>
<p>At DDip AI, we combine generative AI with traditional CGI pipelines to produce photorealistic property visualizations in a fraction of the time and cost of conventional methods.</p>
<h2>AI-Powered Virtual Staging</h2>
<p>Empty rooms are notoriously difficult to sell. AI-powered virtual staging can transform vacant spaces into beautifully furnished interiors within minutes, with styles tailored to target demographics and market positioning.</p>
<h2>The Impact on Sales</h2>
<p>Our clients in the real estate sector have reported significant improvements in engagement metrics since adopting AI-powered visualization. Properties with AI-generated visuals receive substantially more inquiries than those with traditional photography alone.</p>
<h2>Looking Ahead</h2>
<p>The fusion of AI visualization with augmented reality is creating new possibilities for immersive property experiences that were previously impossible.</p>`,
  },
  {
    title: "Automation with a Creative Touch: Beyond the Bot",
    slug: "automation-creative-touch",
    category: "Automation",
    imageUrl: "/images/insights/automation.jpg",
    seoDescription: "Explore how creative automation powered by AI goes beyond simple task repetition to deliver intelligent, context-aware creative production at scale.",
    publishedAt: new Date("2026-01-25"),
    body: `<h2>Redefining Creative Automation</h2>
<p>When most people think of automation, they imagine repetitive tasks being handled by simple scripts. But at DDip AI, we've pioneered a new paradigm: creative automation that combines the efficiency of AI with the nuance of human creativity.</p>
<h2>The Creative Automation Pipeline</h2>
<p>Our automation workflows go far beyond basic task scheduling. They incorporate generative AI models that understand brand guidelines, audience preferences, and campaign objectives to produce creative assets that feel hand-crafted.</p>
<p>From automated social media content generation to intelligent email campaigns that adapt their messaging based on real-time engagement data, our systems deliver the personal touch at scale.</p>
<h2>Real-World Applications</h2>
<p>One of our clients reduced their content production timeline by 70% while actually increasing engagement rates. The secret? AI-powered systems that learn from campaign performance and continuously optimize creative output.</p>
<h2>The Human Element</h2>
<p>We believe the best automation enhances human creativity rather than replacing it. Our systems handle the repetitive heavy lifting, freeing creative teams to focus on strategy, innovation, and the big ideas that truly move brands forward.</p>`,
  },
  {
    title: "GEO: The Next Frontier in Search Optimization",
    slug: "geo-next-frontier-search",
    category: "GEO & SEO",
    imageUrl: "/images/insights/geo-search.jpg",
    seoDescription: "Understand Generative Engine Optimization (GEO) and why it matters for brands looking to stay visible in the age of AI-powered search.",
    publishedAt: new Date("2026-01-18"),
    body: `<h2>From SEO to GEO</h2>
<p>Search is evolving. As AI-powered search engines and generative answer engines become the primary way people find information, traditional SEO strategies need to evolve too. Enter GEO — Generative Engine Optimization.</p>
<h2>What Is GEO?</h2>
<p>GEO is the practice of optimizing your digital presence to be effectively understood, cited, and recommended by AI-powered search and answer engines. Unlike traditional SEO, which focuses on keywords and backlinks, GEO emphasizes structured data, authoritative content, and semantic clarity.</p>
<h2>Why It Matters Now</h2>
<p>With AI-powered search engines gaining market share rapidly, brands that don't adapt their optimization strategies risk becoming invisible. Studies show that a growing percentage of search queries are now answered by AI summaries, and this number is expected to increase significantly.</p>
<h2>DDip AI's GEO Approach</h2>
<p>Our GEO strategy combines technical optimization with content strategy to ensure your brand appears in AI-generated answers, featured snippets, and voice search results. We focus on building the semantic authority that AI engines trust.</p>`,
  },
  {
    title: "Building Brand Identity with AI: A Creative Partnership",
    slug: "brand-identity-ai-partnership",
    category: "Brand & Design",
    imageUrl: "/images/insights/brand-identity.jpg",
    seoDescription: "How AI-powered design tools are enabling faster, more consistent brand identity development while preserving the creative vision that makes brands unique.",
    publishedAt: new Date("2026-01-10"),
    body: `<h2>AI as a Creative Partner</h2>
<p>Building a brand identity has traditionally been a lengthy, expensive process involving multiple rounds of concepting, refinement, and testing. AI is changing this paradigm — not by replacing designers, but by amplifying their capabilities.</p>
<h2>Rapid Exploration</h2>
<p>AI-powered design tools allow creative teams to explore hundreds of visual directions in the time it would traditionally take to develop a handful. This expanded exploration space leads to more innovative, unexpected brand expressions.</p>
<h2>Consistency at Scale</h2>
<p>One of the biggest challenges in brand management is maintaining visual consistency across touchpoints. AI systems can learn brand guidelines and automatically ensure that every piece of content — from social posts to packaging — adheres to the established visual language.</p>
<h2>The DDip AI Difference</h2>
<p>At DDip AI, we don't just use AI tools — we've built proprietary systems that understand the nuances of brand storytelling. Our AI models are trained on design principles, color theory, and typography best practices to deliver results that are both technically excellent and emotionally resonant.</p>
<h2>Case Study: From Concept to Launch</h2>
<p>For a recent client, we developed a complete brand identity package in under two weeks — a process that would typically take two to three months. The AI-accelerated workflow allowed for more client touchpoints and refinement cycles, resulting in a stronger final brand.</p>`,
  },
];

async function seedInsights() {
  await prisma.insight.deleteMany();
  for (const insight of INSIGHT_DATA) {
    await prisma.insight.create({
      data: {
        title: insight.title,
        slug: insight.slug,
        category: insight.category,
        imageUrl: insight.imageUrl,
        body: insight.body,
        publishedAt: insight.publishedAt,
        seoDescription: insight.seoDescription,
      },
    });
  }
  console.log(`  Seeded ${INSIGHT_DATA.length} insights`);
}

// ─── Main ───

async function main() {
  console.log("Seeding database...\n");

  await seedAdmin();
  await seedContentBlocks();
  const tagMap = await seedTags();
  await seedHeroSliders();
  await seedFaqs();
  await seedFilterOptions();
  await seedWorks(tagMap);
  await seedAiSolutions(tagMap);
  await seedInfluencers();
  await seedInsights();

  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
