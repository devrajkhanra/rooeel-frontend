import React from 'react';

interface TableProps {
    children: React.ReactNode;
    className?: string;
}

interface TableHeaderProps {
    children: React.ReactNode;
}

interface TableBodyProps {
    children: React.ReactNode;
}

interface TableRowProps {
    children: React.ReactNode;
    className?: string;
}

interface TableHeadProps {
    children: React.ReactNode;
    className?: string;
}

interface TableCellProps {
    children: React.ReactNode;
    className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
            <table className={`w-full ${className}`}>
                {children}
            </table>
        </div>
    );
};

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
    return <thead className="bg-[var(--color-bg-secondary)]">{children}</thead>;
};

export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
    return <tbody className="divide-y divide-[var(--color-border)]">{children}</tbody>;
};

export const TableRow: React.FC<TableRowProps> = ({ children, className = '' }) => {
    return (
        <tr className={`hover:bg-[var(--color-bg-secondary)] transition-colors ${className}`}>
            {children}
        </tr>
    );
};

export const TableHead: React.FC<TableHeadProps> = ({ children, className = '' }) => {
    return (
        <th
            className={`px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider ${className}`}
        >
            {children}
        </th>
    );
};

export const TableCell: React.FC<TableCellProps> = ({ children, className = '' }) => {
    return (
        <td className={`px-6 py-4 whitespace-nowrap text-sm ${className}`}>
            {children}
        </td>
    );
};
