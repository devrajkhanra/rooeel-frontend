import { apiClient } from './api.client';
import type { User, CreateUserDto, UpdateUserDto } from '@/types/api.types';
import { createLogger } from '@/utils/logger';

const logger = createLogger('UserService');

/**
 * User Service
 * 
 * Provides CRUD operations for user management.
 * Interacts with the backend /user endpoints.
 */
export const userService = {
    // Create new user
    createUser: async (data: CreateUserDto): Promise<User> => {
        logger.info('Creating new user', { email: data.email });
        const response = await apiClient.post<User>('/user', data);
        logger.info('User created successfully', { userId: response.data.id, email: response.data.email });
        return response.data;
    },

    // Get all users
    getAllUsers: async (): Promise<User[]> => {
        logger.debug('Fetching all users');
        const response = await apiClient.get<User[]>('/user');
        logger.debug(`Fetched ${response.data.length} users`);
        return response.data;
    },

    // Get user by ID
    getUserById: async (id: number): Promise<User> => {
        const response = await apiClient.get<User>(`/user/${id}`);
        return response.data;
    },

    // Update user
    updateUser: async (id: number, data: UpdateUserDto): Promise<User> => {
        logger.info('Updating user', { userId: id });
        const response = await apiClient.patch<User>(`/user/${id}`, data);
        logger.info('User updated successfully', { userId: id });
        return response.data;
    },

    // Delete user
    deleteUser: async (id: number): Promise<void> => {
        logger.info('Deleting user', { userId: id });
        await apiClient.delete(`/user/${id}`);
        logger.info('User deleted successfully', { userId: id });
    },
};
