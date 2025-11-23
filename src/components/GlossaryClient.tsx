'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import type { GlossaryTerm } from '@/lib/glossary';

interface GlossaryClientProps {
  termsEn: GlossaryTerm[];
  termsIt: GlossaryTerm[];
  categoriesEn: string[];
  categoriesIt: string[];
}

export default function GlossaryClient({ termsEn, termsIt, categoriesEn, categoriesIt }: GlossaryClientProps) {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const allTerms = language === 'it' ? termsIt : termsEn;
  const categories = language === 'it' ? categoriesIt : categoriesEn;

  // Filter terms
  const filteredTerms = useMemo(() => {
    let terms = allTerms;

    // Filter by category
    if (selectedCategory !== 'all') {
      terms = terms.filter(term => term.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      terms = terms.filter(term =>
        term.term.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query)
      );
    }

    return terms;
  }, [allTerms, selectedCategory, searchQuery]);

  // Group terms by first letter
  const groupedTerms = useMemo(() => {
    const groups: Record<string, typeof filteredTerms> = {};
    filteredTerms.forEach(term => {
      const firstLetter = term.term[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const letters = Object.keys(groupedTerms).sort();

  const t = {
    title: language === 'en' ? 'AI Glossary' : 'Glossario dell\'AI',
    subtitle: language === 'en' 
      ? 'A comprehensive dictionary of artificial intelligence terms and concepts' 
      : 'Un dizionario completo di termini e concetti di intelligenza artificiale',
    searchPlaceholder: language === 'en' ? 'Search terms...' : 'Cerca termini...',
    allCategories: language === 'en' ? 'All Categories' : 'Tutte le Categorie',
    termsCount: language === 'en' 
      ? `${filteredTerms.length} term${filteredTerms.length !== 1 ? 's' : ''}` 
      : `${filteredTerms.length} termin${filteredTerms.length !== 1 ? 'i' : 'e'}`,
    noResults: language === 'en' ? 'No terms found' : 'Nessun termine trovato',
    tryDifferent: language === 'en' ? 'Try a different search or filter' : 'Prova una ricerca o un filtro diverso',
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
              {/* Date - hidden on mobile */}
              <span className="text-gray-600 dark:text-gray-400 hidden sm:block">{today}</span>
              <span className="text-gray-600 dark:text-gray-400 sm:hidden">AI Blog</span>
              
              {/* Right side controls */}
              <div className="flex items-center gap-2 sm:gap-4">
                <LanguageSwitcher />
                <ThemeToggle />
                {/* Vol info - hidden on mobile */}
                <span className="text-gray-600 dark:text-gray-400 hidden sm:block">Vol. 1, No. 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Masthead */}
        <div className="py-6 sm:py-8 border-b border-gray-300 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link href="/">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
                AI Blog
              </h1>
            </Link>
            <p className="text-xs sm:text-sm italic text-gray-600 dark:text-gray-400 border-t border-b border-gray-300 dark:border-gray-700 py-1 inline-block px-4">
              by Michele Laurelli
            </p>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:block bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
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

        {/* Navigation - Mobile */}
        <nav className="md:hidden bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            {/* Mobile menu button */}
            <div className="flex items-center justify-between py-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
                <span>Menu</span>
              </button>
              <span className="text-xs text-gray-600 dark:text-gray-400">{today.split(',')[0]}</span>
            </div>

            {/* Mobile menu items */}
            {mobileMenuOpen && (
              <ul className="pb-4 space-y-2 border-t border-gray-300 dark:border-gray-700 pt-4">
                <li>
                  <Link 
                    href="/" 
                    className="block py-2 text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/categories" 
                    className="block py-2 text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/glossary" 
                    className="block py-2 text-sm font-semibold uppercase tracking-wide text-black dark:text-white font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Glossary
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className="block py-2 text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </nav>

        {/* Glossary Info Bar */}
        <div className="bg-gray-100 dark:bg-gray-800 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Georgia, serif' }}>
                  {t.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-1" style={{ fontFamily: 'Georgia, serif' }}>
                  {t.subtitle}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  {t.termsCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white focus:outline-none text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: 'Georgia, serif' }}
            />
            <svg 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide border-2 transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white'
              }`}
            >
              {t.allCategories}
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide border-2 transition-colors ${
                  selectedCategory === category
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Alphabet Navigation */}
        {letters.length > 0 && (
          <div className="mb-8 pb-4 border-b-2 border-gray-300 dark:border-gray-700">
            <div className="flex flex-wrap gap-2 justify-center">
              {letters.map(letter => (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="w-10 h-10 flex items-center justify-center font-bold text-lg border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {letter}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Terms List - Dictionary style */}
        {letters.length > 0 ? (
          <div className="space-y-12">
            {letters.map(letter => (
              <div key={letter} id={`letter-${letter}`} className="scroll-mt-8">
                {/* Letter Header */}
                <div className="mb-6">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 border-b-4 border-black dark:border-gray-600 inline-block pr-4" style={{ fontFamily: 'Georgia, serif' }}>
                    {letter}
                  </h2>
                </div>

                {/* Terms in this letter */}
                <div className="space-y-6">
                  {groupedTerms[letter].map(term => (
                    <Link
                      key={term.slug}
                      href={`/glossary/${term.slug}`}
                      className="block bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white transition-all hover:shadow-lg p-6 group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Term and Category */}
                          <div className="flex items-baseline gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:underline" style={{ fontFamily: 'Georgia, serif' }}>
                              {term.term}
                            </h3>
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1">
                              {term.category}
                            </span>
                          </div>

                          {/* Pronunciation */}
                          {term.pronunciation && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 italic mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                              {term.pronunciation}
                            </div>
                          )}

                          {/* Definition */}
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                            {term.definition}
                          </p>
                        </div>

                        {/* Arrow */}
                        <div className="text-gray-400 dark:text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Results */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              {t.noResults}
            </h3>
            <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
              {t.tryDifferent}
            </p>
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
