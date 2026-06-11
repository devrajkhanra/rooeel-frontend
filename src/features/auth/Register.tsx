import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from '@tanstack/react-router';

const registerSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    console.log('Register Payload:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Registration logic here
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Card: White background, 1px border, no shadow */}
      <div className="w-full max-w-[480px] rounded border border-outline-variant bg-surface-container-lowest p-8">
        
        {/* Header */}
        <div className="mb-6">
          <p className="mb-1 text-label-md font-medium tracking-widest text-outline uppercase">
            PROJECT ALPHA ERP
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
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-label-md font-semibold text-on-surface">
                First name
              </label>
              <input
                type="text"
                {...register('firstName')}
                className="block h-8 w-full rounded border border-outline-variant bg-surface-container-lowest px-2.5 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
                placeholder="Jane"
              />
              {errors.firstName && <p className="mt-1 text-label-sm text-error">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-label-md font-semibold text-on-surface">
                Last name
              </label>
              <input
                type="text"
                {...register('lastName')}
                className="block h-8 w-full rounded border border-outline-variant bg-surface-container-lowest px-2.5 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
                placeholder="Doe"
              />
              {errors.lastName && <p className="mt-1 text-label-sm text-error">{errors.lastName.message}</p>}
            </div>
          </div>

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
            Create the first admin for the workspace.
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-8 w-full items-center justify-center rounded bg-primary px-4 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-70"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

      </div>
    </div>
  );
}