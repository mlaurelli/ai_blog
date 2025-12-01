import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { getPostBySlug } from '@/lib/posts';
import { seoSettings } from '@/lib/seo';
import { getAuthorByName } from '@/lib/authors';
import { ensureHtmlSync } from '@/lib/markdown';
import BlogPostClient from '@/components/BlogPostClient';

// Force dynamic rendering to respect language cookie
export const dynamic = 'force-dynamic';
// Allow dynamic params for new posts
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('language');
  const preferredLang = (langCookie?.value === 'it' ? 'it' : 'en') as 'en' | 'it';
  
  // Try to get post in preferred language first
  let post = getPostBySlug(slug, preferredLang);
  if (!post) {
    // Fallback to the other language
    post = getPostBySlug(slug, preferredLang === 'en' ? 'it' : 'en');
  }

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const postUrl = `${seoSettings.siteUrl}/blog/${post.slug}`;
  const publishedTime = new Date(post.date).toISOString();
  
  return {
    title: post.title,
    description: post.excerpt,
    keywords: [...seoSettings.keywords, ...post.tags],
    authors: [{ name: post.author.name }],
    openGraph: {
      type: 'article',
      locale: post.language === 'it' ? 'it_IT' : 'en_US',
      url: postUrl,
      siteName: seoSettings.siteName,
      title: post.title,
      description: post.excerpt,
      publishedTime,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: seoSettings.twitterHandle,
      creator: seoSettings.twitterHandle,
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
    alternates: {
      canonical: postUrl,
      languages: {
        'en-US': postUrl,
        'it-IT': postUrl,
      },
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Get both language versions of the post
  let postEn = getPostBySlug(slug, 'en');
  let postIt = getPostBySlug(slug, 'it');
  
  // Convert markdown to HTML for both versions
  if (postEn) {
    postEn = {
      ...postEn,
      content: ensureHtmlSync(postEn.content)
    };
  }
  if (postIt) {
    postIt = {
      ...postIt,
      content: ensureHtmlSync(postIt.content)
    };
  }

  // If neither version exists, show 404
  if (!postEn && !postIt) {
    notFound();
  }

  // Use whichever post exists for author lookup
  const post = postEn || postIt;
  const author = post ? getAuthorByName(post.author.name) : null;

  // JSON-LD structured data for both languages
  const createJsonLd = (p: typeof postEn, lang: 'en' | 'it') => {
    if (!p) return {};
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.excerpt,
      image: p.coverImage,
      datePublished: new Date(p.date).toISOString(),
      dateModified: new Date(p.date).toISOString(),
      author: {
        '@type': 'Person',
        name: p.author.name,
        url: author ? `${seoSettings.siteUrl}/author/${author.id}` : undefined,
      },
      publisher: {
        '@type': 'Person',
        name: 'Michele Laurelli',
        url: seoSettings.siteUrl,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${seoSettings.siteUrl}/blog/${p.slug}`,
      },
      keywords: p.tags.join(', '),
      articleSection: p.tags[0],
      inLanguage: lang === 'it' ? 'it-IT' : 'en-US',
    };
  };

  const jsonLdEn = createJsonLd(postEn, 'en');
  const jsonLdIt = createJsonLd(postIt, 'it');

  return (
    <BlogPostClient 
      postEn={postEn || null} 
      postIt={postIt || null} 
      authorId={author?.id || null}
      jsonLdEn={jsonLdEn}
      jsonLdIt={jsonLdIt}
    />
  );
}

