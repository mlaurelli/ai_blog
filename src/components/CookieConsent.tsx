'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
    timestamp: Date.now(),
  });

  useEffect(() => {
    // Check if user has already made a choice
    const savedPreferences = localStorage.getItem('cookie_preferences');
    if (!savedPreferences) {
      // Show banner after a small delay
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      const parsed = JSON.parse(savedPreferences);
      setPreferences(parsed);
      // Apply preferences
      applyPreferences(parsed);
    }
  }, []);

  const applyPreferences = (prefs: CookiePreferences) => {
    // Apply analytics cookies if accepted
    if (prefs.analytics) {
      enableAnalytics();
    } else {
      disableAnalytics();
    }

    // Apply marketing cookies if accepted
    if (prefs.marketing) {
      enableMarketing();
    } else {
      disableMarketing();
    }
  };

  const enableAnalytics = () => {
    // Google Analytics or similar
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.dataLayer = window.dataLayer || [];
      // @ts-ignore
      window.gtag = function() { window.dataLayer.push(arguments); };
      // @ts-ignore
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const disableAnalytics = () => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.gtag?.('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
  };

  const enableMarketing = () => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.gtag?.('consent', 'update', {
        ad_storage: 'granted'
      });
    }
  };

  const disableMarketing = () => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.gtag?.('consent', 'update', {
        ad_storage: 'denied'
      });
    }
  };

  const acceptAll = () => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    };
    savePreferences(prefs);
  };

  const acceptNecessary = () => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    };
    savePreferences(prefs);
  };

  const saveCustomPreferences = () => {
    const prefs: CookiePreferences = {
      ...preferences,
      timestamp: Date.now(),
    };
    savePreferences(prefs);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie_preferences', JSON.stringify(prefs));
    setPreferences(prefs);
    applyPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t-2 border-gray-300 dark:border-gray-700 shadow-2xl">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {!showSettings ? (
            // Simple banner
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">🍪 We value your privacy</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies. 
                  <Link href="/privacy-policy" className="underline ml-1 hover:text-blue-600">
                    Learn more
                  </Link>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white transition-colors text-sm font-semibold uppercase tracking-wide"
                >
                  Customize
                </button>
                <button
                  onClick={acceptNecessary}
                  className="px-4 py-2 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white transition-colors text-sm font-semibold uppercase tracking-wide"
                >
                  Necessary Only
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-semibold uppercase tracking-wide"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            // Detailed settings
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Cookie Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded border-2 border-gray-300 dark:border-gray-700">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold">Necessary Cookies</h4>
                      <span className="text-xs bg-gray-300 dark:bg-gray-700 px-2 py-0.5 rounded">Always Active</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      These cookies are essential for the website to function properly. They enable basic features like page navigation and access to secure areas.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="mt-1 w-5 h-5"
                  />
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded border-2 border-gray-300 dark:border-gray-700">
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="mt-1 w-5 h-5 accent-black dark:accent-white"
                  />
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded border-2 border-gray-300 dark:border-gray-700">
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">Marketing Cookies</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      These cookies are used to track visitors across websites and display ads that are relevant and engaging.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="mt-1 w-5 h-5 accent-black dark:accent-white"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <Link
                  href="/cookie-policy"
                  className="px-4 py-2 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white transition-colors text-sm font-semibold uppercase tracking-wide text-center"
                >
                  Cookie Policy
                </Link>
                <button
                  onClick={acceptNecessary}
                  className="px-4 py-2 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white transition-colors text-sm font-semibold uppercase tracking-wide"
                >
                  Necessary Only
                </button>
                <button
                  onClick={saveCustomPreferences}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-semibold uppercase tracking-wide"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
