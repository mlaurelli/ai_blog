export type SEOSettings = {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  defaultOgImage: string;
  twitterHandle: string;
  keywords: string[];
  categories: Category[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

export const seoSettings: SEOSettings = {
  siteName: 'Michele Laurelli - AI Research & Engineering',
  siteDescription: 'Artificial intelligence research, engineering insights, and technical analysis. Exploring LLMs, machine learning systems, AI architectures, and practical implementations by Michele Laurelli.',
  siteUrl: 'https://michelelaurelli.it',
  defaultOgImage: 'https://michelelaurelli.it/preview.png',
  twitterHandle: '@MicheleLaurelli',
  keywords: [
    'Michele Laurelli',
    'AI Research',
    'Artificial Intelligence',
    'Machine Learning',
    'LLM',
    'Large Language Models',
    'Deep Learning',
    'Neural Networks',
    'AI Engineering',
    'Private AI',
    'Enterprise AI',
    'AI Architecture',
    'Autonomous Agents',
    'NLP',
    'Computer Vision',
    'MLOps',
    'AI Papers',
    'AI Glossary',
    'Technical Blog'
  ],
  categories: [
    {
      id: 'ai-architecture',
      name: 'AI Architecture',
      slug: 'ai-architecture',
      description: 'Advanced models, training paradigms, optimization strategies, and the engineering of neural systems from the ground up.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop'
    },
    {
      id: 'applied-ai',
      name: 'Applied AI',
      slug: 'applied-ai',
      description: 'Real-world AI deployments in fusion energy, industrial automation, healthcare, and enterprise systems that demand absolute control.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop'
    },
    {
      id: 'private-ai',
      name: 'Private AI',
      slug: 'private-ai',
      description: 'On-premise AI infrastructure, edge deployment, and systems designed for organizations that cannot surrender control to cloud providers.',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop'
    },
    {
      id: 'ai-philosophy',
      name: 'AI Philosophy',
      slug: 'ai-philosophy',
      description: 'Intelligence, creativity, agency, limits, and the human dimensions of artificial intelligence explored without hype.',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop'
    }
  ]
};

export function getSEOSettings(): SEOSettings {
  return seoSettings;
}

export function getAllTags(): string[] {
  // This will be dynamically extracted from posts in real implementation
  return seoSettings.keywords;
}

export function getAllCategories(): Category[] {
  return seoSettings.categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return seoSettings.categories.find(cat => cat.slug === slug);
}

// Generate JSON-LD for Organization
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Michele Laurelli',
    url: seoSettings.siteUrl,
    sameAs: [
      `https://twitter.com/${seoSettings.twitterHandle.replace('@', '')}`,
      'https://github.com/michelelaurelli', // TODO: Add actual links
      'https://linkedin.com/in/michelelaurelli',
    ],
    jobTitle: 'AI Architect',
    worksFor: {
      '@type': 'Organization',
      name: 'Algoretico',
    },
    description: seoSettings.siteDescription,
  };
}

// Generate JSON-LD for Website
export function getWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoSettings.siteName,
    url: seoSettings.siteUrl,
    description: seoSettings.siteDescription,
    inLanguage: ['en-US', 'it-IT'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${seoSettings.siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Generate JSON-LD for Breadcrumbs
export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Generate JSON-LD for BlogPosting
export function getBlogPostJsonLd(post: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: { name: string; url?: string };
  tags?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: post.url,
    image: post.image || seoSettings.defaultOgImage,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.url || seoSettings.siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name: 'Michele Laurelli',
      url: seoSettings.siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
    keywords: post.tags?.join(', '),
    inLanguage: 'en-US',
  };
}

// Generate JSON-LD for ScholarlyArticle (Research Papers)
export function getScholarlyArticleJsonLd(paper: {
  title: string;
  abstract: string;
  url: string;
  arxivUrl: string;
  pdfUrl: string;
  publishedDate: string;
  authors: string[];
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: paper.title,
    abstract: paper.abstract,
    url: paper.url,
    sameAs: paper.arxivUrl,
    encoding: {
      '@type': 'MediaObject',
      contentUrl: paper.pdfUrl,
      encodingFormat: 'application/pdf',
    },
    datePublished: paper.publishedDate,
    author: paper.authors.map(name => ({
      '@type': 'Person',
      name,
    })),
    keywords: paper.keywords?.join(', '),
    publisher: {
      '@type': 'Organization',
      name: 'arXiv',
      url: 'https://arxiv.org',
    },
    inLanguage: 'en',
  };
}

// Generate JSON-LD for NewsArticle (Press Coverage)
export function getNewsArticleJsonLd(article: {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedDate: string;
  siteName: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    url: article.url,
    image: article.image,
    datePublished: article.publishedDate,
    publisher: {
      '@type': 'Organization',
      name: article.siteName,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

// Generate JSON-LD for DefinedTerm (Glossary)
export function getDefinedTermJsonLd(term: {
  term: string;
  definition: string;
  url: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    description: term.definition,
    url: term.url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'AI Glossary',
      description: 'Comprehensive glossary of artificial intelligence terms and concepts',
      url: `${seoSettings.siteUrl}/glossary`,
    },
    ...(term.category && { termCode: term.category }),
  };
}

// Generate JSON-LD for ItemList
export function getItemListJsonLd(items: { name: string; url: string; description?: string }[], listType: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listType,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Thing',
        name: item.name,
        url: item.url,
        ...(item.description && { description: item.description }),
      },
    })),
  };
}
