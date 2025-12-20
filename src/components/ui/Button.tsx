import React from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium rounded-lg
      transition-all duration-200
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    `;

        const variants = {
            primary: `
        bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]
        text-white shadow-md hover:shadow-lg hover:shadow-[var(--color-primary)]/20
        focus-visible:ring-[var(--color-primary)]
      `,
            secondary: `
        bg-[var(--color-surface)] text-[var(--color-text)]
        border border-[var(--color-border)]
        hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-light)]
        focus-visible:ring-[var(--color-border-light)]
      `,
            outline: `
        bg-transparent text-[var(--color-primary)]
        border border-[var(--color-primary)]
        hover:bg-[var(--color-primary)]/10
        focus-visible:ring-[var(--color-primary)]
      `,
            ghost: `
        bg-transparent text-[var(--color-text-secondary)]
        hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]
        focus-visible:ring-[var(--color-border-light)]
      `,
            danger: `
        bg-[var(--color-error)] text-white
        hover:bg-[var(--color-error)]/90 shadow-md
        focus-visible:ring-[var(--color-error)]
      `,
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                    leftIcon
                )}
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';
