'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GlossaryTerm } from '@/lib/glossary';

export default function EditGlossaryTerm({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = (searchParams.get('lang') || 'en') as 'en' | 'it';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<GlossaryTerm>>({
    slug: '',
    language: 'en',
    term: '',
    category: '',
    pronunciation: '',
    definition: '',
    explanation: '',
    examples: [],
    relatedTerms: [],
    etymology: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchTerm();
  }, [resolvedParams.slug, lang]);

  const fetchTerm = async () => {
    try {
      const res = await fetch(`/api/glossary/${resolvedParams.slug}?lang=${lang}`);
      if (res.ok) {
        const term = await res.json();
        setFormData({
          ...term,
          examples: term.examples || ['', '', ''],
          relatedTerms: term.relatedTerms || ['', '', ''],
        });
      } else {
        alert('Term not found');
        router.push('/admin/glossary');
      }
    } catch (error) {
      console.error('Error fetching term:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const token = localStorage.getItem('admin_token');

    // Clean up arrays
    const cleanedExamples = (formData.examples || []).filter(ex => ex.trim() !== '');
    const cleanedRelatedTerms = (formData.relatedTerms || []).filter(rt => rt.trim() !== '');

    const termData = {
      ...formData,
      examples: cleanedExamples.length > 0 ? cleanedExamples : undefined,
      relatedTerms: cleanedRelatedTerms.length > 0 ? cleanedRelatedTerms : undefined,
      pronunciation: formData.pronunciation || undefined,
      etymology: formData.etymology || undefined,
    };

    try {
      const res = await fetch(`/api/glossary/${resolvedParams.slug}?lang=${lang}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(termData),
      });

      if (res.ok) {
        router.push('/admin/glossary');
      } else {
        const error = await res.json();
        alert(`Error: ${error.error || 'Failed to update term'}`);
      }
    } catch (error) {
      alert('Error updating term');
    } finally {
      setSaving(false);
    }
  };

  const updateExample = (index: number, value: string) => {
    const newExamples = [...(formData.examples || [])];
    newExamples[index] = value;
    setFormData({ ...formData, examples: newExamples });
  };

  const updateRelatedTerm = (index: number, value: string) => {
    const newRelatedTerms = [...(formData.relatedTerms || [])];
    newRelatedTerms[index] = value;
    setFormData({ ...formData, relatedTerms: newRelatedTerms });
  };

  const addExample = () => {
    setFormData({ ...formData, examples: [...(formData.examples || []), ''] });
  };

  const addRelatedTerm = () => {
    setFormData({ ...formData, relatedTerms: [...(formData.relatedTerms || []), ''] });
  };

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Edit Term</h1>
              <p className="text-sm text-gray-600 italic mt-1">
                {formData.term} ({lang.toUpperCase()})
              </p>
            </div>
            <Link
              href="/admin/glossary"
              className="px-4 py-2 border-2 border-gray-400 hover:border-black hover:bg-gray-100 font-semibold text-sm uppercase tracking-wide"
            >
              ← Cancel
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white border-2 border-gray-400 p-6">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-300 pb-2">Basic Information</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Slug
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.slug}
                  className="w-full px-4 py-2 border-2 border-gray-300 bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Language
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.language?.toUpperCase()}
                  className="w-full px-4 py-2 border-2 border-gray-300 bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                Term <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none text-xl font-bold"
                style={{ fontFamily: 'Georgia, serif' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Category <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Pronunciation
                </label>
                <input
                  type="text"
                  value={formData.pronunciation || ''}
                  onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none italic"
                  style={{ fontFamily: 'Georgia, serif' }}
                />
              </div>
            </div>
          </div>

          {/* Definition */}
          <div className="bg-white border-2 border-gray-400 p-6">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-300 pb-2">Definition</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                Brief Definition <span className="text-red-600">*</span>
              </label>
              <textarea
                required
                value={formData.definition}
                onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none"
                style={{ fontFamily: 'Georgia, serif' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                Detailed Explanation <span className="text-red-600">*</span>
              </label>
              <textarea
                required
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                rows={15}
                className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none font-mono text-sm"
              />
            </div>
          </div>

          {/* Examples */}
          <div className="bg-white border-2 border-gray-400 p-6">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-300 pb-2">Examples</h2>
            
            {(formData.examples || []).map((example, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Example {index + 1}
                </label>
                <textarea
                  value={example}
                  onChange={(e) => updateExample(index, e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none"
                  style={{ fontFamily: 'Georgia, serif' }}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addExample}
              className="px-4 py-2 border-2 border-gray-400 hover:border-black hover:bg-gray-100 font-semibold text-sm uppercase tracking-wide"
            >
              + Add Example
            </button>
          </div>

          {/* Related Terms */}
          <div className="bg-white border-2 border-gray-400 p-6">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-300 pb-2">Related Terms</h2>
            
            {(formData.relatedTerms || []).map((term, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Related Term {index + 1} (slug)
                </label>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => updateRelatedTerm(index, e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addRelatedTerm}
              className="px-4 py-2 border-2 border-gray-400 hover:border-black hover:bg-gray-100 font-semibold text-sm uppercase tracking-wide"
            >
              + Add Related Term
            </button>
          </div>

          {/* Etymology */}
          <div className="bg-white border-2 border-gray-400 p-6">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-300 pb-2">Etymology</h2>
            
            <textarea
              value={formData.etymology || ''}
              onChange={(e) => setFormData({ ...formData, etymology: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none italic"
              style={{ fontFamily: 'Georgia, serif' }}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin/glossary"
              className="px-6 py-3 border-2 border-gray-400 hover:border-black hover:bg-gray-100 font-semibold uppercase tracking-wide"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-black text-white font-semibold uppercase tracking-wide hover:bg-gray-800 disabled:bg-gray-400"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
