/**
 * Logger Test Component
 * 
 * Add this to your app to test logger functionality
 */

import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';

export function LoggerTest() {
    const [bufferSize, setBufferSize] = useState(logger.getBufferSize());
    const [isCollapsed, setIsCollapsed] = useState(false);
    const isRecording = true; // Always recording

    // Update buffer size every second
    useEffect(() => {
        const interval = setInterval(() => {
            setBufferSize(logger.getBufferSize());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleGenerateLogs = () => {
        logger.info('Test log: Button clicked');
        logger.debug('Debug info', { timestamp: new Date().toISOString() });
        logger.warn('Warning: This is a test warning');
        logger.error('Error: This is a test error', { code: 500 });

        setBufferSize(logger.getBufferSize());
        alert(`Generated 4 logs. Buffer size: ${logger.getBufferSize()}`);
    };

    const handleSaveLogs = () => {
        const size = logger.getBufferSize();
        if (size === 0) {
            alert('No logs to save! Generate some logs first.');
            return;
        }

        logger.saveLogsToFile();
        alert(`Saved ${size} logs to app-logs.txt. Check your Downloads folder!`);
    };

    const handleDownloadWithTimestamp = () => {
        const size = logger.getBufferSize();
        if (size === 0) {
            alert('No logs to save! Generate some logs first.');
            return;
        }

        logger.downloadLogs();
        alert(`Downloaded ${size} logs. Check your Downloads folder!`);
    };

    const handleViewLogs = () => {
        const logs = logger.getLogsAsString();
        console.log('=== Current Logs ===');
        console.log(logs);
        console.log('===================');
        alert(`Logs printed to console. Buffer size: ${logger.getBufferSize()}`);
    };

    const handleClearLogs = () => {
        logger.clearLogs();
        setBufferSize(0);
        alert('Logs cleared!');
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    // Collapsed state - just an icon
    if (isCollapsed) {
        return (
            <div
                onClick={toggleCollapse}
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    width: 56,
                    height: 56,
                    background: '#1f2937',
                    borderRadius: '50%',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                title={`Logger Test - ${bufferSize} logs`}
            >
                <div style={{ position: 'relative' }}>
                    <span style={{ fontSize: 24 }}>📊</span>
                    {isRecording && (
                        <div style={{
                            position: 'absolute',
                            top: -2,
                            right: -2,
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: '#10b981',
                            animation: 'pulse 2s infinite',
                            border: '2px solid #1f2937'
                        }} />
                    )}
                    {bufferSize > 0 && (
                        <div style={{
                            position: 'absolute',
                            bottom: -4,
                            right: -4,
                            background: '#3b82f6',
                            color: '#fff',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            fontWeight: 'bold',
                            border: '2px solid #1f2937'
                        }}>
                            {bufferSize > 99 ? '99+' : bufferSize}
                        </div>
                    )}
                </div>
                <style>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                `}</style>
            </div>
        );
    }

    // Expanded state - full card
    return (
        <div style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            padding: 20,
            background: '#1f2937',
            borderRadius: 8,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            zIndex: 9999,
            minWidth: 280
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ color: '#fff', margin: 0 }}>Logger Test</h3>
                    {isRecording && (
                        <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#10b981',
                            animation: 'pulse 2s infinite'
                        }} title="Recording active" />
                    )}
                </div>
                <button
                    onClick={toggleCollapse}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        fontSize: 20,
                        padding: 4,
                        lineHeight: 1,
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                    title="Collapse"
                >
                    ×
                </button>
            </div>

            <div style={{ color: '#9ca3af', fontSize: 12, marginBottom: 12 }}>
                <div>📊 Buffer: {bufferSize} logs</div>
                <div>💾 localStorage: Enabled</div>
                <div>📥 Auto-save: Disabled (manual only)</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={handleGenerateLogs} style={buttonStyle}>
                    Generate Test Logs
                </button>
                <button onClick={handleSaveLogs} style={buttonStyle}>
                    Save Logs (app-logs.txt)
                </button>
                <button onClick={handleDownloadWithTimestamp} style={buttonStyle}>
                    Download Logs (with timestamp)
                </button>
                <button onClick={handleViewLogs} style={buttonStyle}>
                    View Logs in Console
                </button>
                <button onClick={handleClearLogs} style={{ ...buttonStyle, background: '#dc2626' }}>
                    Clear Logs
                </button>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}

const buttonStyle = {
    padding: '8px 16px',
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 14
};
