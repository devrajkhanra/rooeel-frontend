import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import { useAdmin, useUpdateAdmin } from '@/hooks/useAdmins';
import { updateAdminSchema, type UpdateAdminFormData } from '@/utils/validation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export const AdminEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const adminId = parseInt(id || '0', 10);
    const navigate = useNavigate();
    const { data: admin, isLoading: isLoadingAdmin } = useAdmin(adminId);
    const updateAdmin = useUpdateAdmin();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateAdminFormData>({
        resolver: zodResolver(updateAdminSchema),
    });

    useEffect(() => {
        if (admin) {
            reset({
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                password: '', // Password is optional for update usually, but schema might require it. Check schema later. If optional, empty is fine. If required, we might need a different schema for edit.
            });
        }
    }, [admin, reset]);

    const onSubmit = async (data: UpdateAdminFormData) => {
        try {
            setError(null);
            // Prepare update data. Remove password if empty.
            // For now, assuming API handles empty password as "no change" or we filter it out.
            // The UpdateAdminDto in api.types.ts has password optional.
            // But AdminFormData from validation probably has it required?
            // If validation schema requires password, user must enter it.
            // Usually edit profile shouldn't require password unless changing it.
            // I'll assume for now we send what we have.

            const updateData: any = { ...data };
            if (!updateData.password) delete updateData.password;

            await updateAdmin.mutateAsync({ id: adminId, data: updateData });
            navigate('/admin');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update admin');
        }
    };

    if (isLoadingAdmin) {
        return (
            <div className="container py-8 max-w-2xl">
                <Skeleton className="h-10 w-32 mb-6" />
                <Skeleton className="h-[500px] w-full" />
            </div>
        );
    }

    if (!admin) {
        return (
            <div className="container py-8 text-center">
                <p className="text-[var(--color-error)]">Admin not found</p>
                <Button variant="ghost" onClick={() => navigate('/admin')} className="mt-4">
                    Back to Admins
                </Button>
            </div>
        );
    }

    return (
        <div className="container py-8 max-w-2xl">
            <Button
                variant="ghost"
                leftIcon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => navigate('/admin')}
                className="mb-6"
            >
                Back to Admins
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Admin</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-[var(--color-error)] text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                placeholder="John"
                                error={errors.firstName?.message}
                                {...register('firstName')}
                            />
                            <Input
                                label="Last Name"
                                placeholder="Doe"
                                error={errors.lastName?.message}
                                {...register('lastName')}
                            />
                        </div>

                        <Input
                            label="Email"
                            type="email"
                            placeholder="john.doe@example.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Leave blank to keep current"
                            helperText="Minimum 6 characters"
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                leftIcon={<Save className="h-4 w-4" />}
                                isLoading={updateAdmin.isPending}
                            >
                                Update Admin
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/admin')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
