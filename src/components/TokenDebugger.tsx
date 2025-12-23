import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { STORAGE_KEYS } from '@/config/constants';
import { createLogger } from '@/utils/logger';

const logger = createLogger('TokenDebugger');

/**
 * Token Debugger Component
 * 
 * Displays the current JWT token and its decoded contents
 * Helps debug authentication issues
 */
export function TokenDebugger() {
    const [showToken, setShowToken] = useState(false);
    const [decodedToken, setDecodedToken] = useState<any>(null);

    const handleDecodeToken = () => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

        if (!token) {
            logger.warn('No token found in localStorage');
            alert('No token found!');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setDecodedToken(decoded);
            setShowToken(true);

            logger.info('Token decoded successfully', decoded);
            console.log('=== DECODED TOKEN ===');
            console.log(JSON.stringify(decoded, null, 2));
            console.log('====================');
        } catch (error) {
            logger.error('Failed to decode token', error);

            // Show raw token for debugging
            console.log('=== RAW TOKEN (INVALID) ===');
            console.log('Length:', token.length);
            console.log('First 50 chars:', token.substring(0, 50));
            console.log('Last 50 chars:', token.substring(token.length - 50));
            console.log('Full token:', token);
            console.log('===========================');

            alert(
                'Failed to decode token!\n\n' +
                'Error: ' + (error as Error).message + '\n\n' +
                'Token length: ' + token.length + ' chars\n' +
                'First 50 chars: ' + token.substring(0, 50) + '\n\n' +
                'Check console for full token value.'
            );
        }
    };

    const handleCopyToken = () => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
            navigator.clipboard.writeText(token);
            logger.info('Token copied to clipboard');
            alert('Token copied to clipboard!');
        }
    };

    const handleCheckExpiry = () => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (!token) {
            alert('No token found!');
            return;
        }

        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            const expiryTime = decoded.exp;
            const timeLeft = expiryTime - currentTime;

            if (timeLeft > 0) {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = Math.floor(timeLeft % 60);
                logger.info(`Token expires in ${minutes}m ${seconds}s`);
                alert(`Token is valid!\nExpires in: ${minutes}m ${seconds}s`);
            } else {
                logger.warn('Token has expired');
                alert('Token has expired!');
            }
        } catch (error) {
            logger.error('Failed to check token expiry', error);
            alert('Failed to check token expiry');
        }
    };

    const handleClearToken = () => {
        if (confirm('This will clear your authentication token and log you out. Continue?')) {
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
            logger.warn('Token cleared manually');
            alert('Token cleared! You will be redirected to login.');
            window.location.href = '/login';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            padding: 20,
            background: '#1f2937',
            borderRadius: 8,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            zIndex: 9999,
            maxWidth: 400
        }}>
            <h3 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: 16 }}>
                🔐 Token Debugger
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={handleDecodeToken} style={buttonStyle}>
                    Decode Token
                </button>
                <button onClick={handleCheckExpiry} style={buttonStyle}>
                    Check Expiry
                </button>
                <button onClick={handleCopyToken} style={buttonStyle}>
                    Copy Token
                </button>
                <button onClick={handleClearToken} style={{ ...buttonStyle, background: '#dc2626' }}>
                    Clear Token & Logout
                </button>
                <button
                    onClick={() => setShowToken(!showToken)}
                    style={{ ...buttonStyle, background: '#6b7280' }}
                >
                    {showToken ? 'Hide Details' : 'Show Details'}
                </button>
            </div>

            {showToken && decodedToken && (
                <div style={{
                    marginTop: 12,
                    padding: 12,
                    background: '#111827',
                    borderRadius: 4,
                    maxHeight: 300,
                    overflowY: 'auto'
                }}>
                    <div style={{ color: '#9ca3af', fontSize: 12, fontFamily: 'monospace' }}>
                        <div style={{ marginBottom: 8 }}>
                            <strong style={{ color: '#60a5fa' }}>User ID:</strong>{' '}
                            <span style={{ color: '#fff' }}>{decodedToken.sub || decodedToken.id || 'N/A'}</span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <strong style={{ color: '#60a5fa' }}>Role:</strong>{' '}
                            <span style={{
                                color: decodedToken.role === 'admin' ? '#10b981' : '#f59e0b',
                                fontWeight: 'bold'
                            }}>
                                {decodedToken.role || 'N/A'}
                            </span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <strong style={{ color: '#60a5fa' }}>Email:</strong>{' '}
                            <span style={{ color: '#fff' }}>{decodedToken.email || 'N/A'}</span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <strong style={{ color: '#60a5fa' }}>Issued At:</strong>{' '}
                            <span style={{ color: '#fff' }}>
                                {decodedToken.iat ? new Date(decodedToken.iat * 1000).toLocaleString() : 'N/A'}
                            </span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <strong style={{ color: '#60a5fa' }}>Expires At:</strong>{' '}
                            <span style={{ color: '#fff' }}>
                                {decodedToken.exp ? new Date(decodedToken.exp * 1000).toLocaleString() : 'N/A'}
                            </span>
                        </div>
                        <details style={{ marginTop: 12 }}>
                            <summary style={{ color: '#60a5fa', cursor: 'pointer' }}>
                                Full Token Data
                            </summary>
                            <pre style={{
                                marginTop: 8,
                                fontSize: 10,
                                color: '#d1d5db',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-all'
                            }}>
                                {JSON.stringify(decodedToken, null, 2)}
                            </pre>
                        </details>
                    </div>
                </div>
            )}
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
    fontSize: 14,
    fontWeight: 500
};
