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

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}
