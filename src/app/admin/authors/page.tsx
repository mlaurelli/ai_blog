'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Author } from '@/lib/authors';
import AuthorAvatar from '@/components/AuthorAvatar';

export default function AuthorsManagement() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchAuthors();
  }, [router]);

  const fetchAuthors = async () => {
    try {
      const res = await fetch('/api/authors');
      const data = await res.json();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this author?')) return;

    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/authors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchAuthors();
      } else {
        alert('Error deleting author');
      }
    } catch (error) {
      alert('Error deleting author');
    }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Authors Management</h1>
              <p className="text-sm text-gray-600 italic mt-1">Manage blog authors and contributors</p>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 border-2 border-gray-400 hover:border-black hover:bg-gray-100 font-semibold text-sm uppercase tracking-wide"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">All Authors ({authors.length})</h2>
          <Link
            href="/admin/authors/new"
            className="bg-black text-white px-6 py-3 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors border-2 border-black"
          >
            + New Author
          </Link>
        </div>

        <div className="bg-white border-2 border-gray-400">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {authors.map((author) => (
              <div
                key={author.id}
                className="border-2 border-gray-400 hover:border-black transition-colors"
              >
                {/* Avatar */}
                <div className="h-48 border-b-2 border-gray-400">
                  <AuthorAvatar 
                    name={author.name}
                    avatar={author.avatar}
                    size="xl"
                    shape="square"
                    className="!w-full !h-full !border-0"
                  />
                </div>
                
                {/* Info */}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-1 truncate">{author.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{author.role}</p>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{author.bio}</p>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/authors/edit/${author.id}`}
                      className="flex-1 text-center px-4 py-2 bg-black text-white text-sm font-semibold uppercase tracking-wide hover:bg-gray-800"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/author/${author.id}`}
                      target="_blank"
                      className="flex-1 text-center px-4 py-2 border-2 border-gray-400 hover:border-black text-sm font-semibold uppercase tracking-wide"
                    >
                      View
                    </Link>
                  </div>
                  <button
                    onClick={() => handleDelete(author.id)}
                    className="w-full mt-2 px-4 py-2 border-2 border-red-400 text-red-600 hover:border-red-600 hover:bg-red-50 text-sm font-semibold uppercase tracking-wide"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {authors.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <div className="text-4xl mb-4">👤</div>
              <div className="text-lg font-semibold mb-2">No authors yet</div>
              <div className="text-sm">Create your first author to get started</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
