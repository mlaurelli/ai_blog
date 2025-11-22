'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthorForm from '@/components/AuthorForm';

export default function NewAuthor() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b-4 border-black bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-900">Create New Author</h1>
          <p className="text-sm text-gray-600 italic mt-1">Add a new blog author or contributor</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AuthorForm mode="create" />
      </div>
    </div>
  );
}
