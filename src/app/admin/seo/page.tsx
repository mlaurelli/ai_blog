'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default function SEOManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'tags' | 'categories' | 'meta'>('tags');
  
  // SEO Meta Settings
  const [metaSettings, setMetaSettings] = useState({
    siteName: 'AI Blog - by Michele Laurelli',
    siteDescription: 'Artificial intelligence treated with scientific integrity, engineering precision, and human depth. Insights from an AI architect who builds systems that matter.',
    siteUrl: 'https://michelelaurelli.it',
    defaultOgImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
    twitterHandle: '@MicheleLaurelli',
  });

  // Tags
  const [tags, setTags] = useState<{ name: string; count: number }[]>([]);
  const [newTag, setNewTag] = useState('');

  // Categories
  const [categories, setCategories] = useState([
    { id: '1', name: 'AI Architecture', slug: 'ai-architecture', description: 'Advanced models, training paradigms, optimization strategies, and the engineering of neural systems from the ground up.', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop' },
    { id: '2', name: 'Applied AI', slug: 'applied-ai', description: 'Real-world AI deployments in fusion energy, industrial automation, healthcare, and enterprise systems that demand absolute control.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop' },
    { id: '3', name: 'Private AI', slug: 'private-ai', description: 'On-premise AI infrastructure, edge deployment, and systems designed for organizations that cannot surrender control to cloud providers.', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop' },
    { id: '4', name: 'AI Philosophy', slug: 'ai-philosophy', description: 'Intelligence, creativity, agency, limits, and the human dimensions of artificial intelligence explored without hype.', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop' },
  ]);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '', image: '' });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    loadTags();
  }, [router]);

  const loadTags = () => {
    // Extract all unique tags from posts
    const posts = getAllPosts();
    const tagMap = new Map<string, number>();
    
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    const tagArray = Array.from(tagMap.entries()).map(([name, count]) => ({ name, count }));
    tagArray.sort((a, b) => b.count - a.count);
    setTags(tagArray);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.slug) {
      setCategories([...categories, { 
        id: Date.now().toString(), 
        ...newCategory 
      }]);
      setNewCategory({ name: '', slug: '', description: '', image: '' });
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const handleSaveMetaSettings = () => {
    // In a real implementation, this would save to a database or config file
    alert('SEO settings saved successfully!');
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">SEO Management</h1>
              <p className="text-sm text-gray-600 italic mt-1">AI Blog - by Michele Laurelli</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 border-2 border-gray-400 hover:border-black hover:bg-gray-100 font-semibold text-sm uppercase tracking-wide"
              >
                ← Dashboard
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
        {/* Tab Navigation */}
        <div className="mb-6 border-b-2 border-gray-300">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('tags')}
              className={`px-6 py-3 font-bold uppercase tracking-wide text-sm border-2 border-b-0 transition-colors ${
                activeTab === 'tags' 
                  ? 'bg-white border-gray-400 border-b-white -mb-0.5' 
                  : 'bg-gray-100 border-transparent hover:bg-gray-200'
              }`}
            >
              Tags
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-3 font-bold uppercase tracking-wide text-sm border-2 border-b-0 transition-colors ${
                activeTab === 'categories' 
                  ? 'bg-white border-gray-400 border-b-white -mb-0.5' 
                  : 'bg-gray-100 border-transparent hover:bg-gray-200'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('meta')}
              className={`px-6 py-3 font-bold uppercase tracking-wide text-sm border-2 border-b-0 transition-colors ${
                activeTab === 'meta' 
                  ? 'bg-white border-gray-400 border-b-white -mb-0.5' 
                  : 'bg-gray-100 border-transparent hover:bg-gray-200'
              }`}
            >
              Meta Settings
            </button>
          </div>
        </div>

        {/* Tags Tab */}
        {activeTab === 'tags' && (
          <div className="bg-white border-2 border-gray-400 p-8">
            <h2 className="text-2xl font-bold mb-4">Tag Management</h2>
            <p className="text-gray-600 mb-6">Manage tags used across your blog posts. Tags are automatically extracted from posts.</p>
            
            <div className="mb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {tags.map((tag, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between bg-gray-100 border border-gray-300 px-4 py-2"
                  >
                    <span className="font-semibold text-sm">{tag.name}</span>
                    <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                      {tag.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-gray-300 pt-6">
              <h3 className="font-bold mb-2 uppercase tracking-wide text-sm">Tag Statistics</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 border border-gray-300 p-4">
                  <div className="text-3xl font-bold">{tags.length}</div>
                  <div className="text-sm text-gray-600">Total Tags</div>
                </div>
                <div className="bg-gray-50 border border-gray-300 p-4">
                  <div className="text-3xl font-bold">
                    {tags.length > 0 ? Math.max(...tags.map(t => t.count)) : 0}
                  </div>
                  <div className="text-sm text-gray-600">Most Used</div>
                </div>
                <div className="bg-gray-50 border border-gray-300 p-4">
                  <div className="text-3xl font-bold">
                    {tags.length > 0 ? Math.round(tags.reduce((acc, t) => acc + t.count, 0) / tags.length) : 0}
                  </div>
                  <div className="text-sm text-gray-600">Avg per Tag</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="bg-white border-2 border-gray-400 p-8">
            <h2 className="text-2xl font-bold mb-4">Category Management</h2>
            <p className="text-gray-600 mb-6">Organize your content with categories for better navigation and SEO.</p>
            
            {/* Add New Category */}
            <div className="mb-8 bg-gray-50 border-2 border-gray-300 p-6">
              <h3 className="font-bold mb-4 uppercase tracking-wide text-sm">Add New Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Name *</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setNewCategory({ 
                        ...newCategory, 
                        name,
                        slug: generateSlug(name)
                      });
                    }}
                    className="w-full px-3 py-2 border-2 border-gray-400 focus:border-black focus:outline-none"
                    placeholder="AI & Machine Learning"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Slug *</label>
                  <input
                    type="text"
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-400 focus:border-black focus:outline-none font-mono text-sm"
                    placeholder="ai-ml"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Image URL *</label>
                  <input
                    type="url"
                    value={newCategory.image}
                    onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-400 focus:border-black focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-400 focus:border-black focus:outline-none"
                  rows={2}
                  placeholder="Brief description of this category..."
                />
              </div>
              {newCategory.image && (
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Image Preview</label>
                  <div className="border-2 border-gray-400 overflow-hidden" style={{ maxHeight: '200px' }}>
                    <img src={newCategory.image} alt="Preview" className="w-full h-auto object-cover" />
                  </div>
                </div>
              )}
              <button
                onClick={handleAddCategory}
                className="w-full bg-black text-white px-4 py-2 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
              >
                + Add Category
              </button>
            </div>

            {/* Categories List */}
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="border-2 border-gray-300 overflow-hidden hover:border-gray-400 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category Image */}
                    <div className="h-48 md:h-auto overflow-hidden bg-gray-200">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Category Info */}
                    <div className="md:col-span-2 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{category.name}</h3>
                          <p className="text-xs text-gray-600 font-mono bg-gray-100 inline-block px-2 py-1 mt-1">
                            /{category.slug}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingCategory(editingCategory === category.id ? null : category.id)}
                            className="text-xs font-semibold text-blue-600 hover:underline uppercase"
                          >
                            {editingCategory === category.id ? 'Cancel' : 'Edit'}
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-xs font-semibold text-red-600 hover:underline uppercase"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{category.description}</p>
                      <p className="text-xs text-gray-500 truncate">
                        <span className="font-semibold">Image:</span> {category.image}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meta Settings Tab */}
        {activeTab === 'meta' && (
          <div className="bg-white border-2 border-gray-400 p-8">
            <h2 className="text-2xl font-bold mb-4">SEO Meta Settings</h2>
            <p className="text-gray-600 mb-6">Configure site-wide SEO settings and default meta tags.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Site Name *
                </label>
                <input
                  type="text"
                  value={metaSettings.siteName}
                  onChange={(e) => setMetaSettings({ ...metaSettings, siteName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Site Description *
                </label>
                <textarea
                  value={metaSettings.siteDescription}
                  onChange={(e) => setMetaSettings({ ...metaSettings, siteDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Used as default meta description (150-160 characters recommended)</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Site URL *
                </label>
                <input
                  type="url"
                  value={metaSettings.siteUrl}
                  onChange={(e) => setMetaSettings({ ...metaSettings, siteUrl: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
                  placeholder="https://yourdomain.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Default OG Image URL
                </label>
                <input
                  type="url"
                  value={metaSettings.defaultOgImage}
                  onChange={(e) => setMetaSettings({ ...metaSettings, defaultOgImage: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
                  placeholder="https://example.com/og-image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended size: 1200x630px</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Twitter Handle
                </label>
                <input
                  type="text"
                  value={metaSettings.twitterHandle}
                  onChange={(e) => setMetaSettings({ ...metaSettings, twitterHandle: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
                  placeholder="@yourusername"
                />
              </div>

              <div className="border-t-2 border-gray-300 pt-6">
                <h3 className="font-bold mb-4 uppercase tracking-wide text-sm">Preview</h3>
                <div className="bg-gray-50 border border-gray-300 p-4">
                  <div className="mb-2">
                    <div className="text-blue-600 text-sm">{metaSettings.siteUrl}</div>
                    <div className="text-lg font-semibold text-gray-900">{metaSettings.siteName}</div>
                    <div className="text-sm text-gray-600">{metaSettings.siteDescription}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveMetaSettings}
                className="w-full bg-black text-white py-3 px-6 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors border-2 border-black"
              >
                Save SEO Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
