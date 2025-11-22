import Link from 'next/link';
import Layout from '@/components/Layout';

export default function NotFound() {
  return (
    <Layout title="404 - Page Not Found">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 border-4 border-black">
        <div className="border-b-2 border-black pb-6 mb-6">
          <h1 className="text-8xl font-bold text-gray-900">404</h1>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-700 mb-8 italic">
          The article you are looking for appears to have been moved or no longer exists.
        </p>
        <div className="border-t-2 border-black pt-6">
          <Link
            href="/"
            className="inline-block border-2 border-black px-8 py-3 text-sm font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
          >
            Return to Front Page
          </Link>
        </div>
      </div>
    </Layout>
  );
}
