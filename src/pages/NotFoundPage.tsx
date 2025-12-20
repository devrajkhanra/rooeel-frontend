import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-9xl font-extrabold gradient-text mb-4">404</h1>
                <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
                <p className="text-[var(--color-text-secondary)] mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/">
                    <Button leftIcon={<Home className="h-4 w-4" />}>
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
};
