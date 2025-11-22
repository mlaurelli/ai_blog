'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GlossaryTerm } from '@/lib/glossary';

export default function AdminGlossary() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLang, setFilterLang] = useState<'all' | 'en' | 'it'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchTerms();
  }, [router]);

  const fetchTerms = async () => {
    try {
      const res = await fetch('/api/glossary');
      const data = await res.json();
      setTerms(data);
    } catch (error) {
      console.error('Error fetching terms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string, language: string) => {
    if (!confirm(`Are you sure you want to delete this term (${language})?`)) return;

    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/glossary', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ slug }),
      });

      if (res.ok) {
        alert('Term deleted successfully');
        fetchTerms();
      } else {
        const data = await res.json();
        alert(data.error || 'Error deleting term');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting term');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  // Get unique categories
  const categories = [...new Set(terms.map(t => t.category))].sort();

  // Filter terms
  const filteredTerms = terms.filter(term => {
    const langMatch = filterLang === 'all' || term.language === filterLang;
    const catMatch = filterCategory === 'all' || term.category === filterCategory;
    return langMatch && catMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Glossary Management</h1>
              <p className="text-sm text-gray-600 italic mt-1">AI Terminology Dictionary</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 border-2 border-gray-400 hover:border-black hover:bg-gray-100 font-semibold text-sm uppercase tracking-wide"
              >
                ← Back to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border-2 border-gray-400 hover:border-black hover:bg-gray-100 font-semibold text-sm uppercase tracking-wide"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/admin/glossary/new"
            className="bg-black text-white p-6 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors border-2 border-black text-center"
          >
            <div className="text-2xl mb-2">📚</div>
            <div>New Term</div>
          </Link>
          <Link
            href="/glossary"
            target="_blank"
            className="bg-white border-2 border-gray-400 p-6 font-bold uppercase tracking-wide hover:border-black hover:bg-gray-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">👁️</div>
            <div>View Glossary</div>
          </Link>
          <div className="bg-white border-2 border-gray-400 p-6 text-center">
            <div className="text-3xl font-bold text-gray-900">{terms.length}</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Total Terms</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2 block">
              Language
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterLang('all')}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide border-2 ${
                  filterLang === 'all'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterLang('en')}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide border-2 ${
                  filterLang === 'en'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setFilterLang('it')}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide border-2 ${
                  filterLang === 'it'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-green-600'
                }`}
              >
                IT
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2 block">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none font-semibold text-sm uppercase"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Terms ({filteredTerms.length})
          </h2>
        </div>

        {/* Terms Table */}
        <div className="bg-white border-2 border-gray-400">
          <table className="w-full">
            <thead className="border-b-2 border-gray-400 bg-gray-50">
              <tr>
                <th className="text-left p-4 font-bold uppercase tracking-wide text-sm">Term</th>
                <th className="text-left p-4 font-bold uppercase tracking-wide text-sm">Lang</th>
                <th className="text-left p-4 font-bold uppercase tracking-wide text-sm">Category</th>
                <th className="text-left p-4 font-bold uppercase tracking-wide text-sm">Pronunciation</th>
                <th className="text-right p-4 font-bold uppercase tracking-wide text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTerms.length > 0 ? (
                filteredTerms.map((term, index) => (
                  <tr 
                    key={`${term.slug}-${term.language}`} 
                    className={index !== filteredTerms.length - 1 ? 'border-b border-gray-300' : ''}
                  >
                    <td className="p-4">
                      <Link 
                        href={`/glossary/${term.slug}`} 
                        target="_blank"
                        className="font-semibold hover:underline"
                      >
                        {term.term}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {term.definition}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 text-xs font-bold uppercase ${
                        term.language === 'en' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {term.language}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-block bg-gray-900 text-white px-2 py-1 text-xs font-semibold uppercase">
                        {term.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 italic">
                      {term.pronunciation || '—'}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/glossary/edit/${term.slug}?lang=${term.language}`}
                        className="text-sm font-semibold text-blue-600 hover:underline mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(term.slug, term.language)}
                        className="text-sm font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No terms found. Create your first term!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
