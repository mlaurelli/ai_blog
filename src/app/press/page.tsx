'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import type { PressItem } from '@/lib/press';
import { ExternalLink, Calendar, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PressPage() {
  const [pressItems, setPressItems] = useState<PressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    async function fetchPressItems() {
      try {
        const response = await fetch('/api/press');
        if (response.ok) {
          const data = await response.json();
          setPressItems(data);
        }
      } catch (error) {
        console.error('Error fetching press items:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPressItems();
  }, []);

  const dateLocale = language === 'it' ? 'it-IT' : 'en-US';

  if (loading) {
    return (
      <Layout title={t('press.title')}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xl">{t('press.loading')}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${t('press.title')} - Michele Laurelli`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight tracking-tight text-gray-900 dark:text-white">
            {t('press.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('press.subtitle')}
          </p>
        </header>

        {/* Press Items */}
        {pressItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('common.noPressYet')}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {pressItems.map((item) => (
              <article
                key={item.id}
                className="border-2 border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors bg-white dark:bg-gray-900"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="flex flex-col md:flex-row gap-6 p-6">
                    {/* Image */}
                    {item.image && (
                      <div className="w-full md:w-64 h-48 flex-shrink-0 border-2 border-gray-400 dark:border-gray-600 group-hover:border-black dark:group-hover:border-white transition-colors overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      {/* Site Name */}
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {item.siteName}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl md:text-3xl font-black mb-3 leading-tight text-gray-900 dark:text-white group-hover:underline">
                        {item.title}
                      </h2>

                      {/* Description */}
                      {item.description && (
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                          {item.description}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(item.publishedDate).toLocaleDateString(dateLocale, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ExternalLink className="w-4 h-4" />
                          <span>{t('common.readOn')} {item.siteName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
