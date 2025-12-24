import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useAssignUser } from '@/hooks/useProjects';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/utils/toast';
import type { Project } from '@/types/api.types';

interface UserAssignmentModalProps {
    project: Project;
    onClose: () => void;
    onSuccess?: () => void;
}

export const UserAssignmentModal: React.FC<UserAssignmentModalProps> = ({
    project,
    onClose,
    onSuccess,
}) => {
    const { data: allUsers, isLoading: usersLoading } = useUsers();
    const assignUser = useAssignUser();
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Filter out users already assigned to the project
    const assignedUserIds = project.users?.map(u => u.id) || [];
    const availableUsers = allUsers?.filter(user => !assignedUserIds.includes(user.id)) || [];

    const handleAssign = async () => {
        if (!selectedUserId) {
            setError('Please select a user');
            return;
        }

        const selectedUser = availableUsers.find(u => u.id === selectedUserId);
        const userName = selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'User';

        try {
            setError(null);
            await assignUser.mutateAsync({
                projectId: project.id,
                data: { userId: selectedUserId },
            });
            showToast.success(`${userName} assigned to project successfully`);
            onSuccess?.();
            onClose();
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err.message || 'Failed to assign user';
            setError(errorMessage);
            showToast.error(errorMessage);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--color-surface)] rounded-xl shadow-2xl max-w-md w-full border border-[var(--color-border)] animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                    <div>
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-[var(--color-primary)]" />
                            Assign User to Project
                        </h2>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                            {project.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {error && (
                        <div className="p-4 rounded-lg bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-[var(--color-error)] text-sm">
                            {error}
                        </div>
                    )}

                    {usersLoading ? (
                        <div className="text-center py-8">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--color-primary)] border-r-transparent"></div>
                            <p className="text-sm text-[var(--color-text-secondary)] mt-3">Loading users...</p>
                        </div>
                    ) : availableUsers.length === 0 ? (
                        <div className="text-center py-8 bg-[var(--color-bg-secondary)] rounded-lg border border-dashed border-[var(--color-border)]">
                            <p className="text-[var(--color-text-secondary)]">
                                No available users to assign
                            </p>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                All users have been assigned to this project
                            </p>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Select User
                            </label>
                            <select
                                value={selectedUserId || ''}
                                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                                className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                            >
                                <option value="">Choose a user...</option>
                                {availableUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.firstName} {user.lastName} ({user.email})
                                    </option>
                                ))}
                            </select>
                            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                                {availableUsers.length} user{availableUsers.length !== 1 ? 's' : ''} available
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={assignUser.isPending}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAssign}
                        isLoading={assignUser.isPending}
                        disabled={!selectedUserId || availableUsers.length === 0}
                        className="flex-1"
                    >
                        Assign User
                    </Button>
                </div>
            </div>
        </div>
    );
};
