'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import type { Paper } from '@/lib/papers';
import { getCategoryLabel } from '@/lib/papers';
import { FileText, Calendar, Users, Download, Search } from 'lucide-react';

export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
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
    fetchPapers();
  }, []);

  // Get unique categories
  const allCategories = Array.from(
    new Set(papers.flatMap(paper => paper.categories))
  ).sort();

  // Filter papers by category and search query
  const filteredPapers = papers
    .filter(paper => {
      // Category filter
      if (selectedCategory !== 'all' && !paper.categories.includes(selectedCategory)) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          paper.title.toLowerCase().includes(query) ||
          paper.abstract.toLowerCase().includes(query) ||
          paper.aiExplanation.toLowerCase().includes(query) ||
          paper.authors.some(author => author.toLowerCase().includes(query))
        );
      }
      return true;
    });

  if (loading) {
    return (
      <Layout title="AI Research Papers">
        <div className="max-w-6xl mx-auto">
          <p className="text-xl">Loading papers...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="AI Research Papers - Latest AI Research from arXiv">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight tracking-tight text-gray-900 dark:text-white">
            AI Research Papers
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            Latest research papers from arXiv in Artificial Intelligence, Machine Learning, and related fields.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search papers by title, abstract, explanation, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-black dark:focus:border-white outline-none transition-colors"
            />
          </div>
        </header>

        {/* Category Filter */}
        {allCategories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide border-2 transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                    : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white'
                }`}
              >
                All ({papers.length})
              </button>
              {allCategories.slice(0, 8).map(category => {
                const count = papers.filter(p => p.categories.includes(category)).length;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide border-2 transition-colors ${
                      selectedCategory === category
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                        : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white'
                    }`}
                  >
                    {getCategoryLabel(category)} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Papers List */}
        {filteredPapers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No papers found in this category.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredPapers.map((paper) => (
              <article
                key={paper.slug}
                className="border-2 border-gray-300 dark:border-gray-700 p-6 hover:border-black dark:hover:border-white transition-colors bg-white dark:bg-gray-900"
              >
                <div className="mb-4">
                  <h2 className="text-2xl md:text-3xl font-black mb-3 leading-tight text-gray-900 dark:text-white">
                    <Link
                      href={`/papers/${paper.slug}`}
                      className="hover:underline"
                    >
                      {paper.title}
                    </Link>
                  </h2>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
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
                      <Users className="w-4 h-4" />
                      <span>{paper.authors.length} authors</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span className="font-mono text-xs">{paper.arxivId}</span>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {paper.categories.slice(0, 4).map((category, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-xs font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100"
                      >
                        {getCategoryLabel(category)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Explanation */}
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-black dark:border-white">
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                    📖 Simple Explanation
                  </p>
                  <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                    {paper.aiExplanation}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/papers/${paper.slug}`}
                    className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-semibold text-sm uppercase tracking-wide hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
                  >
                    Read More
                  </Link>
                  <a
                    href={paper.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border-2 border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide hover:border-black dark:hover:border-white transition-colors inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
