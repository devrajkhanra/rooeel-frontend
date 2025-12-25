import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signupSchema, type SignupFormData } from '@/utils/validation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        try {
            setIsLoading(true);
            setError(null);
            await signup(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
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
                    <h1 className="text-xl font-semibold mb-1">Create Admin Account</h1>
                    <p className="text-sm text-[var(--color-text-secondary)]">Sign up to get started with Rooeel</p>
                </div>

                {/* Signup form */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-md bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-[var(--color-error)] text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                placeholder="John"
                                autoComplete="given-name"
                                leftIcon={<User className="h-4 w-4" />}
                                error={errors.firstName?.message}
                                {...register('firstName')}
                            />
                            <Input
                                label="Last Name"
                                placeholder="Doe"
                                autoComplete="family-name"
                                leftIcon={<User className="h-4 w-4" />}
                                error={errors.lastName?.message}
                                {...register('lastName')}
                            />
                        </div>

                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            leftIcon={<Mail className="h-4 w-4" />}
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            helperText="Minimum 6 characters"
                            autoComplete="new-password"
                            leftIcon={<Lock className="h-4 w-4" />}
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-xs text-[var(--color-text-tertiary)]">
                        <p>
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
