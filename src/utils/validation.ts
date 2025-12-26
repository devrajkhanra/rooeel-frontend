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
    requestType: z.enum(['firstName', 'lastName', 'email', 'password'], {
        required_error: 'Please select a request type',
    }),
    requestedValue: z.string().min(1, 'Requested value is required'),
    currentPassword: z.string().optional(),
}).refine((data) => {
    // Current password is required for password change requests
    if (data.requestType === 'password' && !data.currentPassword) {
        return false;
    }
    return true;
}, {
    message: 'Current password is required for password changes',
    path: ['currentPassword'],
}).refine((data) => {
    // Validate requested value based on request type
    if (data.requestType === 'firstName' || data.requestType === 'lastName') {
        return data.requestedValue.length >= 3;
    }
    if (data.requestType === 'email') {
        return z.string().email().safeParse(data.requestedValue).success;
    }
    if (data.requestType === 'password') {
        return data.requestedValue.length >= 6;
    }
    return true;
}, (data) => ({
    message:
        data.requestType === 'firstName' || data.requestType === 'lastName'
            ? 'Name must be at least 3 characters'
            : data.requestType === 'email'
                ? 'Invalid email address'
                : 'Password must be at least 6 characters',
    path: ['requestedValue'],
}));

export type AdminFormData = z.infer<typeof adminSchema>;
export type UpdateAdminFormData = z.infer<typeof updateAdminSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type RequestFormData = z.infer<typeof requestSchema>;

// Designation validation
export const createDesignationSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must not exceed 500 characters').optional().or(z.literal('')),
});

export const updateDesignationSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must not exceed 500 characters').optional().or(z.literal('')),
});

export type CreateDesignationFormData = z.infer<typeof createDesignationSchema>;
export type UpdateDesignationFormData = z.infer<typeof updateDesignationSchema>;

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
