import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/utils/validation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type LoginRole = 'admin' | 'user';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, userLogin } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<LoginRole>('admin');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsLoading(true);
            setError(null);

            // Use appropriate login method based on selected role
            if (selectedRole === 'admin') {
                await login(data);
            } else {
                await userLogin(data);
            }

            navigate('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-background)]">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="inline-flex h-10 w-10 rounded-md bg-[var(--color-primary)] items-center justify-center mb-4">
                        <span className="text-black font-bold text-lg">R</span>
                    </div>
                    <h1 className="text-xl font-semibold mb-1">Welcome to Rooeel</h1>
                    <p className="text-sm text-[var(--color-text-secondary)]">Sign in to your account</p>
                </div>

                {/* Login form */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
                    {/* Role Selection Tabs */}
                    <div className="flex gap-2 mb-6 p-1 bg-[var(--color-background)] rounded-lg">
                        <button
                            type="button"
                            onClick={() => setSelectedRole('admin')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${selectedRole === 'admin'
                                    ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm'
                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                }`}
                        >
                            <Shield className="h-4 w-4" />
                            Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole('user')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${selectedRole === 'user'
                                    ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm'
                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                }`}
                        >
                            <UserIcon className="h-4 w-4" />
                            User
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-md bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-[var(--color-error)] text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            leftIcon={<Mail className="h-4 w-4" />}
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            leftIcon={<Lock className="h-4 w-4" />}
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Sign In as {selectedRole === 'admin' ? 'Admin' : 'User'}
                        </Button>
                    </form>

                    {selectedRole === 'admin' && (
                        <div className="mt-6 text-center text-xs text-[var(--color-text-tertiary)]">
                            <p>
                                Don't have an admin account?{' '}
                                <Link
                                    to="/signup"
                                    className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    )}

                    {selectedRole === 'user' && (
                        <div className="mt-6 p-3 rounded-md bg-[var(--color-info)]/10 border border-[var(--color-info)]/20">
                            <p className="text-xs text-[var(--color-text-secondary)]">
                                <strong>Note:</strong> Users cannot self-register. Contact an admin to create your account.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
