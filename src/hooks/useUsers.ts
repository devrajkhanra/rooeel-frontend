import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import type { CreateUserDto, UpdateUserDto } from '@/types/api.types';
import { QUERY_KEYS } from '@/config/constants';

// Fetch all users
export const useUsers = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.USERS],
        queryFn: userService.getAllUsers,
    });
};

// Fetch single user
export const useUser = (id: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.USER, id],
        queryFn: () => userService.getUserById(id),
        enabled: !!id,
    });
};

// Create user mutation
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateUserDto) => userService.createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
        },
    });
};

// Update user mutation
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) =>
            userService.updateUser(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER, variables.id] });
        },
    });
};

// Delete user mutation
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => userService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
        },
    });
};
