'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function CookiePolicyContent() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: 'Cookie Policy',
      lastUpdated: 'Last updated',
      intro: {
        title: '1. What Are Cookies?',
        text1: 'Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.',
        text2: 'Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device after you close your browser, while session cookies are deleted when you close your browser.',
      },
      usage: {
        title: '2. How We Use Cookies',
        text: 'We use cookies for the following purposes:',
        items: [
          '<strong>Essential Operation:</strong> To enable core functionality of our website',
          '<strong>User Preferences:</strong> To remember your settings and preferences (theme, language)',
          '<strong>Analytics:</strong> To understand how visitors use our site (with your consent)',
          '<strong>Performance:</strong> To improve the speed and performance of our site',
        ],
      },
      types: '3. Types of Cookies We Use',
      necessary: 'Necessary Cookies',
      alwaysActive: 'ALWAYS ACTIVE',
      necessaryDesc: 'These cookies are essential for the website to function properly. They enable basic features like page navigation, security, and access to secure areas of the website.',
      analytics: 'Analytics Cookies',
      requiresConsent: 'REQUIRES CONSENT',
      analyticsDesc: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. We use this information to improve our content and user experience.',
      marketing: 'Marketing Cookies',
      marketingDesc: 'These cookies are used to track visitors across websites and display ads that are relevant and engaging.',
      currentStatus: 'Current Status',
      noMarketing: 'We currently do not use any marketing or advertising cookies on our website. If we decide to introduce them in the future, we will update this policy and request your consent.',
      managing: '5. Managing Your Cookie Preferences',
      managingText: 'You have several options to manage and control cookies:',
      backHome: 'Back to Home',
      privacyPolicy: 'Privacy Policy',
    },
    it: {
      title: 'Policy sui Cookie',
      lastUpdated: 'Ultimo aggiornamento',
      intro: {
        title: '1. Cosa sono i Cookie?',
        text1: 'I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti un sito web. Sono ampiamente utilizzati per far funzionare i siti web in modo più efficiente e fornire informazioni ai proprietari del sito.',
        text2: 'I cookie possono essere "persistenti" o "di sessione". I cookie persistenti rimangono sul tuo dispositivo dopo la chiusura del browser, mentre i cookie di sessione vengono eliminati alla chiusura del browser.',
      },
      usage: {
        title: '2. Come Utilizziamo i Cookie',
        text: 'Utilizziamo i cookie per i seguenti scopi:',
        items: [
          '<strong>Funzionamento Essenziale:</strong> Per abilitare le funzionalità principali del nostro sito web',
          '<strong>Preferenze Utente:</strong> Per ricordare le tue impostazioni e preferenze (tema, lingua)',
          '<strong>Analisi:</strong> Per capire come i visitatori utilizzano il nostro sito (con il tuo consenso)',
          '<strong>Prestazioni:</strong> Per migliorare la velocità e le prestazioni del nostro sito',
        ],
      },
      types: '3. Tipi di Cookie che Utilizziamo',
      necessary: 'Cookie Necessari',
      alwaysActive: 'SEMPRE ATTIVI',
      necessaryDesc: 'Questi cookie sono essenziali per il corretto funzionamento del sito web. Abilitano funzionalità di base come la navigazione delle pagine, la sicurezza e l\'accesso alle aree protette del sito web.',
      analytics: 'Cookie Analitici',
      requiresConsent: 'RICHIEDE CONSENSO',
      analyticsDesc: 'Questi cookie ci aiutano a capire come i visitatori interagiscono con il nostro sito web raccogliendo e comunicando informazioni in forma anonima. Utilizziamo queste informazioni per migliorare i nostri contenuti e l\'esperienza utente.',
      marketing: 'Cookie Marketing',
      marketingDesc: 'Questi cookie vengono utilizzati per tracciare i visitatori attraverso i siti web e visualizzare annunci pertinenti e coinvolgenti.',
      currentStatus: 'Stato Attuale',
      noMarketing: 'Attualmente non utilizziamo alcun cookie di marketing o pubblicitario sul nostro sito web. Se decidiamo di introdurli in futuro, aggiorneremo questa policy e richiederemo il tuo consenso.',
      managing: '5. Gestione delle Preferenze sui Cookie',
      managingText: 'Hai diverse opzioni per gestire e controllare i cookie:',
      backHome: 'Torna alla Home',
      privacyPolicy: 'Privacy Policy',
    },
  };

  const t = content[language];
  const today = new Date().toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b-4 border-black dark:border-white pb-4 mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t.title}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t.lastUpdated}: {today}
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold mb-4">{t.intro.title}</h2>
          <p className="mb-4">{t.intro.text1}</p>
          <p className="mb-4">{t.intro.text2}</p>
        </section>

        {/* Usage */}
        <section>
          <h2 className="text-2xl font-bold mb-4">{t.usage.title}</h2>
          <p className="mb-4">{t.usage.text}</p>
          <ul className="list-disc pl-6 mb-4">
            {t.usage.items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </section>

        {/* Types of Cookies */}
        <section>
          <h2 className="text-2xl font-bold mb-4">{t.types}</h2>

          <div className="space-y-6">
            {/* Necessary Cookies */}
            <div className="border-2 border-gray-300 dark:border-gray-700 rounded p-6 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{t.necessary}</h3>
                <span className="bg-green-500 text-white text-xs px-3 py-1 rounded font-bold">
                  {t.alwaysActive}
                </span>
              </div>
              <p className="mb-4 text-gray-700 dark:text-gray-300">{t.necessaryDesc}</p>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-200 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-2 text-left">{language === 'it' ? 'Nome Cookie' : 'Cookie Name'}</th>
                      <th className="px-4 py-2 text-left">{language === 'it' ? 'Scopo' : 'Purpose'}</th>
                      <th className="px-4 py-2 text-left">{language === 'it' ? 'Durata' : 'Duration'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-300 dark:border-gray-700">
                      <td className="px-4 py-2 font-mono">cookie_preferences</td>
                      <td className="px-4 py-2">
                        {language === 'it' ? 'Memorizza le tue preferenze sui cookie' : 'Stores your cookie consent preferences'}
                      </td>
                      <td className="px-4 py-2">{language === 'it' ? '1 anno' : '1 year'}</td>
                    </tr>
                    <tr className="border-t border-gray-300 dark:border-gray-700">
                      <td className="px-4 py-2 font-mono">theme</td>
                      <td className="px-4 py-2">
                        {language === 'it' ? 'Ricorda la tua preferenza del tema (chiaro/scuro)' : 'Remembers your theme preference (light/dark)'}
                      </td>
                      <td className="px-4 py-2">{language === 'it' ? 'Persistente' : 'Persistent'}</td>
                    </tr>
                    <tr className="border-t border-gray-300 dark:border-gray-700">
                      <td className="px-4 py-2 font-mono">language</td>
                      <td className="px-4 py-2">
                        {language === 'it' ? 'Ricorda la tua preferenza linguistica' : 'Remembers your language preference'}
                      </td>
                      <td className="px-4 py-2">{language === 'it' ? 'Persistente' : 'Persistent'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="border-2 border-gray-300 dark:border-gray-700 rounded p-6 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{t.analytics}</h3>
                <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded font-bold">
                  {t.requiresConsent}
                </span>
              </div>
              <p className="mb-4 text-gray-700 dark:text-gray-300">{t.analyticsDesc}</p>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-200 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-2 text-left">{language === 'it' ? 'Nome Cookie' : 'Cookie Name'}</th>
                      <th className="px-4 py-2 text-left">{language === 'it' ? 'Provider' : 'Provider'}</th>
                      <th className="px-4 py-2 text-left">{language === 'it' ? 'Scopo' : 'Purpose'}</th>
                      <th className="px-4 py-2 text-left">{language === 'it' ? 'Durata' : 'Duration'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-300 dark:border-gray-700">
                      <td className="px-4 py-2 font-mono">_ga</td>
                      <td className="px-4 py-2">Google Analytics</td>
                      <td className="px-4 py-2">
                        {language === 'it' ? 'Distingue gli utenti' : 'Distinguishes users'}
                      </td>
                      <td className="px-4 py-2">{language === 'it' ? '2 anni' : '2 years'}</td>
                    </tr>
                    <tr className="border-t border-gray-300 dark:border-gray-700">
                      <td className="px-4 py-2 font-mono">_gid</td>
                      <td className="px-4 py-2">Google Analytics</td>
                      <td className="px-4 py-2">
                        {language === 'it' ? 'Distingue gli utenti' : 'Distinguishes users'}
                      </td>
                      <td className="px-4 py-2">{language === 'it' ? '24 ore' : '24 hours'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="border-2 border-gray-300 dark:border-gray-700 rounded p-6 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{t.marketing}</h3>
                <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded font-bold">
                  {t.requiresConsent}
                </span>
              </div>
              <p className="mb-4 text-gray-700 dark:text-gray-300">{t.marketingDesc}</p>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                <p className="text-sm">
                  <strong>{t.currentStatus}:</strong> {t.noMarketing}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Managing Preferences */}
        <section>
          <h2 className="text-2xl font-bold mb-4">{t.managing}</h2>
          <p className="mb-4">{t.managingText}</p>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border-l-4 border-blue-500">
              <h4 className="font-bold mb-2">
                {language === 'it' ? '1. Banner Consenso Cookie' : '1. Cookie Consent Banner'}
              </h4>
              <p className="text-sm">
                {language === 'it'
                  ? 'Utilizza il nostro banner di consenso cookie quando visiti il sito per la prima volta per scegliere quali cookie accettare o rifiutare.'
                  : 'Use our cookie consent banner when you first visit the site to choose which cookies to accept or reject.'}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border-l-4 border-green-500">
              <h4 className="font-bold mb-2">
                {language === 'it' ? '2. Impostazioni Browser' : '2. Browser Settings'}
              </h4>
              <p className="text-sm">
                {language === 'it'
                  ? 'La maggior parte dei browser ti consente di rifiutare o eliminare i cookie. I metodi variano da browser a browser.'
                  : 'Most browsers allow you to refuse or delete cookies. Methods for doing so vary from browser to browser.'}
              </p>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t-2 border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            <Link href="/privacy-policy" className="underline hover:text-blue-600">
              {t.privacyPolicy}
            </Link>
            {' | '}
            <Link href="/" className="underline hover:text-blue-600">
              {t.backHome}
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
