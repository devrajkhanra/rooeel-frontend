# Logger File Logging Usage

The logger now supports file logging with the following features:

## Features

- **In-Memory Buffer**: Logs are stored in memory (default: 1000 entries)
- **Download Logs**: Download logs as a text file
- **Auto-Save**: Optionally auto-save logs at regular intervals
- **LocalStorage Persistence**: Optional persistence across page refreshes
- **Circular Buffer**: Automatically removes oldest logs when buffer is full

## Usage Examples

### Basic Usage (File Logging Enabled by Default)

```typescript
import { logger } from './utils/logger';

// Logs are automatically stored in memory
logger.info('Application started');
logger.debug('Debug information', { userId: 123 });
logger.warn('Warning message');
logger.error('Error occurred', new Error('Something went wrong'));
```

### Save Logs to File

```typescript
// Save logs to file (downloads as app-logs.txt by default)
logger.saveLogsToFile();

// Or use downloadLogs with custom filename
logger.downloadLogs('my-custom-logs.txt');

// Set custom filename for auto-save
logger.setLogFileName('frontend-logs.txt');
logger.saveLogsToFile(); // Downloads as frontend-logs.txt
```

> **Note**: In a browser environment, logs are downloaded to your Downloads folder. To save to the project root, move the downloaded file to `d:\Project\rooeel-frontend\app-logs.txt`.

### Enable Auto-Save

```typescript
// Enable auto-save every 10 seconds
logger.setAutoSaveInterval(10000);

// Logs will automatically download every 10 seconds
// Move the downloaded file to project root as needed

// Disable auto-save
logger.setAutoSaveInterval(0);
```

> **Warning**: Auto-save will trigger browser downloads at the specified interval. This may be disruptive. Consider using manual save instead.

### Enable LocalStorage Persistence

```typescript
// Enable localStorage to persist logs across page refreshes
logger.setLocalStorage(true);

// Logs will now be saved to localStorage and loaded on page refresh
logger.info('This log will persist across refreshes');
```

### Manage Log Buffer

```typescript
// Get all logs as an array
const logs = logger.getLogs();
console.log(logs);

// Get all logs as a single string
const logsString = logger.getLogsAsString();
console.log(logsString);

// Get current buffer size
const size = logger.getBufferSize();
console.log(`Current buffer size: ${size}`);

// Clear all logs
logger.clearLogs();
```

### Disable File Logging

```typescript
// Disable file logging (logs will only go to console)
logger.setFileLogging(false);

logger.info('This will only appear in console');

// Re-enable file logging
logger.setFileLogging(true);
```

### Create Contextual Logger

```typescript
import { createLogger } from './utils/logger';

// Create a logger with context
const authLogger = createLogger('AuthService');
authLogger.info('User logged in'); // [INFO] [AuthService] User logged in

// Save logs from any logger instance (shares the same buffer)
authLogger.saveLogsToFile();
```

## Configuration

You can configure the logger when creating a custom instance:

```typescript
import { Logger } from './utils/logger';

const customLogger = new Logger({
    level: LogLevel.INFO,           // Minimum log level
    enableTimestamps: true,         // Show timestamps
    enableColors: true,             // Color-coded console output
    enableFileLogging: true,        // Enable file logging
    enableLocalStorage: false,      // Persist to localStorage
    maxBufferSize: 2000,           // Maximum buffer size
    autoSaveInterval: 0,           // Auto-save interval (0 = disabled)
    logFileName: 'app-logs.txt'    // Default filename
});
```

## Log Format

### Console Format
```
[17:48:02] [INFO] [AuthService] User logged in
```

### File Format
```
[2025-12-22 17:48:02] [INFO] [AuthService] User logged in
[2025-12-22 17:48:05] [ERROR] [APIClient] Request failed {"status":500,"message":"Internal Server Error"}
```

## Saving Logs to Project Root

Since this is a browser application, logs cannot be directly written to the filesystem. Here are your options:

### Option 1: Manual Save (Recommended)
```typescript
// When you need to save logs
logger.saveLogsToFile();

// Then manually move the downloaded file from Downloads to:
// d:\Project\rooeel-frontend\app-logs.txt
```

### Option 2: Auto-Save with Manual Move
```typescript
// Enable auto-save every 30 seconds
logger.setAutoSaveInterval(30000);

// Periodically move the downloaded file to project root
// This will create multiple timestamped files
```

### Option 3: Copy Logs from Console
```typescript
// Get logs as string
const logs = logger.getLogsAsString();

// Copy to clipboard
navigator.clipboard.writeText(logs);

// Then paste into a file in your project root
```

## Best Practices

1. **Manual Save for Production**: Use `saveLogsToFile()` when needed rather than auto-save
2. **Clear Logs Periodically**: Clear logs after saving to prevent memory issues
3. **Use LocalStorage Wisely**: Only enable if you need persistence across refreshes
4. **Context Loggers**: Use contextual loggers for better organization
5. **Save Before Critical Operations**: Save logs before operations that might crash the app

## Example: Error Reporting Flow

```typescript
import { logger } from './utils/logger';

try {
    // Your code here
    logger.info('Starting operation');
    // ... operation code ...
} catch (error) {
    logger.error('Operation failed', error);
    
    // Save logs for debugging
    logger.saveLogsToFile();
    
    // User can then move app-logs.txt to project root
}
```

## API Reference

### Log Methods
- `logger.debug(message, ...args)` - Debug level log
- `logger.info(message, ...args)` - Info level log
- `logger.warn(message, ...args)` - Warning level log
- `logger.error(message, ...args)` - Error level log

### Configuration Methods
- `logger.setLevel(level)` - Set minimum log level
- `logger.setFileLogging(enabled)` - Enable/disable file logging
- `logger.setLocalStorage(enabled)` - Enable/disable localStorage
- `logger.setAutoSaveInterval(ms)` - Set auto-save interval (0 = disabled)
- `logger.setLogFileName(filename)` - Set default filename

### File Operations
- `logger.saveLogsToFile()` - Manually save logs to file (triggers download)
- `logger.downloadLogs(filename?)` - Download logs with custom filename
- `logger.getLogs()` - Get logs as array
- `logger.getLogsAsString()` - Get logs as string
- `logger.clearLogs()` - Clear all logs
- `logger.getBufferSize()` - Get current buffer size

