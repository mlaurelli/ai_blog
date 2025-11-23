import Layout from '@/components/Layout';
import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy',
  description: 'Cookie Policy and tracking information for AI Blog',
};

export default function CookiePolicyPage() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b-4 border-black dark:border-white pb-4 mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
            <p className="mb-4">
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make 
              websites work more efficiently and provide information to the owners of the site.
            </p>
            <p className="mb-4">
              Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device after you close your browser, 
              while session cookies are deleted when you close your browser.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
            <p className="mb-4">
              We use cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Essential Operation:</strong> To enable core functionality of our website</li>
              <li><strong>User Preferences:</strong> To remember your settings and preferences (theme, language)</li>
              <li><strong>Analytics:</strong> To understand how visitors use our site (with your consent)</li>
              <li><strong>Performance:</strong> To improve the speed and performance of our site</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Types of Cookies We Use</h2>

            <div className="space-y-6">
              {/* Necessary Cookies */}
              <div className="border-2 border-gray-300 dark:border-gray-700 rounded p-6 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Necessary Cookies</h3>
                  <span className="bg-green-500 text-white text-xs px-3 py-1 rounded font-bold">ALWAYS ACTIVE</span>
                </div>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  These cookies are essential for the website to function properly. They enable basic features like page navigation, 
                  security, and access to secure areas of the website.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-200 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-2 text-left">Cookie Name</th>
                        <th className="px-4 py-2 text-left">Purpose</th>
                        <th className="px-4 py-2 text-left">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-300 dark:border-gray-700">
                        <td className="px-4 py-2 font-mono">cookie_preferences</td>
                        <td className="px-4 py-2">Stores your cookie consent preferences</td>
                        <td className="px-4 py-2">1 year</td>
                      </tr>
                      <tr className="border-t border-gray-300 dark:border-gray-700">
                        <td className="px-4 py-2 font-mono">theme</td>
                        <td className="px-4 py-2">Remembers your theme preference (light/dark)</td>
                        <td className="px-4 py-2">Persistent</td>
                      </tr>
                      <tr className="border-t border-gray-300 dark:border-gray-700">
                        <td className="px-4 py-2 font-mono">language</td>
                        <td className="px-4 py-2">Remembers your language preference</td>
                        <td className="px-4 py-2">Persistent</td>
                      </tr>
                      <tr className="border-t border-gray-300 dark:border-gray-700">
                        <td className="px-4 py-2 font-mono">admin_token</td>
                        <td className="px-4 py-2">Admin authentication (admin panel only)</td>
                        <td className="px-4 py-2">Session</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border-2 border-gray-300 dark:border-gray-700 rounded p-6 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Analytics Cookies</h3>
                  <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded font-bold">REQUIRES CONSENT</span>
                </div>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information 
                  anonymously. We use this information to improve our content and user experience.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-200 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-2 text-left">Cookie Name</th>
                        <th className="px-4 py-2 text-left">Provider</th>
                        <th className="px-4 py-2 text-left">Purpose</th>
                        <th className="px-4 py-2 text-left">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-300 dark:border-gray-700">
                        <td className="px-4 py-2 font-mono">_ga</td>
                        <td className="px-4 py-2">Google Analytics</td>
                        <td className="px-4 py-2">Distinguishes users</td>
                        <td className="px-4 py-2">2 years</td>
                      </tr>
                      <tr className="border-t border-gray-300 dark:border-gray-700">
                        <td className="px-4 py-2 font-mono">_ga_*</td>
                        <td className="px-4 py-2">Google Analytics</td>
                        <td className="px-4 py-2">Stores and counts pageviews</td>
                        <td className="px-4 py-2">2 years</td>
                      </tr>
                      <tr className="border-t border-gray-300 dark:border-gray-700">
                        <td className="px-4 py-2 font-mono">_gid</td>
                        <td className="px-4 py-2">Google Analytics</td>
                        <td className="px-4 py-2">Distinguishes users</td>
                        <td className="px-4 py-2">24 hours</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                  <p className="text-sm">
                    <strong>Note:</strong> We use Google Analytics with IP anonymization enabled. This means your IP address 
                    is anonymized within EU member states before being stored.
                  </p>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border-2 border-gray-300 dark:border-gray-700 rounded p-6 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Marketing Cookies</h3>
                  <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded font-bold">REQUIRES CONSENT</span>
                </div>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  These cookies are used to track visitors across websites and display ads that are relevant and engaging. 
                  They may be set through our site by advertising partners.
                </p>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                  <p className="text-sm">
                    <strong>Current Status:</strong> We currently do not use any marketing or advertising cookies on our website. 
                    If we decide to introduce them in the future, we will update this policy and request your consent.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Third-Party Cookies</h2>
            <p className="mb-4">
              Some cookies are placed by third-party services that appear on our pages. We do not control these cookies. 
              You should check the relevant third party's website for more information about these cookies.
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded border-2 border-gray-300 dark:border-gray-700 mb-4">
              <h4 className="font-bold mb-2">Google Analytics</h4>
              <p className="text-sm mb-2">
                We use Google Analytics to analyze website usage. Google Analytics uses cookies to collect information about how visitors use our site.
              </p>
              <p className="text-sm">
                Learn more: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Google Privacy Policy</a>
              </p>
              <p className="text-sm">
                Opt-out: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Google Analytics Opt-out Browser Add-on</a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Managing Your Cookie Preferences</h2>
            <p className="mb-4">
              You have several options to manage and control cookies:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border-l-4 border-blue-500">
                <h4 className="font-bold mb-2">1. Cookie Consent Banner</h4>
                <p className="text-sm">
                  Use our cookie consent banner when you first visit the site to choose which cookies to accept or reject.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border-l-4 border-green-500">
                <h4 className="font-bold mb-2">2. Browser Settings</h4>
                <p className="text-sm mb-2">
                  Most browsers allow you to refuse or delete cookies. Methods for doing so vary from browser to browser:
                </p>
                <ul className="text-sm list-disc pl-6">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Chrome</a></li>
                  <li><a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Firefox</a></li>
                  <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Safari</a></li>
                  <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Edge</a></li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border-l-4 border-purple-500">
                <h4 className="font-bold mb-2">3. Industry Opt-Out Tools</h4>
                <p className="text-sm">
                  Visit <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Your Online Choices</a> (EU) 
                  to opt out of behavioral advertising from participating companies.
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm">
                <strong>⚠️ Warning:</strong> Blocking or deleting cookies may impact the functionality of our website. 
                Certain features may not work properly without necessary cookies.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Updates to This Policy</h2>
            <p className="mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. 
              We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about our use of cookies, please contact us:
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded border-2 border-gray-300 dark:border-gray-700">
              <p className="mb-2"><strong>Michele Laurelli</strong></p>
              <p className="mb-2">Email: <a href="mailto:contact@ai-blog.it" className="text-blue-600 dark:text-blue-400 underline">contact@ai-blog.it</a></p>
              <p>Website: <a href="https://ai-blog.it" className="text-blue-600 dark:text-blue-400 underline">https://ai-blog.it</a></p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t-2 border-gray-300 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              <Link href="/privacy-policy" className="underline hover:text-blue-600">Privacy Policy</Link>
              {' '} | {' '}
              <Link href="/" className="underline hover:text-blue-600">Back to Home</Link>
            </p>
          </div>
        </div>
      </article>
    </Layout>
  );
}
