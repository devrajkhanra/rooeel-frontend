import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import type { UpdateAdminDto } from '@/types/api.types';
import { QUERY_KEYS } from '@/config/constants';

// Fetch all admins
export const useAdmins = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.ADMINS],
        queryFn: adminService.getAllAdmins,
    });
};

// Fetch single admin
export const useAdmin = (id: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.ADMIN, id],
        queryFn: () => adminService.getAdminById(id),
        enabled: !!id,
    });
};

/**
 * NOTE: Admin creation is not available through this hook.
 * Admins can ONLY be created through the /auth/signup endpoint.
 * Use authService.signup() to create new admins.
 */

// Update admin mutation
export const useUpdateAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateAdminDto }) =>
            adminService.updateAdmin(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, variables.id] });
        },
    });
};

// Delete admin mutation
export const useDeleteAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => adminService.deleteAdmin(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
        },
    });
};
