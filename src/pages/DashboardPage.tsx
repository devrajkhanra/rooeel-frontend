import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Users, FileText, Folder, TrendingUp } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp }) => {
    return (
        <div className="p-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-light)] transition-all">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-[var(--color-text-tertiary)] mb-1">{title}</p>
                    <p className="text-3xl font-bold text-[var(--color-text)]">{value}</p>
                    {trend && (
                        <p className={`text-xs mt-2 flex items-center gap-1 ${trendUp ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
                            <TrendingUp className={`h-3 w-3 ${!trendUp && 'rotate-180'}`} />
                            {trend}
                        </p>
                    )}
                </div>
                <div className="p-3 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.firstName || 'User'}
                </h1>
                <p className="text-[var(--color-text-secondary)]">
                    Here's what's happening with your account today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {user?.role === 'admin' ? (
                    <>
                        <StatCard
                            title="Total Users"
                            value="24"
                            icon={<Users className="h-6 w-6" />}
                            trend="+12% from last month"
                            trendUp={true}
                        />
                        <StatCard
                            title="Active Projects"
                            value="8"
                            icon={<Folder className="h-6 w-6" />}
                            trend="+2 new this week"
                            trendUp={true}
                        />
                        <StatCard
                            title="Pending Requests"
                            value="5"
                            icon={<FileText className="h-6 w-6" />}
                            trend="3 need attention"
                            trendUp={false}
                        />
                    </>
                ) : (
                    <>
                        <StatCard
                            title="My Projects"
                            value="3"
                            icon={<Folder className="h-6 w-6" />}
                        />
                        <StatCard
                            title="My Requests"
                            value="2"
                            icon={<FileText className="h-6 w-6" />}
                            trend="1 pending"
                            trendUp={true}
                        />
                    </>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        {user?.role === 'admin' ? (
                            <>
                                <button className="w-full text-left px-4 py-3 rounded-lg bg-[var(--color-background)] hover:bg-[var(--color-surface-hover)] transition-colors border border-[var(--color-border)]">
                                    <p className="font-medium text-sm">Create New Project</p>
                                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">Start a new project and assign team members</p>
                                </button>
                                <button className="w-full text-left px-4 py-3 rounded-lg bg-[var(--color-background)] hover:bg-[var(--color-surface-hover)] transition-colors border border-[var(--color-border)]">
                                    <p className="font-medium text-sm">Add New User</p>
                                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">Invite a new team member to the platform</p>
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="w-full text-left px-4 py-3 rounded-lg bg-[var(--color-background)] hover:bg-[var(--color-surface-hover)] transition-colors border border-[var(--color-border)]">
                                    <p className="font-medium text-sm">View My Projects</p>
                                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">See all projects you're assigned to</p>
                                </button>
                                <button className="w-full text-left px-4 py-3 rounded-lg bg-[var(--color-background)] hover:bg-[var(--color-surface-hover)] transition-colors border border-[var(--color-border)]">
                                    <p className="font-medium text-sm">Submit Request</p>
                                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">Request changes to your profile information</p>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="p-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm">New project created</p>
                                <p className="text-xs text-[var(--color-text-tertiary)]">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-success)] mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm">Request approved</p>
                                <p className="text-xs text-[var(--color-text-tertiary)]">5 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-info)] mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm">User assigned to project</p>
                                <p className="text-xs text-[var(--color-text-tertiary)]">1 day ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
