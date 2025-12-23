import { apiClient } from './api.client';
import type { UserRequest, CreateRequestDto } from '@/types/api.types';
import { createLogger } from '@/utils/logger';

const logger = createLogger('RequestService');

/**
 * Request Service
 * 
 * Provides operations for user change request management.
 * Users can create requests, admins can approve/reject them.
 */
export const requestService = {
    // Create a new change request (user only)
    createRequest: async (data: CreateRequestDto): Promise<UserRequest> => {
        logger.info('Creating change request', {
            requestType: data.requestType,
            payload: data  // Log full payload for debugging
        });

        try {
            const response = await apiClient.post<UserRequest>('/request', data);
            logger.info('Request created successfully', { requestId: response.data.id });
            return response.data;
        } catch (error: any) {
            logger.error('Failed to create request', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                errorData: error.response?.data,
                requestPayload: data,
                message: error.message
            });
            throw error;
        }
    },

    // Get current user's requests (user only)
    getMyRequests: async (): Promise<UserRequest[]> => {
        logger.debug('Fetching my requests');
        const response = await apiClient.get<UserRequest[]>('/request/my-requests');
        logger.debug(`Fetched ${response.data.length} requests`);
        return response.data;
    },

    // Get requests from admin's users (admin only)
    getAdminRequests: async (): Promise<UserRequest[]> => {
        logger.debug('Fetching admin requests');
        const response = await apiClient.get<UserRequest[]>('/request/admin-requests');
        logger.debug(`Fetched ${response.data.length} admin requests`);
        return response.data;
    },

    // Get a specific request by ID
    getRequestById: async (id: number): Promise<UserRequest> => {
        logger.debug('Fetching request by ID', { requestId: id });
        const response = await apiClient.get<UserRequest>(`/request/${id}`);
        return response.data;
    },

    // Approve a request (admin only)
    approveRequest: async (id: number): Promise<UserRequest> => {
        logger.info('Approving request', { requestId: id });
        const response = await apiClient.patch<UserRequest>(`/request/${id}/approve`);
        logger.info('Request approved successfully', { requestId: id });
        return response.data;
    },

    // Reject a request (admin only)
    rejectRequest: async (id: number): Promise<UserRequest> => {
        logger.info('Rejecting request', { requestId: id });
        const response = await apiClient.patch<UserRequest>(`/request/${id}/reject`);
        logger.info('Request rejected successfully', { requestId: id });
        return response.data;
    },
};
