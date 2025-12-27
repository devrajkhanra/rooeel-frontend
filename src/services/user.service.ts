import { apiClient } from './api.client';
import type { User, CreateUserDto, UpdateUserDto, ResetPasswordDto } from '@/types/api.types';


/**
 * User Service
 * 
 * Provides CRUD operations for user management.
 * Interacts with the backend /user endpoints.
 */
export const userService = {
    // Create new user
    createUser: async (data: CreateUserDto): Promise<User> => {
        const response = await apiClient.post<User>('/user', data);
        return response.data;
    },

    // Get all users
    getAllUsers: async (): Promise<User[]> => {
        const response = await apiClient.get<User[]>('/user');
        return response.data;
    },

    // Get user by ID
    getUserById: async (id: number): Promise<User> => {
        const response = await apiClient.get<User>(`/user/${id}`);
        return response.data;
    },

    // Update user
    updateUser: async (id: number, data: UpdateUserDto): Promise<User> => {
        const response = await apiClient.patch<User>(`/user/${id}`, data);
        return response.data;
    },

    // Reset user password (admin only)
    resetPassword: async (id: number, data: ResetPasswordDto): Promise<User> => {
        const response = await apiClient.patch<User>(`/user/${id}/reset-password`, data);
        return response.data;
    },

    // Delete user
    deleteUser: async (id: number): Promise<void> => {
        await apiClient.delete(`/user/${id}`);
    },
};
