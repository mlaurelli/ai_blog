import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { getAllTermsAdmin } from '@/lib/glossary';
import { seoSettings } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = seoSettings.siteUrl;
  
  // Homepage
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
      url: `${baseUrl}/glossary`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
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

  return [
    ...routes,
    ...postRoutesEn,
    ...postRoutesIt,
    ...glossaryRoutesEn,
    ...glossaryRoutesIt,
  ];
}
