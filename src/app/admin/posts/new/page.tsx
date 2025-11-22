'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImagePicker from '@/components/ImagePicker';

export default function NewPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [imageSource, setImageSource] = useState<'ai' | 'unsplash'>('unsplash');
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    language: 'both' as 'en' | 'it' | 'both',
    title: '',
    excerpt: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    authorName: '',
    authorAvatar: '/avatar.jpg',
    coverImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
    tags: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleAIGenerate = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a title first');
      return;
    }

    setGenerating(true);

    try {
      const res = await fetch('/api/ai/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          imageSource,
          language: formData.language,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormData(prev => ({
          ...prev,
          slug: data.post.slug,
          content: data.post.content,
          excerpt: data.post.excerpt,
          coverImage: data.post.coverImage,
          tags: data.post.tags.join(', '),
          authorName: prev.authorName || 'Michele Laurelli',
          date: prev.date || new Date().toISOString().split('T')[0],
        }));
        alert('Article generated successfully! Review and publish.');
      } else {
        alert(data.error || 'Error generating article');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating article');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('admin_token');
    
    // Ensure slug exists (especially important for AI mode)
    const finalSlug = formData.slug || formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const postData = {
      slug: finalSlug,
      language: formData.language,
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      date: formData.date,
      author: {
        name: formData.authorName || 'Michele Laurelli',
        avatar: formData.authorAvatar,
      },
      coverImage: formData.coverImage,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        alert('Error creating post');
      }
    } catch (error) {
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b-4 border-black bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-sm text-gray-600 italic mt-1">The Daily Chronicle CMS</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Mode Toggle */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 p-6 mb-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">🤖 AI-Powered Generation</h2>
              <p className="text-sm text-gray-600">Let AI write your article based on the title. Just enter a title and choose image source.</p>
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

        <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-400 p-8">
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={generateSlug}
              className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
              required
            />
            {aiMode && (
              <p className="text-sm text-purple-600 mt-2 font-semibold">💡 In AI Mode: Enter your title, choose image source, then click "Generate with AI"</p>
            )}
          </div>

          {!aiMode && (
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none font-mono text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-1">URL-friendly version (auto-generated from title)</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Language *
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value as 'en' | 'it' | 'both' }))}
              className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
              required
            >
              <option value="both">Both English and Italian (Bilingue)</option>
              <option value="en">English Only (Solo Inglese)</option>
              <option value="it">Italian Only (Solo Italiano)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select "Both" for bilingual posts, or choose a specific language for single-language posts
            </p>
          </div>

          {aiMode && (
            <div className="mb-6 bg-purple-50 border-2 border-purple-200 p-6 rounded">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                🖼️ Image Source *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setImageSource('unsplash')}
                  className={`p-4 border-2 rounded transition-all ${
                    imageSource === 'unsplash'
                      ? 'border-purple-600 bg-purple-100'
                      : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  <div className="text-2xl mb-2">📸</div>
                  <div className="font-bold">Unsplash</div>
                  <div className="text-xs text-gray-600 mt-1">AI finds relevant photo</div>
                </button>
                <button
                  type="button"
                  onClick={() => setImageSource('ai')}
                  className={`p-4 border-2 rounded transition-all ${
                    imageSource === 'ai'
                      ? 'border-purple-600 bg-purple-100'
                      : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="font-bold">DALL-E 3</div>
                  <div className="text-xs text-gray-600 mt-1">AI generates image</div>
                </button>
              </div>
              
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={generating || !formData.title.trim()}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 font-bold uppercase tracking-wide hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-purple-700"
              >
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating Article...
                  </span>
                ) : (
                  '✨ Generate with AI'
                )}
              </button>
            </div>
          )}

          {!aiMode && (
            <>
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Excerpt *
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Brief summary shown in post cards</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={15}
              className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none font-mono text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Full article content (supports Markdown-style formatting)</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Author Name *
              </label>
              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Cover Image *
            </label>
            <ImagePicker
              value={formData.coverImage}
              onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
              title={formData.title}
              excerpt={formData.excerpt}
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Tags *
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
              placeholder="JavaScript, Tutorial, Web Development"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated list of tags</p>
          </div>
            </>
          )}

          {(aiMode && formData.content) && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded">
              <p className="text-green-800 font-semibold">✓ Article generated! Review the content below and click "Create Post" when ready.</p>
            </div>
          )}

          {aiMode && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Generated Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
                  placeholder="Excerpt will appear here after AI generation..."
                />
                <p className="text-xs text-gray-500 mt-1">Short, engaging summary to encourage clicks</p>
              </div>

              {formData.coverImage && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Generated Cover Image
                  </label>
                  <div className="border-2 border-gray-400 p-4 bg-white">
                    <img 
                      src={formData.coverImage} 
                      alt="Generated cover" 
                      className="w-full h-64 object-cover rounded"
                    />
                    <p className="text-xs text-gray-500 mt-2">✓ Image selected from {imageSource === 'ai' ? 'DALL-E 3' : 'Unsplash'}</p>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Generated Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
                  placeholder="Tags will appear here after AI generation..."
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated list of tags</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Generated Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={15}
                  className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none font-mono text-sm"
                  placeholder="Content will appear here after AI generation..."
                />
                <p className="text-xs text-gray-500 mt-1">Full article content (editable)</p>
              </div>

              {/* Hidden fields for AI mode to satisfy form requirements */}
              <input type="hidden" name="slug" value={formData.slug} />
              <input type="hidden" name="date" value={formData.date} />
              <input type="hidden" name="authorName" value={formData.authorName || 'Michele Laurelli'} />
            </>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || (aiMode && !formData.content)}
              className="flex-1 bg-black text-white py-3 px-6 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:bg-gray-400 border-2 border-black"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <Link
              href="/admin/dashboard"
              className="px-6 py-3 border-2 border-gray-400 hover:border-black hover:bg-gray-100 font-semibold uppercase tracking-wide text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
