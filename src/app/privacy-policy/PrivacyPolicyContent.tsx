'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function PrivacyPolicyContent() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated',
      intro: {
        title: '1. Introduction',
        text1: 'Welcome to AI Blog ("we," "our," or "us"). We are committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website',
        text2: 'This policy complies with the EU General Data Protection Regulation (GDPR), the Italian Personal Data Protection Code (Legislative Decree no. 196/2003), and other applicable data protection laws.',
      },
      controller: {
        title: '2. Data Controller',
        text: 'The data controller responsible for your personal data is:',
      },
      dataCollection: {
        title: '3. Information We Collect',
        provided: {
          title: '3.1 Information You Provide',
          text: 'We may collect the following information when you interact with our Site:',
          items: [
            '<strong>Contact Information:</strong> Name, email address when you subscribe to our newsletter or contact us',
            '<strong>Communication Data:</strong> Content of messages you send us',
            '<strong>User Content:</strong> Comments, feedback, or other content you submit',
          ],
        },
        automatic: {
          title: '3.2 Information Collected Automatically',
          text: 'When you visit our Site, we automatically collect:',
          items: [
            '<strong>Technical Data:</strong> IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform',
            '<strong>Usage Data:</strong> Information about how you use our Site, including pages visited, time spent on pages, and navigation paths',
            '<strong>Cookie Data:</strong> See our Cookie Policy for details',
          ],
        },
      },
      usage: {
        title: '4. How We Use Your Information',
        text: 'We process your personal data for the following purposes:',
        purposes: [
          {
            title: 'To Provide and Maintain Our Service',
            basis: 'Legal Basis: Legitimate interest',
            desc: 'To deliver content, maintain functionality, and improve user experience',
          },
          {
            title: 'To Communicate With You',
            basis: 'Legal Basis: Consent / Legitimate interest',
            desc: 'To respond to inquiries, send newsletters (with your consent), and provide updates',
          },
          {
            title: 'To Analyze and Improve',
            basis: 'Legal Basis: Consent (via cookie consent)',
            desc: 'To understand user behavior, improve content, and optimize performance',
          },
          {
            title: 'To Comply With Legal Obligations',
            basis: 'Legal Basis: Legal obligation',
            desc: 'To comply with applicable laws, regulations, and legal processes',
          },
        ],
      },
      rights: {
        title: '6. Your Rights Under GDPR',
        text: 'Under the GDPR, you have the following rights:',
        items: [
          { title: 'Right to Access', desc: 'Request copies of your personal data' },
          { title: 'Right to Rectification', desc: 'Request correction of inaccurate data' },
          { title: 'Right to Erasure', desc: 'Request deletion of your data ("right to be forgotten")' },
          { title: 'Right to Restriction', desc: 'Request restriction of processing' },
          { title: 'Right to Data Portability', desc: 'Receive your data in a structured format' },
          { title: 'Right to Object', desc: 'Object to processing based on legitimate interests' },
          { title: 'Right to Withdraw Consent', desc: 'Withdraw consent at any time' },
          { title: 'Right to Lodge a Complaint', desc: 'File a complaint with a supervisory authority' },
        ],
        contact: 'To exercise any of these rights, please contact us at',
      },
      backHome: 'Back to Home',
      cookiePolicy: 'Cookie Policy',
    },
    it: {
      title: 'Privacy Policy',
      lastUpdated: 'Ultimo aggiornamento',
      intro: {
        title: '1. Introduzione',
        text1: 'Benvenuto su AI Blog ("noi," "nostro," o "ci"). Ci impegniamo a proteggere i tuoi dati personali e a rispettare la tua privacy. Questa Privacy Policy spiega come raccogliamo, utilizziamo, divulghiamo e proteggiamo le tue informazioni quando visiti il nostro sito web',
        text2: 'Questa policy è conforme al Regolamento Generale sulla Protezione dei Dati dell\'UE (GDPR), al Codice Italiano della Privacy (D.Lgs. n. 196/2003) e altre leggi applicabili sulla protezione dei dati.',
      },
      controller: {
        title: '2. Titolare del Trattamento',
        text: 'Il titolare del trattamento responsabile dei tuoi dati personali è:',
      },
      dataCollection: {
        title: '3. Informazioni che Raccogliamo',
        provided: {
          title: '3.1 Informazioni che Fornisci',
          text: 'Potremmo raccogliere le seguenti informazioni quando interagisci con il nostro Sito:',
          items: [
            '<strong>Informazioni di Contatto:</strong> Nome, indirizzo email quando ti iscrivi alla newsletter o ci contatti',
            '<strong>Dati di Comunicazione:</strong> Contenuto dei messaggi che ci invii',
            '<strong>Contenuti Utente:</strong> Commenti, feedback o altri contenuti che invii',
          ],
        },
        automatic: {
          title: '3.2 Informazioni Raccolte Automaticamente',
          text: 'Quando visiti il nostro Sito, raccogliamo automaticamente:',
          items: [
            '<strong>Dati Tecnici:</strong> Indirizzo IP, tipo e versione del browser, fuso orario, tipi e versioni di plug-in del browser, sistema operativo e piattaforma',
            '<strong>Dati di Utilizzo:</strong> Informazioni su come utilizzi il nostro Sito, incluse le pagine visitate, il tempo trascorso sulle pagine e i percorsi di navigazione',
            '<strong>Dati dei Cookie:</strong> Vedi la nostra Policy sui Cookie per i dettagli',
          ],
        },
      },
      usage: {
        title: '4. Come Utilizziamo le Tue Informazioni',
        text: 'Trattiamo i tuoi dati personali per le seguenti finalità:',
        purposes: [
          {
            title: 'Per Fornire e Mantenere il Nostro Servizio',
            basis: 'Base Legale: Interesse legittimo',
            desc: 'Per fornire contenuti, mantenere le funzionalità e migliorare l\'esperienza utente',
          },
          {
            title: 'Per Comunicare con Te',
            basis: 'Base Legale: Consenso / Interesse legittimo',
            desc: 'Per rispondere alle richieste, inviare newsletter (con il tuo consenso) e fornire aggiornamenti',
          },
          {
            title: 'Per Analizzare e Migliorare',
            basis: 'Base Legale: Consenso (tramite consenso cookie)',
            desc: 'Per comprendere il comportamento degli utenti, migliorare i contenuti e ottimizzare le prestazioni',
          },
          {
            title: 'Per Conformarsi agli Obblighi Legali',
            basis: 'Base Legale: Obbligo legale',
            desc: 'Per conformarsi alle leggi, ai regolamenti e ai processi legali applicabili',
          },
        ],
      },
      rights: {
        title: '6. I Tuoi Diritti ai sensi del GDPR',
        text: 'Ai sensi del GDPR, hai i seguenti diritti:',
        items: [
          { title: 'Diritto di Accesso', desc: 'Richiedere copie dei tuoi dati personali' },
          { title: 'Diritto di Rettifica', desc: 'Richiedere la correzione di dati inesatti' },
          { title: 'Diritto alla Cancellazione', desc: 'Richiedere la cancellazione dei tuoi dati ("diritto all\'oblio")' },
          { title: 'Diritto di Limitazione', desc: 'Richiedere la limitazione del trattamento' },
          { title: 'Diritto alla Portabilità dei Dati', desc: 'Ricevere i tuoi dati in un formato strutturato' },
          { title: 'Diritto di Opposizione', desc: 'Opporsi al trattamento basato su interessi legittimi' },
          { title: 'Diritto di Revocare il Consenso', desc: 'Revocare il consenso in qualsiasi momento' },
          { title: 'Diritto di Reclamo', desc: 'Presentare un reclamo a un\'autorità di controllo' },
        ],
        contact: 'Per esercitare uno qualsiasi di questi diritti, ti preghiamo di contattarci all\'indirizzo',
      },
      backHome: 'Torna alla Home',
      cookiePolicy: 'Policy sui Cookie',
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
          <p className="mb-4">
            {t.intro.text1} <strong>ai-blog.it</strong>.
          </p>
          <p className="mb-4">{t.intro.text2}</p>
        </section>

        {/* Data Controller */}
        <section>
          <h2 className="text-2xl font-bold mb-4">{t.controller.title}</h2>
          <p className="mb-4">{t.controller.text}</p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded border-2 border-gray-300 dark:border-gray-700 mb-4">
            <p>
              <strong>Michele Laurelli</strong>
            </p>
            <p>
              Email:{' '}
              <a href="mailto:contact@ai-blog.it" className="text-blue-600 dark:text-blue-400 underline">
                contact@ai-blog.it
              </a>
            </p>
            <p>
              Website:{' '}
              <a href="https://ai-blog.it" className="text-blue-600 dark:text-blue-400 underline">
                https://ai-blog.it
              </a>
            </p>
          </div>
        </section>

        {/* Data Collection */}
        <section>
          <h2 className="text-2xl font-bold mb-4">{t.dataCollection.title}</h2>

          <h3 className="text-xl font-bold mb-3">{t.dataCollection.provided.title}</h3>
          <p className="mb-4">{t.dataCollection.provided.text}</p>
          <ul className="list-disc pl-6 mb-4">
            {t.dataCollection.provided.items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3 className="text-xl font-bold mb-3">{t.dataCollection.automatic.title}</h3>
          <p className="mb-4">{t.dataCollection.automatic.text}</p>
          <ul className="list-disc pl-6 mb-4">
            {t.dataCollection.automatic.items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </section>

        {/* Usage */}
        <section>
          <h2 className="text-2xl font-bold mb-4">{t.usage.title}</h2>
          <p className="mb-4">{t.usage.text}</p>

          <div className="space-y-4">
            {t.usage.purposes.map((purpose, i) => (
              <div key={i} className={`bg-gray-50 dark:bg-gray-800 p-4 rounded border-l-4 ${['border-blue-500', 'border-green-500', 'border-purple-500', 'border-red-500'][i]}`}>
                <h4 className="font-bold mb-2">{purpose.title}</h4>
                <p className="text-sm mb-2">
                  <strong>{purpose.basis}</strong>
                </p>
                <p className="text-sm">{purpose.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rights */}
        <section>
          <h2 className="text-2xl font-bold mb-4">{t.rights.title}</h2>
          <p className="mb-4">{t.rights.text}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {t.rights.items.map((right, i) => (
              <div key={i} className="border-2 border-gray-300 dark:border-gray-700 p-4 rounded">
                <h4 className="font-bold mb-2">✓ {right.title}</h4>
                <p className="text-sm">{right.desc}</p>
              </div>
            ))}
          </div>

          <p className="mb-4">
            {t.rights.contact}{' '}
            <a href="mailto:contact@ai-blog.it" className="text-blue-600 dark:text-blue-400 underline">
              contact@ai-blog.it
            </a>
          </p>
        </section>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t-2 border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            <Link href="/cookie-policy" className="underline hover:text-blue-600">
              {t.cookiePolicy}
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
