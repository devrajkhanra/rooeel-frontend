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
    assignUser: async (projectId: number, data: AssignUserDto): Promise<{ assignedUsers: string[] }> => {
        logger.info(`Assigning user ${data.userId} to project ${projectId}`);
        const response = await apiClient.post<{ assignedUsers: string[] }>(`/project/${projectId}/assign-user`, data);
        logger.info(`User assigned successfully. Assigned users: ${response.data.assignedUsers.join(', ')}`);
        return response.data;
    },

    // Remove user from project (admin only)
    removeUser: async (projectId: number, userId: number): Promise<{ assignedUsers: string[] }> => {
        logger.info(`Removing user ${userId} from project ${projectId}`);
        const response = await apiClient.delete<{ assignedUsers: string[] }>(`/project/${projectId}/remove-user/${userId}`);
        logger.info(`User removed successfully. Remaining users: ${response.data.assignedUsers.join(', ')}`);
        return response.data;
    },

    // Assign designation to project (admin only)
    assignDesignationToProject: async (projectId: number, designationId: number): Promise<{ message: string }> => {
        logger.info(`Assigning designation ${designationId} to project ${projectId}`);
        const response = await apiClient.post<{ message: string }>(`/project/${projectId}/designations`, { designationId });
        logger.info('Designation assigned to project successfully');
        return response.data;
    },

    // Remove designation from project (admin only)
    removeDesignationFromProject: async (projectId: number, designationId: number): Promise<{ message: string }> => {
        logger.info(`Removing designation ${designationId} from project ${projectId}`);
        const response = await apiClient.delete<{ message: string }>(`/project/${projectId}/designations/${designationId}`);
        logger.info('Designation removed from project successfully');
        return response.data;
    },

    // Get all designations assigned to a project
    getProjectDesignations: async (projectId: number): Promise<any[]> => {
        logger.debug(`Fetching designations for project ${projectId}`);
        const response = await apiClient.get<any[]>(`/project/${projectId}/designations`);
        logger.debug(`Fetched ${response.data.length} designations for project`);
        return response.data;
    },

    // Set user designation within a project (admin only)
    setUserDesignation: async (projectId: number, userId: number, designationId: number): Promise<any> => {
        logger.info(`Setting designation ${designationId} for user ${userId} in project ${projectId}`);
        const response = await apiClient.patch<any>(`/project/${projectId}/user/${userId}/designation`, { designationId });
        logger.info('User designation set successfully');
        return response.data;
    },

    // Remove user designation from project (admin only)
    removeUserDesignation: async (projectId: number, userId: number): Promise<any> => {
        logger.info(`Removing designation for user ${userId} from project ${projectId}`);
        const response = await apiClient.delete<any>(`/project/${projectId}/user/${userId}/designation`);
        logger.info('User designation removed successfully');
        return response.data;
    },
};
