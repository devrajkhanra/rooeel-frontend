/**
 * Logger Utility
 * 
 * Provides structured logging with different log levels, timestamps, and color-coded output.
 * Automatically adjusts verbosity based on environment (development vs production).
 * Supports file logging with in-memory buffer and download functionality.
 */

const LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
} as const;

type LogLevel = typeof LogLevel[keyof typeof LogLevel];

interface LoggerConfig {
    level: LogLevel;
    enableTimestamps: boolean;
    enableColors: boolean;
    enableFileLogging: boolean;
    enableLocalStorage: boolean;
    maxBufferSize: number;
    autoSaveInterval: number; // Auto-save interval in milliseconds (0 = disabled)
    logFileName: string; // Name of the log file
}

const STORAGE_KEY = 'app-logs';

class Logger {
    private config: LoggerConfig;
    private context?: string;
    private lastSaveTime: number = 0;
    private logBuffer: string[] = [];

    constructor(config?: Partial<LoggerConfig>, context?: string) {
        this.config = {
            level: import.meta.env.PROD ? LogLevel.WARN : LogLevel.DEBUG,
            enableTimestamps: true,
            enableColors: !import.meta.env.PROD,
            enableFileLogging: true,
            enableLocalStorage: true, // Enable localStorage persistence by default
            maxBufferSize: 1000,
            autoSaveInterval: 0, // Disabled - manual download only
            logFileName: 'app-logs.txt',
            ...config,
        };
        this.context = context;

        // Load logs from localStorage if enabled
        if (this.config.enableLocalStorage) {
            this.loadLogsFromStorage();
        }
    }

