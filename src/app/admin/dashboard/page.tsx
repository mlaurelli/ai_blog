'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/lib/posts';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchPosts();
  }, [router]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/posts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ slug }),
      });

      if (res.ok) {
        alert('Post deleted successfully');
        fetchPosts();
      } else {
        const data = await res.json();
        alert(data.error || 'Error deleting post');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting post');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
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
              <h1 className="text-4xl font-bold text-gray-900">CMS Dashboard</h1>
              <p className="text-sm text-gray-600 italic mt-1">AI Blog - by Michele Laurelli</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border-2 border-gray-400 hover:border-black hover:bg-gray-100 font-semibold text-sm uppercase tracking-wide"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Link
            href="/admin/posts/new"
            className="bg-black text-white p-6 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors border-2 border-black text-center"
          >
            <div className="text-2xl mb-2">📝</div>
            <div>New Post</div>
          </Link>
          <Link
            href="/admin/glossary"
            className="bg-white border-2 border-gray-400 p-6 font-bold uppercase tracking-wide hover:border-black hover:bg-gray-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📚</div>
            <div>Glossary</div>
          </Link>
          <Link
            href="/admin/authors"
            className="bg-white border-2 border-gray-400 p-6 font-bold uppercase tracking-wide hover:border-black hover:bg-gray-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">👤</div>
            <div>Authors</div>
          </Link>
          <Link
            href="/admin/media"
            className="bg-white border-2 border-gray-400 p-6 font-bold uppercase tracking-wide hover:border-black hover:bg-gray-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🖼️</div>
            <div>Media Library</div>
          </Link>
          <Link
            href="/admin/seo"
            className="bg-white border-2 border-gray-400 p-6 font-bold uppercase tracking-wide hover:border-black hover:bg-gray-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🔍</div>
            <div>SEO Management</div>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="bg-white border-2 border-gray-400 p-6 font-bold uppercase tracking-wide hover:border-black hover:bg-gray-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">👁️</div>
            <div>View Site</div>
          </Link>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">All Posts ({posts.length})</h2>
        </div>

        <div className="bg-white border-2 border-gray-400">
          <table className="w-full">
            <thead className="border-b-2 border-gray-400 bg-gray-50">
              <tr>
                <th className="text-left p-4 font-bold uppercase tracking-wide text-sm">Title</th>
                <th className="text-left p-4 font-bold uppercase tracking-wide text-sm">Lang</th>
                <th className="text-left p-4 font-bold uppercase tracking-wide text-sm">Date</th>
                <th className="text-left p-4 font-bold uppercase tracking-wide text-sm">Author</th>
                <th className="text-left p-4 font-bold uppercase tracking-wide text-sm">Tags</th>
                <th className="text-right p-4 font-bold uppercase tracking-wide text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => (
                <tr key={`${post.slug}-${post.language}`} className={index !== posts.length - 1 ? 'border-b border-gray-300' : ''}>
                  <td className="p-4">
                    <Link href={`/blog/${post.slug}`} className="font-semibold hover:underline">
                      {post.title}
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-1 text-xs font-bold uppercase ${
                      post.language === 'en' ? 'bg-blue-100 text-blue-800' : 
                      post.language === 'it' ? 'bg-green-100 text-green-800' : 
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {post.language}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(post.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm text-gray-600">{post.author.name}</td>
                  <td className="p-4 text-sm">
                    {post.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="inline-block bg-gray-200 px-2 py-1 text-xs mr-1">
                        {tag}
                      </span>
                    ))}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/posts/edit/${post.slug}`}
                      className="text-sm font-semibold text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className="text-sm font-semibold text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
