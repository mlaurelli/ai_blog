'use client';

import Head from 'next/head';
import { getScholarlyArticleJsonLd, seoSettings } from '@/lib/seo';
import type { Paper } from '@/lib/papers';

interface PaperSEOProps {
  paper: Paper;
}

export default function PaperSEO({ paper }: PaperSEOProps) {
  const url = `${seoSettings.siteUrl}/papers/${paper.slug}`;
  
  const jsonLd = getScholarlyArticleJsonLd({
    title: paper.title,
    abstract: paper.abstract,
    url,
    arxivUrl: paper.arxivUrl,
    pdfUrl: paper.pdfUrl,
    publishedDate: paper.publishedDate,
    authors: paper.authors,
    keywords: paper.categories,
  });

  const description = paper.aiExplanation || paper.abstract.substring(0, 160);

  return (
    <Head>
      <title>{`${paper.title} - AI Research Paper | Michele Laurelli`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={`${paper.categories.join(', ')}, AI research, machine learning paper, ${paper.authors.slice(0, 3).join(', ')}`} />
      
      {/* Open Graph */}
      <meta property="og:title" content={paper.title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content={seoSettings.defaultOgImage} />
      <meta property="article:published_time" content={paper.publishedDate} />
      <meta property="article:author" content={paper.authors[0]} />
      <meta property="article:section" content="AI Research" />
      {paper.categories.map((cat) => (
        <meta key={cat} property="article:tag" content={cat} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={paper.title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={seoSettings.defaultOgImage} />
      <meta name="twitter:creator" content={seoSettings.twitterHandle} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
      
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}
