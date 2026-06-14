import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';
import type { AdminUser, UserStatus } from '../../types/user.types';

const userSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string(),
  status: z.enum(['ACTIVE', 'INVITED', 'SUSPENDED']),
});

export type UserFormValues = z.infer<typeof userSchema>;
export type UserEditFormValues = UserFormValues;

interface Props {
  user?: AdminUser | null;
  isLoading?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (values: UserFormValues | UserEditFormValues) => Promise<void>;
}

const STATUS_OPTIONS: UserStatus[] = ['ACTIVE', 'INVITED', 'SUSPENDED'];

export function UserFormModal({
  user,
  isLoading = false,
  error,
  onClose,
  onSubmit,
}: Props) {
  const isEdit = Boolean(user);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<UserFormValues | UserEditFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      password: '',
      status: user?.status ?? 'ACTIVE',
    },
  });

  useEffect(() => {
    reset({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      password: '',
      status: user?.status ?? 'ACTIVE',
    });
  }, [reset, user]);

  const submit = async (values: UserFormValues | UserEditFormValues) => {
    const password = values.password.trim();
    if (!isEdit && password.length < 10) {
      setError('password', { message: 'Password must be at least 10 characters' });
      return;
    }
    if (isEdit && password.length > 0 && password.length < 10) {
      setError('password', {
        message: 'Password must be blank or at least 10 characters',
      });
      return;
    }
    await onSubmit(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[520px] rounded bg-surface-container-lowest shadow-popover">
        <div className="flex items-center justify-between border-b border-outline-variant p-4">
          <div>
            <h2 className="text-headline-md font-semibold text-on-surface">
              {isEdit ? 'Edit User' : 'Create User'}
            </h2>
            <p className="text-label-md text-outline">
              {isEdit ? 'Update identity, access status, or password.' : 'Add an admin user.'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded p-1 text-outline transition-colors hover:bg-surface-container hover:text-on-surface disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4 p-4">
          {error && (
            <p className="rounded border border-error/20 bg-error/10 p-2 text-body-sm text-error">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-body-sm font-semibold text-on-surface">
                First Name <span className="text-error">*</span>
              </label>
              <input
                {...register('firstName')}
                className="block w-full rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-container/40"
              />
              {errors.firstName && (
                <p className="mt-1 text-label-sm text-error">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-body-sm font-semibold text-on-surface">
                Last Name <span className="text-error">*</span>
              </label>
              <input
                {...register('lastName')}
                className="block w-full rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-container/40"
              />
              {errors.lastName && (
                <p className="mt-1 text-label-sm text-error">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-body-sm font-semibold text-on-surface">
              Email <span className="text-error">*</span>
            </label>
            <input
              type="email"
              {...register('email')}
              className="block w-full rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-container/40"
            />
            {errors.email && (
              <p className="mt-1 text-label-sm text-error">{errors.email.message}</p>
            )}
          </div>

          <div className={`grid grid-cols-1 gap-3 ${isEdit ? 'sm:grid-cols-2' : ''}`}>
            <div>
              <label className="mb-1 block text-body-sm font-semibold text-on-surface">
                Password {!isEdit && <span className="text-error">*</span>}
              </label>
              <input
                type="password"
                autoComplete="new-password"
                {...register('password')}
                placeholder={isEdit ? 'Leave blank to keep current' : ''}
                className="block w-full rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
              />
              {errors.password && (
                <p className="mt-1 text-label-sm text-error">{errors.password.message}</p>
              )}
            </div>

            {isEdit && (
              <div>
                <label className="mb-1 block text-body-sm font-semibold text-on-surface">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="block h-[38px] w-full rounded border border-outline-variant bg-surface-container-lowest p-2 text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-container/40"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-outline-variant pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="h-8 rounded px-3 text-body-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-8 items-center gap-1.5 rounded bg-primary px-4 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-70"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
