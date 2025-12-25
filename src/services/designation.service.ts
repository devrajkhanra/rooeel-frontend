import { apiClient } from './api.client';
import type { Designation, CreateDesignationDto, UpdateDesignationDto } from '@/types/api.types';
import { createLogger } from '@/utils/logger';

const logger = createLogger('DesignationService');

/**
 * Designation Service
 * 
 * Provides operations for designation management.
 * All operations require admin authentication.
 */
export const designationService = {
    // Get all designations (admin only)
    getAllDesignations: async (): Promise<Designation[]> => {
        logger.debug('Fetching all designations');
        const response = await apiClient.get<Designation[]>('/designation');
        logger.debug(`Fetched ${response.data.length} designations`);
        return response.data;
    },

    // Get designation by ID (admin only)
    getDesignationById: async (id: number): Promise<Designation> => {
        logger.debug('Fetching designation by ID', { designationId: id });
        const response = await apiClient.get<Designation>(`/designation/${id}`);
        return response.data;
    },

    // Create designation (admin only)
    createDesignation: async (data: CreateDesignationDto): Promise<Designation> => {
        logger.info('Creating designation', { name: data.name });
        const response = await apiClient.post<Designation>('/designation', data);
        logger.info('Designation created successfully', { designationId: response.data.id });
        return response.data;
    },

    // Update designation (admin only)
    updateDesignation: async (id: number, data: UpdateDesignationDto): Promise<Designation> => {
        logger.info('Updating designation', { designationId: id });
        const response = await apiClient.patch<Designation>(`/designation/${id}`, data);
        logger.info('Designation updated successfully', { designationId: id });
        return response.data;
    },

    // Delete designation (admin only)
    deleteDesignation: async (id: number): Promise<void> => {
        logger.info('Deleting designation', { designationId: id });
        await apiClient.delete(`/designation/${id}`);
        logger.info('Designation deleted successfully', { designationId: id });
    },
};
