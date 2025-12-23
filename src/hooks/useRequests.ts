import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { requestService } from '@/services/request.service';
import type { CreateRequestDto } from '@/types/api.types';
import { QUERY_KEYS } from '@/config/constants';

// Fetch user's own requests
export const useMyRequests = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.MY_REQUESTS],
        queryFn: requestService.getMyRequests,
    });
};

// Fetch admin's users' requests
export const useAdminRequests = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.ADMIN_REQUESTS],
        queryFn: requestService.getAdminRequests,
    });
};

// Create a new request
export const useCreateRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateRequestDto) => requestService.createRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_REQUESTS] });
        },
    });
};

// Approve a request (admin only)
export const useApproveRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => requestService.approveRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_REQUESTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
        },
    });
};

// Reject a request (admin only)
export const useRejectRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => requestService.rejectRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_REQUESTS] });
        },
    });
};
