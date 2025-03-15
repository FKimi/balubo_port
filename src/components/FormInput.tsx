import React, { InputHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
}

export function FormInput({
  label,
  error,
  helpText,
  icon,
  id,
  className = '',
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-neutral-700"
      >
        {label}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          id={id}
          className={`
            block
            w-full
            h-12
            px-4
            rounded-lg
            border
            shadow-sm
            transition
            duration-200
            ease-in-out
            placeholder:text-neutral-400
            ${icon ? 'pl-10' : ''}
            ${error
              ? 'border-error-300 focus:border-error-500 focus:ring-error-500 bg-error-50'
              : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
            }
            ${className}
          `}
          {...props}
        />

        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-error-500" />
          </div>
        )}
      </div>
      
      {helpText && !error && (
        <p className="text-sm text-neutral-500">{helpText}</p>
      )}
      
      {error && (
        <p className="text-sm text-error-600 flex items-center">
          {error}
        </p>
      )}
    </div>
  );
}