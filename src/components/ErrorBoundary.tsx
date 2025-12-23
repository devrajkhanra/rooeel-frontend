/**
 * Error Boundary Component
 * 
 * Catches React component errors and displays a user-friendly error UI with recovery options.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './ui/Button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Update state with error info
        this.setState({
            errorInfo,
        });
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleReload = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="max-w-md w-full space-y-6 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-foreground">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-muted-foreground">
                                We've encountered an unexpected error. Our team has been notified.
                            </p>
                        </div>

                        {this.state.error && (
                            <div className="bg-muted rounded-lg p-4 text-left">
                                <p className="text-sm font-mono text-destructive break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <Button onClick={this.handleReset} variant="outline">
                                Try Again
                            </Button>
                            <Button onClick={this.handleReload}>
                                Reload Page
                            </Button>
                        </div>

                        {import.meta.env.DEV && this.state.errorInfo && (
                            <details className="text-left">
                                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                                    View Error Details
                                </summary>
                                <pre className="mt-2 text-xs bg-muted p-4 rounded overflow-auto max-h-64">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
