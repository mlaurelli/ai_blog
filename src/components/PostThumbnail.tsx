'use client';

import { useState } from 'react';

interface PostThumbnailProps {
  src: string;
  alt: string;
  className?: string;
}

export default function PostThumbnail({ src, alt, className = '' }: PostThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  
  if (imageError) {
    return (
      <div className={`bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-3xl">📄</div>
        </div>
      </div>
    );
  }
  
  return (
    <img 
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Thumbnail not found: ${src}`);
        }
        setImageError(true);
      }}
    />
  );
}
