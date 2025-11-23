'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/lib/posts';
import ImagePicker from '@/components/ImagePicker';
import RichTextEditor from '@/components/RichTextEditor';

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    slug: '',
    language: 'both' as 'en' | 'it' | 'both',
    title: '',
    excerpt: '',
    content: '',
    date: '',
    authorName: '',
    authorAvatar: '',
    coverImage: '',
    tags: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchPost();
  }, [slug, router]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${slug}`);
      if (res.ok) {
        const post: Post = await res.json();
        setFormData({
          slug: post.slug,
          language: post.language || 'both',
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          date: post.date,
          authorName: post.author.name,
          authorAvatar: post.author.avatar,
          coverImage: post.coverImage,
          tags: post.tags.join(', '),
        });
      } else {
        alert('Post not found');
        router.push('/admin/dashboard');
      }
    } catch (error) {
      alert('Error loading post');
      router.push('/admin/dashboard');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('admin_token');
    
    const postData = {
      slug: formData.slug,
      language: formData.language,
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      date: formData.date,
      author: {
        name: formData.authorName,
        avatar: formData.authorAvatar,
      },
      coverImage: formData.coverImage,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        // Add small delay to ensure cache invalidation completes
        setTimeout(() => {
          router.push('/admin/dashboard');
          router.refresh(); // Force router to refetch data
        }, 100);
      } else {
        alert('Error updating post');
      }
    } catch (error) {
      alert('Error updating post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b-4 border-black bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-900">Edit Post</h1>
          <p className="text-sm text-gray-600 italic mt-1">The Daily Chronicle CMS</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none font-mono text-sm bg-gray-100"
              required
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Cannot be changed after creation</p>
          </div>

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
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Content *
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              placeholder="Write your article content here..."
            />
            <p className="text-xs text-gray-500 mt-1">Full article content with rich text editing</p>
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
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white py-3 px-6 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:bg-gray-400 border-2 border-black"
            >
              {loading ? 'Saving...' : 'Save Changes'}
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
