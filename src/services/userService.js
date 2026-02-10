import { USER_API_URL, getAuthHeaders, getAuthHeaderOnly, isAuthenticated } from './api';

/**
 * Request OTP for phone number
 * @param {string} phoneNumber - Phone number to send OTP
 */
export const requestOtpApi = async (phoneNumber) => {
    const response = await fetch(`${USER_API_URL}/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to request OTP');
    }
    return data;
};

/**
 * Verify OTP and login
 * @param {string} phoneNumber - Phone number
 * @param {string} otp - OTP to verify
 */
export const verifyOtpApi = async (phoneNumber, otp) => {
    const response = await fetch(`${USER_API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp })
    });
    return response.json();
};

/**
 * Fetch user details from backend
 */
export const fetchUserDetailsApi = async () => {
    if (!isAuthenticated()) return null;

    const response = await fetch(`${USER_API_URL}/getUser`, {
        headers: getAuthHeaderOnly()
    });
    return response.json();
};

/**
 * Update user profile details
 * @param {Object} details - User details to update
 */
export const updateUserDetailsApi = async (details) => {
    if (!isAuthenticated()) return null;

    const response = await fetch(`${USER_API_URL}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            fullName: details.name,
            email: details.email
        })
    });
    return { response, data: await response.json() };
};

/**
 * Transform user data from API response to frontend format
 * @param {Object} userData - Raw user data from API
 */
export const normalizeUserData = (userData) => {
    return {
        ...userData,
        name: userData.fullName || userData.name,
        phone: userData.phoneNumber || userData.phone
    };
};

/**
 * Transform addresses from API response to frontend format
 * @param {Array} addresses - Raw addresses from API
 */
export const normalizeAddresses = (addresses) => {
    if (!addresses) return [];
    return addresses.map(addr => ({
        ...addr,
        type: addr.addressType || 'home'
    }));
};
