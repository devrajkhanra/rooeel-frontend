import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useAuthStore';
import { unauthenticatedGraphQLClient } from '../../lib/graphql-client';
import { REGISTER_MUTATION } from '../../lib/graphql/auth.operations';
import type { AuthPayload } from '../../types/auth.types';

const registerSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(10, { message: 'Password must be at least 10 characters' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function Register() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const result = await unauthenticatedGraphQLClient.request<{
        registerAdmin: AuthPayload;
      }>(
        REGISTER_MUTATION,
        { input: data },
      );
      return result.registerAdmin;
    },
    onSuccess: (payload) => {
      login(
        payload.user,
        payload.accessToken,
        payload.refreshToken,
        payload.expiresInSeconds,
      );
      navigate({ to: '/projects' });
    },
    onError: (error: Error) => {
      const message =
        error.message?.includes('already exists')
          ? 'An account with this email already exists.'
          : 'Registration failed. Please try again.';
      setError('root', { message });
    },
  });

  const onSubmit = (data: RegisterFormValues) => registerMutation.mutate(data);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-[480px] rounded border border-outline-variant bg-surface-container-lowest p-8">

        {/* Header */}
        <div className="mb-6">
          <p className="mb-1 text-label-md font-medium tracking-widest text-outline uppercase">
            ROOEEL ERP
          </p>
          <h1 className="mb-1 text-headline-lg font-semibold text-on-surface">Create admin account</h1>
          <p className="text-body-sm text-on-surface-variant">
            Admin-only setup. Create the admin account that will manage projects and tendering.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="mb-8 flex w-max items-center rounded bg-surface-container-low p-1">
          <div className="rounded bg-primary px-4 py-1.5 text-body-sm font-medium text-on-primary">
            Register
          </div>
          <Link
            to="/"
            className="rounded px-4 py-1.5 text-body-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Login
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root && (
            <p className="rounded bg-error/10 p-2 text-body-sm text-error border border-error/20">
              {errors.root.message}
            </p>
          )}

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-label-md font-semibold text-on-surface">
                First name
              </label>
              <input
                id="register-first-name"
                type="text"
                {...register('firstName')}
                className="block h-8 w-full rounded border border-outline-variant bg-surface-container-lowest px-2.5 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
                placeholder="Jane"
              />
              {errors.firstName && (
                <p className="mt-1 text-label-sm text-error">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-label-md font-semibold text-on-surface">
                Last name
              </label>
              <input
                id="register-last-name"
                type="text"
                {...register('lastName')}
                className="block h-8 w-full rounded border border-outline-variant bg-surface-container-lowest px-2.5 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-label-sm text-error">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-label-md font-semibold text-on-surface">
              Email
            </label>
            <input
              id="register-email"
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
              id="register-password"
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
            Create the first admin for the workspace.
          </p>

          <button
            id="register-submit"
            type="submit"
            disabled={registerMutation.isPending}
            className="flex h-8 w-full items-center justify-center rounded bg-primary px-4 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-70"
          >
            {registerMutation.isPending ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
