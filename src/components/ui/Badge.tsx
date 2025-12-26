import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        const variants = {
            default: 'bg-[var(--color-border)] text-[var(--color-text)]',
            secondary: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
            success: 'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20',
            warning: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[var(--color-warning)]/20',
            danger: 'bg-[var(--color-error)]/10 text-[var(--color-error)] border border-[var(--color-error)]/20',
            info: 'bg-[var(--color-info)]/10 text-[var(--color-info)] border border-[var(--color-info)]/20',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);

Badge.displayName = 'Badge';
