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

    // Admin login
    const login = async (credentials: LoginCredentials) => {
        const { user, token } = await authService.login(credentials);
        setAuth(user, token);
        return user;
    };

    // User login
    const userLogin = async (credentials: LoginCredentials) => {
        const { user, token } = await authService.userLogin(credentials);
        setAuth(user, token);
        return user;
    };

    // Admin logout
    const logout = async () => {
        const currentUser = user;
        if (currentUser?.role === 'user') {
            await authService.userLogout();
        } else {
            await authService.logout();
        }
        clearAuth();
    };

    return {
        user,
        isAuthenticated,
        signup,
        login,
        userLogin,
        logout,
    };
};
