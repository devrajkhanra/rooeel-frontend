import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useAssignUser } from '@/hooks/useProjects';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/ui/Button';
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

        try {
            setError(null);
            await assignUser.mutateAsync({
                projectId: project.id,
                data: { userId: selectedUserId },
            });
            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || 'Failed to assign user');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-lg max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Assign User to Project
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    <div>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                            Project: <span className="font-medium text-[var(--color-text-primary)]">{project.name}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 rounded-md bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-[var(--color-error)] text-sm">
                            {error}
                        </div>
                    )}

                    {usersLoading ? (
                        <div className="text-center py-4">
                            <p className="text-sm text-[var(--color-text-secondary)]">Loading users...</p>
                        </div>
                    ) : availableUsers.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                No available users to assign
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
                                className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            >
                                <option value="">Select a user...</option>
                                {availableUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.firstName} {user.lastName} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-2 justify-end p-4 border-t border-[var(--color-border)]">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={assignUser.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAssign}
                        isLoading={assignUser.isPending}
                        disabled={!selectedUserId || availableUsers.length === 0}
                    >
                        Assign User
                    </Button>
                </div>
            </div>
        </div>
    );
};
