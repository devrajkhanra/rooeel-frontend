import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/config/constants';
import { createLogger } from '@/utils/logger';

const logger = createLogger('ApiClient');

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            logger.debug(`${config.method?.toUpperCase()} ${config.url} [Auth: ✓]`);
        } else {
            logger.warn(`${config.method?.toUpperCase()} ${config.url} [Auth: ✗ - No token found]`);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        logger.debug(`${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        return response;
    },
    (error: AxiosError) => {
        const status = error.response?.status;
        const url = error.config?.url;

        if (status === 401) {
            logger.warn(`401 Unauthorized - ${url}`, {
                message: error.message,
                responseData: error.response?.data,
                headers: error.config?.headers?.Authorization ? 'Token present' : 'No token'
            });
            logger.warn(`Redirecting to login and clearing auth data`);
            // Clear auth data on unauthorized
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
            window.location.href = '/login';
        } else {
            logger.error(`API Error - ${error.config?.method?.toUpperCase()} ${url}`, {
                status,
                message: error.message,
                data: error.response?.data,
            });
        }
        return Promise.reject(error);
    }
);
