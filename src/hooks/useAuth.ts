import { useAuthStore } from '@/stores/auth.store';
import { authService } from '@/services/auth.service';
import type { LoginCredentials, SignupCredentials } from '@/types/auth.types';

export const useAuth = () => {
    const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

    // Admin signup (only way to create admins)
    const signup = async (credentials: SignupCredentials) => {
        const { user, token } = await authService.signup(credentials);
        setAuth(user, token);
        return user;
    };

    // Unified login (works for both admin and user with role parameter)
    const login = async (credentials: LoginCredentials) => {
        const { user, token } = await authService.login(credentials);
        setAuth(user, token);
        return user;
    };

    // Unified logout (works for both admin and user)
    const logout = async () => {
        await authService.logout();
        clearAuth();
    };

    return {
        user,
        isAuthenticated,
        signup,
        login,
        logout,
    };
};
