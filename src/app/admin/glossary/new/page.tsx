'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewGlossaryTerm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    language: 'en' as 'en' | 'it',
    term: '',
    category: '',
    pronunciation: '',
    definition: '',
    explanation: '',
    examples: ['', '', ''],
    relatedTerms: ['', '', ''],
    etymology: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleAIGenerate = async () => {
    if (!formData.term.trim()) {
      alert('Please enter a term first');
      return;
    }

    setGenerating(true);

    try {
      const res = await fetch('/api/ai/generate-glossary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          term: formData.term,
          language: formData.language,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormData({
          ...formData,
          slug: data.term.slug,
          category: data.term.category,
          pronunciation: data.term.pronunciation,
          definition: data.term.definition,
          explanation: data.term.explanation,
          examples: data.term.examples.length > 0 ? data.term.examples : ['', '', ''],
          relatedTerms: data.term.relatedTerms.length > 0 ? data.term.relatedTerms : ['', '', ''],
          etymology: data.term.etymology,
        });
        alert('Glossary term generated successfully! Review and save.');
      } else {
        alert(data.error || 'Error generating term');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating term');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const token = localStorage.getItem('admin_token');

    // Clean up arrays (remove empty entries)
    const cleanedExamples = formData.examples.filter(ex => ex.trim() !== '');
    const cleanedRelatedTerms = formData.relatedTerms.filter(rt => rt.trim() !== '');

    const termData = {
      ...formData,
      examples: cleanedExamples.length > 0 ? cleanedExamples : undefined,
      relatedTerms: cleanedRelatedTerms.length > 0 ? cleanedRelatedTerms : undefined,
      pronunciation: formData.pronunciation || undefined,
      etymology: formData.etymology || undefined,
    };

    try {
      const res = await fetch('/api/glossary', {
        method: 'POST',
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
        alert(`Error: ${error.error || 'Failed to create term'}`);
      }
    } catch (error) {
      alert('Error creating term');
    } finally {
      setSaving(false);
    }
  };

  const updateExample = (index: number, value: string) => {
    const newExamples = [...formData.examples];
    newExamples[index] = value;
    setFormData({ ...formData, examples: newExamples });
  };

  const updateRelatedTerm = (index: number, value: string) => {
    const newRelatedTerms = [...formData.relatedTerms];
    newRelatedTerms[index] = value;
    setFormData({ ...formData, relatedTerms: newRelatedTerms });
  };

  const addExample = () => {
    setFormData({ ...formData, examples: [...formData.examples, ''] });
  };

  const addRelatedTerm = () => {
    setFormData({ ...formData, relatedTerms: [...formData.relatedTerms, ''] });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b-4 border-black bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">New Glossary Term</h1>
              <p className="text-sm text-gray-600 italic mt-1">Add a new AI term to the dictionary</p>
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
        {/* AI Mode Toggle */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 p-6 mb-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">🤖 AI-Powered Glossary Generation</h2>
              <p className="text-sm text-gray-600">Let AI create a comprehensive glossary entry. Just enter the term and language.</p>
            </div>
            <button
              type="button"
              onClick={() => setAiMode(!aiMode)}
              className={`px-6 py-3 font-bold uppercase tracking-wide transition-all border-2 ${
                aiMode
                  ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'
                  : 'bg-white text-gray-700 border-gray-400 hover:border-purple-600'
              }`}
            >
              {aiMode ? '✓ AI Mode Active' : 'Enable AI Mode'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white border-2 border-gray-400 p-6">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-300 pb-2">Basic Information</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                Term <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                placeholder="Neural Network"
                className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none text-xl font-bold"
                style={{ fontFamily: 'Georgia, serif' }}
              />
              {aiMode && (
                <p className="text-sm text-purple-600 mt-2 font-semibold">💡 In AI Mode: Enter the term and language, then click "Generate with AI"</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Language <span className="text-red-600">*</span>
                </label>
                <select
                  required
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value as 'en' | 'it' })}
                  className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none"
                >
                  <option value="en">English (EN)</option>
                  <option value="it">Italian (IT)</option>
                </select>
              </div>

              {!aiMode && (
                <div>
                  <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                    Slug <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="neural-network"
                    className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">URL-friendly identifier</p>
                </div>
              )}
            </div>

            {aiMode && (
              <div className="mb-4 bg-purple-50 border-2 border-purple-200 p-6 rounded">
                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={generating || !formData.term.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 font-bold uppercase tracking-wide hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-purple-700"
                >
                  {generating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating Glossary Entry...
                    </span>
                  ) : (
                    '✨ Generate with AI'
                  )}
                </button>
              </div>
            )}

            {!aiMode && (

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
                  placeholder="Architecture"
                  className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Pronunciation
                </label>
                <input
                  type="text"
                  value={formData.pronunciation}
                  onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                  placeholder="/ˈnjʊərəl ˈnetwɜːrk/"
                  className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none italic"
                  style={{ fontFamily: 'Georgia, serif' }}
                />
              </div>
            </div>
            )}
          </div>

          {/* Success Message for AI */}
          {(aiMode && formData.definition) && (
            <div className="p-4 bg-green-50 border-2 border-green-300 rounded">
              <p className="text-green-800 font-semibold">✓ Glossary term generated! Review the content below and click "Create Term" when ready.</p>
            </div>
          )}

          {/* Definition */}
          <div className="bg-white border-2 border-gray-400 p-6">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-300 pb-2">Definition</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                Brief Definition (1-2 sentences) <span className="text-red-600">*</span>
              </label>
              <textarea
                required
                value={formData.definition}
                onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                rows={3}
                placeholder="A computational model inspired by biological neural networks..."
                className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none"
                style={{ fontFamily: 'Georgia, serif' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                Detailed Explanation (Markdown supported) <span className="text-red-600">*</span>
              </label>
              <textarea
                required
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                rows={15}
                placeholder="## Introduction&#10;&#10;Neural networks are...&#10;&#10;## How They Work&#10;&#10;..."
                className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Use Markdown: ## Headings, **bold**, *italic*, - lists</p>
            </div>
          </div>

          {/* Examples */}
          <div className="bg-white border-2 border-gray-400 p-6">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-300 pb-2">Examples</h2>
            
            {formData.examples.map((example, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Example {index + 1}
                </label>
                <textarea
                  value={example}
                  onChange={(e) => updateExample(index, e.target.value)}
                  rows={2}
                  placeholder="A CNN recognizing cats in photos by learning hierarchical features..."
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
            
            {formData.relatedTerms.map((term, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Related Term {index + 1} (slug)
                </label>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => updateRelatedTerm(index, e.target.value)}
                  placeholder="backpropagation"
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
            <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-300 pb-2">Etymology (Optional)</h2>
            
            <textarea
              value={formData.etymology}
              onChange={(e) => setFormData({ ...formData, etymology: e.target.value })}
              rows={3}
              placeholder="Coined in the 1940s, combining 'neural' (from Greek neuron) and 'network'..."
              className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none italic"
              style={{ fontFamily: 'Georgia, serif' }}
            />
          </div>

          {/* Hidden field for AI mode slug */}
          {aiMode && <input type="hidden" name="slug" value={formData.slug} />}

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
              disabled={saving || (aiMode && !formData.definition)}
              className="px-6 py-3 bg-black text-white font-semibold uppercase tracking-wide hover:bg-gray-800 disabled:bg-gray-400"
            >
              {saving ? 'Creating...' : 'Create Term'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
