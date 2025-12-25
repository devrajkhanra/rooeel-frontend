import React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-[var(--color-text)] mb-2"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] opacity-70">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            `
                w-full px-3 py-2 rounded-md text-sm
                bg-[var(--color-surface)] text-[var(--color-text)]
                border border-[var(--color-border)]
                placeholder:text-[var(--color-text-tertiary)]
                transition-colors duration-200
                focus:outline-none focus:border-[var(--color-primary)]
                disabled:opacity-50 disabled:cursor-not-allowed
              `,
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            error && 'border-[var(--color-error)] focus:border-[var(--color-error)]',
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] opacity-70">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-[var(--color-error)]">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-[var(--color-text-tertiary)]">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
