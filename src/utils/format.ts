import { format, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
    try {
        const date = parseISO(dateString);
        return format(date, 'MMM dd, yyyy');
    } catch {
        return dateString;
    }
};

export const formatDateTime = (dateString: string): string => {
    try {
        const date = parseISO(dateString);
        return format(date, 'MMM dd, yyyy HH:mm');
    } catch {
        return dateString;
    }
};

export const formatName = (firstName: string, lastName: string): string => {
    return `${firstName} ${lastName}`.trim();
};

export const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};
