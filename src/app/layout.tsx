import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { seoSettings, getOrganizationJsonLd, getWebsiteJsonLd } from "@/lib/seo";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(seoSettings.siteUrl),
  title: {
    default: seoSettings.siteName,
    template: `%s | ${seoSettings.siteName}`,
  },
  description: seoSettings.siteDescription,
  keywords: seoSettings.keywords,
  authors: [{ name: 'Michele Laurelli', url: seoSettings.siteUrl }],
  creator: 'Michele Laurelli',
  publisher: 'Michele Laurelli',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['it_IT'],
    url: seoSettings.siteUrl,
    siteName: seoSettings.siteName,
    title: seoSettings.siteName,
    description: seoSettings.siteDescription,
    images: [
      {
        url: seoSettings.defaultOgImage,
        width: 1200,
        height: 630,
        alt: seoSettings.siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: seoSettings.twitterHandle,
    creator: seoSettings.twitterHandle,
    title: seoSettings.siteName,
    description: seoSettings.siteDescription,
    images: [seoSettings.defaultOgImage],
  },
  alternates: {
    canonical: seoSettings.siteUrl,
    languages: {
      'en-US': seoSettings.siteUrl,
      'it-IT': seoSettings.siteUrl,
    },
  },
  verification: {
    google: 'google-site-verification-code', // TODO: Add actual verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = getOrganizationJsonLd();
  const websiteJsonLd = getWebsiteJsonLd();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        
        {/* Theme Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${lora.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
