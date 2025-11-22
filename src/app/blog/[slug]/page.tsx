import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { seoSettings } from '@/lib/seo';
import { getAuthorByName } from '@/lib/authors';
import Layout from '@/components/Layout';
import Link from 'next/link';

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;
// Allow dynamic params for new posts
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  let post = getPostBySlug(slug, 'en');
  if (!post) {
    post = getPostBySlug(slug, 'it');
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
  
  // Try to get post in English first, then Italian
  let post = getPostBySlug(slug, 'en');
  if (!post) {
    post = getPostBySlug(slug, 'it');
  }

  if (!post) {
    notFound();
  }

  // Get author info for linking
  const author = getAuthorByName(post.author.name);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: author ? `${seoSettings.siteUrl}/author/${author.id}` : undefined,
    },
    publisher: {
      '@type': 'Person',
      name: 'Michele Laurelli',
      url: seoSettings.siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${seoSettings.siteUrl}/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    articleSection: post.tags[0],
    inLanguage: post.language === 'it' ? 'it-IT' : 'en-US',
  };

  return (
    <Layout title={`${post.title} | AI Blog - by Michele Laurelli`}>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <article className="max-w-4xl mx-auto">
        {/* Article Header */}
        <header className="mb-12">
          {/* Category/Tag Badge */}
          <div className="mb-6">
            <Link 
              href="/"
              className="text-xs uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white border-b-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white pb-1 inline-block transition-colors"
            >
              ← {post.tags[0]}
            </Link>
          </div>
          
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-8 leading-[1.1] tracking-tight">
            {post.title}
          </h1>
          
          {/* Excerpt/Subtitle */}
          <p className="text-xl md:text-2xl leading-relaxed text-gray-700 dark:text-gray-300 mb-8 font-light">
            {post.excerpt}
          </p>

          {/* Author & Meta Info */}
          <div className="flex items-center gap-4 pb-8 border-b border-gray-300 dark:border-gray-700 mb-8">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center">
                <span className="text-white dark:text-black font-bold text-lg">
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
            <div className="flex-1">
              {author ? (
                <Link 
                  href={`/author/${author.id}`}
                  className="font-semibold text-gray-900 dark:text-gray-100 hover:underline"
                >
                  {post.author.name}
                </Link>
              ) : (
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {post.author.name}
                </div>
              )}
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>·</span>
                <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="mb-8 border-2 border-gray-400 dark:border-gray-600 overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto object-cover"
              style={{ maxHeight: '500px' }}
            />
          </div>
        </header>

        {/* Article Content */}
        <div className="columns-1 md:columns-2 gap-8 text-justify">
          {post.content.split('\n\n').map((paragraph, i) => {
            // Skip the main heading
            if (paragraph.startsWith('# ')) {
              return null;
            }
            
            // Simple markdown-like rendering for code blocks
            if (paragraph.startsWith('```') && paragraph.endsWith('```')) {
              const code = paragraph.slice(3, -3);
              return (
                <pre key={i} className="bg-gray-100 dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 overflow-x-auto my-6 text-sm break-inside-avoid">
                  <code>{code}</code>
                </pre>
              );
            }
            
            // Simple markdown-like rendering for headings
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={i} className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 break-after-avoid">
                  {paragraph.slice(3)}
                </h2>
              );
            }
            
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={i} className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3 break-after-avoid">
                  {paragraph.slice(4)}
                </h3>
              );
            }
            
            // Simple markdown-like rendering for lists
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n').filter(line => line.startsWith('- '));
              return (
                <ul key={i} className="mb-6 space-y-2 list-disc list-inside break-inside-avoid">
                  {items.map((item, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {item.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')}
                    </li>
                  ))}
                </ul>
              );
            }
            
            // First paragraph gets dropcap
            const isDropcap = i === 0 || (i === 1 && post.content.startsWith('# '));
            
            // Simple markdown-like rendering for bold text
            const parts = paragraph.split('**');
            if (parts.length > 1) {
              return (
                <p key={i} className={`mb-6 text-gray-700 dark:text-gray-300 leading-relaxed ${isDropcap ? 'dropcap' : ''}`}>
                  {parts.map((part, j) => 
                    j % 2 === 0 ? part : <strong key={j}>{part}</strong>
                  )}
                </p>
              );
            }
            
            return (
              <p key={i} className={`mb-6 text-gray-700 dark:text-gray-300 leading-relaxed ${isDropcap ? 'dropcap' : ''}`}>
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t-2 border-black dark:border-gray-600">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs uppercase tracking-wide font-semibold text-gray-600 dark:text-gray-400 border border-gray-400 dark:border-gray-600 px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white hover:underline"
          >
            ← Return to Front Page
          </Link>
        </footer>
      </article>
    </Layout>
  );
}

export async function generateStaticParams() {
  // Generate params for all posts (both languages)
  const postsEn = getAllPosts('en');
  const postsIt = getAllPosts('it');
  
  // Combine and deduplicate by slug
  const allSlugs = new Set([
    ...postsEn.map(p => p.slug),
    ...postsIt.map(p => p.slug)
  ]);
  
  return Array.from(allSlugs).map((slug) => ({
    slug,
  }));
}
