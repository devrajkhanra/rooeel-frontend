import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { formatName, getInitials } from '@/utils/format';

export const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--color-border)] bg-[var(--color-header)] h-14">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Breadcrumb / Title */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--color-text)]">Rooeel</span>
                </div>

                {/* User menu */}
                {user && (
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[var(--color-surface-hover)] transition-colors">
                                <div className="h-7 w-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                                    <span className="text-black text-xs font-medium">
                                        {getInitials(user.firstName, user.lastName)}
                                    </span>
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-xs font-medium text-[var(--color-text)]">{formatName(user.firstName, user.lastName)}</p>
                                </div>
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                className="min-w-[200px] bg-[var(--color-surface)] rounded-md border border-[var(--color-border)] shadow-lg p-1 z-[var(--z-dropdown)] animate-slide-down"
                                sideOffset={5}
                            >
                                <div className="px-3 py-2 border-b border-[var(--color-border)] mb-1">
                                    <p className="text-xs font-medium text-[var(--color-text)]">{formatName(user.firstName, user.lastName)}</p>
                                    <p className="text-xs text-[var(--color-text-tertiary)]">{user.email}</p>
                                </div>
                                <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-[var(--color-surface-hover)] cursor-pointer outline-none">
                                    <User className="h-4 w-4" />
                                    Profile
                                </DropdownMenu.Item>
                                <DropdownMenu.Separator className="h-px bg-[var(--color-border)] my-1" />
                                <DropdownMenu.Item
                                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-[var(--color-error)]/10 text-[var(--color-error)] cursor-pointer outline-none"
                                    onSelect={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                )}
            </div>
        </header>
    );
};
