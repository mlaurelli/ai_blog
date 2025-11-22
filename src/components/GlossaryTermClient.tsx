'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import type { GlossaryTerm } from '@/lib/glossary';

interface GlossaryTermClientProps {
  termEn: GlossaryTerm | null;
  termIt: GlossaryTerm | null;
  relatedTermsEn: GlossaryTerm[];
  relatedTermsIt: GlossaryTerm[];
}

export default function GlossaryTermClient({ 
  termEn, 
  termIt, 
  relatedTermsEn, 
  relatedTermsIt 
}: GlossaryTermClientProps) {
  const { language } = useLanguage();
  const term = language === 'it' ? termIt : termEn;
  const relatedTermsData = language === 'it' ? relatedTermsIt : relatedTermsEn;

  if (!term) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            {language === 'en' ? 'Term Not Found' : 'Termine Non Trovato'}
          </h1>
          <Link href="/glossary" className="text-blue-600 hover:underline">
            {language === 'en' ? '← Back to Glossary' : '← Torna al Glossario'}
          </Link>
        </div>
      </div>
    );
  }

  const t = {
    backToGlossary: language === 'en' ? 'Back to Glossary' : 'Torna al Glossario',
    pronunciation: language === 'en' ? 'Pronunciation' : 'Pronuncia',
    category: language === 'en' ? 'Category' : 'Categoria',
    definition: language === 'en' ? 'Definition' : 'Definizione',
    etymology: language === 'en' ? 'Etymology' : 'Etimologia',
    examples: language === 'en' ? 'Examples' : 'Esempi',
    relatedTerms: language === 'en' ? 'Related Terms' : 'Termini Correlati',
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation Header */}
      <header className="border-b-4 border-black dark:border-gray-600">
        {/* Date and edition info */}
        <div className="border-b border-gray-300 dark:border-gray-700 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 dark:text-gray-400">{today}</span>
              <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <ThemeToggle />
                <span className="text-gray-600 dark:text-gray-400">Vol. 1, No. 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Masthead */}
        <div className="py-8 border-b border-gray-300 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link href="/">
              <h1 className="text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
                AI Blog
              </h1>
            </Link>
            <p className="text-sm italic text-gray-600 dark:text-gray-400 border-t border-b border-gray-300 dark:border-gray-700 py-1 inline-block px-4">
              by Michele Laurelli
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex justify-center space-x-8 py-3 text-sm font-semibold uppercase tracking-wide">
              <li>
                <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-gray-300 dark:text-gray-600">|</li>
              <li>
                <Link href="/categories" className="text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li className="text-gray-300 dark:text-gray-600">|</li>
              <li>
                <Link href="/glossary" className="text-black dark:text-white font-bold transition-colors">
                  Glossary
                </Link>
              </li>
              <li className="text-gray-300 dark:text-gray-600">|</li>
              <li>
                <Link href="/about" className="text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Back Button Bar */}
        <div className="bg-gray-100 dark:bg-gray-800 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              href="/glossary" 
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.backToGlossary}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Term Header */}
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              {term.term}
            </h1>
            
            {/* Pronunciation and Category */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
              {term.pronunciation && (
                <div className="text-lg italic" style={{ fontFamily: 'Georgia, serif' }}>
                  {term.pronunciation}
                </div>
              )}
              <span className="text-xs font-semibold uppercase tracking-wider bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1">
                {term.category}
              </span>
            </div>
          </div>

          {/* Quick Definition Box */}
          <div className="bg-stone-100 dark:bg-gray-700 border-l-4 border-black dark:border-gray-500 p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
              {t.definition}
            </div>
            <p className="text-lg leading-relaxed text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Georgia, serif' }}>
              {term.definition}
            </p>
          </div>
        </div>

        {/* Detailed Explanation */}
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-gray-900 dark:text-gray-100">
                    {children}
                  </strong>
                ),
                ul: ({ children }) => (
                  <ul className="list-none space-y-2 my-4">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="flex gap-3">
                    <span className="text-gray-400 dark:text-gray-500 mt-1">▪</span>
                    <span className="flex-1">{children}</span>
                  </li>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 text-sm font-mono text-gray-800 dark:text-gray-200">
                    {children}
                  </code>
                ),
              }}
            >
              {term.explanation}
            </ReactMarkdown>
          </div>
        </div>

        {/* Examples Section */}
        {term.examples && term.examples.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 border-b-2 border-gray-300 dark:border-gray-600 pb-2" style={{ fontFamily: 'Georgia, serif' }}>
              {t.examples}
            </h2>
            <div className="space-y-4">
              {term.examples.map((example, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-gray-800 dark:text-gray-200 leading-relaxed pt-1" style={{ fontFamily: 'Georgia, serif' }}>
                    {example}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Etymology */}
        {term.etymology && (
          <div className="bg-stone-100 dark:bg-gray-700 border-l-4 border-gray-400 dark:border-gray-500 p-6 mb-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
              {t.etymology}
            </div>
            <p className="text-gray-800 dark:text-gray-200 italic leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
              {term.etymology}
            </p>
          </div>
        )}

        {/* Related Terms */}
        {relatedTermsData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 border-b-2 border-gray-300 dark:border-gray-600 pb-2" style={{ fontFamily: 'Georgia, serif' }}>
              {t.relatedTerms}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedTermsData.map(relatedTerm => (
                <Link
                  key={relatedTerm.slug}
                  href={`/glossary/${relatedTerm.slug}`}
                  className="block border-2 border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white p-4 transition-all hover:shadow-lg group bg-white dark:bg-gray-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:underline mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                        {relatedTerm.term}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2" style={{ fontFamily: 'Georgia, serif' }}>
                        {relatedTerm.definition}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-black dark:group-hover:text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-black dark:border-gray-600 mt-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-xs text-gray-600 dark:text-gray-400">
            <p className="mb-2">© {new Date().getFullYear()} Michele Laurelli. All rights reserved.</p>
            <p className="italic">Artificial intelligence treated with scientific integrity, engineering precision, and human depth.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
