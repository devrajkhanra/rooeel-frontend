import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useAuthStore';
import { graphQLClient } from '../../lib/graphql-client';
import { LOGIN_MUTATION } from '../../lib/graphql/auth.operations';
import type { AuthPayload } from '../../types/auth.types';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(10, { message: 'Password must be at least 10 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const result = await graphQLClient.request<{ login: AuthPayload }>(
        LOGIN_MUTATION,
        { input: data },
      );
      return result.login;
    },
    onSuccess: (payload) => {
      login(payload.user, payload.accessToken, payload.refreshToken);
      navigate({ to: '/projects' });
    },
    onError: (error: Error) => {
      const message =
        error.message?.includes('Invalid credentials')
          ? 'Invalid email or password.'
          : 'An error occurred. Please try again.';
      setError('root', { message });
    },
  });

  const onSubmit = (data: LoginFormValues) => loginMutation.mutate(data);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-[480px] rounded border border-outline-variant bg-surface-container-lowest p-8">

        {/* Header */}
        <div className="mb-6">
          <p className="mb-1 text-label-md font-medium tracking-widest text-outline uppercase">
            ROOEEL ERP
          </p>
          <h1 className="mb-1 text-headline-lg font-semibold text-on-surface">Sign in</h1>
          <p className="text-body-sm text-on-surface-variant">
            Admin sign-in for project and tendering management.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="mb-8 flex w-max items-center rounded bg-surface-container-low p-1">
          <Link
            to="/register"
            className="rounded px-4 py-1.5 text-body-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Register
          </Link>
          <div className="rounded bg-primary px-4 py-1.5 text-body-sm font-medium text-on-primary">
            Login
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Root error */}
          {errors.root && (
            <p className="rounded bg-error/10 p-2 text-body-sm text-error border border-error/20">
              {errors.root.message}
            </p>
          )}

          {/* Email */}
          <div>
            <label className="mb-1 block text-label-md font-semibold text-on-surface">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              {...register('email')}
              className="block h-8 w-full rounded border border-outline-variant bg-surface-container-lowest px-2.5 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
              placeholder="jane.doe@company.com"
            />
            {errors.email && (
              <p className="mt-1 text-label-sm text-error">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-label-md font-semibold text-on-surface">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              {...register('password')}
              className="block h-8 w-full rounded border border-outline-variant bg-surface-container-lowest px-2.5 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-label-sm text-error">{errors.password.message}</p>
            )}
          </div>

          <p className="pt-2 text-body-sm text-on-surface-variant">
            Sign in with your admin credentials.
          </p>

          <button
            id="login-submit"
            type="submit"
            disabled={loginMutation.isPending}
            className="flex h-8 w-full items-center justify-center rounded bg-primary px-4 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-70"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-body-sm font-medium text-primary hover:underline">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}