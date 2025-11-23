import Layout from '@/components/Layout';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy and data protection information for AI Blog',
};

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b-4 border-black dark:border-white pb-4 mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to AI Blog ("we," "our," or "us"). We are committed to protecting your personal data and respecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              <strong> ai-blog.it</strong> (the "Site").
            </p>
            <p className="mb-4">
              This policy complies with the EU General Data Protection Regulation (GDPR), the Italian Personal Data Protection Code 
              (Legislative Decree no. 196/2003), and other applicable data protection laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Data Controller</h2>
            <p className="mb-4">
              The data controller responsible for your personal data is:
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded border-2 border-gray-300 dark:border-gray-700 mb-4">
              <p><strong>Michele Laurelli</strong></p>
              <p>Email: <a href="mailto:contact@ai-blog.it" className="text-blue-600 dark:text-blue-400 underline">contact@ai-blog.it</a></p>
              <p>Website: <a href="https://ai-blog.it" className="text-blue-600 dark:text-blue-400 underline">https://ai-blog.it</a></p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Information We Collect</h2>
            
            <h3 className="text-xl font-bold mb-3">3.1 Information You Provide</h3>
            <p className="mb-4">We may collect the following information when you interact with our Site:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Contact Information:</strong> Name, email address when you subscribe to our newsletter or contact us</li>
              <li><strong>Communication Data:</strong> Content of messages you send us</li>
              <li><strong>User Content:</strong> Comments, feedback, or other content you submit</li>
            </ul>

            <h3 className="text-xl font-bold mb-3">3.2 Information Collected Automatically</h3>
            <p className="mb-4">When you visit our Site, we automatically collect:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform</li>
              <li><strong>Usage Data:</strong> Information about how you use our Site, including pages visited, time spent on pages, and navigation paths</li>
              <li><strong>Cookie Data:</strong> See our <Link href="/cookie-policy" className="text-blue-600 dark:text-blue-400 underline">Cookie Policy</Link> for details</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. How We Use Your Information</h2>
            <p className="mb-4">We process your personal data for the following purposes:</p>
            
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border-l-4 border-blue-500">
                <h4 className="font-bold mb-2">To Provide and Maintain Our Service</h4>
                <p className="text-sm mb-2"><strong>Legal Basis:</strong> Legitimate interest</p>
                <p className="text-sm">To deliver content, maintain functionality, and improve user experience</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border-l-4 border-green-500">
                <h4 className="font-bold mb-2">To Communicate With You</h4>
                <p className="text-sm mb-2"><strong>Legal Basis:</strong> Consent / Legitimate interest</p>
                <p className="text-sm">To respond to inquiries, send newsletters (with your consent), and provide updates</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border-l-4 border-purple-500">
                <h4 className="font-bold mb-2">To Analyze and Improve</h4>
                <p className="text-sm mb-2"><strong>Legal Basis:</strong> Consent (via cookie consent)</p>
                <p className="text-sm">To understand user behavior, improve content, and optimize performance</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border-l-4 border-red-500">
                <h4 className="font-bold mb-2">To Comply With Legal Obligations</h4>
                <p className="text-sm mb-2"><strong>Legal Basis:</strong> Legal obligation</p>
                <p className="text-sm">To comply with applicable laws, regulations, and legal processes</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Data Sharing and Disclosure</h2>
            <p className="mb-4">We do not sell your personal data. We may share your information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Service Providers:</strong> Third-party companies that help us operate our Site (e.g., hosting providers, analytics services) - only with your consent where required</li>
              <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process</li>
              <li><strong>Protection of Rights:</strong> To protect our rights, property, or safety, or that of our users</li>
            </ul>

            <h3 className="text-xl font-bold mb-3">Third-Party Services</h3>
            <p className="mb-4">Our Site may use the following third-party services (with your consent):</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Google Analytics:</strong> For website analytics (anonymized IP)</li>
              <li><strong>Unsplash:</strong> For royalty-free images</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Your Rights Under GDPR</h2>
            <p className="mb-4">Under the GDPR, you have the following rights:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border-2 border-gray-300 dark:border-gray-700 p-4 rounded">
                <h4 className="font-bold mb-2">✓ Right to Access</h4>
                <p className="text-sm">Request copies of your personal data</p>
              </div>
              <div className="border-2 border-gray-300 dark:border-gray-700 p-4 rounded">
                <h4 className="font-bold mb-2">✓ Right to Rectification</h4>
                <p className="text-sm">Request correction of inaccurate data</p>
              </div>
              <div className="border-2 border-gray-300 dark:border-gray-700 p-4 rounded">
                <h4 className="font-bold mb-2">✓ Right to Erasure</h4>
                <p className="text-sm">Request deletion of your data ("right to be forgotten")</p>
              </div>
              <div className="border-2 border-gray-300 dark:border-gray-700 p-4 rounded">
                <h4 className="font-bold mb-2">✓ Right to Restriction</h4>
                <p className="text-sm">Request restriction of processing</p>
              </div>
              <div className="border-2 border-gray-300 dark:border-gray-700 p-4 rounded">
                <h4 className="font-bold mb-2">✓ Right to Data Portability</h4>
                <p className="text-sm">Receive your data in a structured format</p>
              </div>
              <div className="border-2 border-gray-300 dark:border-gray-700 p-4 rounded">
                <h4 className="font-bold mb-2">✓ Right to Object</h4>
                <p className="text-sm">Object to processing based on legitimate interests</p>
              </div>
              <div className="border-2 border-gray-300 dark:border-gray-700 p-4 rounded">
                <h4 className="font-bold mb-2">✓ Right to Withdraw Consent</h4>
                <p className="text-sm">Withdraw consent at any time</p>
              </div>
              <div className="border-2 border-gray-300 dark:border-gray-700 p-4 rounded">
                <h4 className="font-bold mb-2">✓ Right to Lodge a Complaint</h4>
                <p className="text-sm">File a complaint with a supervisory authority</p>
              </div>
            </div>

            <p className="mb-4">
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:contact@ai-blog.it" className="text-blue-600 dark:text-blue-400 underline">contact@ai-blog.it</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, 
              alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure hosting infrastructure</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Data minimization principles</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Data Retention</h2>
            <p className="mb-4">
              We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
              unless a longer retention period is required or permitted by law.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Contact Data:</strong> Retained while you maintain a relationship with us, then deleted upon request</li>
              <li><strong>Analytics Data:</strong> Anonymized after 26 months (Google Analytics default)</li>
              <li><strong>Cookie Data:</strong> See our <Link href="/cookie-policy" className="text-blue-600 dark:text-blue-400 underline">Cookie Policy</Link></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
            <p className="mb-4">
              Your data may be transferred to and processed in countries outside the European Economic Area (EEA). 
              When we transfer data outside the EEA, we ensure appropriate safeguards are in place, such as:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Standard Contractual Clauses approved by the European Commission</li>
              <li>Transfers to countries with adequacy decisions</li>
              <li>Compliance with GDPR Chapter V requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Children's Privacy</h2>
            <p className="mb-4">
              Our Site is not directed to children under 16 years of age. We do not knowingly collect personal data from children. 
              If you believe we have collected data from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Posting the updated policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending you an email notification (if you've subscribed)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded border-2 border-gray-300 dark:border-gray-700">
              <p className="mb-2"><strong>Michele Laurelli</strong></p>
              <p className="mb-2">Email: <a href="mailto:contact@ai-blog.it" className="text-blue-600 dark:text-blue-400 underline">contact@ai-blog.it</a></p>
              <p className="mb-2">Website: <a href="https://ai-blog.it" className="text-blue-600 dark:text-blue-400 underline">https://ai-blog.it</a></p>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <strong>Italian Data Protection Authority (Garante per la protezione dei dati personali):</strong><br />
                Website: <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">www.garanteprivacy.it</a>
              </p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t-2 border-gray-300 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              <Link href="/cookie-policy" className="underline hover:text-blue-600">Cookie Policy</Link>
              {' '} | {' '}
              <Link href="/" className="underline hover:text-blue-600">Back to Home</Link>
            </p>
          </div>
        </div>
      </article>
    </Layout>
  );
}
