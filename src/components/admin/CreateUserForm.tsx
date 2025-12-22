import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { userSchema, type UserFormData } from '@/utils/validation';
import { useCreateUser } from '@/hooks/useUsers';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CreateUserFormProps {
    onSuccess?: () => void;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSuccess }) => {
    const createUser = useCreateUser();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
    });

    const onSubmit = async (data: UserFormData) => {
        try {
            setError(null);
            setSuccess(null);
            await createUser.mutateAsync(data);
            setSuccess('User created successfully!');
            reset();
            onSuccess?.();
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || 'Failed to create user');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="p-3 rounded-md bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-[var(--color-error)] text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3 rounded-md bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 text-[var(--color-success)] text-sm">
                    {success}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="First Name"
                    placeholder="John"
                    leftIcon={<UserIcon className="h-4 w-4" />}
                    error={errors.firstName?.message}
                    {...register('firstName')}
                />
                <Input
                    label="Last Name"
                    placeholder="Doe"
                    leftIcon={<UserIcon className="h-4 w-4" />}
                    error={errors.lastName?.message}
                    {...register('lastName')}
                />
            </div>

            <Input
                label="Email"
                type="email"
                placeholder="user@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email')}
            />

            <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                helperText="Minimum 6 characters"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register('password')}
            />

            <Button
                type="submit"
                className="w-full"
                isLoading={createUser.isPending}
            >
                Create User
            </Button>
        </form>
    );
};
