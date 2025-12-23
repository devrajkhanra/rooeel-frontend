import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Tag } from 'lucide-react';
import { projectSchema, updateProjectSchema, type ProjectFormData, type UpdateProjectFormData } from '@/utils/validation';
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showToast } from '@/utils/toast';
import type { Project, ProjectStatus } from '@/types/api.types';

interface ProjectFormProps {
    project?: Project; // If provided, form is in edit mode
    onSuccess?: () => void;
    onCancel?: () => void;
}

const STATUS_OPTIONS: { value: ProjectStatus; label: string; description: string }[] = [
    { value: 'active', label: 'Active', description: 'Project is currently in progress' },
    { value: 'inactive', label: 'Inactive', description: 'Project is paused or on hold' },
    { value: 'completed', label: 'Completed', description: 'Project has been finished' },
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
        watch,
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

    const selectedStatus = watch('status');

    const onSubmit = async (data: ProjectFormData | UpdateProjectFormData) => {
        try {
            setError(null);
            if (isEditMode && project) {
                await updateProject.mutateAsync({ id: project.id, data });
                showToast.success('Project updated successfully');
            } else {
                await createProject.mutateAsync(data as ProjectFormData);
                showToast.success('Project created successfully');
            }
            onSuccess?.();
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err.message || 'Failed to save project';
            setError(errorMessage);
            showToast.error(errorMessage);
        }
    };

    const isLoading = createProject.isPending || updateProject.isPending;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="p-4 rounded-lg bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-[var(--color-error)] text-sm">
                    {error}
                </div>
            )}

            <div>
                <Input
                    label="Project Name"
                    placeholder="Enter project name"
                    leftIcon={<FileText className="h-4 w-4" />}
                    error={errors.name?.message}
                    {...register('name')}
                />
                <p className="mt-1.5 text-xs text-[var(--color-text-secondary)]">
                    A clear, descriptive name for your project
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Description <span className="text-[var(--color-text-secondary)]">(optional)</span>
                </label>
                <textarea
                    {...register('description')}
                    placeholder="Describe the project goals, scope, and key details..."
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none transition-all"
                />
                {errors.description && (
                    <p className="mt-1.5 text-xs text-[var(--color-error)]">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-3">
                    <Tag className="h-4 w-4 inline mr-2" />
                    Project Status
                </label>
                <div className="space-y-2">
                    {STATUS_OPTIONS.map((option) => (
                        <label
                            key={option.value}
                            className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedStatus === option.value
                                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                                    : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)] bg-[var(--color-bg-secondary)]'
                                }`}
                        >
                            <input
                                type="radio"
                                value={option.value}
                                {...register('status')}
                                className="mt-1 mr-3 accent-[var(--color-primary)]"
                            />
                            <div className="flex-1">
                                <div className="font-medium">{option.label}</div>
                                <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                                    {option.description}
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
                {errors.status && (
                    <p className="mt-2 text-xs text-[var(--color-error)]">
                        {errors.status.message}
                    </p>
                )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className="flex-1"
                >
                    {isEditMode ? 'Update Project' : 'Create Project'}
                </Button>
            </div>
        </form>
    );
};
