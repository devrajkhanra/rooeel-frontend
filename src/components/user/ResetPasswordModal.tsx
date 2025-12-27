import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // Import z from zod directly since we are defining a small schema here
import { X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showToast } from '@/utils/toast';
import { useResetPassword } from '@/hooks/useUsers'; // Check if this hook exists or needs to be created
import type { User } from '@/types/api.types';

const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type ResetFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordModalProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ user, isOpen, onClose }) => {
    const { mutateAsync: resetPassword, isPending } = useResetPassword();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ResetFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetFormData) => {
        try {
            await resetPassword({ id: user.id, data: { password: data.password } });
            showToast.success('Password reset successfully');
            reset();
            onClose();
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Failed to reset password';
            showToast.error(message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Reset Password</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Resetting password for user <span className="font-medium text-[var(--color-text-primary)]">{user.firstName} {user.lastName}</span> ({user.email}).
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="New Password"
                        type="password"
                        placeholder="Enter new password"
                        leftIcon={<Lock className="h-4 w-4" />}
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isPending}
                        >
                            Reset Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
