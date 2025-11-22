'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MediaFile {
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
  type: string;
}

export default function MediaLibrary() {
  const router = useRouter();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    loadMediaLibrary();
  }, [router]);

  const loadMediaLibrary = async () => {
    try {
      const res = await fetch('/api/media/list');
      const data = await res.json();
      if (data.success) {
        setMediaFiles(data.files);
      }
    } catch (error) {
      console.error('Failed to load media library:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        loadMediaLibrary();
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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
              <h1 className="text-4xl font-bold text-gray-900">Media Library</h1>
              <p className="text-sm text-gray-600 italic mt-1">AI Blog - by Michele Laurelli</p>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 border-2 border-gray-400 hover:border-black hover:bg-gray-100 font-semibold text-sm uppercase tracking-wide"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="bg-white border-2 border-gray-400 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Upload New Media</h2>
          <label className="block w-full">
            <input
              type="file"
              accept="image/*,.gif"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
            <div className="border-2 border-dashed border-gray-400 hover:border-black p-8 text-center cursor-pointer transition-colors">
              {uploading ? (
                <div className="text-gray-600">Uploading...</div>
              ) : (
                <>
                  <div className="text-4xl mb-2">📤</div>
                  <div className="font-semibold">Click to upload image or GIF</div>
                  <div className="text-sm text-gray-500 mt-1">
                    JPG, PNG, GIF, WebP (max 10MB)
                  </div>
                </>
              )}
            </div>
          </label>
        </div>

        {/* Media Grid */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Uploaded Media ({mediaFiles.length})
          </h2>
        </div>

        {mediaFiles.length === 0 ? (
          <div className="bg-white border-2 border-gray-400 p-12 text-center text-gray-500">
            <div className="text-4xl mb-4">📁</div>
            <div className="text-lg font-semibold mb-2">No media uploaded yet</div>
            <div className="text-sm">Upload your first image using the form above</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mediaFiles.map((file) => (
              <div
                key={file.filename}
                className="bg-white border-2 border-gray-400 overflow-hidden hover:border-black transition-colors"
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-full object-cover"
                  />
                  {file.type === '.gif' && (
                    <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs font-bold">
                      GIF
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-sm font-mono text-gray-600 truncate mb-2">
                    {file.filename}
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    <div>{formatFileSize(file.size)}</div>
                    <div>{new Date(file.uploadedAt).toLocaleDateString()}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(file.url)}
                    className="w-full bg-black text-white py-2 px-4 text-sm font-semibold uppercase tracking-wide hover:bg-gray-800 transition-colors"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
