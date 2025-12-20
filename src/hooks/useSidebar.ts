import { useState, useEffect } from 'react';

const SIDEBAR_STORAGE_KEY = 'sidebar-collapsed';

export const useSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        // Initialize from localStorage
        const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
        return stored === 'true';
    });

    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        // Persist state to localStorage
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed));
    }, [isCollapsed]);

    const toggleCollapse = () => {
        setIsCollapsed(prev => !prev);
    };

    const toggleMobile = () => {
        setIsMobileOpen(prev => !prev);
    };

    const closeMobile = () => {
        setIsMobileOpen(false);
    };

    return {
        isCollapsed,
        isMobileOpen,
        toggleCollapse,
        toggleMobile,
        closeMobile,
    };
};
