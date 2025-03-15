import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4 bg-neutral-50 rounded-lg">
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
            {icon}
          </div>
        </div>
      )}
      
      <h3 className="text-lg font-medium text-neutral-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-neutral-600 mb-4 max-w-sm mx-auto">
          {description}
        </p>
      )}
      
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}