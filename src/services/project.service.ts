import { apiClient } from './api.client';
import type { Project, CreateProjectDto, UpdateProjectDto, AssignUserDto } from '@/types/api.types';


/**
 * Project Service
 * 
 * Provides operations for project management.
 * Admins can create, update, delete projects and assign users.
 * Users can view projects they're assigned to.
 */
export const projectService = {
    // Get all projects (filtered by role on backend)
    getAllProjects: async (): Promise<Project[]> => {
        const response = await apiClient.get<Project[]>('/project');
        return response.data;
    },

    // Get project by ID
    getProjectById: async (id: number): Promise<Project> => {
        const response = await apiClient.get<Project>(`/project/${id}`);
        return response.data;
    },

    // Create project (admin only)
    createProject: async (data: CreateProjectDto): Promise<Project> => {
        const response = await apiClient.post<Project>('/project', data);
        return response.data;
    },

    // Update project (admin only)
    updateProject: async (id: number, data: UpdateProjectDto): Promise<Project> => {
        const response = await apiClient.patch<Project>(`/project/${id}`, data);
        return response.data;
    },

    // Delete project (admin only)
    deleteProject: async (id: number): Promise<void> => {
        await apiClient.delete(`/project/${id}`);
    },

    // Assign user to project (admin only)
    assignUser: async (projectId: number, data: AssignUserDto): Promise<{ assignedUsers: string[] }> => {
        const response = await apiClient.post<{ assignedUsers: string[] }>(`/project/${projectId}/assign-user`, data);
        return response.data;
    },

    // Remove user from project (admin only)
    removeUser: async (projectId: number, userId: number): Promise<{ assignedUsers: string[] }> => {
        const response = await apiClient.delete<{ assignedUsers: string[] }>(`/project/${projectId}/remove-user/${userId}`);
        return response.data;
    },
};
