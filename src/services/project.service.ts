import { apiClient } from './api.client';
import type { Project, CreateProjectDto, UpdateProjectDto, AssignUserDto } from '@/types/api.types';
import { createLogger } from '@/utils/logger';

const logger = createLogger('ProjectService');

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
        logger.debug('Fetching all projects');
        const response = await apiClient.get<Project[]>('/project');
        logger.debug(`Fetched ${response.data.length} projects`);
        return response.data;
    },

    // Get project by ID
    getProjectById: async (id: number): Promise<Project> => {
        logger.debug('Fetching project by ID', { projectId: id });
        const response = await apiClient.get<Project>(`/project/${id}`);
        return response.data;
    },

    // Create project (admin only)
    createProject: async (data: CreateProjectDto): Promise<Project> => {
        logger.info('Creating project', { name: data.name });
        const response = await apiClient.post<Project>('/project', data);
        logger.info('Project created successfully', { projectId: response.data.id });
        return response.data;
    },

    // Update project (admin only)
    updateProject: async (id: number, data: UpdateProjectDto): Promise<Project> => {
        logger.info('Updating project', { projectId: id });
        const response = await apiClient.patch<Project>(`/project/${id}`, data);
        logger.info('Project updated successfully', { projectId: id });
        return response.data;
    },

    // Delete project (admin only)
    deleteProject: async (id: number): Promise<void> => {
        logger.info('Deleting project', { projectId: id });
        await apiClient.delete(`/project/${id}`);
        logger.info('Project deleted successfully', { projectId: id });
    },

    // Assign user to project (admin only)
    assignUser: async (projectId: number, data: AssignUserDto): Promise<void> => {
        logger.info('Assigning user to project', { projectId, userId: data.userId });
        await apiClient.post(`/project/${projectId}/assign-user`, data);
        logger.info('User assigned successfully', { projectId, userId: data.userId });
    },

    // Remove user from project (admin only)
    removeUser: async (projectId: number, userId: number): Promise<void> => {
        logger.info('Removing user from project', { projectId, userId });
        await apiClient.delete(`/project/${projectId}/remove-user/${userId}`);
        logger.info('User removed successfully', { projectId, userId });
    },
};
