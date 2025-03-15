import React from 'react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({
  src,
  alt = '',
  size = 'md',
  className = ''
}: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  if (!src) {
    return (
      <div
        className={`
          ${sizes[size]}
          bg-neutral-100
          rounded-full
          flex
          items-center
          justify-center
          text-neutral-600
          font-medium
          ${className}
        `}
      >
        {alt ? alt.charAt(0).toUpperCase() : 'U'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`
        ${sizes[size]}
        rounded-full
        object-cover
        ${className}
      `}
    />
  );
}