'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { PressItem } from '@/lib/press';
import { ExternalLink, Trash2, Edit, Plus, Loader2, ArrowLeft } from 'lucide-react';

export default function AdminPressPage() {
  const router = useRouter();
  const [pressItems, setPressItems] = useState<PressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingUrl, setAddingUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [editingItem, setEditingItem] = useState<PressItem | null>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchPressItems();
  }, [router]);

  async function fetchPressItems() {
    try {
      const response = await fetch('/api/press');
      if (response.ok) {
        const data = await response.json();
        setPressItems(data);
      }
    } catch (error) {
      console.error('Error fetching press items:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!addingUrl.trim()) return;

    setIsExtracting(true);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/press', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ url: addingUrl }),
      });

      if (response.ok) {
        setAddingUrl('');
        await fetchPressItems();
        alert('Press item added successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to add press item'}`);
      }
    } catch (error) {
      console.error('Error adding press item:', error);
      alert('Failed to add press item');
    } finally {
      setIsExtracting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this press item?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/press', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await fetchPressItems();
        alert('Press item deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting press item:', error);
      alert('Failed to delete press item');
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/press', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editingItem),
      });

      if (response.ok) {
        setEditingItem(null);
        await fetchPressItems();
        alert('Press item updated successfully!');
      }
    } catch (error) {
      console.error('Error updating press item:', error);
      alert('Failed to update press item');
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
          <h1 className="text-4xl font-bold text-gray-900 mt-4">Manage Press Coverage</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Add New URL Form */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Press Coverage
          </h2>
          <form onSubmit={handleAddUrl} className="flex gap-3">
            <input
              type="url"
              value={addingUrl}
              onChange={(e) => setAddingUrl(e.target.value)}
              placeholder="Paste article URL here..."
              className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-black dark:focus:border-white outline-none"
              disabled={isExtracting}
              required
            />
            <button
              type="submit"
              disabled={isExtracting}
              className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add URL
                </>
              )}
            </button>
          </form>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            The system will automatically extract title, description, image, and date from the URL.
          </p>
        </div>

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-300 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Edit Press Item</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Image URL</label>
                  <input
                    type="url"
                    value={editingItem.image}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Published Date</label>
                  <input
                    type="date"
                    value={editingItem.publishedDate.split('T')[0]}
                    onChange={(e) => setEditingItem({ ...editingItem, publishedDate: new Date(e.target.value).toISOString() })}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-semibold"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-6 py-2 border-2 border-gray-300 dark:border-gray-700 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Press Items List */}
        {pressItems.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            <p>No press coverage added yet. Add a URL above to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pressItems.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700"
              >
                <div className="flex gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-32 h-24 object-cover border-2 border-gray-300 dark:border-gray-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {item.siteName} • {new Date(item.publishedDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {item.description}
                        </p>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          View article <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 border-2 border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 border-2 border-red-300 dark:border-red-700 hover:border-red-600 dark:hover:border-red-500 text-red-600 dark:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
