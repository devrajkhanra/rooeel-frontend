import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import { useCreateAdmin } from '@/hooks/useAdmins';
import { adminSchema, type AdminFormData } from '@/utils/validation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export const AdminCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const createAdmin = useCreateAdmin();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AdminFormData>({
        resolver: zodResolver(adminSchema),
    });

    const onSubmit = async (data: AdminFormData) => {
        try {
            setError(null);
            await createAdmin.mutateAsync(data);
            navigate('/admin');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create admin');
        }
    };

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
                    <CardTitle>Create New Admin</CardTitle>
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
                            placeholder="••••••••"
                            helperText="Minimum 6 characters"
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                leftIcon={<Save className="h-4 w-4" />}
                                isLoading={createAdmin.isPending}
                            >
                                Create Admin
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
