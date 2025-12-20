import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        const variants = {
            default: 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]',
            success: 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20',
            warning: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20',
            error: 'bg-[var(--color-error)]/10 text-[var(--color-error)] border-[var(--color-error)]/20',
            info: 'bg-[var(--color-info)]/10 text-[var(--color-info)] border-[var(--color-info)]/20',
        };

        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);

Badge.displayName = 'Badge';
