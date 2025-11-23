'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePathname } from 'next/navigation';
import { trackEvent } from './GoogleAnalytics';

export default function NewsletterModal() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user has already subscribed
    const hasSubscribed = localStorage.getItem('newsletter_subscribed');
    if (hasSubscribed) {
      return;
    }

    // Show modal after 10 seconds on each page visit
    const timer = setTimeout(() => {
      setShowModal(true);
      // Track modal appearance
      trackEvent('newsletter_modal_shown', {
        page: pathname,
      });
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [pathname]); // Reset timer on page change

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email.trim()) {
      setError(t('newsletter.errorEmail'));
      return;
    }

    if (!validateEmail(email)) {
      setError(t('newsletter.errorEmailInvalid'));
      return;
    }

    if (!privacyAccepted) {
      setError(t('newsletter.errorPrivacy'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Call Mailchimp API via our secure endpoint
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (data.code === 'ALREADY_SUBSCRIBED') {
          setError(t('newsletter.errorAlreadySubscribed'));
        } else if (data.error) {
          setError(data.error);
        } else {
          setError(t('newsletter.errorGeneric'));
        }
        return;
      }

      // Success - Save to localStorage
      localStorage.setItem('newsletter_subscribed', 'true');
      localStorage.setItem('newsletter_email', email.toLowerCase().trim());
      localStorage.setItem('newsletter_date', new Date().toISOString());
      
      // Track successful subscription
      trackEvent('newsletter_subscription', {
        method: 'modal',
        page: pathname,
      });
      
      setSuccess(true);
      
      // Close modal after showing success message
      setTimeout(() => {
        setShowModal(false);
      }, 2500);
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError(t('newsletter.errorGeneric'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Track modal dismissal
    trackEvent('newsletter_modal_dismissed', {
      page: pathname,
    });
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white dark:bg-gray-900 border-4 border-black dark:border-gray-600 shadow-2xl max-w-md w-full pointer-events-auto animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b-2 border-black dark:border-gray-600 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center pr-8">
              <div className="text-4xl mb-3">📬</div>
              <h2 className="text-2xl font-bold mb-2">
                {t('newsletter.title')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('newsletter.subtitle')}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6">
            {success ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">
                  {t('newsletter.successTitle')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('newsletter.successMessage')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label htmlFor="newsletter-email" className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                    {t('newsletter.emailLabel')} *
                  </label>
                  <input
                    type="email"
                    id="newsletter-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('newsletter.emailPlaceholder')}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-black dark:focus:border-white outline-none transition-colors"
                    required
                  />
                </div>

                {/* Privacy Checkbox - GDPR Required */}
                <div className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 p-4 rounded">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      className="mt-1 w-5 h-5 accent-black dark:accent-white flex-shrink-0"
                      required
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t('newsletter.privacyText')}{' '}
                      <Link 
                        href="/privacy-policy" 
                        className="underline font-semibold hover:text-black dark:hover:text-white"
                        target="_blank"
                      >
                        {t('newsletter.privacyLink')}
                      </Link>
                      {' '}<span className="text-red-600 dark:text-red-400 font-bold">*</span>
                    </span>
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 p-3 rounded">
                    <p className="text-sm text-red-700 dark:text-red-400">
                      ⚠️ {error}
                    </p>
                  </div>
                )}

                {/* GDPR Info */}
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-3 rounded">
                  <p className="mb-1">
                    <strong>ℹ️ {t('newsletter.gdprTitle')}</strong>
                  </p>
                  <p>{t('newsletter.gdprText')}</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !privacyAccepted}
                  className="w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-bold uppercase tracking-wide"
                >
                  {isSubmitting ? t('newsletter.subscribing') : t('newsletter.subscribe')}
                </button>

                {/* Close Link */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white underline transition-colors"
                >
                  {t('newsletter.noThanks')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
