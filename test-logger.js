/**
 * Logger Test Script
 * 
 * Run this in the browser console to test the logger functionality
 */

// Import logger (if using modules)
// import { logger } from './src/utils/logger';

// Test 1: Generate some logs
console.log('=== Testing Logger ===');

logger.info('Test log 1: Application started');
logger.debug('Test log 2: Debug information', { userId: 123, action: 'login' });
logger.warn('Test log 3: Warning message');
logger.error('Test log 4: Error occurred', new Error('Test error'));

// Test 2: Check buffer size
const bufferSize = logger.getBufferSize();
console.log(`Buffer size: ${bufferSize} logs`);

// Test 3: Get logs as string
const logsString = logger.getLogsAsString();
console.log('Logs content:');
console.log(logsString);

// Test 4: Try to save logs to file
console.log('Attempting to save logs to file...');
logger.saveLogsToFile();
console.log('If a download was triggered, check your Downloads folder for app-logs.txt');

// Test 5: Alternative - download with timestamp
console.log('Attempting to download with timestamp...');
logger.downloadLogs();
console.log('If a download was triggered, check your Downloads folder');

// Test 6: Check configuration
console.log('Logger configuration check:');
console.log('- File logging enabled:', logger.config?.enableFileLogging ?? 'unknown');
console.log('- Buffer size:', bufferSize);

// Instructions
console.log('\n=== Instructions ===');
console.log('1. Check your Downloads folder for app-logs.txt or app-logs-*.txt');
console.log('2. If no file appeared, check browser console for errors');
console.log('3. Try running: logger.saveLogsToFile() manually');
console.log('4. Check buffer: logger.getBufferSize()');
console.log('5. View logs: console.log(logger.getLogsAsString())');
