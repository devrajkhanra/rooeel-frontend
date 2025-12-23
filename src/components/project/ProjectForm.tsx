import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Tag } from 'lucide-react';
import { projectSchema, updateProjectSchema, type ProjectFormData, type UpdateProjectFormData } from '@/utils/validation';
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Project, ProjectStatus } from '@/types/api.types';

interface ProjectFormProps {
    project?: Project; // If provided, form is in edit mode
    onSuccess?: () => void;
    onCancel?: () => void;
}

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'completed', label: 'Completed' },
];

export const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSuccess, onCancel }) => {
    const isEditMode = !!project;
    const createProject = useCreateProject();
    const updateProject = useUpdateProject();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProjectFormData | UpdateProjectFormData>({
        resolver: zodResolver(isEditMode ? updateProjectSchema : projectSchema),
        defaultValues: project ? {
            name: project.name,
            description: project.description || '',
            status: project.status,
        } : {
            status: 'active',
        },
    });

    const onSubmit = async (data: ProjectFormData | UpdateProjectFormData) => {
        try {
            setError(null);
            if (isEditMode && project) {
                await updateProject.mutateAsync({ id: project.id, data });
            } else {
                await createProject.mutateAsync(data as ProjectFormData);
            }
            onSuccess?.();
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || 'Failed to save project');
        }
    };

    const isLoading = createProject.isPending || updateProject.isPending;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="p-3 rounded-md bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-[var(--color-error)] text-sm">
                    {error}
                </div>
            )}

            <Input
                label="Project Name"
                placeholder="Enter project name"
                leftIcon={<FileText className="h-4 w-4" />}
                error={errors.name?.message}
                {...register('name')}
            />

            <div>
                <label className="block text-sm font-medium mb-2">
                    Description
                </label>
                <textarea
                    {...register('description')}
                    placeholder="Enter project description (optional)"
                    rows={4}
                    className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                />
                {errors.description && (
                    <p className="mt-1 text-xs text-[var(--color-error)]">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    <Tag className="h-4 w-4 inline mr-2" />
                    Status
                </label>
                <select
                    {...register('status')}
                    className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                    {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {errors.status && (
                    <p className="mt-1 text-xs text-[var(--color-error)]">
                        {errors.status.message}
                    </p>
                )}
            </div>

            <div className="flex gap-2 justify-end">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                >
                    {isEditMode ? 'Update Project' : 'Create Project'}
                </Button>
            </div>
        </form>
    );
};
