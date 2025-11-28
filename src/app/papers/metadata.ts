import { Metadata } from 'next';
import { seoSettings } from '@/lib/seo';

export const papersMetadata: Metadata = {
  title: 'AI Research Papers - Latest Machine Learning & Deep Learning Papers',
  description: 'Curated collection of cutting-edge AI research papers from arXiv. Explore the latest developments in machine learning, deep learning, NLP, computer vision, and AI systems. Updated daily with AI-generated explanations.',
  keywords: [
    'AI research papers',
    'machine learning papers',
    'arXiv AI',
    'deep learning research',
    'NLP papers',
    'computer vision papers',
    'AI research',
    'scholarly articles AI',
    'latest AI papers',
    'machine learning research'
  ],
  openGraph: {
    title: 'AI Research Papers Collection - Michele Laurelli',
    description: 'Curated AI research papers from arXiv with AI-generated explanations. Latest developments in ML, DL, NLP, and computer vision.',
    url: `${seoSettings.siteUrl}/papers`,
    siteName: seoSettings.siteName,
    images: [
      {
        url: seoSettings.defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'AI Research Papers Collection',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Research Papers Collection',
    description: 'Curated AI research papers from arXiv with AI-generated explanations.',
    images: [seoSettings.defaultOgImage],
    creator: seoSettings.twitterHandle,
  },
  alternates: {
    canonical: `${seoSettings.siteUrl}/papers`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
