import { Metadata } from 'next';
import { seoSettings } from '@/lib/seo';

export const pressMetadata: Metadata = {
  title: 'Press Coverage - Media Mentions & Articles About Michele Laurelli',
  description: 'Press coverage, media mentions, and articles featuring Michele Laurelli\'s work in artificial intelligence, machine learning, and AI research. News, interviews, and industry recognition.',
  keywords: [
    'Michele Laurelli press',
    'AI expert media',
    'machine learning expert',
    'AI interviews',
    'tech media coverage',
    'AI news',
    'press mentions',
    'AI thought leader',
    'media appearances',
    'AI industry news'
  ],
  openGraph: {
    title: 'Press Coverage - Michele Laurelli',
    description: 'Media coverage and articles featuring Michele Laurelli\'s AI research and insights.',
    url: `${seoSettings.siteUrl}/press`,
    siteName: seoSettings.siteName,
    images: [
      {
        url: seoSettings.defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'Press Coverage - Michele Laurelli',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Press Coverage - Michele Laurelli',
    description: 'Media coverage and articles featuring AI research and insights.',
    images: [seoSettings.defaultOgImage],
    creator: seoSettings.twitterHandle,
  },
  alternates: {
    canonical: `${seoSettings.siteUrl}/press`,
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
