'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Read the current theme from localStorage and sync with DOM
    const saved = localStorage.getItem('theme');
    const initialTheme = (saved === 'dark' || saved === 'light') ? saved : 'light';
    setTheme(initialTheme);
    
    // Ensure DOM is in sync with the theme state
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  const changeTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update the DOM class
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <div className="flex gap-0.5 items-center border-2 border-gray-400 dark:border-gray-600 rounded overflow-hidden">
        <div className="px-3 py-1.5 sm:px-4 sm:py-1.5 w-16 h-9"></div>
        <div className="w-px bg-gray-400 dark:bg-gray-600 h-6"></div>
        <div className="px-3 py-1.5 sm:px-4 sm:py-1.5 w-16 h-9"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-0.5 items-center border-2 border-gray-400 dark:border-gray-600 rounded overflow-hidden">
      <button
        onClick={() => changeTheme('light')}
        className={`w-[42px] h-[36px] sm:w-[52px] sm:h-[36px] text-xs sm:text-sm font-bold uppercase tracking-wide transition-all active:scale-95 touch-manipulation flex items-center justify-center ${
          theme === 'light'
            ? 'bg-black dark:bg-white text-white dark:text-black'
            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-label="Switch to light mode"
        title="Light mode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      </button>
      <div className="w-px bg-gray-400 dark:bg-gray-600 h-6"></div>
      <button
        onClick={() => changeTheme('dark')}
        className={`w-[42px] h-[36px] sm:w-[52px] sm:h-[36px] text-xs sm:text-sm font-bold uppercase tracking-wide transition-all active:scale-95 touch-manipulation flex items-center justify-center ${
          theme === 'dark'
            ? 'bg-black dark:bg-white text-white dark:text-black'
            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-label="Switch to dark mode"
        title="Dark mode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      </button>
    </div>
  );
}
