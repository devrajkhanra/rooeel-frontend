import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
        <header className="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md">
            <div className="container">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">R</span>
                        </div>
                        <span className="text-xl font-bold gradient-text">Rooeel</span>
                    </Link>

                    {/* User menu */}
                    {user && (
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                            {getInitials(user.firstName, user.lastName)}
                                        </span>
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium">{formatName(user.firstName, user.lastName)}</p>
                                        <p className="text-xs text-[var(--color-text-tertiary)]">{user.email}</p>
                                    </div>
                                </button>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    className="min-w-[200px] bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] shadow-lg p-1 z-[var(--z-dropdown)] animate-slide-down"
                                    sideOffset={5}
                                >
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
            </div>
        </header>
    );
};