    /**
     * Format timestamp as YYYY-MM-DD HH:MM:SS
     */
    private getTimestamp(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    /**
     * Format timestamp for console (HH:MM:SS)
     */
    private getConsoleTimestamp(): string {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    /**
     * Format log message for console with timestamp and context
     */
    private formatConsoleMessage(level: string, message: string): string {
        const parts: string[] = [];

        if (this.config.enableTimestamps) {
            parts.push(`[${this.getConsoleTimestamp()}]`);
        }

        parts.push(`[${level}]`);

        if (this.context) {
            parts.push(`[${this.context}]`);
        }

        parts.push(message);

        return parts.join(' ');
    }

    /**
     * Format log message for file with full timestamp and context
     */
    private formatFileMessage(level: string, message: string, args: any[]): string {
        const parts: string[] = [];

        parts.push(`[${this.getTimestamp()}]`);
        parts.push(`[${level}]`);

        if (this.context) {
            parts.push(`[${this.context}]`);
        }

        parts.push(message);

        // Add additional arguments if present
        if (args.length > 0) {
            const argsStr = args.map(arg => {
                if (typeof arg === 'object') {
                    try {
                        return JSON.stringify(arg);
                    } catch {
                        return String(arg);
                    }
                }
                return String(arg);
            }).join(' ');
            parts.push(argsStr);
        }

        return parts.join(' ');
    }

    /**
     * Get color style for log level
     */
    private getColorStyle(level: LogLevel): string {
        if (!this.config.enableColors) return '';

        const colors = {
            [LogLevel.DEBUG]: 'color: #9CA3AF', // Gray
            [LogLevel.INFO]: 'color: #3B82F6',  // Blue
            [LogLevel.WARN]: 'color: #F59E0B',  // Orange
            [LogLevel.ERROR]: 'color: #EF4444', // Red
        };

        return colors[level] || '';
    }

    /**
     * Write log entry to buffer
     */
    private writeToBuffer(message: string): void {
        if (!this.config.enableFileLogging) return;

        // Add to buffer
        this.logBuffer.push(message);

        // Implement circular buffer - remove oldest entries if buffer is full
        if (this.logBuffer.length > this.config.maxBufferSize) {
            this.logBuffer.shift();
        }

        // Sync to localStorage if enabled
        if (this.config.enableLocalStorage) {
            this.saveLogsToStorage();
        }
    }

    /**
     * Load logs from localStorage
     */
    private loadLogsFromStorage(): void {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                this.logBuffer = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load logs from localStorage:', error);
        }
    }

    /**
     * Save logs to localStorage
     */
    private saveLogsToStorage(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logBuffer));
        } catch (error) {
            console.error('Failed to save logs to localStorage:', error);
        }
    }

    /**
     * Auto-save logs to file if interval has passed
     */
    private autoSaveToFile(): void {
        if (!this.config.autoSaveInterval || this.config.autoSaveInterval <= 0) return;

        const now = Date.now();
        if (now - this.lastSaveTime >= this.config.autoSaveInterval) {
            this.saveToFile();
            this.lastSaveTime = now;
        }
    }

    /**
     * Save logs to a file in the project root
     */
    private saveToFile(): void {
        if (!this.config.enableFileLogging || this.logBuffer.length === 0) return;

        const logsContent = this.getLogsAsString();
        const blob = new Blob([logsContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        // Create a hidden link to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = this.config.logFileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        URL.revokeObjectURL(url);
    }

    /**
     * Log a message at the specified level
     */
    private log(level: LogLevel, levelName: string, message: string, ...args: any[]): void {
        if (level < this.config.level) return;

        const consoleMessage = this.formatConsoleMessage(levelName, message);
        const style = this.getColorStyle(level);

        const consoleMethod = level === LogLevel.ERROR ? console.error :
            level === LogLevel.WARN ? console.warn :
                console.log;

        if (style && args.length === 0) {
            consoleMethod(`%c${consoleMessage}`, style);
        } else if (style) {
            consoleMethod(`%c${consoleMessage}`, style, ...args);
        } else {
            consoleMethod(consoleMessage, ...args);
        }

        // Write to file buffer
        const fileMessage = this.formatFileMessage(levelName, message, args);
        this.writeToBuffer(fileMessage);

        // Auto-save to file if enabled
        this.autoSaveToFile();
    }

    /**
     * Log debug message (development only)
     */
    debug(message: string, ...args: any[]): void {
        this.log(LogLevel.DEBUG, 'DEBUG', message, ...args);
    }

    /**
     * Log info message
     */
    info(message: string, ...args: any[]): void {
        this.log(LogLevel.INFO, 'INFO', message, ...args);
    }

    /**
     * Log warning message
     */
    warn(message: string, ...args: any[]): void {
        this.log(LogLevel.WARN, 'WARN', message, ...args);
    }

    /**
     * Log error message
     */
    error(message: string, ...args: any[]): void {
        this.log(LogLevel.ERROR, 'ERROR', message, ...args);
    }

    /**
     * Set the minimum log level
     */
    setLevel(level: LogLevel): void {
        this.config.level = level;
    }

    /**
     * Enable or disable file logging
     */
    setFileLogging(enabled: boolean): void {
        this.config.enableFileLogging = enabled;
    }

    /**
     * Enable or disable localStorage persistence
     */
    setLocalStorage(enabled: boolean): void {
        this.config.enableLocalStorage = enabled;
        if (enabled) {
            this.saveLogsToStorage();
        }
    }

    /**
     * Set auto-save interval (0 to disable)
     */
    setAutoSaveInterval(milliseconds: number): void {
        this.config.autoSaveInterval = milliseconds;
    }

    /**
     * Set the log file name
     */
    setLogFileName(filename: string): void {
        this.config.logFileName = filename;
    }

    /**
     * Manually save logs to file (triggers download)
     */
    saveLogsToFile(): void {
        this.saveToFile();
    }

    /**
     * Get all logs as an array
     */
    getLogs(): string[] {
        return [...this.logBuffer];
    }

    /**
     * Get all logs as a single string
     */
    getLogsAsString(): string {
        return this.logBuffer.join('\n');
    }

    /**
     * Download logs as a text file
     */
    downloadLogs(filename?: string): void {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const defaultFilename = `app-logs-${timestamp}.txt`;
        const finalFilename = filename || defaultFilename;

        const logsContent = this.getLogsAsString();
        const blob = new Blob([logsContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = finalFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL object
        URL.revokeObjectURL(url);

        this.info(`Logs downloaded as ${finalFilename}`);
    }

    /**
     * Clear all logs from buffer and localStorage
     */
    clearLogs(): void {
        this.logBuffer = [];
        if (this.config.enableLocalStorage) {
            localStorage.removeItem(STORAGE_KEY);
        }
        this.info('Log buffer cleared');
    }

    /**
     * Get current buffer size
     */
    getBufferSize(): number {
        return this.logBuffer.length;
    }

    /**
     * Create a new logger instance with a specific context
     */
    createLogger(context: string): Logger {
        return new Logger(this.config, context);
    }
}

// Export singleton instance
export const logger = new Logger();

// Export factory function for creating contextual loggers
export const createLogger = (context: string): Logger => {
    return logger.createLogger(context);
};

// Export LogLevel for external use
export { LogLevel };
