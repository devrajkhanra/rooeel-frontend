import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileEdit, Lock } from 'lucide-react';
import { requestSchema, type RequestFormData } from '@/utils/validation';
import { useCreateRequest } from '@/hooks/useRequests';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { RequestType } from '@/types/api.types';

interface RequestFormProps {
    onSuccess?: () => void;
}

const REQUEST_TYPE_OPTIONS: { value: RequestType; label: string }[] = [
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'email', label: 'Email' },
    { value: 'password', label: 'Password' },
];

export const RequestForm: React.FC<RequestFormProps> = ({ onSuccess }) => {
    const createRequest = useCreateRequest();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<RequestFormData>({
        resolver: zodResolver(requestSchema),
    });

    const requestType = watch('requestType');
    const isPasswordRequest = requestType === 'password';

    const onSubmit = async (data: RequestFormData) => {
        try {
            setError(null);
            setSuccess(null);
            await createRequest.mutateAsync(data);
            setSuccess('Request submitted successfully! Your admin will review it.');
            reset();
            onSuccess?.();
        } catch (err: any) {
            // Extract detailed error information
            const errorMessage = err?.response?.data?.message || err.message || 'Failed to create request';
            const errorDetails = err?.response?.data?.error || '';
            const statusCode = err?.response?.status || '';

            // Construct full error message
            let fullError = errorMessage;
            if (errorDetails && errorDetails !== errorMessage) {
                fullError += `: ${errorDetails}`;
            }
            if (statusCode) {
                fullError += ` (Status: ${statusCode})`;
            }

            // Log comprehensive error information
            console.error('=== REQUEST CREATION ERROR ===');
            console.error('Status:', statusCode);
            console.error('Message:', errorMessage);
            console.error('Details:', errorDetails);
            console.error('Full Response:', err?.response?.data);
            console.error('Request Payload:', data);
            console.error('============================');

            setError(fullError);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="p-3 rounded-md bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-[var(--color-error)] text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3 rounded-md bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 text-[var(--color-success)] text-sm">
                    {success}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-2">
                    Request Type
                </label>
                <select
                    {...register('requestType')}
                    className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                    <option value="">Select what you want to change</option>
                    {REQUEST_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {errors.requestType && (
                    <p className="mt-1 text-xs text-[var(--color-error)]">
                        {errors.requestType.message}
                    </p>
                )}
            </div>

            <Input
                label="New Value"
                type={isPasswordRequest ? 'password' : 'text'}
                placeholder={
                    requestType === 'firstName' ? 'Enter new first name' :
                        requestType === 'lastName' ? 'Enter new last name' :
                            requestType === 'email' ? 'Enter new email' :
                                requestType === 'password' ? 'Enter new password' :
                                    'Select a request type first'
                }
                leftIcon={<FileEdit className="h-4 w-4" />}
                error={errors.requestedValue?.message}
                disabled={!requestType}
                {...register('requestedValue')}
            />

            {isPasswordRequest && (
                <Input
                    label="Current Password"
                    type="password"
                    placeholder="Enter your current password"
                    helperText="Required to verify your identity"
                    leftIcon={<Lock className="h-4 w-4" />}
                    error={errors.currentPassword?.message}
                    {...register('currentPassword')}
                />
            )}

            <div className="p-3 rounded-md bg-[var(--color-info)]/10 border border-[var(--color-info)]/20">
                <p className="text-xs text-[var(--color-text-secondary)]">
                    <strong>Note:</strong> Your request will be sent to your admin for approval.
                    {isPasswordRequest && ' Password change requests cannot be approved by admins for security reasons.'}
                </p>
            </div>

            <Button
                type="submit"
                className="w-full"
                isLoading={createRequest.isPending}
                disabled={!requestType}
            >
                Submit Request
            </Button>
        </form>
    );
};
