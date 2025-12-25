import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { designationService } from '@/services/designation.service';
import type { CreateDesignationDto, UpdateDesignationDto } from '@/types/api.types';

// Query keys
export const designationKeys = {
    all: ['designations'] as const,
    lists: () => [...designationKeys.all, 'list'] as const,
    details: () => [...designationKeys.all, 'detail'] as const,
    detail: (id: number) => [...designationKeys.details(), id] as const,
};

// Get all designations
export const useDesignations = () => {
    return useQuery({
        queryKey: designationKeys.lists(),
        queryFn: () => designationService.getAllDesignations(),
    });
};

// Get designation by ID
export const useDesignationById = (id: number) => {
    return useQuery({
        queryKey: designationKeys.detail(id),
        queryFn: () => designationService.getDesignationById(id),
        enabled: !!id,
    });
};

// Create designation
export const useCreateDesignation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateDesignationDto) => designationService.createDesignation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: designationKeys.lists() });
        },
    });
};

// Update designation
export const useUpdateDesignation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateDesignationDto }) =>
            designationService.updateDesignation(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: designationKeys.lists() });
            queryClient.invalidateQueries({ queryKey: designationKeys.detail(variables.id) });
        },
    });
};

// Delete designation
export const useDeleteDesignation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => designationService.deleteDesignation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: designationKeys.lists() });
        },
    });
};
