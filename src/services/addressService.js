import { USER_API_URL, getAuthHeaders, getAuthHeaderOnly, isAuthenticated } from './api';

/**
 * Add new address
 * @param {Object} addressData - Address data to add
 */
export const addAddressApi = async (addressData) => {
    if (!isAuthenticated()) return null;

    const response = await fetch(`${USER_API_URL}/address`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            addressType: addressData.type || 'home',
            fullAddress: addressData.fullAddress,
            city: addressData.city || 'Kochi',
            district: addressData.district || 'Ernakulam',
            state: addressData.state || 'Kerala',
            pincode: parseInt(addressData.pincode) || 0,
            landmark: addressData.landmark || '',
            phoneNumber: parseInt(addressData.phone?.replace(/\D/g, '')) || 0,
            isDefault: addressData.isDefault || false
        })
    });
    return { response, data: await response.json() };
};

/**
 * Update existing address
 * @param {string} id - Address ID to update
 * @param {Object} addressData - New address data
 */
export const updateAddressApi = async (id, addressData) => {
    if (!isAuthenticated()) return null;

    const response = await fetch(`${USER_API_URL}/address/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            addressType: addressData.type,
            fullAddress: addressData.fullAddress,
            landmark: addressData.landmark,
            pincode: parseInt(addressData.pincode)
        })
    });
    return { response, data: await response.json() };
};

/**
 * Delete address
 * @param {string} id - Address ID to delete
 */
export const deleteAddressApi = async (id) => {
    if (!isAuthenticated()) return null;

    const response = await fetch(`${USER_API_URL}/address/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaderOnly()
    });
    return response;
};

/**
 * Set address as default
 * @param {string} id - Address ID to set as default
 */
export const setDefaultAddressApi = async (id) => {
    if (!isAuthenticated()) return null;

    const response = await fetch(`${USER_API_URL}/address/default/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaderOnly()
    });
    return response;
};
