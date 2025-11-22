'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Author } from '@/lib/authors';
import AuthorForm from '@/components/AuthorForm';

export default function EditAuthor() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState<Author | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchAuthor();
  }, [id, router]);

  const fetchAuthor = async () => {
    try {
      const res = await fetch(`/api/authors/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAuthor(data);
      } else {
        alert('Author not found');
        router.push('/admin/authors');
      }
    } catch (error) {
      alert('Error loading author');
      router.push('/admin/authors');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading author...</div>
      </div>
    );
  }

  if (!author) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b-4 border-black bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-900">Edit Author</h1>
          <p className="text-sm text-gray-600 italic mt-1">Update author information</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AuthorForm mode="edit" initialData={author} />
      </div>
    </div>
  );
}
