'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import CookieConsent from './CookieConsent';
import NewsletterModal from './NewsletterModal';
import GoogleAnalytics from './GoogleAnalytics';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'AI Blog - by Michele Laurelli' }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
                    className="block py-2 text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors"
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
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      <footer className="border-t-2 border-black dark:border-gray-600 mt-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            {/* Policy Links */}
            <div className="mb-4 flex flex-wrap justify-center gap-4 text-xs">
              <Link href="/privacy-policy" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white underline font-semibold uppercase tracking-wide">
                Privacy Policy
              </Link>
              <span className="text-gray-400">•</span>
              <Link href="/cookie-policy" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white underline font-semibold uppercase tracking-wide">
                Cookie Policy
              </Link>
              <span className="text-gray-400">•</span>
              <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white underline font-semibold uppercase tracking-wide">
                About
              </Link>
            </div>
            
            {/* Copyright */}
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p className="mb-2">© {new Date().getFullYear()} Michele Laurelli. All rights reserved.</p>
              <p className="italic">Artificial intelligence treated with scientific integrity, engineering precision, and human depth.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieConsent />
      
      {/* Newsletter Modal */}
      <NewsletterModal />
      
      {/* Google Analytics Page Tracking */}
      <GoogleAnalytics />
    </div>
  );
}
