'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-sm font-bold uppercase tracking-wide transition-colors ${
          language === 'en'
            ? 'bg-black dark:bg-white text-white dark:text-black'
            : 'border-2 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('it')}
        className={`px-3 py-1 text-sm font-bold uppercase tracking-wide transition-colors ${
          language === 'it'
            ? 'bg-black dark:bg-white text-white dark:text-black'
            : 'border-2 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
        }`}
      >
        IT
      </button>
    </div>
  );
}
