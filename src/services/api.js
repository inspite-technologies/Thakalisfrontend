// Base API configuration
export const API_BASE_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001');
export const USER_API_URL = `${API_BASE_URL}/user`;

/**
 * Get authorization headers with token
 */
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

/**
 * Get authorization header only (for GET/DELETE requests)
 */
export const getAuthHeaderOnly = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

/**
 * Handle API response
 */
export const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || data.msg || 'Request failed');
    }
    return data;
};
