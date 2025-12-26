import { useState, useMemo } from 'react';
import { useDesignations } from '@/hooks/useDesignations';
import {
    useProjectDesignations,
    useAssignDesignationToProject,
    useRemoveDesignationFromProject,
    useSetUserDesignation,
    useRemoveUserDesignation,
} from '@/hooks/useProjects';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Plus, X, UserCog } from 'lucide-react';
import type { Project } from '@/types/api.types';

interface ProjectDesignationManagerProps {
    project: Project;
}

export const ProjectDesignationManager = ({ project }: ProjectDesignationManagerProps) => {
    const [selectedDesignationId, setSelectedDesignationId] = useState<number | null>(null);
    const [assigningToUserId, setAssigningToUserId] = useState<number | null>(null);

    const { data: allDesignations = [], isLoading: designationsLoading } = useDesignations();
    const { data: projectDesignations = [], isLoading: projectDesignationsLoading } = useProjectDesignations(project.id);
    const assignDesignation = useAssignDesignationToProject();
    const removeDesignation = useRemoveDesignationFromProject();
    const setUserDesignation = useSetUserDesignation();
    const removeUserDesignation = useRemoveUserDesignation();

    // Debug logging
    console.log('ProjectDesignationManager Debug:', {
        projectId: project.id,
        allDesignations,
        projectDesignations,
        designationsLoading,
        projectDesignationsLoading
    });

    // Enrich project designations with full designation data using useMemo
    // Backend might return just IDs, so we map them to full objects
    const enrichedProjectDesignations = useMemo(() => {
        const enriched = projectDesignations.map((pd: any) => {
            // Always try to enrich with latest designation data
            const fullDesignation = allDesignations.find(d => d.id === pd.designationId);

            if (!fullDesignation && !pd.designation) {
                console.warn(`Designation ${pd.designationId} not found in allDesignations or pd.designation`);
            }

            return {
                ...pd,
                designation: fullDesignation || pd.designation
            };
        });

        console.log('Enriched Project Designations:', enriched);
        return enriched;
    }, [allDesignations, projectDesignations]);

    // Get designations not yet assigned to this project
    const availableDesignations = useMemo(() => {
        return allDesignations.filter(
            (d) => !projectDesignations.some((pd: any) => pd.designationId === d.id)
        );
    }, [allDesignations, projectDesignations]);

    const handleAssignDesignation = async () => {
        if (!selectedDesignationId) return;

        try {
            await assignDesignation.mutateAsync({
                projectId: project.id,
                designationId: selectedDesignationId,
            });
            setSelectedDesignationId(null);
        } catch (error) {
            console.error('Failed to assign designation:', error);
        }
    };

    const handleRemoveDesignation = async (designationId: number) => {
        try {
            await removeDesignation.mutateAsync({
                projectId: project.id,
                designationId,
            });
        } catch (error) {
            console.error('Failed to remove designation:', error);
        }
    };

    const handleSetUserDesignation = async (userId: number, designationId: number) => {
        try {
            await setUserDesignation.mutateAsync({
                projectId: project.id,
                userId,
                designationId,
            });
            setAssigningToUserId(null);
        } catch (error) {
            console.error('Failed to set user designation:', error);
        }
    };

    const handleRemoveUserDesignation = async (userId: number) => {
        try {
            await removeUserDesignation.mutateAsync({
                projectId: project.id,
                userId,
            });
        } catch (error) {
            console.error('Failed to remove user designation:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Project Designations Section */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Project Designations</h3>
                </div>

                {/* Assigned Designations */}
                <div className="space-y-2 mb-4">
                    {enrichedProjectDesignations.length === 0 ? (
                        <p className="text-sm text-[var(--color-text-secondary)]">No designations assigned to this project yet.</p>
                    ) : (
                        enrichedProjectDesignations.map((pd: any) => (
                            <div
                                key={pd.id}
                                className="flex items-center justify-between p-3 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]"
                            >
                                <div>
                                    <p className="font-medium">
                                        {pd.designation?.name || `[Designation ID: ${pd.designationId}]`}
                                    </p>
                                    {pd.designation?.description && (
                                        <p className="text-sm text-[var(--color-text-secondary)]">{pd.designation.description}</p>
                                    )}
                                    {!pd.designation && (
                                        <p className="text-xs text-[var(--color-error)]">
                                            Error: Designation data not loaded
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveDesignation(pd.designationId)}
                                    disabled={removeDesignation.isPending}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Designation */}
                {availableDesignations.length > 0 && (
                    <div className="flex gap-2">
                        <select
                            value={selectedDesignationId || ''}
                            onChange={(e) => setSelectedDesignationId(Number(e.target.value))}
                            className="flex-1 px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        >
                            <option value="">Select a designation...</option>
                            {availableDesignations.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                        <Button
                            onClick={handleAssignDesignation}
                            disabled={!selectedDesignationId || assignDesignation.isPending}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                        </Button>
                    </div>
                )}
            </Card>

            {/* User Designations Section */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">User Designations</h3>
                </div>

                <div className="space-y-3">
                    {!project.users || project.users.length === 0 ? (
                        <p className="text-sm text-[var(--color-text-secondary)]">No users assigned to this project yet.</p>
                    ) : (
                        project.users.map((pu) => (
                            <div
                                key={pu.id}
                                className="flex items-center justify-between p-3 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]"
                            >
                                <div className="flex items-center gap-3">
                                    <UserCog className="h-5 w-5 text-[var(--color-text-secondary)]" />
                                    <div>
                                        <p className="font-medium">
                                            {pu.user?.firstName} {pu.user?.lastName}
                                        </p>
                                        <p className="text-sm text-[var(--color-text-secondary)]">{pu.user?.email}</p>
                                    </div>
                                    {pu.designation && (
                                        <Badge variant="secondary">{pu.designation.name}</Badge>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {assigningToUserId === pu.userId ? (
                                        <>
                                            <select
                                                onChange={(e) => {
                                                    const designationId = Number(e.target.value);
                                                    if (designationId) {
                                                        handleSetUserDesignation(pu.userId, designationId);
                                                    }
                                                }}
                                                className="px-3 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                            >
                                                <option value="">Select designation...</option>
                                                {enrichedProjectDesignations.map((pd: any) => (
                                                    <option key={pd.id} value={pd.designationId}>
                                                        {pd.designation?.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setAssigningToUserId(null)}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => setAssigningToUserId(pu.userId)}
                                                disabled={enrichedProjectDesignations.length === 0}
                                            >
                                                {pu.designation ? 'Change' : 'Assign'}
                                            </Button>
                                            {pu.designation && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveUserDesignation(pu.userId)}
                                                    disabled={removeUserDesignation.isPending}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
};
