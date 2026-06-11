import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from '@tanstack/react-router';
import { useAuthStore } from '../../store/useAuthStore';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log('Login Payload:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    login({ id: '1', email: data.email, role: 'ADMIN' }, 'mock-jwt-token');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Card: White background, 1px border, no shadow */}
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
          {/* Email */}
          <div>
            <label className="mb-1 block text-label-md font-semibold text-on-surface">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="block h-8 w-full rounded border border-outline-variant bg-surface-container-lowest px-2.5 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
              placeholder="jane.doe@company.com"
            />
            {errors.email && <p className="mt-1 text-label-sm text-error">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-label-md font-semibold text-on-surface">
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              className="block h-8 w-full rounded border border-outline-variant bg-surface-container-lowest px-2.5 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-label-sm text-error">{errors.password.message}</p>}
          </div>

          {/* Subtext */}
          <p className="pt-2 text-body-sm text-on-surface-variant">
            Sign in with your admin credentials.
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-8 w-full items-center justify-center rounded bg-primary px-4 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-70"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <a href="#" className="text-body-sm font-medium text-primary hover:underline">
            Forgot password?
          </a>
        </div>

      </div>
    </div>
  );
}