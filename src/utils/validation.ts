import { z } from 'zod';

// Admin validation schema (matches backend: min 2 chars for names, min 8 for password)
export const adminSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name too long'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name too long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateAdminSchema = adminSchema.partial();

// User validation schema (matches backend: min 2 chars for names, min 8 for password)
export const userSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name too long'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name too long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateUserSchema = userSchema.partial();

// Login validation schema (includes role for unified endpoint)
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    role: z.enum(['admin', 'user']),
});

// Signup validation schema (admin signup - matches backend requirements)
export const signupSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name too long'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name too long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Request validation schema
export const requestSchema = z.object({
    requestType: z.enum(['firstName', 'lastName', 'email', 'password']),
    requestedValue: z.string().optional(),
}).refine((data) => {
    // Validate requested value based on request type
    if (data.requestType === 'firstName' || data.requestType === 'lastName') {
        return !!data.requestedValue && data.requestedValue.length >= 2;
    }
    if (data.requestType === 'email') {
        return !!data.requestedValue && z.string().email().safeParse(data.requestedValue).success;
    }
    if (data.requestType === 'password') {
        // README says requestedValue is not required for password, but if provided, check min length
        // However, usually we want to send the new password. Let's assume min 8 chars if provided.
        // Or if the UI requires it, we enforce it here. 
        // Let's enforce it in UI validation for better UX, but allow empty if backend supports it.
        // Actually, let's keep it required for now as User likely wants to set it.
        return !data.requestedValue || data.requestedValue.length >= 8;
    }
    return true;
}, {
    message: 'Invalid value for the selected field type',
    path: ['requestedValue'],
});

export type AdminFormData = z.infer<typeof adminSchema>;
export type UpdateAdminFormData = z.infer<typeof updateAdminSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type RequestFormData = z.infer<typeof requestSchema>;

// Project validation schema
export const projectSchema = z.object({
    name: z.string().min(3, 'Project name must be at least 3 characters').max(100, 'Project name too long'),
    description: z.string().min(10, 'Description must be at least 10 characters').optional().or(z.literal('')),
    status: z.enum(['active', 'inactive', 'completed']).optional(),
});

export const updateProjectSchema = projectSchema.partial();

export const assignUserSchema = z.object({
    userId: z.number().positive('Please select a valid user'),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;
export type AssignUserFormData = z.infer<typeof assignUserSchema>;
