import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
  removable = false,
  onRemove
}: BadgeProps) {
  const variants = {
    default: 'bg-neutral-100 text-neutral-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        font-medium
        rounded-full
        transition-colors
        duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${onClick ? 'cursor-pointer hover:bg-opacity-80' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1.5 hover:bg-neutral-200 rounded-full p-0.5"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}