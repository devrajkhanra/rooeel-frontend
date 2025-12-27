import React, { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminRequests } from '@/hooks/useRequests';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/format';

export const NotificationBell: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data: requests } = useAdminRequests();

    // Debug logging


    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Only admins see notifications
    if (user?.role !== 'admin') {
        return null;
    }

    const pendingRequests = requests?.filter(r => r.status === 'pending') || [];
    const pendingCount = pendingRequests.length;

    const handleBellClick = () => {
        setIsOpen(!isOpen);
    };

    const handleItemClick = () => {
        setIsOpen(false);
        navigate('/admin/requests');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleBellClick}
                className="relative p-2 rounded-md hover:bg-[var(--color-surface-hover)] transition-colors"
                aria-label="Notifications"
            >
                {/* Wave effect background */}
                {pendingCount > 0 && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-yellow-400/30 opacity-75"></span>
                )}

                <Bell className={cn(
                    "h-5 w-5 transition-colors",
                    pendingCount > 0
                        ? "text-yellow-400 animate-vibrate"
                        : "text-[var(--color-text-secondary)]"
                )} />

                {pendingCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-danger)]"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg z-50 animate-slide-down">
                    <div className="flex items-center justify-between p-3 border-b border-[var(--color-border)]">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {pendingCount > 0 && (
                            <Badge variant="danger">{pendingCount} New</Badge>
                        )}
                    </div>

                    <div className="max-h-[300px] overflow-y-auto">
                        {pendingRequests.length === 0 ? (
                            <div className="p-4 text-center text-sm text-[var(--color-text-tertiary)]">
                                No new notifications
                            </div>
                        ) : (
                            <div className="py-1">
                                {pendingRequests.map((request) => (
                                    <button
                                        key={request.id}
                                        onClick={handleItemClick}
                                        className="w-full text-left px-4 py-3 hover:bg-[var(--color-surface-hover)] transition-colors border-b border-[var(--color-border)] last:border-0"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-sm font-medium">
                                                {request.requestType === 'firstName' ? 'First Name Change' :
                                                    request.requestType === 'lastName' ? 'Last Name Change' :
                                                        request.requestType === 'email' ? 'Email Change' :
                                                            'Password Change'}
                                            </span>
                                            <span className="text-xs text-[var(--color-text-tertiary)]">
                                                {formatDate(request.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--color-text-secondary)] truncate">
                                            From: {request.user?.email}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {pendingRequests.length > 0 && (
                        <div className="p-2 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] rounded-b-lg">
                            <button
                                onClick={handleItemClick}
                                className="w-full text-center text-xs font-medium text-[var(--color-primary)] hover:underline"
                            >
                                View all requests
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
