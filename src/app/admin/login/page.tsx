'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('admin_token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white border-4 border-black p-8">
          <div className="text-center mb-8 pb-6 border-b-2 border-black">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-sm text-gray-600 italic">The Daily Chronicle CMS</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border-2 border-red-500 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-6 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:bg-gray-400 border-2 border-black"
            >
              {loading ? 'Logging in...' : 'Enter'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-300 text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-black underline">
              ← Back to site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
