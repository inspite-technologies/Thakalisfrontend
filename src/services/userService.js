import api from '../api/axios';

/**
 * Request OTP for phone number
 * @param {string} phoneNumber - Phone number to send OTP
 */
export const requestOtpApi = async (phoneNumber) => {
    try {
        const response = await api.post('/user/request-otp', { phoneNumber });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to request OTP');
    }
};

/**
 * Verify OTP and login
 * @param {string} phoneNumber - Phone number
 * @param {string} otp - OTP to verify
 */
export const verifyOtpApi = async (phoneNumber, otp) => {
    const response = await api.post('/user/verify-otp', { phoneNumber, otp });
    return response.data;
};

/**
 * Fetch user details from backend
 */
export const fetchUserDetailsApi = async () => {
    const response = await api.get('/user/getUser');
    return response.data;
};

/**
 * Update user profile details
 * @param {Object} details - User details to update
 */
export const updateUserDetailsApi = async (details) => {
    const response = await api.put('/user/', {
        fullName: details.name,
        email: details.email
    });
    return { response, data: response.data };
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
