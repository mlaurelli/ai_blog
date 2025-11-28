'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Paper } from '@/lib/papers';
import { ArrowLeft, RefreshCw, FileText, Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminPapersPage() {
  const router = useRouter();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchPapers();
  }, [router]);

  async function fetchPapers() {
    try {
      const response = await fetch('/api/papers');
      if (response.ok) {
        const data = await response.json();
        setPapers(data);
      }
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleManualImport() {
    if (!confirm('Start manual paper import? This may take a few minutes.')) return;

    setImporting(true);
    setImportStatus(null);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/papers/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setImportStatus({
          message: data.message || 'Import completed successfully!',
          type: 'success',
        });
        // Refresh papers list
        await fetchPapers();
      } else {
        setImportStatus({
          message: data.error || data.message || 'Import failed',
          type: 'error',
        });
      }
    } catch (error: any) {
      console.error('Error during import:', error);
      setImportStatus({
        message: `Import failed: ${error.message}`,
        type: 'error',
      });
    } finally {
      setImporting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b-4 border-black bg-white mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/admin/dashboard"
            className="text-sm uppercase tracking-wide font-bold text-gray-600 hover:text-black mb-4 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">Manage Research Papers</h1>
          <p className="text-gray-600 mt-2">
            Papers are automatically imported daily at midnight. You can also trigger a manual import below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Manual Import Section */}
        <div className="mb-8 p-6 bg-white border-2 border-gray-300">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Manual Paper Import
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Click the button below to check for new papers from arXiv and import them immediately.
                This process may take 2-5 minutes depending on how many new papers are available.
              </p>
              
              {/* Status Message */}
              {importStatus && (
                <div className={`mb-4 p-3 border-2 flex items-start gap-2 ${
                  importStatus.type === 'success' 
                    ? 'bg-green-50 border-green-500 text-green-800' 
                    : importStatus.type === 'error'
                    ? 'bg-red-50 border-red-500 text-red-800'
                    : 'bg-blue-50 border-blue-500 text-blue-800'
                }`}>
                  {importStatus.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                  {importStatus.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1">
                    <p className="font-semibold">{importStatus.message}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleManualImport}
                disabled={importing}
                className="px-6 py-3 bg-black text-white font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {importing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Importing Papers...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Import New Papers
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Current Papers Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 bg-white border-2 border-gray-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Total Papers</p>
                <p className="text-3xl font-bold mt-2">{papers.length}</p>
              </div>
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="p-6 bg-white border-2 border-gray-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Latest Paper</p>
                <p className="text-lg font-bold mt-2">
                  {papers.length > 0 
                    ? new Date(papers[0].publishedDate).toLocaleDateString()
                    : 'N/A'
                  }
                </p>
              </div>
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="p-6 bg-white border-2 border-gray-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Categories</p>
                <p className="text-3xl font-bold mt-2">
                  {new Set(papers.flatMap(p => p.categories)).size}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Recent Papers List */}
        <div className="bg-white border-2 border-gray-300 mb-8">
          <div className="p-6 border-b-2 border-gray-300">
            <h2 className="text-xl font-bold">Recent Papers (Latest 10)</h2>
          </div>
          <div className="divide-y-2 divide-gray-300">
            {papers.slice(0, 10).map((paper) => (
              <div key={paper.slug} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{paper.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {paper.authors.slice(0, 3).join(', ')}
                      {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {paper.categories.slice(0, 4).map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-200 text-xs font-semibold uppercase"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Published: {new Date(paper.publishedDate).toLocaleDateString()} • 
                      arXiv ID: {paper.arxivId}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/papers/${paper.slug}`}
                      target="_blank"
                      className="px-4 py-2 border-2 border-gray-400 hover:border-black text-sm font-semibold text-center"
                    >
                      View
                    </Link>
                    <a
                      href={paper.arxivUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border-2 border-gray-400 hover:border-black text-sm font-semibold text-center"
                    >
                      arXiv
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cron Job Information */}
        <div className="bg-blue-50 border-2 border-blue-500 p-6 mb-8">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            Automatic Import Schedule
          </h3>
          <p className="text-sm text-gray-700 mb-2">
            Papers are automatically imported every day at <strong>00:00 UTC (midnight)</strong>.
          </p>
          <p className="text-sm text-gray-600">
            The system checks arXiv for new papers in AI categories and automatically adds them to the database.
            You can check the logs on the server at <code className="bg-blue-100 px-1">/home/ubuntu/michelelaurelli.it/logs/daily-import.log</code>
          </p>
        </div>
      </div>
    </div>
  );
}
