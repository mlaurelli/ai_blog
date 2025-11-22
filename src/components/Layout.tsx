'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'AI Blog - by Michele Laurelli' }: LayoutProps) {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
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
                <Link href="/glossary" className="text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors">
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
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

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
