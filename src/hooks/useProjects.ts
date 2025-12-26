import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/project.service';
import type { CreateProjectDto, UpdateProjectDto, AssignUserDto } from '@/types/api.types';

// Query keys
export const projectKeys = {
    all: ['projects'] as const,
    lists: () => [...projectKeys.all, 'list'] as const,
    list: (filters: string) => [...projectKeys.lists(), { filters }] as const,
    details: () => [...projectKeys.all, 'detail'] as const,
    detail: (id: number) => [...projectKeys.details(), id] as const,
};

// Get all projects
export const useProjects = () => {
    return useQuery({
        queryKey: projectKeys.lists(),
        queryFn: () => projectService.getAllProjects(),
    });
};

// Get project by ID
export const useProjectById = (id: number) => {
    return useQuery({
        queryKey: projectKeys.detail(id),
        queryFn: () => projectService.getProjectById(id),
        enabled: !!id,
    });
};

// Create project
export const useCreateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateProjectDto) => projectService.createProject(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
};

// Update project
export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateProjectDto }) =>
            projectService.updateProject(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) });
        },
    });
};

// Delete project
export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => projectService.deleteProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
};

// Assign user to project
export const useAssignUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, data }: { projectId: number; data: AssignUserDto }) =>
            projectService.assignUser(projectId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
};

// Remove user from project
export const useRemoveUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, userId }: { projectId: number; userId: number }) =>
            projectService.removeUser(projectId, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
};

// Assign designation to project
export const useAssignDesignationToProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, designationId }: { projectId: number; designationId: number }) =>
            projectService.assignDesignationToProject(projectId, designationId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
};

// Remove designation from project
export const useRemoveDesignationFromProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, designationId }: { projectId: number; designationId: number }) =>
            projectService.removeDesignationFromProject(projectId, designationId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
};

// Get project designations
export const useProjectDesignations = (projectId: number) => {
    return useQuery({
        queryKey: [...projectKeys.detail(projectId), 'designations'],
        queryFn: () => projectService.getProjectDesignations(projectId),
        enabled: !!projectId,
    });
};

// Set user designation within project
export const useSetUserDesignation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, userId, designationId }: { projectId: number; userId: number; designationId: number }) =>
            projectService.setUserDesignation(projectId, userId, designationId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
};

// Remove user designation from project
export const useRemoveUserDesignation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, userId }: { projectId: number; userId: number }) =>
            projectService.removeUserDesignation(projectId, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
};
