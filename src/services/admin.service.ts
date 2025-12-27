import { apiClient } from './api.client';
import type { Admin, CreateAdminDto, UpdateAdminDto } from '@/types/api.types';


/**
 * Admin Service
 * 
 * Provides CRUD operations for admin management.
 */
export const adminService = {
    // Create new admin (admin only)
    createAdmin: async (data: CreateAdminDto): Promise<Admin> => {
        const response = await apiClient.post<Admin>('/admin', data);
        return response.data;
    },
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
