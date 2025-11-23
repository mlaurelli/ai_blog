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
    
    // Cookie Banner
    'cookie.title': 'We value your privacy',
    'cookie.description': 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
    'cookie.learnMore': 'Learn more',
    'cookie.customize': 'Customize',
    'cookie.necessaryOnly': 'Necessary Only',
    'cookie.acceptAll': 'Accept All',
    'cookie.settings': 'Cookie Settings',
    'cookie.necessary': 'Necessary Cookies',
    'cookie.alwaysActive': 'Always Active',
    'cookie.necessaryDesc': 'These cookies are essential for the website to function properly. They enable basic features like page navigation and access to secure areas.',
    'cookie.analytics': 'Analytics Cookies',
    'cookie.analyticsDesc': 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
    'cookie.marketing': 'Marketing Cookies',
    'cookie.marketingDesc': 'These cookies are used to track visitors across websites and display ads that are relevant and engaging.',
    'cookie.cookiePolicy': 'Cookie Policy',
    'cookie.savePreferences': 'Save Preferences',
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
    
    // Cookie Banner
    'cookie.title': 'Rispettiamo la tua privacy',
    'cookie.description': 'Utilizziamo i cookie per migliorare la tua esperienza di navigazione, fornire contenuti personalizzati e analizzare il nostro traffico. Cliccando "Accetta Tutti", acconsenti all\'uso dei cookie.',
    'cookie.learnMore': 'Scopri di più',
    'cookie.customize': 'Personalizza',
    'cookie.necessaryOnly': 'Solo Necessari',
    'cookie.acceptAll': 'Accetta Tutti',
    'cookie.settings': 'Impostazioni Cookie',
    'cookie.necessary': 'Cookie Necessari',
    'cookie.alwaysActive': 'Sempre Attivi',
    'cookie.necessaryDesc': 'Questi cookie sono essenziali per il corretto funzionamento del sito web. Abilitano funzionalità di base come la navigazione delle pagine e l\'accesso alle aree protette.',
    'cookie.analytics': 'Cookie Analitici',
    'cookie.analyticsDesc': 'Questi cookie ci aiutano a capire come i visitatori interagiscono con il nostro sito raccogliendo e comunicando informazioni in forma anonima.',
    'cookie.marketing': 'Cookie Marketing',
    'cookie.marketingDesc': 'Questi cookie vengono utilizzati per tracciare i visitatori attraverso i siti web e visualizzare annunci pertinenti e coinvolgenti.',
    'cookie.cookiePolicy': 'Policy sui Cookie',
    'cookie.savePreferences': 'Salva Preferenze',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load language from localStorage or auto-detect
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'en' || saved === 'it')) {
      setLanguageState(saved);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('it')) {
        setLanguageState('it');
        localStorage.setItem('language', 'it');
      } else {
        setLanguageState('en');
        localStorage.setItem('language', 'en');
      }
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
