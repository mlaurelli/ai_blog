'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImagePicker from '@/components/ImagePicker';

interface AuthorFormProps {
  initialData?: {
    id: string;
    name: string;
    bio: string;
    avatar: string;
    role: string;
    email?: string;
    website?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
    seo: {
      title: string;
      description: string;
      keywords: string[];
    };
  };
  mode: 'create' | 'edit';
}

export default function AuthorForm({ initialData, mode }: AuthorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    name: initialData?.name || '',
    bio: initialData?.bio || '',
    avatar: initialData?.avatar || '',
    role: initialData?.role || '',
    email: initialData?.email || '',
    website: initialData?.website || '',
    twitter: initialData?.twitter || '',
    linkedin: initialData?.linkedin || '',
    github: initialData?.github || '',
    seoTitle: initialData?.seo.title || '',
    seoDescription: initialData?.seo.description || '',
    seoKeywords: initialData?.seo.keywords.join(', ') || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateId = () => {
    const id = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, id }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('admin_token');
    
    const authorData = {
      id: formData.id,
      name: formData.name,
      bio: formData.bio,
      avatar: formData.avatar,
      role: formData.role,
      email: formData.email || undefined,
      website: formData.website || undefined,
      twitter: formData.twitter || undefined,
      linkedin: formData.linkedin || undefined,
      github: formData.github || undefined,
      seo: {
        title: formData.seoTitle,
        description: formData.seoDescription,
        keywords: formData.seoKeywords.split(',').map(kw => kw.trim()).filter(Boolean),
      },
    };

    try {
      const url = mode === 'create' ? '/api/authors' : `/api/authors/${formData.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(authorData),
      });

      if (res.ok) {
        setTimeout(() => {
          // Force browser to reload images by doing a hard navigation
          window.location.href = '/admin/authors';
        }, 100);
      } else {
        alert(`Error ${mode === 'create' ? 'creating' : 'updating'} author`);
      }
    } catch (error) {
      alert(`Error ${mode === 'create' ? 'creating' : 'updating'} author`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-400 p-8">
      {/* Basic Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-wide">Basic Information</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={mode === 'create' ? generateId : undefined}
            className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            ID *
          </label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none font-mono text-sm"
            disabled={mode === 'edit'}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {mode === 'create' ? 'Auto-generated from name, used in URLs' : 'Cannot be changed after creation'}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Role/Title *
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
            placeholder="e.g., AI Architect, Researcher, Professor"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Bio *
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Brief professional bio for author page</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Avatar Image *
          </label>
          <ImagePicker
            value={formData.avatar}
            onChange={(url) => setFormData(prev => ({ ...prev, avatar: url }))}
            title={formData.name}
            excerpt={formData.role}
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-wide">Social Links (Optional)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
              placeholder="author@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Twitter
            </label>
            <input
              type="text"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
              placeholder="username (without @)"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              LinkedIn
            </label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
              placeholder="username"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              GitHub
            </label>
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
              placeholder="username"
            />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-wide">SEO Settings *</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            SEO Title *
          </label>
          <input
            type="text"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
            placeholder="Author Name - Role/Title"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Shown in search results and browser tabs</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            SEO Description *
          </label>
          <textarea
            name="seoDescription"
            value={formData.seoDescription}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Brief description for search engines (150-160 chars)</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            SEO Keywords *
          </label>
          <input
            type="text"
            name="seoKeywords"
            value={formData.seoKeywords}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
            placeholder="AI Expert, Machine Learning, Deep Learning"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Comma-separated keywords</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-black text-white py-3 px-6 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:bg-gray-400 border-2 border-black"
        >
          {loading ? `${mode === 'create' ? 'Creating' : 'Saving'}...` : `${mode === 'create' ? 'Create' : 'Save'} Author`}
        </button>
        <Link
          href="/admin/authors"
          className="px-6 py-3 border-2 border-gray-400 hover:border-black hover:bg-gray-100 font-semibold uppercase tracking-wide text-center"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
