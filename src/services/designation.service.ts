import { apiClient } from './api.client';
import type { Designation, CreateDesignationDto, UpdateDesignationDto } from '@/types/api.types';


/**
 * Designation Service
 * 
 * Provides operations for designation management.
 * All operations require admin authentication.
 */
export const designationService = {
    // Get all designations (admin only)
    getAllDesignations: async (): Promise<Designation[]> => {
        const response = await apiClient.get<Designation[]>('/designation');
        return response.data;
    },

    // Get designation by ID (admin only)
    getDesignationById: async (id: number): Promise<Designation> => {
        const response = await apiClient.get<Designation>(`/designation/${id}`);
        return response.data;
    },

    // Create designation (admin only)
    createDesignation: async (data: CreateDesignationDto): Promise<Designation> => {
        const response = await apiClient.post<Designation>('/designation', data);
        return response.data;
    },

    // Update designation (admin only)
    updateDesignation: async (id: number, data: UpdateDesignationDto): Promise<Designation> => {
        const response = await apiClient.patch<Designation>(`/designation/${id}`, data);
        return response.data;
    },

    // Delete designation (admin only)
    deleteDesignation: async (id: number): Promise<void> => {
        await apiClient.delete(`/designation/${id}`);
    },
};
