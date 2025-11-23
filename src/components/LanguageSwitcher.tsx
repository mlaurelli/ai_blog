'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-1 items-center">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-bold uppercase tracking-wide transition-all active:scale-95 touch-manipulation ${
          language === 'en'
            ? 'bg-black dark:bg-white text-white dark:text-black'
            : 'border-2 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('it')}
        className={`px-2.5 py-1.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-bold uppercase tracking-wide transition-all active:scale-95 touch-manipulation ${
          language === 'it'
            ? 'bg-black dark:bg-white text-white dark:text-black'
            : 'border-2 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
        }`}
        aria-label="Cambia in Italiano"
      >
        IT
      </button>
    </div>
  );
}
