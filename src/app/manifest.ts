import { MetadataRoute } from 'next';
import { seoSettings } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seoSettings.siteName,
    short_name: 'AI Blog',
    description: seoSettings.siteDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
