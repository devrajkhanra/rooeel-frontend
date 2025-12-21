import { apiClient } from './api.client';
import type { Admin, UpdateAdminDto } from '@/types/api.types';

/**
 * Admin Service
 * 
 * Provides CRUD operations for admin management.
 * 
 * NOTE: Admins can ONLY be created through the /auth/signup endpoint.
 * Direct admin creation via /admin endpoint is not available for security reasons.
 * Use authService.signup() to create new admins.
 */
export const adminService = {
    // Get all admins
    getAllAdmins: async (): Promise<Admin[]> => {
        const response = await apiClient.get<Admin[]>('/admin');
        return response.data;
    },

    // Get admin by ID
    getAdminById: async (id: number): Promise<Admin> => {
        const response = await apiClient.get<Admin>(`/admin/${id}`);
        return response.data;
    },

    // Update admin
    updateAdmin: async (id: number, data: UpdateAdminDto): Promise<Admin> => {
        const response = await apiClient.patch<Admin>(`/admin/${id}`, data);
        return response.data;
    },

    // Delete admin
    deleteAdmin: async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/${id}`);
    },
};
