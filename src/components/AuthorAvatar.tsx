'use client';

import { useState } from 'react';

interface AuthorAvatarProps {
  name: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  className?: string;
}

export default function AuthorAvatar({ 
  name, 
  avatar, 
  size = 'md',
  shape = 'circle',
  className = '' 
}: AuthorAvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  // Size classes
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-32 h-32 md:w-40 md:h-40 text-4xl md:text-5xl'
  };
  
  // Shape classes
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'border-4 border-black dark:border-white'
  };
  
  // Get initials
  const getInitials = () => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const hasValidAvatar = avatar && !imageError && (avatar.startsWith('http') || avatar.startsWith('/'));
  
  return (
    <div className={`${sizeClasses[size]} ${shapeClasses[shape]} overflow-hidden flex-shrink-0 ${className}`}>
      {hasValidAvatar ? (
        <img 
          src={avatar}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`Avatar not found for ${name}: ${avatar}`);
            }
            setImageError(true);
          }}
        />
      ) : (
        <div className={`w-full h-full ${
          shape === 'circle' 
            ? 'bg-black dark:bg-white' 
            : 'bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-800'
        } flex items-center justify-center font-black ${
          shape === 'circle'
            ? 'text-white dark:text-black'
            : 'text-white'
        }`}>
          {getInitials()}
        </div>
      )}
    </div>
  );
}
