import { z } from 'zod';

// Admin validation schema (matches backend: min 3 chars for names, min 6 for password)
export const adminSchema = z.object({
    firstName: z.string().min(3, 'First name must be at least 3 characters').max(50, 'First name too long'),
    lastName: z.string().min(3, 'Last name must be at least 3 characters').max(50, 'Last name too long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const updateAdminSchema = adminSchema.partial();

// User validation schema (matches backend: min 3 chars for names, min 6 for password)
export const userSchema = z.object({
    firstName: z.string().min(3, 'First name must be at least 3 characters').max(50, 'First name too long'),
    lastName: z.string().min(3, 'Last name must be at least 3 characters').max(50, 'Last name too long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const updateUserSchema = userSchema.partial();

// Login validation schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Signup validation schema (admin signup - matches backend requirements)
export const signupSchema = z.object({
    firstName: z.string().min(3, 'First name must be at least 3 characters').max(50, 'First name too long'),
    lastName: z.string().min(3, 'Last name must be at least 3 characters').max(50, 'Last name too long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type AdminFormData = z.infer<typeof adminSchema>;
export type UpdateAdminFormData = z.infer<typeof updateAdminSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
