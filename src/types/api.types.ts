export interface Admin {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string; // Optional as it shouldn't be returned from API
    createdAt: string;
}

export interface CreateAdminDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UpdateAdminDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string; // Optional as it shouldn't be returned from API
    createdBy?: number; // Foreign key to Admin
    createdAt: string;
}

export interface CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
}

export interface ResetPasswordDto {
    password: string;
}

// Request Management Types
export type RequestType = 'firstName' | 'lastName' | 'email' | 'password';
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface UserRequest {
    id: number;
    userId: number;
    adminId: number;
    requestType: RequestType;
    currentValue: string;
    requestedValue: string;
    status: RequestStatus;
    createdAt: string;
    updatedAt: string;
    // Relations
    user?: User;
    admin?: Admin;
}

export interface CreateRequestDto {
    requestType: RequestType;
    requestedValue?: string; // Optional for password changes per README
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}

// Project Management Types
export type ProjectStatus = 'active' | 'inactive' | 'completed';

export interface Project {
    id: number;
    name: string;
    description?: string;
    status: ProjectStatus;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
    // Relations (when included)
    users?: ProjectUser[];  // Array of ProjectUser objects with nested user data
    admin?: Admin;
}

export interface ProjectUser {
    id: number;
    projectId: number;
    userId: number;
    assignedAt: string;
    // Nested user data from backend
    user?: User;
}

export interface CreateProjectDto {
    name: string;
    description?: string;
    status?: ProjectStatus;
}

export interface UpdateProjectDto {
    name?: string;
    description?: string;
    status?: ProjectStatus;
}

export interface AssignUserDto {
    userId: number;
}
