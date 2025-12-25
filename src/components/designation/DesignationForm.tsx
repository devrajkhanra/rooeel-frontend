import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createDesignationSchema, updateDesignationSchema, type CreateDesignationFormData, type UpdateDesignationFormData } from '@/utils/validation';
import { useCreateDesignation, useUpdateDesignation } from '@/hooks/useDesignations';
import { showToast } from '@/utils/toast';
import type { Designation } from '@/types/api.types';

interface DesignationFormProps {
    designation?: Designation;
    onClose: () => void;
}

export const DesignationForm: React.FC<DesignationFormProps> = ({ designation, onClose }) => {
    const isEditing = !!designation;
    const createDesignation = useCreateDesignation();
    const updateDesignation = useUpdateDesignation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateDesignationFormData | UpdateDesignationFormData>({
        resolver: zodResolver(isEditing ? updateDesignationSchema : createDesignationSchema),
        defaultValues: designation ? {
            name: designation.name,
            description: designation.description || '',
        } : undefined,
    });

    const onSubmit = async (data: CreateDesignationFormData | UpdateDesignationFormData) => {
        try {
            setIsSubmitting(true);
            if (isEditing) {
                await updateDesignation.mutateAsync({
                    id: designation.id,
                    data: data as UpdateDesignationFormData,
                });
                showToast.success('Designation updated successfully');
            } else {
                await createDesignation.mutateAsync(data as CreateDesignationFormData);
                showToast.success('Designation created successfully');
            }
            onClose();
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err.message || 'Failed to save designation';
            showToast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--color-surface)] rounded-xl shadow-2xl max-w-lg w-full border border-[var(--color-border)]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                    <h2 className="text-xl font-semibold">
                        {isEditing ? 'Edit Designation' : 'Create Designation'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors p-2 hover:bg-[var(--color-surface-hover)] rounded-lg"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <Input
                        label="Name"
                        placeholder="e.g., Software Engineer"
                        {...register('name')}
                        error={errors.name?.message}
                        autoComplete="off"
                    />

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            {...register('description')}
                            placeholder="Describe the role and responsibilities..."
                            className="w-full px-3 py-2 rounded-md text-sm bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] placeholder:text-[var(--color-text-tertiary)] transition-colors duration-200 focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                            rows={4}
                        />
                        {errors.description && (
                            <p className="mt-1.5 text-sm text-[var(--color-error)]">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1"
                            isLoading={isSubmitting}
                        >
                            {isEditing ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
