import toast from 'react-hot-toast';

/**
 * Toast Utility
 * 
 * Professional toast notifications with Supabase-like styling
 */

const defaultOptions = {
    duration: 4000,
    position: 'top-right' as const,
    style: {
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        maxWidth: '400px',
        boxShadow: 'var(--shadow-lg)',
    },
};

export const showToast = {
    success: (message: string) => {
        toast.success(message, {
            ...defaultOptions,
            iconTheme: {
                primary: 'var(--color-success)',
                secondary: 'var(--color-surface)',
            },
        });
    },

    error: (message: string) => {
        toast.error(message, {
            ...defaultOptions,
            iconTheme: {
                primary: 'var(--color-error)',
                secondary: 'var(--color-surface)',
            },
        });
    },

    loading: (message: string) => {
        return toast.loading(message, defaultOptions);
    },

    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading,
                success: messages.success,
                error: messages.error,
            },
            defaultOptions
        );
    },

    dismiss: (toastId?: string) => {
        toast.dismiss(toastId);
    },
};
