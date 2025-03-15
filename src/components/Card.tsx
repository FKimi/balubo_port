import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({
  children,
  className = '',
  onClick,
  hoverable = false
}: CardProps) {
  return (
    <div
      className={`
        bg-white
        rounded-xl
        shadow-sm
        overflow-hidden
        transition-all
        duration-200
        ${hoverable ? 'hover:shadow-md hover:translate-y-[-2px]' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-4 border-b border-neutral-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-lg font-semibold text-neutral-900 ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-4 bg-neutral-50 border-t border-neutral-200 ${className}`}>
      {children}
    </div>
  );
}