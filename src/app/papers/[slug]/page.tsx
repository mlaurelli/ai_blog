'use client';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import Layout from '@/components/Layout';
import Link from 'next/link';
import type { Paper } from '@/lib/papers';
import { getCategoryLabel } from '@/lib/papers';
import { Calendar, Users, FileText, ExternalLink, Download, ArrowLeft } from 'lucide-react';

export default function PaperDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPaper() {
      try {
        const response = await fetch('/api/papers');
        if (response.ok) {
          const papers: Paper[] = await response.json();
          const foundPaper = papers.find(p => p.slug === slug);
          setPaper(foundPaper || null);
        }
      } catch (error) {
        console.error('Error fetching paper:', error);
        setPaper(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPaper();
  }, [slug]);

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="max-w-4xl mx-auto">
          <p className="text-xl">Loading paper...</p>
        </div>
      </Layout>
    );
  }

  if (!paper) {
    notFound();
  }

  return (
    <Layout title={`${paper.title} - AI Research Paper`}>
      <article className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/papers"
            className="text-xs uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white border-b-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white pb-1 inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Papers
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight text-gray-900 dark:text-white">
            {paper.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(paper.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span className="font-mono text-xs">{paper.arxivId}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {paper.categories.map((category, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-xs font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100"
              >
                {getCategoryLabel(category)}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            <a
              href={paper.arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-semibold text-sm uppercase tracking-wide hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View on arXiv
            </a>
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border-2 border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide hover:border-black dark:hover:border-white transition-colors inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          </div>
        </header>

        {/* AI Explanation */}
        <section className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 border-l-4 border-black dark:border-white">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
            📖 Simple Explanation
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-line">
              {paper.aiExplanation}
            </p>
          </div>
        </section>

        {/* Authors */}
        <section className="mb-8">
          <h2 className="text-2xl font-black mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6" />
            Authors
          </h2>
          <div className="flex flex-wrap gap-2">
            {paper.authors.map((author, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                {author}
              </span>
            ))}
          </div>
        </section>

        {/* Abstract */}
        <section className="mb-8">
          <h2 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">
            Abstract
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
              {paper.abstract}
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t-2 border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This paper was imported from{' '}
            <a
              href={paper.arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-black dark:hover:text-white"
            >
              arXiv.org
            </a>
            . The simple explanation was generated using AI to make the research more accessible.
          </p>
        </footer>
      </article>
    </Layout>
  );
}
