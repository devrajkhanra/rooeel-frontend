import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signupSchema, type SignupFormData } from '@/utils/validation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg)] via-[var(--color-bg-secondary)] to-[var(--color-bg)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

            {/* Signup card */}
            <Card className="w-full max-w-md relative z-10 animate-scale-in">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                        <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl gradient-text">Create Admin Account</CardTitle>
                    <CardDescription>Sign up to get started with Rooeel</CardDescription>
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
                                leftIcon={<User className="h-4 w-4" />}
                                error={errors.firstName?.message}
                                {...register('firstName')}
                            />
                            <Input
                                label="Last Name"
                                placeholder="Doe"
                                leftIcon={<User className="h-4 w-4" />}
                                error={errors.lastName?.message}
                                {...register('lastName')}
                            />
                        </div>

                        <Input
                            label="Email"
                            type="email"
                            placeholder="admin@example.com"
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
                            size="lg"
                            isLoading={isLoading}
                        >
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-[var(--color-text-tertiary)]">
                        <p>
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-[var(--color-primary)] hover:text-[var(--color-primary-light)] font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
