import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { getAllTermsAdmin } from '@/lib/glossary';
import { getAllPapers } from '@/lib/papers';
import { getAllPressItems } from '@/lib/press';
import { seoSettings } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = seoSettings.siteUrl;
  
  // Homepage and main pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/papers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/press`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Blog posts (English)
  const postsEn = getAllPosts('en');
  const postRoutesEn = postsEn.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Blog posts (Italian)
  const postsIt = getAllPosts('it');
  const postRoutesIt = postsIt.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Glossary terms (English)
  const termsEn = getAllTermsAdmin().filter(t => t.language === 'en');
  const glossaryRoutesEn = termsEn.map((term) => ({
    url: `${baseUrl}/glossary/${term.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Glossary terms (Italian)
  const termsIt = getAllTermsAdmin().filter(t => t.language === 'it');
  const glossaryRoutesIt = termsIt.map((term) => ({
    url: `${baseUrl}/glossary/${term.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Research papers
  const papers = getAllPapers();
  const paperRoutes = papers.map((paper) => ({
    url: `${baseUrl}/papers/${paper.slug}`,
    lastModified: new Date(paper.publishedDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Press coverage
  const pressItems = getAllPressItems();
  const pressRoutes = pressItems.map((item) => ({
    url: `${baseUrl}/press`,
    lastModified: new Date(item.publishedDate),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Category pages
  const categories = seoSettings.categories;
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...routes,
    ...postRoutesEn,
    ...postRoutesIt,
    ...glossaryRoutesEn,
    ...glossaryRoutesIt,
    ...paperRoutes,
    ...pressRoutes,
    ...categoryRoutes,
  ];
}
