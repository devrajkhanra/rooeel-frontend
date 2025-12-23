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
}

export interface CreateRequestDto {
    requestType: RequestType;
    requestedValue: string;
    currentPassword?: string; // Required for password changes
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
