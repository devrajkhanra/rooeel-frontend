import { apiClient } from './api.client';
import type { UserRequest, CreateRequestDto } from '@/types/api.types';


/**
 * Request Service
 * 
 * Provides operations for user change request management.
 * Users can create requests, admins can approve/reject them.
 */
export const requestService = {
    // Create a new change request (user only)
    createRequest: async (data: CreateRequestDto): Promise<UserRequest> => {

        try {
            const response = await apiClient.post<UserRequest>('/request', data);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    // Get current user's requests (user only)
    getMyRequests: async (): Promise<UserRequest[]> => {
        const response = await apiClient.get<UserRequest[]>('/request');
        return response.data;
    },

    // Get requests from admin's users (admin only)
    getAdminRequests: async (): Promise<UserRequest[]> => {
        const response = await apiClient.get<UserRequest[]>('/request/admin');
        return response.data;
    },

    // Get a specific request by ID
    getRequestById: async (id: number): Promise<UserRequest> => {
        const response = await apiClient.get<UserRequest>(`/request/${id}`);
        return response.data;
    },

    // Approve a request (admin only)
    approveRequest: async (id: number): Promise<UserRequest> => {
        const response = await apiClient.patch<UserRequest>(`/request/${id}/approve`);
        return response.data;
    },

    // Reject a request (admin only)
    rejectRequest: async (id: number): Promise<UserRequest> => {
        const response = await apiClient.patch<UserRequest>(`/request/${id}/reject`);
        return response.data;
    },
};
