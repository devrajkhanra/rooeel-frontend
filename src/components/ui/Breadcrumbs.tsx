import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
    return (
        <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm ${className}`}>
            <Link
                to="/"
                className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-colors"
                aria-label="Home"
            >
                <Home className="h-4 w-4" />
            </Link>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <React.Fragment key={index}>
                        <ChevronRight className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                        {item.href && !isLast ? (
                            <Link
                                to={item.href}
                                className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={isLast ? 'text-[var(--color-text)] font-medium' : 'text-[var(--color-text-tertiary)]'}>
                                {item.label}
                            </span>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};
