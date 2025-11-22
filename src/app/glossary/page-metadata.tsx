import type { Metadata } from 'next';
import { seoSettings } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'AI Glossary - Comprehensive Dictionary of AI Terms',
  description: 'Complete glossary of Artificial Intelligence, Machine Learning, and Deep Learning terms. Precise definitions, examples, and technical explanations in English and Italian.',
  keywords: [
    ...seoSettings.keywords,
    'AI Glossary',
    'Machine Learning Dictionary',
    'AI Terms',
    'Technical Definitions',
    'Neural Networks Glossary',
    'Deep Learning Terms',
  ],
  openGraph: {
    title: 'AI Glossary - Complete Dictionary | AI Blog',
    description: 'Comprehensive glossary of AI and Machine Learning terms with precise definitions and examples.',
    url: `${seoSettings.siteUrl}/glossary`,
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'AI Glossary',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Glossary - Complete Dictionary',
    description: 'Comprehensive glossary of AI and Machine Learning terms.',
    images: ['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=630&fit=crop'],
  },
  alternates: {
    canonical: `${seoSettings.siteUrl}/glossary`,
  },
};
