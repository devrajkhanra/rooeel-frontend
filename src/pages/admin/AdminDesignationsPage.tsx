import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDesignations, useDeleteDesignation } from '@/hooks/useDesignations';
import { DesignationForm } from '@/components/designation/DesignationForm';
import { showToast } from '@/utils/toast';
import type { Designation } from '@/types/api.types';

export const AdminDesignationsPage: React.FC = () => {
    const { data: designations, isLoading, error } = useDesignations();
    const deleteDesignation = useDeleteDesignation();
    const [showForm, setShowForm] = useState(false);
    const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleEdit = (designation: Designation) => {
        setEditingDesignation(designation);
        setShowForm(true);
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Delete designation "${name}"? This action cannot be undone.`)) return;

        try {
            await deleteDesignation.mutateAsync(id);
            showToast.success(`Designation "${name}" deleted successfully`);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err.message || 'Failed to delete designation';
            showToast.error(errorMessage);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingDesignation(null);
    };

    // Filter designations based on search query
    const filteredDesignations = designations?.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-5 w-96 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <Card className="border-[var(--color-error)]/20">
                    <CardContent className="py-12 text-center">
                        <p className="text-[var(--color-error)] text-lg">Failed to load designations</p>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                            Please try refreshing the page
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Designations</h1>
                        <p className="text-[var(--color-text-secondary)]">
                            Manage job roles and titles for your projects
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        leftIcon={<Plus className="h-4 w-4" />}
                        onClick={() => setShowForm(true)}
                        className="shadow-sm hover:shadow-md transition-shadow"
                    >
                        New Designation
                    </Button>
                </div>

                {/* Search */}
                <div className="max-w-md">
                    <input
                        type="text"
                        placeholder="Search designations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg text-sm bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)]"
                    />
                </div>
            </div>

            {/* Designations Grid */}
            {filteredDesignations && filteredDesignations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDesignations.map((designation) => (
                        <Card key={designation.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-[var(--color-primary)]/10">
                                            <Briefcase className="h-5 w-5 text-[var(--color-primary)]" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{designation.name}</h3>
                                        </div>
                                    </div>
                                </div>

                                {designation.description && (
                                    <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-3">
                                        {designation.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                                    <div className="text-xs text-[var(--color-text-tertiary)]">
                                        Created {new Date(designation.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(designation)}
                                            className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                                            title="Edit designation"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(designation.id, designation.name)}
                                            className="p-2 rounded-lg hover:bg-[var(--color-error)]/10 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] transition-colors"
                                            title="Delete designation"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
                        <p className="text-lg font-medium mb-2">
                            {searchQuery ? 'No designations found' : 'No designations yet'}
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                            {searchQuery
                                ? 'Try adjusting your search query'
                                : 'Create your first designation to get started'}
                        </p>
                        {!searchQuery && (
                            <Button
                                variant="primary"
                                leftIcon={<Plus className="h-4 w-4" />}
                                onClick={() => setShowForm(true)}
                            >
                                Create Designation
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Form Modal */}
            {showForm && (
                <DesignationForm
                    designation={editingDesignation || undefined}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
};
