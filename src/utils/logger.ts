type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

// Check if we are in development mode (Vite exposes import.meta.env)
const IS_DEV = import.meta.env.DEV;

class Logger {
    private level: LogLevel = 'debug';

    constructor() {
        // You could configure this from env vars if needed
    }

    private formatMessage(level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    }

    private shouldLog(level: LogLevel): boolean {
        // Always log in dev, could restrict in prod
        return IS_DEV || LOG_LEVELS[level] >= LOG_LEVELS.warn;
    }

    debug(message: string, ...args: any[]) {
        if (this.shouldLog('debug')) {
            console.debug(this.formatMessage('debug', message), ...args);
        }
    }

    info(message: string, ...args: any[]) {
        if (this.shouldLog('info')) {
            console.info(this.formatMessage('info', message), ...args);
        }
    }

    warn(message: string, ...args: any[]) {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', message), ...args);
        }
    }

    error(message: string, ...args: any[]) {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', message), ...args);
        }
    }

    group(label: string) {
        if (IS_DEV) {
            console.group(label);
        }
    }

    groupEnd() {
        if (IS_DEV) {
            console.groupEnd();
        }
    }
}

export const logger = new Logger();
