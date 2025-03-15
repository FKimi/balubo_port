import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Alert({
  type,
  title,
  children,
  action,
  dismissible = false,
  onDismiss
}: AlertProps) {
  const styles = {
    error: {
      bg: 'bg-error-50',
      border: 'border-error-200',
      text: 'text-error-800',
      icon: <XCircle className="h-5 w-5 text-error-500" />,
    },
    success: {
      bg: 'bg-success-50',
      border: 'border-success-200',
      text: 'text-success-800',
      icon: <CheckCircle className="h-5 w-5 text-success-500" />,
    },
    warning: {
      bg: 'bg-warning-50',
      border: 'border-warning-200',
      text: 'text-warning-800',
      icon: <AlertTriangle className="h-5 w-5 text-warning-500" />,
    },
    info: {
      bg: 'bg-primary-50',
      border: 'border-primary-200',
      text: 'text-primary-800',
      icon: <AlertCircle className="h-5 w-5 text-primary-500" />,
    },
  };

  return (
    <div className={`rounded-lg border p-4 ${styles[type].bg} ${styles[type].border}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {styles[type].icon}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${styles[type].text}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${styles[type].text} ${title ? 'mt-2' : ''}`}>
            {children}
          </div>
          {action && (
            <div className="mt-4">
              {action}
            </div>
          )}
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className={`inline-flex rounded-md p-1.5 ${styles[type].text} hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-600`}
            >
              <span className="sr-only">閉じる</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}