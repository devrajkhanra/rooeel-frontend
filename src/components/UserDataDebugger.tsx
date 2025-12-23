import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { apiClient } from '@/services/api.client';
import { createLogger } from '@/utils/logger';

const logger = createLogger('UserDataDebugger');

/**
 * User Data Debugger Component
 * 
 * Displays the current user's data from the API
 * Helps debug user data structure and verify createdBy field
 */
export function UserDataDebugger() {
    const [userData, setUserData] = useState<any>(null);
    const [showData, setShowData] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleFetchUserData = async () => {
        const currentUser = authService.getCurrentUser();

        if (!currentUser) {
            logger.warn('No user logged in');
            alert('No user logged in!');
            return;
        }

        setLoading(true);
        try {
            // Fetch fresh user data from API
            const response = await apiClient.get(`/user/${currentUser.id}`);
            setUserData(response.data);
            setShowData(true);

            logger.info('User data fetched successfully', response.data);
            console.log('=== USER DATA ===');
            console.log(JSON.stringify(response.data, null, 2));
            console.log('=================');
        } catch (error: any) {
            logger.error('Failed to fetch user data', error);
            alert('Failed to fetch user data: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleCopyData = () => {
        if (userData) {
            navigator.clipboard.writeText(JSON.stringify(userData, null, 2));
            logger.info('User data copied to clipboard');
            alert('User data copied to clipboard!');
        }
    };

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
            maxWidth: 400
        }}>
            <h3 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: 16 }}>
                👤 User Data Debugger
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                    onClick={handleFetchUserData}
                    disabled={loading}
                    style={buttonStyle}
                >
                    {loading ? 'Loading...' : 'Fetch User Data'}
                </button>
                {userData && (
                    <>
                        <button onClick={handleCopyData} style={buttonStyle}>
                            Copy Data
                        </button>
                        <button
                            onClick={() => setShowData(!showData)}
                            style={{ ...buttonStyle, background: '#6b7280' }}
                        >
                            {showData ? 'Hide Details' : 'Show Details'}
                        </button>
                    </>
                )}
            </div>

            {showData && userData && (
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
                            <span style={{ color: '#fff' }}>{userData.id || 'N/A'}</span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <strong style={{ color: '#60a5fa' }}>Email:</strong>{' '}
                            <span style={{ color: '#fff' }}>{userData.email || 'N/A'}</span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <strong style={{ color: '#60a5fa' }}>Name:</strong>{' '}
                            <span style={{ color: '#fff' }}>
                                {userData.firstName} {userData.lastName}
                            </span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <strong style={{ color: '#60a5fa' }}>Created By (Admin ID):</strong>{' '}
                            <span style={{
                                color: userData.createdBy ? '#10b981' : '#ef4444',
                                fontWeight: 'bold'
                            }}>
                                {userData.createdBy || 'MISSING!'}
                            </span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <strong style={{ color: '#60a5fa' }}>Created At:</strong>{' '}
                            <span style={{ color: '#fff' }}>
                                {userData.createdAt ? new Date(userData.createdAt).toLocaleString() : 'N/A'}
                            </span>
                        </div>
                        <details style={{ marginTop: 12 }}>
                            <summary style={{ color: '#60a5fa', cursor: 'pointer' }}>
                                Full User Data
                            </summary>
                            <pre style={{
                                marginTop: 8,
                                fontSize: 10,
                                color: '#d1d5db',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-all'
                            }}>
                                {JSON.stringify(userData, null, 2)}
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
