'use client';

import { useState } from 'react';

interface CoverImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function CoverImage({ src, alt, className = '', style }: CoverImageProps) {
  const [imageError, setImageError] = useState(false);
  
  if (imageError) {
    return (
      <div 
        className={`w-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 ${className}`}
        style={style || { height: '500px' }}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-6xl mb-4">📄</div>
          <div className="text-lg font-semibold">Image Not Available</div>
          <div className="text-sm mt-2">Cover image could not be loaded</div>
        </div>
      </div>
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Cover image not found: ${src}`);
        }
        setImageError(true);
      }}
    />
  );
}
