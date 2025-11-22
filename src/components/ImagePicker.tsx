'use client';

import { useState, useEffect } from 'react';

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  title?: string;
  excerpt?: string;
}

interface MediaFile {
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
  type: string;
}

interface SearchImage {
  id: string;
  url: string;
  thumbnail: string;
  description: string;
  author: string;
}

interface UnsplashImage {
  id: string;
  url: string;
  thumbnail: string;
  description: string;
  author: string;
}

export default function ImagePicker({ value, onChange, title = '', excerpt = '' }: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'url' | 'library' | 'upload' | 'ai'>('library');
  const [urlInput, setUrlInput] = useState(value);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [libraryImages, setLibraryImages] = useState<string[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [searchImages, setSearchImages] = useState<UnsplashImage[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  
  // Initialize preview key on client side only
  useEffect(() => {
    setPreviewKey(Date.now());
  }, []);

  useEffect(() => {
    setUrlInput(value);
  }, [value]);

  const loadMediaLibrary = async () => {
    try {
      const res = await fetch('/api/media/list');
      const data = await res.json();
      if (data.success) {
        setMediaFiles(data.files);
      }
    } catch (error) {
      console.error('Failed to load media library:', error);
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
        selectImage(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleAiSearch = async () => {
    setSearching(true);
    try {
      const res = await fetch('/api/media/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          title,
          excerpt,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSearchImages(data.images);
      } else {
        alert('Search failed');
      }
    } catch (error) {
      alert('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab === 'library') {
      loadMediaLibrary();
    }
    if (tab === 'ai' && searchImages.length === 0) {
      // Auto-trigger AI search when opening the tab
      handleAiSearch();
    }
  };

  const selectImage = (url: string) => {
    onChange(url);
    setUrlInput(url);
    setPreviewKey(Date.now()); // Force preview refresh
    setIsOpen(false);
    setJustSelected(true);
    setTimeout(() => setJustSelected(false), 2000);
  };

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => {
            setUrlInput(e.target.value);
            onChange(e.target.value);
          }}
          className="flex-1 px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
          placeholder="https://example.com/image.jpg or /uploads/image.png"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-3 border-2 border-gray-400 hover:border-black hover:bg-gray-100 font-semibold"
        >
          {isOpen ? 'Close' : 'Browse'}
        </button>
      </div>

      {value && (
        <div className="mb-4 relative">
          <img 
            src={`${value}${value.includes('?') ? '&' : '?'}cb=${previewKey}`}
            alt="Cover preview" 
            className="w-full h-48 object-cover border-2 border-gray-300"
            key={`preview-${previewKey}`}
          />
          {justSelected && (
            <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 text-sm font-semibold rounded shadow-lg">
              ✓ Image Selected
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div className="border-2 border-gray-400 p-4 mb-4 bg-white">
          {/* Tabs */}
          <div className="flex gap-2 mb-4 border-b-2 border-gray-300">
            <button
              type="button"
              onClick={() => handleTabChange('url')}
              className={`px-4 py-2 font-semibold text-sm uppercase tracking-wide ${
                activeTab === 'url'
                  ? 'border-b-2 border-black -mb-0.5'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              URL
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('upload')}
              className={`px-4 py-2 font-semibold text-sm uppercase tracking-wide ${
                activeTab === 'upload'
                  ? 'border-b-2 border-black -mb-0.5'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('library')}
              className={`px-4 py-2 font-semibold text-sm uppercase tracking-wide ${
                activeTab === 'library'
                  ? 'border-b-2 border-black -mb-0.5'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Library
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('ai')}
              className={`px-4 py-2 font-semibold text-sm uppercase tracking-wide ${
                activeTab === 'ai'
                  ? 'border-b-2 border-black -mb-0.5'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              🤖 Find Image
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === 'url' && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Enter an image URL from any source (Unsplash, custom hosting, etc.)
                </p>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-400 focus:border-black focus:outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
                <button
                  type="button"
                  onClick={() => selectImage(urlInput)}
                  className="mt-4 w-full bg-black text-white py-3 px-6 font-bold uppercase tracking-wide hover:bg-gray-800"
                >
                  Use This URL
                </button>
              </div>
            )}

            {activeTab === 'upload' && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Upload an image or animated GIF (max 10MB)
                </p>
                <label className="block w-full">
                  <input
                    type="file"
                    accept="image/*,.gif"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-400 hover:border-black p-8 text-center cursor-pointer">
                    {uploading ? (
                      <div className="text-gray-600">Uploading...</div>
                    ) : (
                      <>
                        <div className="text-4xl mb-2">📤</div>
                        <div className="font-semibold">Click to upload</div>
                        <div className="text-sm text-gray-500 mt-1">
                          JPG, PNG, GIF, WebP
                        </div>
                      </>
                    )}
                  </div>
                </label>
              </div>
            )}

            {activeTab === 'library' && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Select from your uploaded images
                </p>
                {mediaFiles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No images uploaded yet. Use the Upload tab to add images.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                    {mediaFiles.map((file) => (
                      <div
                        key={file.filename}
                        onClick={() => selectImage(file.url)}
                        className="border-2 border-gray-300 hover:border-black cursor-pointer overflow-hidden transition-all"
                      >
                        <img
                          src={file.url}
                          alt={file.filename}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-2 bg-gray-50 text-xs truncate">
                          {file.filename}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ai' && (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    AI will analyze your post and find relevant images
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Optional: custom search query"
                      className="flex-1 px-4 py-2 border-2 border-gray-400 focus:border-black focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAiSearch}
                      disabled={searching}
                      className="px-6 py-2 bg-black text-white font-semibold uppercase tracking-wide hover:bg-gray-800 disabled:bg-gray-400"
                    >
                      {searching ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                </div>

                {searchImages.length === 0 && !searching && (
                  <div className="text-center py-8 text-gray-500">
                    Click Search to find the perfect image for your post
                  </div>
                )}

                {searching && (
                  <div className="text-center py-8 text-gray-600">
                    Finding the perfect image...
                  </div>
                )}

                {searchImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                    {searchImages.map((image) => (
                      <div
                        key={image.id}
                        onClick={() => selectImage(image.url)}
                        className="border-2 border-gray-300 hover:border-black cursor-pointer overflow-hidden transition-all"
                      >
                        <img
                          src={image.thumbnail}
                          alt={image.description}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-2 bg-gray-50">
                          <div className="text-xs truncate font-semibold">
                            {image.description}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            by {image.author}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-1">
        Use URL, upload your own, browse library, or let AI find the perfect image
      </p>
    </div>
  );
}
