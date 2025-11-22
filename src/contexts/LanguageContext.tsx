'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'it';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.authors': 'Authors',
    
    // Common
    'common.readMore': 'Read More',
    'common.backToBlog': 'Back to Blog',
    'common.minRead': 'min read',
    'common.by': 'by',
    'common.on': 'on',
    'common.articles': 'Articles',
    'common.allPosts': 'All Posts',
    
    // Footer
    'footer.tagline': 'AI Blog - by Michele Laurelli',
    'footer.rights': 'All rights reserved.',
    
    // Author page
    'author.articlesBy': 'Articles by',
    'author.email': 'Email',
    'author.website': 'Website',
    
    // Blog
    'blog.latestPosts': 'Latest Posts',
    'blog.categories': 'Categories',
    
    // Meta
    'meta.defaultTitle': 'AI Blog - by Michele Laurelli',
    'meta.defaultDescription': 'Insights on AI architecture, machine learning, and private AI systems',
  },
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.about': 'Chi Sono',
    'nav.authors': 'Autori',
    
    // Common
    'common.readMore': 'Leggi di più',
    'common.backToBlog': 'Torna al Blog',
    'common.minRead': 'min di lettura',
    'common.by': 'di',
    'common.on': 'il',
    'common.articles': 'Articoli',
    'common.allPosts': 'Tutti gli Articoli',
    
    // Footer
    'footer.tagline': 'Blog AI - di Michele Laurelli',
    'footer.rights': 'Tutti i diritti riservati.',
    
    // Author page
    'author.articlesBy': 'Articoli di',
    'author.email': 'Email',
    'author.website': 'Sito Web',
    
    // Blog
    'blog.latestPosts': 'Ultimi Articoli',
    'blog.categories': 'Categorie',
    
    // Meta
    'meta.defaultTitle': 'Blog AI - di Michele Laurelli',
    'meta.defaultDescription': 'Approfondimenti su architettura AI, machine learning e sistemi AI privati',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load language from localStorage
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'en' || saved === 'it')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
