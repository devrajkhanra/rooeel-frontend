import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, LogIn } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showToast } from '@/utils/toast';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, userLogin } = useAuth();
    const [role, setRole] = useState<'admin' | 'user'>('user');
    const [isLoading, setIsLoading] = useState(false);

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
            if (role === 'admin') {
                await login(data);
            } else {
                await userLogin(data);
            }
            showToast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err: any) {
            showToast.error(err?.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-primary)] mb-4">
                        <span className="text-black font-bold text-xl">R</span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Welcome to Rooeel</h1>
                    <p className="text-[var(--color-text-secondary)]">Sign in to your account</p>
                </div>

                {/* Login Form */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8">
                    {/* Role Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-3">Sign in as</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole('user')}
                                className={`px-4 py-2.5 rounded-lg border-2 transition-all ${role === 'user'
                                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-text)]'
                                    : 'border-[var(--color-border)] hover:border-[var(--color-border-light)] text-[var(--color-text-secondary)]'
                                    }`}
                            >
                                <p className="font-medium text-sm">User</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                className={`px-4 py-2.5 rounded-lg border-2 transition-all ${role === 'admin'
                                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-text)]'
                                    : 'border-[var(--color-border)] hover:border-[var(--color-border-light)] text-[var(--color-text-secondary)]'
                                    }`}
                            >
                                <p className="font-medium text-sm">Admin</p>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                            variant="primary"
                            className="w-full"
                            isLoading={isLoading}
                            leftIcon={<LogIn className="h-4 w-4" />}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-[var(--color-text-tertiary)] mt-8">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};
