import type { Metadata } from 'next';
import { seoSettings } from '@/lib/seo';
import AboutClient from '@/components/AboutClient';

export const metadata: Metadata = {
  title: 'About Michele Laurelli - AI Architect & Researcher',
  description: 'AI architect building complete intelligence systems from neural networks to autonomous agents. Founder of Algoretico, specializing in private AI infrastructure for demanding environments.',
  keywords: [
    ...seoSettings.keywords,
    'Michele Laurelli',
    'AI Architect',
    'Algoretico',
    'AI Researcher',
    'Private AI',
    'Neural Networks',
    'Autonomous Agents',
  ],
  openGraph: {
    title: 'About Michele Laurelli - AI Architect',
    description: 'Building AI systems that matter. Complete architectures for organizations that need absolute control.',
    url: `${seoSettings.siteUrl}/about`,
    type: 'profile',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Michele Laurelli - AI Architect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Michele Laurelli - AI Architect',
    description: 'Building AI systems that matter. Complete architectures for organizations that need absolute control.',
  },
  alternates: {
    canonical: `${seoSettings.siteUrl}/about`,
  },
};

export default function About() {
  return <AboutClient />;
}
