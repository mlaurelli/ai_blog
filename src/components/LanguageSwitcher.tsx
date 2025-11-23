'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-0.5 items-center border-2 border-gray-400 dark:border-gray-600 rounded overflow-hidden">
      <button
        onClick={() => setLanguage('en')}
        className={`min-w-[2.5rem] px-3 py-1.5 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wide transition-all active:scale-95 touch-manipulation flex items-center justify-center ${
          language === 'en'
            ? 'bg-black dark:bg-white text-white dark:text-black'
            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-label="Switch to English"
        title="English"
      >
        EN
      </button>
      <div className="w-px bg-gray-400 dark:bg-gray-600 h-6"></div>
      <button
        onClick={() => setLanguage('it')}
        className={`min-w-[2.5rem] px-3 py-1.5 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wide transition-all active:scale-95 touch-manipulation flex items-center justify-center ${
          language === 'it'
            ? 'bg-black dark:bg-white text-white dark:text-black'
            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-label="Cambia in Italiano"
        title="Italiano"
      >
        IT
      </button>
    </div>
  );
}
