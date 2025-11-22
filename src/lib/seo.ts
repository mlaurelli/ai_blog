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
  siteName: 'AI Blog - by Michele Laurelli',
  siteDescription: 'Artificial intelligence treated with scientific integrity, engineering precision, and human depth. Insights from an AI architect who builds systems that matter.',
  siteUrl: 'https://michelelaurelli.it',
  defaultOgImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
  twitterHandle: '@MicheleLaurelli',
  keywords: [
    'AI',
    'Artificial Intelligence',
    'Machine Learning',
    'Technology',
    'Innovation',
    'Private AI',
    'Enterprise AI',
    'AI Architecture',
    'Autonomous Agents',
    'Deep Learning'
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
