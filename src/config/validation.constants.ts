/**
 * Validation Constants
 * 
 * These constants match the backend validation rules to ensure
 * consistent validation across the application.
 */

export const VALIDATION_RULES = {
    firstName: {
        minLength: 3,
        required: true,
        errorMessage: 'First name must be at least 3 characters',
    },
    lastName: {
        minLength: 3,
        required: true,
        errorMessage: 'Last name must be at least 3 characters',
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessage: 'Please enter a valid email address',
    },
    password: {
        minLength: 6,
        required: true,
        errorMessage: 'Password must be at least 6 characters',
    },
} as const;

/**
 * Validation helper functions
 */
export const validators = {
    validateFirstName: (value: string): string | null => {
        if (!value || value.trim().length === 0) {
            return 'First name is required';
        }
        if (value.length < VALIDATION_RULES.firstName.minLength) {
            return VALIDATION_RULES.firstName.errorMessage;
        }
        return null;
    },

    validateLastName: (value: string): string | null => {
        if (!value || value.trim().length === 0) {
            return 'Last name is required';
        }
        if (value.length < VALIDATION_RULES.lastName.minLength) {
            return VALIDATION_RULES.lastName.errorMessage;
        }
        return null;
    },

    validateEmail: (value: string): string | null => {
        if (!value || value.trim().length === 0) {
            return 'Email is required';
        }
        if (!VALIDATION_RULES.email.pattern.test(value)) {
            return VALIDATION_RULES.email.errorMessage;
        }
        return null;
    },

    validatePassword: (value: string): string | null => {
        if (!value || value.trim().length === 0) {
            return 'Password is required';
        }
        if (value.length < VALIDATION_RULES.password.minLength) {
            return VALIDATION_RULES.password.errorMessage;
        }
        return null;
    },
};
